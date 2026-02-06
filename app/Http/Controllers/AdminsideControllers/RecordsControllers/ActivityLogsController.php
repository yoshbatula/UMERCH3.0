<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogsController extends Controller
{
    /**
     * Get activity logs with pagination and filtering
     */
    public function getLogs(Request $request)
    {
        $query = ActivityLog::query()->orderBy('created_at', 'desc');

        // Search filter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user_name', 'like', "%{$search}%")
                    ->orWhere('user_id', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Activity filter
        if ($request->has('activity') && $request->activity != 'all') {
            $activity = $request->activity;
            
            // Handle Archive and Restore filters with partial matching
            if ($activity === 'Archive' || $activity === 'Restore') {
                $query->where('activity', 'like', "{$activity}%");
            } else {
                $query->where('activity', $activity);
            }
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $logs = $query->paginate($perPage);

        return response()->json($logs);
    }

    /**
     * Get activity statistics
     */
    public function getStats()
    {
        $totalActivities = ActivityLog::count();
        $totalLogins = ActivityLog::where('activity', 'Login')->count();
        $totalLogouts = ActivityLog::where('activity', 'Logout')->count();
        $totalArchived = ActivityLog::where('activity', 'like', 'Archived Product:%')->count();
        $totalRestored = ActivityLog::where('activity', 'like', 'Restored Product:%')->count();

        return response()->json([
            'total_activities' => $totalActivities,
            'total_logins' => $totalLogins,
            'total_logouts' => $totalLogouts,
            'total_archived' => $totalArchived,
            'total_restored' => $totalRestored,
        ]);
    }
}
