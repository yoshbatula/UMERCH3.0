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
        Schema::create('inventory_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained('_products', 'product_id')->onDelete('set null');
            $table->string('item_name');
            $table->enum('type', ['Stock In', 'Stock Out', 'Add Product', 'Delete Product', 'Archived', 'Restored', 'Edit Product']);
            $table->integer('quantity')->default(0);
            $table->integer('total')->default(0);
            $table->string('admin_action')->default('Admin_1'); // Who performed the action
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_logs');
    }
};
