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
        Schema::create('_orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->foreignId('user_id')
                ->constrained('users', 'id')
                ->onDelete('cascade');
            $table->enum('status', ['Pending', 'Processing', 'Completed', 'Cancelled', 'Ready-for-pickup', 'Out-of-delivery'])->default('Pending');
            $table->string('receipt_form')->nullable();
            $table->dateTime('order_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_orders');
    }
};
