<?php

namespace Tests\Feature\InventoryReport;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Log;

/**
 * WB-SR-68 | InventoryReportController::getReport()
 * Branch: Exception handling — DB connection error
 *
 * Expected: 500 JSON response + error logged to file
 *
 * Strategy: The test environment uses SQLite :memory: with NO migrations run,
 * so any Eloquent query inside getReport() throws a QueryException naturally
 * (table does not exist). We verify the catch block fires: Log::error() is
 * called and the response is 500 with an { error } body.
 */
class WB_SR_68_GetReportExceptionTest extends TestCase
{
    public function test_getReport_returns_500_and_logs_error_on_db_failure(): void
    {
        // Arrange — build an in-memory Admin user (never persisted, no DB needed)
        $admin = new User();
        $admin->id            = 1;
        $admin->user_fullname = 'Test Admin';
        $admin->email         = 'admin@test.com';
        $admin->role          = 'Admin';

        // actingAs() injects the user directly into the auth guard — no DB query
        $this->actingAs($admin);

        // Spy on Log so we can assert error() was called
        Log::spy();

        // Act — SQLite :memory: has no tables, so Products::get() throws QueryException
        // which is caught by the catch (\Exception $e) block in getReport()
        $response = $this->getJson('/admin/inventory-report');

        // Assert 1 — HTTP 500
        $response->assertStatus(500);

        // Assert 2 — response body contains an "error" key
        $response->assertJsonStructure(['error']);

        // Assert 3 — Log::error was called with the expected prefix
        Log::shouldHaveReceived('error')
            ->atLeast()->once()
            ->withArgs(fn(string $message) => str_starts_with($message, 'Inventory Report Error:'));
    }
}
