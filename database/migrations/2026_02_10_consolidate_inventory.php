<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Move inventory from deleted products (4, 5, 6) to original products (1, 2, 3)
        DB::table('_inventory')->where('product_id', 4)->update(['product_id' => 1]);
        DB::table('_inventory')->where('product_id', 5)->update(['product_id' => 2]);
        DB::table('_inventory')->where('product_id', 6)->update(['product_id' => 3]);
        
        // Move stock_ins from deleted products to original products
        DB::table('stock_ins')->where('product_id', 4)->update(['product_id' => 1]);
        DB::table('stock_ins')->where('product_id', 5)->update(['product_id' => 2]);
        DB::table('stock_ins')->where('product_id', 6)->update(['product_id' => 3]);
    }

    public function down(): void
    {
        // No rollback needed
    }
};
