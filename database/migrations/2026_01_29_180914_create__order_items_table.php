<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('_order_items', function (Blueprint $table) {
            $table->id('order_item_id');
            $table->foreignId('order_id')
                ->constrained('_orders', 'order_id')
                ->onDelete('cascade');
            $table->foreignId('product_id')
                ->constrained('_products', 'product_id')
                ->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_order_items');
    }
};
