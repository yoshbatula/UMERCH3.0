<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\StockIn;
use Illuminate\Support\Facades\DB;

class StockInController extends Controller
{
    public function index()
    {
        // Return stock-in logs joined with product details
        return \Illuminate\Support\Facades\DB::table('stock_ins')
            ->join('_products', '_products.product_id', '=', 'stock_ins.product_id')
            ->select(
                'stock_ins.stock_in_id',
                '_products.product_id',
                '_products.product_name',
                'stock_ins.variant',
                'stock_ins.cost',
                'stock_ins.stock_qty',
                '_products.product_image'
            )
            ->orderBy('stock_ins.stock_in_date', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:_products,product_id',
            'variant' => 'required|string',
            'stock_qty' => 'required|integer|min:1',
            'cost' => 'required|numeric'
        ]);

        DB::transaction(function () use ($request) {
            $product = Products::findOrFail($request->product_id);
            $variant = trim($request->variant);

            // Increment overall product stock
            $product->increment('product_stock', $request->stock_qty);

            // Merge with existing stock-in entry for same product + variant
            $existing = StockIn::where('product_id', $product->product_id)
                ->where('variant', $variant)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                $existing->update([
                    'stock_qty' => $existing->stock_qty + $request->stock_qty,
                    'cost' => $request->cost,
                    'stock_in_date' => now(),
                ]);
            } else {
                try {
                    StockIn::create([
                        'product_id' => $product->product_id,
                        'variant' => $variant,
                        'stock_qty' => $request->stock_qty,
                        'cost' => $request->cost,
                        'stock_in_date' => now()
                    ]);
                } catch (\Illuminate\Database\QueryException $e) {
                    // Handle race where another insert just created the same (product_id, variant)
                    $row = StockIn::where('product_id', $product->product_id)
                        ->where('variant', $variant)
                        ->lockForUpdate()
                        ->first();
                    if ($row) {
                        $row->update([
                            'stock_qty' => $row->stock_qty + $request->stock_qty,
                            'cost' => $request->cost,
                            'stock_in_date' => now(),
                        ]);
                    } else {
                        throw $e;
                    }
                }
            }
        });

        return redirect()->back()->with('success', 'Stock added successfully!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'variant' => 'required|string',
            'stock_qty' => 'required|integer|min:0',
        ]);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($request, $id) {
            $log = StockIn::lockForUpdate()->findOrFail($id);
            $product = Products::findOrFail($log->product_id);

            $newVariant = trim($request->variant);
            $newQty = (int) $request->stock_qty;
            $delta = $newQty - (int) $log->stock_qty;

            // Adjust product stock by delta
            if ($delta !== 0) {
                $product->increment('product_stock', $delta);
            }

            // If variant changes and there is an existing row for the new variant, merge
            if ($newVariant !== $log->variant) {
                $existing = StockIn::where('product_id', $log->product_id)
                    ->where('variant', $newVariant)
                    ->lockForUpdate()
                    ->first();

                if ($existing) {
                    $existing->update([
                        'stock_qty' => (int) $existing->stock_qty + $newQty,
                        'stock_in_date' => now(),
                    ]);
                    $log->delete();
                } else {
                    $log->update([
                        'variant' => $newVariant,
                        'stock_qty' => $newQty,
                        'stock_in_date' => now(),
                    ]);
                }
            } else {
                $log->update([
                    'stock_qty' => $newQty,
                    'stock_in_date' => now(),
                ]);
            }

            return redirect()->back()->with('success', 'Stock updated successfully!');
        });
    }

    public function destroy($id)
    {
        return \Illuminate\Support\Facades\DB::transaction(function () use ($id) {
            $log = StockIn::lockForUpdate()->findOrFail($id);
            $product = Products::findOrFail($log->product_id);

            // Decrease product stock by the logged quantity (not below zero)
            $decrement = (int) $log->stock_qty;
            if ($decrement > 0) {
                $newStock = max(0, (int) $product->product_stock - $decrement);
                $product->update(['product_stock' => $newStock]);
            }

            $log->delete();

            return redirect()->back()->with('success', 'Stock deleted successfully!');
        });
    }
}
