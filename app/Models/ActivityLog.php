<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    // Disable updated_at since the table only has created_at
    const UPDATED_AT = null;

    protected $fillable = [
        'action',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Get the user associated with the activity log
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Log user login activity
     */
    public static function logLogin($user, $admin = null)
    {
        $description = $admin 
            ? "Admin {$admin->admin_fullname} (ID: {$admin->admin_id}) logged in"
            : "User {$user->user_fullname} (ID: {$user->um_id}) logged in";

        return self::create([
            'action' => 'Login',
            'description' => $description,
        ]);
    }

    /**
     * Log user logout activity
     */
    public static function logLogout($user)
    {
        return self::create([
            'action' => 'Logout',
            'description' => "User {$user->user_fullname} (ID: {$user->um_id}) logged out",
        ]);
    }

    /**
     * Log user deactivation activity
     */
    public static function logDeactivated($user)
    {
        return self::create([
            'action' => 'Deactivated',
            'description' => "User {$user->user_fullname} (ID: {$user->um_id}) was deactivated",
        ]);
    }

    /**
     * Log user activation activity
     */
    public static function logActivated($user)
    {
        return self::create([
            'action' => 'Activated',
            'description' => "User {$user->user_fullname} (ID: {$user->um_id}) was activated",
        ]);
    }
}
