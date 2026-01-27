<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'um_id' => '544960',
            'email' => 'rho.jornadal.544960@umindanao.edu.ph',
            'user_fullname' => 'Rho Jornadal',
            'user_password' => Hash::make('rho123'),
        ]);
    }
}
