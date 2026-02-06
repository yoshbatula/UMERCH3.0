<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('_products', function (Blueprint $table) {
            $table->enum('status', ['active', 'archived'])->default('active')->after('variant');
        });
    }

    public function down(): void
    {
        Schema::table('_products', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
