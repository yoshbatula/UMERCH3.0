<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\StockOut;
use App\Models\InventoryLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
class StockOutController extends Controller
{
    // Stock out logs
    public function logs()
    {
        try {
            $logs = StockOut::join('_products', 'stock_outs.product_id', '_products.product_id')
                ->select(
                    'stock_outs.stock_out_id as id',
                    'stock_outs.date_time',
                    '_products.product_name',
                    '_products.variant',
                    'stock_outs.quantity',
                    'stock_outs.modified_by'
                )
                ->orderByDesc('stock_outs.date_time')
                ->get();
            
            Log::info('Stock-out logs returned: ' . $logs->count() . ' records');
            
            return $logs;
        } catch (\Exception $e) {
            Log::error('Error fetching stock-out logs: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    public function store(Request $request)
    {
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can create stock-out records');
        }
        $request->validate([
            'product_id' => 'required|exists:_products,id',
            'quantity' => 'required|integer|min:1',
            'modified_by' => 'required'
        ]);

        DB::transaction(function () use ($request) {
            $product = Products::findOrFail($request->product_id);

            if ($product->product_stock < $request->quantity) {
                abort(400, 'Insufficient stock');
            }

            $product->decrement('product_stock', $request->quantity);

            StockOut::create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'modified_by' => $request->modified_by,
                'date_time' => now()
            ]);

            // Log the stock out operation
            InventoryLog::create([
                'product_id' => $product->id,
                'item_name' => $product->product_name,
                'type' => 'Stock Out',
                'quantity' => -$request->quantity, // Negative for stock out
                'total' => $product->product_stock,
                'admin_action' => 'Admin'
            ]);
        });

        return response()->json(['message' => 'Stock deducted']);
    }
}
