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
        // Alter the activity enum to include Activated and Deactivated
        DB::statement("ALTER TABLE activity_logs MODIFY COLUMN activity ENUM('Login', 'Logout', 'Activated', 'Deactivated') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        DB::statement("ALTER TABLE activity_logs MODIFY COLUMN activity ENUM('Login', 'Logout') NOT NULL");
    }
};
