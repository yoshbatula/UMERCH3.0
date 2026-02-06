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

        // Filter out admin activities (admin has um_id = 1 or user_fullname = 'Admin')
        $query->where(function ($q) {
            $q->where('description', 'NOT LIKE', '%ID: 1)%')
              ->where('description', 'NOT LIKE', 'User Admin (ID: 1)%');
        });

        // Search filter - search in action and description
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Activity filter
        if ($request->has('activity') && $request->activity != 'all') {
            $activity = $request->activity;
            $query->where('action', $activity);
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
        // Filter out admin activities from stats (admin has um_id = 1)
        $totalActivities = ActivityLog::where('description', 'NOT LIKE', '%ID: 1)%')->count();
        $totalLogins = ActivityLog::where('action', 'Login')
            ->where('description', 'NOT LIKE', '%ID: 1)%')
            ->count();
        $totalLogouts = ActivityLog::where('action', 'Logout')
            ->where('description', 'NOT LIKE', '%ID: 1)%')
            ->count();

        return response()->json([
            'total_activities' => $totalActivities,
            'total_logins' => $totalLogins,
            'total_logouts' => $totalLogouts,
        ]);
    }
}
