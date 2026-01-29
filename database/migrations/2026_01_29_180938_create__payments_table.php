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
        Schema::create('_payments', function (Blueprint $table) {
            $table->id('payment_id');
            $table->foreignId('order_id')
                ->constrained('_orders', 'order_id')
                ->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_method');
            $table->string('receipt_photo')->nullable();
            $table->enum('status', ['Pending', 'Approved', 'Decline'])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_payments');
    }
};
