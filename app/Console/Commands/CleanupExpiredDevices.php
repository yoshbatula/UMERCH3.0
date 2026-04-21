<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TrustedDevice;

class CleanupExpiredDevices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'devices:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove expired trusted devices from the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $deleted = TrustedDevice::where('is_expired', true)
            ->orWhere('expires_at', '<', now())
            ->delete();

        $this->info("Cleaned up {$deleted} expired device(s).");
    }
}
