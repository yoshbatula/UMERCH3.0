<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // No-op: `product_id` is the primary key of `_products` and must not be dropped.
    }

    public function down(): void
    {
        // No-op
    }
};
