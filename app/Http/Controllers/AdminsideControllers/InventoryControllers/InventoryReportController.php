<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use App\Models\Products;
use App\Models\StockIn;
use App\Models\StockOut;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InventoryReportController extends Controller
{
    /**
     * Get inventory report filtered by day, week, or month
     */
    public function getReport(Request $request)
    {
        try {
            // [WB-SR-68 / WB-SR-74 TESTING] Simulated DB failure — remove after testing
            throw new \Exception('DB CONNECTION FAILED');

            $filterType = $request->query('filterType', 'day'); // day, week, month
            $filterDate = $request->query('filterDate', now()->toDateString()); // YYYY-MM-DD

            // Get all products (both active and archived)
            $products = Products::get();

            if ($products->isEmpty()) {
                return response()->json([
                    'filter_type' => $filterType,
                    'filter_date' => $filterDate,
                    'data' => [],
                    'total_sold_qty' => 0,
                    'total_purchased_qty' => 0,
                    'total_purchased_value' => 0,
                    'total_sold_value' => 0,
                ]);
            }

            $reportData = [];
            $totalSoldQty = 0;
            $totalPurchasedQty = 0;
            $totalPurchasedValue = 0;
            $totalSoldValue = 0;

            foreach ($products as $product) {
                // Determine date range based on filter type
                [$startDate, $endDate, $dateFallback] = $this->getDateRange($filterType, $filterDate);

                // Get sold quantity and value from stock_outs
                $soldData = DB::table('stock_outs')
                    ->whereBetween(DB::raw('DATE(date_time)'), [$startDate, $endDate])
                    ->where('product_id', $product->product_id)
                    ->select(DB::raw('SUM(quantity) as qty, COUNT(*) as count'))
                    ->first();
                
                $soldQty = (int)($soldData->qty ?? 0);
                
                // Get sold value from order_items subtotal (through orders)
                $soldValue = DB::table('_order_items')
                    ->join('_orders', '_orders.order_id', '=', '_order_items.order_id')
                    ->whereBetween(DB::raw('DATE(_orders.created_at)'), [$startDate, $endDate])
                    ->where('_order_items.product_id', $product->product_id)
                    ->sum('_order_items.subtotal');
                
                $soldValue = (float)($soldValue ?? 0);

                // Get purchased quantity from stock_ins
                $purchasedData = DB::table('stock_ins')
                    ->whereBetween(DB::raw('DATE(stock_in_date)'), [$startDate, $endDate])
                    ->where('product_id', $product->product_id)
                    ->select(DB::raw('SUM(stock_qty) as qty'), DB::raw('SUM(cost * stock_qty) as value'))
                    ->first();
                
                $purchasedQty = (int)($purchasedData->qty ?? 0);
                $purchasedValue = (float)($purchasedData->value ?? 0);

                // Get current stock from inventory table
                $currentStock = DB::table('_inventory')
                    ->where('product_id', $product->product_id)
                    ->sum('quantity') ?? 0;

                // Stock decrease amount (sold quantity)
                $stockDecrease = $soldQty;

                // Add to totals
                $totalSoldQty += $soldQty;
                $totalPurchasedQty += $purchasedQty;
                $totalPurchasedValue += $purchasedValue;
                $totalSoldValue += $soldValue;

                $reportData[] = [
                    'product_id' => $product->product_id,
                    'product_name' => $product->product_name,
                    'variant_type' => $product->variant_type,
                    'status' => $product->status,
                    'unit_price' => (float)$product->product_price,
                    'sold_qty' => $soldQty,
                    'sold_value' => round($soldValue, 2),
                    'purchased_qty' => $purchasedQty,
                    'purchased_value' => round($purchasedValue, 2),
                    'stock_decrease' => $stockDecrease,
                    'current_stock' => (int)$currentStock,
                    'date_range' => [
                        'start' => $startDate,
                        'end' => $endDate,
                        'display' => $this->formatDateRange($filterType, $startDate, $endDate),
                    ],
                ];
            }

            return response()->json([
                'filter_type' => $filterType,
                'filter_date' => $filterDate,
                'date_fallback' => $dateFallback ?? false, // [WB-SR-77] true = filterDate was malformed, fell back to today
                'data' => $reportData,
                'total_sold_qty' => $totalSoldQty,
                'total_purchased_qty' => $totalPurchasedQty,
                'total_purchased_value' => round($totalPurchasedValue, 2),
                'total_sold_value' => round($totalSoldValue, 2),
            ]);
        } catch (\Exception $e) {
            Log::error('Inventory Report Error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Failed to generate report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export report as CSV
     */
    public function exportCSV(Request $request)
    {
        $filterType = $request->query('filterType', 'day');
        $filterDate = $request->query('filterDate', now()->toDateString());

        // Get report data
        $response = $this->getReport($request);
        $reportData = json_decode($response->content(), true);

        if (isset($reportData['error'])) {
            return response($reportData['error'], 500);
        }

        // Create CSV
        $csvData = [];
        $csvData[] = ['Inventory Report - ' . $reportData['data'][0]['date_range']['display'] ?? 'Report'];
        $csvData[] = []; // Empty row for spacing
        $csvData[] = ['Date/Period', 'Product Name', 'Variant Type', 'Unit Price', 'Sold Qty', 'Sold Value', 'Stock Decrease', 'Purchased Qty', 'Purchased Value', 'Current Stock'];

        foreach ($reportData['data'] as $row) {
            $csvData[] = [
                $row['date_range']['display'],
                $row['product_name'],
                $row['variant_type'],
                '₱' . number_format($row['unit_price'], 2),
                $row['sold_qty'],
                '₱' . number_format($row['sold_value'], 2),
                $row['stock_decrease'],
                $row['purchased_qty'],
                '₱' . number_format($row['purchased_value'], 2),
                $row['current_stock'],
            ];
        }

        $csvData[] = []; // Empty row for spacing
        // Add totals row
        $csvData[] = [
            'SUMMARY',
            '',
            '',
            '',
            $reportData['total_sold_qty'],
            '₱' . number_format($reportData['total_sold_value'], 2),
            $reportData['total_sold_qty'],
            $reportData['total_purchased_qty'],
            '₱' . number_format($reportData['total_purchased_value'], 2),
            ''
        ];

        // Generate CSV content
        $csvContent = '';
        foreach ($csvData as $row) {
            $csvContent .= '"' . implode('","', array_map(function ($cell) {
                return str_replace('"', '""', $cell);
            }, $row)) . '"' . "\n";
        }

        return response($csvContent)
            ->header('Content-Type', 'text/csv; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename="inventory-report-' . now()->format('Y-m-d-His') . '.csv"');
    }

    /**
     * Export report as Excel (requires maatwebsite/excel package)
     */
    public function exportExcel(Request $request)
    {
        // For now, using CSV as Excel package may not be installed
        // CSV is compatible and can be opened with Excel
        return $this->exportCSV($request);
    }

    /**
     * Determine date range based on filter type
     */
    private function getDateRange($filterType, $filterDate)
    {
        $usedFallback = false;
        try {
            $date = Carbon::createFromFormat('Y-m-d', $filterDate);
            // [WB-SR-77] Reject overflow dates (e.g. 2026-99-99 parses but re-formats differently)
            if ($date->format('Y-m-d') !== $filterDate) {
                throw new \Exception('Overflowed date');
            }
        } catch (\Exception $e) {
            // [WB-SR-77] Fallback to today when date is malformed
            $date = Carbon::now();
            $usedFallback = true;
        }

        switch ($filterType) {
            case 'week':
                $startDate = $date->startOfWeek()->toDateString();
                $endDate = $date->endOfWeek()->toDateString();
                break;
            case 'month':
                $startDate = $date->startOfMonth()->toDateString();
                $endDate = $date->endOfMonth()->toDateString();
                break;
            case 'day':
            default:
                $startDate = $date->toDateString();
                $endDate = $date->toDateString();
                break;
        }

        return [$startDate, $endDate, $usedFallback];
    }

    /**
     * Format date range for display
     */
    private function formatDateRange($filterType, $startDate, $endDate)
    {
        switch ($filterType) {
            case 'week':
                return $startDate . ' to ' . $endDate . ' (Week)';
            case 'month':
                try {
                    return Carbon::createFromFormat('Y-m-d', $startDate)->format('F Y');
                } catch (\Exception $e) {
                    return $startDate;
                }
            case 'day':
            default:
                return $startDate;
        }
    }
}
