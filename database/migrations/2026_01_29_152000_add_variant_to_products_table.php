<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('_products', 'variant')) {
            Schema::table('_products', function (Blueprint $table) {
                $table->string('variant')->after('product_stock');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('_products', 'variant')) {
            Schema::table('_products', function (Blueprint $table) {
                $table->dropColumn('variant');
            });
        }
    }
};
