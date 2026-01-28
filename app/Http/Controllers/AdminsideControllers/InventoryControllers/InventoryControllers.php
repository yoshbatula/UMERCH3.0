<?php

namespace App\Http\Controllers\AdminsideControllers\InventoryControllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use Illuminate\Support\Facades\Storage;

class InventoryControllers extends Controller {

    public function index() {
        $products = Products::all();
        return view('adminside.inventory.inventory', compact('products'));
    }
}