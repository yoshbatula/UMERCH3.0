<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;

use App\Http\Controllers\Controller;
use App\Models\Orders;
use App\Models\OrderItems;
use App\Models\Products;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        $today = Carbon::today();
        
        // Today's Earnings - sum of all order items subtotals for today
        $todayEarnings = Orders::whereDate('created_at', $today)
            ->with('orderItems')
            ->get()
            ->sum(function ($order) {
                return $order->orderItems->sum('subtotal');
            });

        // Today's Products - count of active products in inventory
        $todayProducts = Products::where('product_stock', '>', 0)->count();

        // Today's Sales - count of orders placed today
        $todaySales = Orders::whereDate('created_at', $today)->count();
        
        // Today's Sales Amount
        $todaySalesAmount = Orders::whereDate('created_at', $today)
            ->with('orderItems')
            ->get()
            ->sum(function ($order) {
                return $order->orderItems->sum('subtotal');
            });

        // Total Login Users - total registered users
        $totalUsers = User::count();

        return response()->json([
            'todayEarnings' => $todayEarnings,
            'todayProducts' => $todayProducts,
            'todaySales' => $todaySales,
            'todaySalesAmount' => $todaySalesAmount,
            'totalUsers' => $totalUsers,
        ]);
    }

    public function getSalesOverview(Request $request)
    {
        $period = $request->get('period', 'daily'); // daily, weekly, monthly
        $today = Carbon::today();
        
        $salesData = [];

        if ($period === 'daily') {
            // Last 7 days
            for ($i = 6; $i >= 0; $i--) {
                $date = $today->copy()->subDays($i);
                $dayName = $date->format('D');
                
                $sales = Orders::whereDate('created_at', $date)
                    ->with('orderItems')
                    ->get()
                    ->sum(function ($order) {
                        return $order->orderItems->sum('subtotal');
                    });

                $salesData[] = [
                    'label' => $i === 0 ? 'Today' : $dayName,
                    'value' => $sales,
                ];
            }
        } elseif ($period === 'weekly') {
            // Last 4 weeks
            for ($i = 3; $i >= 0; $i--) {
                $startOfWeek = $today->copy()->subWeeks($i)->startOfWeek();
                $endOfWeek = $today->copy()->subWeeks($i)->endOfWeek();
                
                $sales = Orders::whereBetween('created_at', [$startOfWeek, $endOfWeek])
                    ->with('orderItems')
                    ->get()
                    ->sum(function ($order) {
                        return $order->orderItems->sum('subtotal');
                    });

                $salesData[] = [
                    'label' => 'Week ' . ($i === 0 ? 'Current' : (4 - $i)),
                    'value' => $sales,
                ];
            }
        } else {
            // Last 6 months
            for ($i = 5; $i >= 0; $i--) {
                $date = $today->copy()->subMonths($i);
                $monthName = $date->format('M');
                
                $sales = Orders::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->with('orderItems')
                    ->get()
                    ->sum(function ($order) {
                        return $order->orderItems->sum('subtotal');
                    });

                $salesData[] = [
                    'label' => $monthName,
                    'value' => $sales,
                ];
            }
        }

        return response()->json($salesData);
    }

    public function getInventoryStatus()
    {
        $lowStock = Products::where('product_stock', '>', 0)
            ->where('product_stock', '<=', 5)
            ->count();
        
        $outOfStock = Products::where('product_stock', 0)->count();
        
        $inStock = Products::where('product_stock', '>', 5)->count();

        $total = $lowStock + $outOfStock + $inStock;

        return response()->json([
            'lowStock' => $lowStock,
            'outOfStock' => $outOfStock,
            'inStock' => $inStock,
            'total' => $total,
            'lowStockPercent' => $total > 0 ? round(($lowStock / $total) * 100) : 0,
            'outOfStockPercent' => $total > 0 ? round(($outOfStock / $total) * 100) : 0,
            'inStockPercent' => $total > 0 ? round(($inStock / $total) * 100) : 0,
        ]);
    }

    public function getRecentTransactions()
    {
        $transactions = Orders::with(['user', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_id,
                    'customer' => $order->user ? $order->user->user_fullname : 'Unknown',
                    'status' => $order->status ?? 'Pending',
                    'orderId' => str_pad($order->order_id, 4, '0', STR_PAD_LEFT),
                    'amount' => $order->orderItems->sum('subtotal'),
                ];
            });

        return response()->json($transactions);
    }

    public function getTopProducts(Request $request)
    {
        $period = $request->get('period', 'weekly'); // weekly or monthly
        $today = Carbon::today();

        if ($period === 'weekly') {
            $startDate = $today->copy()->subWeek();
        } else {
            $startDate = $today->copy()->subMonth();
        }

        // Get top products based on quantity sold
        $topProducts = OrderItems::whereBetween('created_at', [$startDate, $today])
            ->with('product')
            ->selectRaw('product_id, SUM(quantity) as total_qty, SUM(subtotal) as total_sales')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(4)
            ->get()
            ->map(function ($item, $index) {
                return [
                    'rank' => $index + 1,
                    'name' => $item->product ? $item->product->product_name : 'Unknown',
                    'category' => $item->product ? $item->product->variant : 'N/A',
                    'quantity' => $item->total_qty,
                    'sales' => $item->total_sales,
                ];
            });

        return response()->json($topProducts);
    }

    public function getWeeklyStats()
    {
        $today = Carbon::today();
        $lastWeek = $today->copy()->subWeek();
        $twoWeeksAgo = $today->copy()->subWeeks(2);

        // This week's revenue
        $thisWeekRevenue = Orders::whereBetween('created_at', [$lastWeek, $today])
            ->with('orderItems')
            ->get()
            ->sum(fn($order) => $order->orderItems->sum('subtotal'));

        // Last week's revenue (for comparison)
        $lastWeekRevenue = Orders::whereBetween('created_at', [$twoWeeksAgo, $lastWeek])
            ->with('orderItems')
            ->get()
            ->sum(fn($order) => $order->orderItems->sum('subtotal'));

        // This week's orders
        $thisWeekOrders = Orders::whereBetween('created_at', [$lastWeek, $today])->count();
        $lastWeekOrders = Orders::whereBetween('created_at', [$twoWeeksAgo, $lastWeek])->count();

        // This week's sales amount
        $thisWeekSales = $thisWeekRevenue;
        $lastWeekSales = $lastWeekRevenue;

        // Calculate percentage changes
        $revenueChange = $lastWeekRevenue > 0 
            ? round((($thisWeekRevenue - $lastWeekRevenue) / $lastWeekRevenue) * 100) 
            : 0;
        $ordersChange = $lastWeekOrders > 0 
            ? round((($thisWeekOrders - $lastWeekOrders) / $lastWeekOrders) * 100) 
            : 0;
        $salesChange = $lastWeekSales > 0 
            ? round((($thisWeekSales - $lastWeekSales) / $lastWeekSales) * 100) 
            : 0;

        return response()->json([
            'revenue' => $thisWeekRevenue,
            'revenueChange' => $revenueChange,
            'orders' => $thisWeekOrders,
            'ordersChange' => $ordersChange,
            'sales' => $thisWeekSales,
            'salesChange' => $salesChange,
        ]);
    }
}
