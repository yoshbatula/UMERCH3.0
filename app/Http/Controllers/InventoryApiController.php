<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\JsonResponse;

class InventoryApiController extends Controller
{
    /**
     * Get all inventory records with per-variant stock quantities
     */
    public function index(): JsonResponse
    {
        $inventory = Inventory::all();
        return response()->json($inventory);
    }

    /**
     * Get inventory for a specific product
     */
    public function getByProduct($productId): JsonResponse
    {
        $inventory = Inventory::where('product_id', $productId)->get();
        return response()->json($inventory);
    }
}
