<?php

namespace Tests\Unit\InventoryReport;

use Tests\TestCase;
use Carbon\Carbon;
use ReflectionMethod;
use App\Http\Controllers\AdminsideControllers\InventoryControllers\InventoryReportController;

/**
 * WB-SR-77 | InventoryReportController::getDateRange()
 * Branch: Invalid date handling — malformed filterDate string
 *
 * Expected: Carbon::createFromFormat() throws, catch block runs,
 *           $date falls back to Carbon::now(), date range reflects today.
 *
 * Strategy: getDateRange() is private — use PHP ReflectionMethod to invoke
 *           it directly, bypassing getReport() entirely.
 */
class WB_SR_77_GetDateRangeInvalidDateTest extends TestCase
{
    private function callGetDateRange(string $filterType, string $filterDate): array
    {
        $controller = new InventoryReportController();
        $method = new ReflectionMethod(InventoryReportController::class, 'getDateRange');
        $method->setAccessible(true);
        return $method->invoke($controller, $filterType, $filterDate);
    }

    /**
     * Asserts that a clearly malformed date ('not-a-date') causes the catch block
     * to fire and fall back to today.
     */
    public function test_malformed_date_falls_back_to_today_for_day_filter(): void
    {
        $today = Carbon::now()->toDateString();

        [$startDate, $endDate] = $this->callGetDateRange('day', 'not-a-date');

        $this->assertEquals($today, $startDate);
        $this->assertEquals($today, $endDate);
    }

    /**
     * Out-of-range date ('2026-99-99') — Carbon throws, falls back to now().
     */
    public function test_out_of_range_date_falls_back_to_current_week(): void
    {
        $now   = Carbon::now();
        $start = $now->copy()->startOfWeek()->toDateString();
        $end   = $now->copy()->endOfWeek()->toDateString();

        [$startDate, $endDate] = $this->callGetDateRange('week', '2026-99-99');

        $this->assertEquals($start, $startDate);
        $this->assertEquals($end,   $endDate);
    }

    /**
     * Empty string — Carbon throws, falls back to now().
     */
    public function test_empty_string_falls_back_to_current_month(): void
    {
        $now   = Carbon::now();
        $start = $now->copy()->startOfMonth()->toDateString();
        $end   = $now->copy()->endOfMonth()->toDateString();

        [$startDate, $endDate] = $this->callGetDateRange('month', '');

        $this->assertEquals($start, $startDate);
        $this->assertEquals($end,   $endDate);
    }
}
