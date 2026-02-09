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
        // Change action column from ENUM to VARCHAR to support descriptive activity messages
        DB::statement("ALTER TABLE activity_logs MODIFY COLUMN action VARCHAR(255) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to ENUM (only if you need to rollback)
        DB::statement("ALTER TABLE activity_logs MODIFY COLUMN action ENUM('Login', 'Activated', 'Deactivated') NOT NULL");
    }
};
