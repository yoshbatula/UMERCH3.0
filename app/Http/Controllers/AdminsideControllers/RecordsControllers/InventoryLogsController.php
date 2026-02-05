<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InventoryLog;
use Inertia\Inertia;

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
        $query = InventoryLog::with('product')
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

        return response()->json($logs);
    }
}
