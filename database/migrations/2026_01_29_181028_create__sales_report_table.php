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
        Schema::create('_sales_report', function (Blueprint $table) {
            $table->id('sales_report_id');
            $table->double('total_sales')->default(0);
            $table->double('daily_sales')->default(0);
            $table->dateTime('generated_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_sales_report');
    }
};
