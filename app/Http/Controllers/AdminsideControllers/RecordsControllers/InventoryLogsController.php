<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InventoryLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
class InventoryLogsController extends Controller
{
    // Render the Inventory Logs page
    public function index()
    {
        return Inertia::render('Admin-side/RecordLogin-page/InventoryLogs');
    }

    // API endpoint to fetch inventory logs
    public function getLogs(Request $request)
    {
        try {
            $query = InventoryLog::query()
                ->orderBy('created_at', 'desc');

            // Apply filters if provided
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            if ($request->has('search') && $request->search) {
                $query->where('item_name', 'like', '%' . $request->search . '%');
            }

            // Pagination
            $perPage = $request->get('per_page', 10);
            $logs = $query->paginate($perPage);

            // Format the response to match frontend expectations
            return response()->json([
                'data' => $logs->items(),
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'from' => $logs->firstItem(),
                'to' => $logs->lastItem(),
            ]);
        } catch (\Exception $e) {
            Log::error('InventoryLogsController Error: ' . $e->getMessage());
            return response()->json([
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
