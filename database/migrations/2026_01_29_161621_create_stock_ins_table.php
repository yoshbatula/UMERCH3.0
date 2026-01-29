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
        Schema::create('stock_ins', function (Blueprint $table) {
        $table->id('stock_in_id');
        $table->foreignId('product_id')
        ->constrained('_products', 'product_id')
        ->onDelete('cascade');
        $table->integer('stock_qty');
        $table->decimal('cost', 10, 2);
        $table->timestamp('stock_in_date');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_ins');
    }
};
