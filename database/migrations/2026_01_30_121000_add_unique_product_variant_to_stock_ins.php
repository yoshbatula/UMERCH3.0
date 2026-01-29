<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_ins', function (Blueprint $table) {
            // Add a unique index on (product_id, variant) to prevent duplicate rows per variant
            // Guard against existing index name conflicts by using a deterministic name
            $table->unique(['product_id', 'variant'], 'stock_ins_product_variant_unique');
        });
    }

    public function down(): void
    {
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->dropUnique('stock_ins_product_variant_unique');
        });
    }
};
