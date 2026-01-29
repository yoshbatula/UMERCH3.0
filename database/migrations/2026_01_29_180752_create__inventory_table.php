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
        Schema::create('_inventory', function (Blueprint $table) {
            $table->id('inventory_id');
            $table->foreignId('product_id')
                ->constrained('_products', 'product_id')
                ->onDelete('cascade');
            $table->string('product_name');
            $table->string('product_image');
            $table->dateTime('DateTime');
            $table->integer('stock')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_inventory');
    }
};
