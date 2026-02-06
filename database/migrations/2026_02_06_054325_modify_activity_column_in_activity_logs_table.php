<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, drop the index on activity column
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['activity']);
        });
        
        // Change activity column from ENUM to VARCHAR to support descriptive activity messages
        DB::statement("ALTER TABLE activity_logs MODIFY COLUMN activity VARCHAR(255) NOT NULL");
        
        // Optionally recreate the index with a key length
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->index('activity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the index first
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['activity']);
        });
        
        // Revert back to ENUM (only if you need to rollback)
        DB::statement("ALTER TABLE activity_logs MODIFY COLUMN activity ENUM('Login', 'Logout', 'Activated', 'Deactivated') NOT NULL");
        
        // Recreate the index
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->index('activity');
        });
    }
};
