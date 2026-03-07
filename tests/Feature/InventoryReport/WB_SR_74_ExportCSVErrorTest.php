<?php

namespace Tests\Feature\InventoryReport;

use Tests\TestCase;
use App\Models\User;

/**
 * WB-SR-74 | InventoryReportController::exportCSV()
 * Branch: Data fetch failure — getReport() returns error structure
 *
 * Pre-condition: getReport() has the WB-SR-68 simulated exception in place:
 *   throw new \Exception('DB CONNECTION FAILED');
 *
 * Expected: exportCSV() detects the error structure and returns:
 *   HTTP 500 + body "Failed to generate report: DB CONNECTION FAILED"
 */
class WB_SR_74_ExportCSVErrorTest extends TestCase
{
    public function test_exportCSV_returns_500_with_error_message_when_getReport_fails(): void
    {
        // Arrange — in-memory admin user, no DB needed
        $admin = new User();
        $admin->id            = 1;
        $admin->user_fullname = 'Test Admin';
        $admin->email         = 'admin@test.com';
        $admin->role          = 'Admin';

        $this->actingAs($admin);

        // Act — exportCSV() internally calls getReport(), which throws and returns
        // { error: "Failed to generate report: DB CONNECTION FAILED" }
        $response = $this->get('/admin/inventory-report/export-csv');

        // Assert 1 — HTTP 500
        $response->assertStatus(500);

        // Assert 2 — body is exactly the error message passed back from getReport()
        $this->assertStringContainsString(
            'Failed to generate report: DB CONNECTION FAILED',
            $response->getContent()
        );
    }
}
