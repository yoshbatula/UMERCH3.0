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
        Schema::create('_fullfilments', function (Blueprint $table) {
            $table->id('fullfilment_id');
            $table->foreignId('order_id')
                ->constrained('_orders', 'order_id')
                ->onDelete('cascade');
            $table->enum('status', ['Delivery', 'Pickup']);
            $table->dateTime('release_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_fullfilments');
    }
};
