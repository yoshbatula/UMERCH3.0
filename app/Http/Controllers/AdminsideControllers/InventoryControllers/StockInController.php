<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\StockIn;
use App\Models\Inventory;
use App\Models\InventoryLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class StockInController extends Controller
{
    private function getStatus($quantity)
    {
        if ($quantity > 20) {
            return 'active';
        } elseif ($quantity > 0) {
            return 'low';
        } else {
            return 'out_of_stock';
        }
    }

    public function index()
    {
        // Return stock-in logs joined with product details using leftJoin
        return \Illuminate\Support\Facades\DB::table('stock_ins')
            ->leftJoin('_products', '_products.product_id', '=', 'stock_ins.product_id')
            ->select(
                'stock_ins.stock_in_id',
                'stock_ins.product_id',
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
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can create stock-in records');
        }
        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:_products,product_id',
                'variant' => 'required|string',
                'stock_qty' => 'required|integer|min:1',
                'cost' => 'required|numeric'
            ]);

            DB::transaction(function () use ($request) {
                $product = Products::findOrFail($request->product_id);
                $variant = trim($request->variant);

                // Just add to inventory, don't create new product records
                $currentInv = Inventory::where('product_id', $product->product_id)
                    ->where('variant', trim($request->variant))
                    ->first();
                $newQty = ($currentInv?->quantity ?? 0) + $request->stock_qty;
                Inventory::updateOrCreate(
                    ['product_id' => $product->product_id, 'variant' => trim($request->variant)],
                    [
                        'quantity' => $newQty,
                        'status' => $this->getStatus($newQty),
                        'cost' => $request->cost
                    ]
                );

                // Create stock-in log
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
                        }
                    }
                }
                

                // Log the stock-in activity
                InventoryLog::create([
                    'product_id' => $product->product_id,
                    'item_name' => $product->product_name . ' - ' . $variant,
                    'type' => 'Stock In',
                    'quantity' => $request->stock_qty,
                    'total' => $newQty,
                    'admin_action' => 'Admin'
                ]);

                Log::info('Stock In Created', [
                    'product_id' => $product->product_id,
                    'item_name' => $product->product_name . ' - ' . $variant,
                    'quantity' => $request->stock_qty,
                    'total' => $newQty,
                    'admin_action' => 'Admin'
                ]);
            });

            return redirect()->back()->with('success', 'Stock added successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Stock In Validation Error', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return redirect()->back()->withErrors($e->errors());
        } catch (\Throwable $e) {
            Log::error('Stock In Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can update stock-in records');
        }
        $request->validate([
            'variant' => 'required|string',
            'stock_qty' => 'required|integer|min:0',
        ]);

        try {
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

                // Update or create inventory record
                $currentInv = Inventory::where('product_id', $log->product_id)
                    ->where('variant', $newVariant)
                    ->first();
                $invNewQty = ($currentInv?->quantity ?? 0) + $delta;
                Inventory::updateOrCreate(
                    ['product_id' => $log->product_id, 'variant' => $newVariant],
                    [
                        'quantity' => max(0, $invNewQty),
                        'status' => $this->getStatus(max(0, $invNewQty)),
                        'cost' => $log->cost
                    ]
                );

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

                // Log the stock edit activity
                InventoryLog::create([
                    'product_id' => $product->product_id,
                    'item_name' => $product->product_name . ' - ' . $newVariant,
                    'type' => 'Edit Product',
                    'quantity' => $delta,
                    'total' => max(0, $invNewQty),
                    'admin_action' => 'Admin'
                ]);

                Log::info('Stock In Updated', [
                    'product_id' => $product->product_id,
                    'item_name' => $product->product_name . ' - ' . $newVariant,
                    'delta' => $delta,
                    'new_quantity' => max(0, $invNewQty),
                    'admin' => Auth::user()?->user_fullname ?? 'Admin'
                ]);

                return redirect()->back()->with('success', 'Stock updated successfully!');
            });
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Stock In Validation Error', [
                'errors' => $e->errors()
            ]);
            return redirect()->back()->withErrors($e->errors());
        } catch (\Throwable $e) {
            Log::error('Stock In Update Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        if (!Auth::check() || Auth::user()->role !== 'Admin') {
            abort(403, 'Only admins can delete stock-in records');
        }
        try {
            return \Illuminate\Support\Facades\DB::transaction(function () use ($id) {
                $log = StockIn::lockForUpdate()->findOrFail($id);
                $product = Products::findOrFail($log->product_id);

                // Decrease product stock by the logged quantity (not below zero)
                $decrement = (int) $log->stock_qty;
                if ($decrement > 0) {
                    $newStock = max(0, (int) $product->product_stock - $decrement);
                    $product->update(['product_stock' => $newStock]);
                }

                // Update inventory record
                $inventory = Inventory::where('product_id', $log->product_id)
                    ->where('variant', $log->variant)
                    ->first();
                if ($inventory) {
                    $newInvQty = max(0, $inventory->quantity - $decrement);
                    $inventory->update([
                        'quantity' => $newInvQty,
                        'status' => $this->getStatus($newInvQty)
                    ]);
                }

                // Create inventory log for the deletion
                InventoryLog::create([
                    'product_id' => $product->product_id,
                    'item_name' => $product->product_name . ' - ' . $log->variant,
                    'type' => 'Stock Out',
                    'quantity' => -$decrement,
                    'total' => max(0, ($inventory?->quantity ?? 0) - $decrement),
                    'admin_action' => 'Admin'
                ]);

                $log->delete();

                Log::info('Stock In Deleted', [
                    'product_id' => $product->product_id,
                    'item_name' => $product->product_name . ' - ' . $log->variant,
                    'quantity_deleted' => -$decrement,
                    'admin' => Auth::user()?->user_fullname ?? 'Admin'
                ]);

                return redirect()->back()->with('success', 'Stock deleted successfully!');
            });
        } catch (\Throwable $e) {
            Log::error('Stock In Delete Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
