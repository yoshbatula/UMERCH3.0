<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\StockOut;
use Illuminate\Support\Facades\DB;

class StockOutController extends Controller
{
    public function logs()
    {
        return StockOut::join('_products', 'stock_outs.product_id', '_products.id')
            ->select(
                'stock_outs.id',
                'stock_outs.date_time',
                '_products.product_name',
                'stock_outs.quantity',
                'stock_outs.modified_by'
            )
            ->orderByDesc('stock_outs.date_time')
            ->get();
    }

    public function store(Request $request)
    {
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
        });

        return response()->json(['message' => 'Stock deducted']);
    }
}
