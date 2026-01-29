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
        Schema::table('_inventory', function (Blueprint $table) {
            // Drop old columns if they exist
            if (Schema::hasColumn('_inventory', 'product_name')) {
                $table->dropColumn('product_name');
            }
            if (Schema::hasColumn('_inventory', 'product_image')) {
                $table->dropColumn('product_image');
            }
            if (Schema::hasColumn('_inventory', 'DateTime')) {
                $table->dropColumn('DateTime');
            }
            if (Schema::hasColumn('_inventory', 'stock')) {
                $table->dropColumn('stock');
            }
        });

        Schema::table('_inventory', function (Blueprint $table) {
            // Add new columns
            if (!Schema::hasColumn('_inventory', 'variant')) {
                $table->string('variant')->after('product_id');
            }
            if (!Schema::hasColumn('_inventory', 'quantity')) {
                $table->integer('quantity')->default(0)->after('variant');
            }
            if (!Schema::hasColumn('_inventory', 'status')) {
                $table->string('status')->default('active')->after('quantity');
            }
            if (!Schema::hasColumn('_inventory', 'cost')) {
                $table->decimal('cost', 10, 2)->nullable()->after('status');
            }

            // Create unique index on product_id + variant
            if (!Schema::hasIndex('_inventory', '_inventory_product_id_variant_unique')) {
                $table->unique(['product_id', 'variant']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('_inventory', function (Blueprint $table) {
            $table->dropUnique('_inventory_product_id_variant_unique');
            $table->dropColumn(['variant', 'quantity', 'status', 'cost']);
        });
    }
};
