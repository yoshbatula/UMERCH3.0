<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('_products', 'product_id')) {
            Schema::table('_products', function (Blueprint $table) {
                $table->dropColumn('product_id');
            });
        }
    }

    public function down(): void
    {
        // If needed, you can restore the column, but normally `_products` should not have `product_id`.
        if (!Schema::hasColumn('_products', 'product_id')) {
            Schema::table('_products', function (Blueprint $table) {
                $table->unsignedBigInteger('product_id')->nullable();
            });
        }
    }
};
