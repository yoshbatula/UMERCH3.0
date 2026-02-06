<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    protected $fillable = [
        'user_id',
        'user_name',
        'email',
        'activity',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
    public static function logLogin($user)
    {
        return self::create([
            'user_id' => $user->um_id ?? $user->id,
            'user_name' => $user->user_fullname ?? $user->name,
            'email' => $user->email,
            'activity' => 'Login',
        ]);
    }

    /**
     * Log user logout activity
     */
    public static function logLogout($user)
    {
        return self::create([
            'user_id' => $user->um_id ?? $user->id,
            'user_name' => $user->user_fullname ?? $user->name,
            'email' => $user->email,
            'activity' => 'Logout',
        ]);
    }

    /**
     * Log user activation activity
     */
    public static function logActivated($user)
    {
        return self::create([
            'user_id' => $user->um_id ?? $user->id,
            'user_name' => $user->user_fullname ?? $user->name,
            'email' => $user->email,
            'activity' => 'Activated',
        ]);
    }

    /**
     * Log user deactivation activity
     */
    public static function logDeactivated($user)
    {
        return self::create([
            'user_id' => $user->um_id ?? $user->id,
            'user_name' => $user->user_fullname ?? $user->name,
            'email' => $user->email,
            'activity' => 'Deactivated',
        ]);
    }

    /**
     * Log product archive activity
     */
    public static function logProductArchive($user, $productName, $variant)
    {
        return self::create([
            'user_id' => $user->um_id ?? $user->id,
            'user_name' => $user->user_fullname ?? $user->name,
            'email' => $user->email,
            'activity' => "Archived Product: {$productName} - {$variant}",
        ]);
    }

    /**
     * Log product restore activity
     */
    public static function logProductRestore($user, $productName, $variant)
    {
        return self::create([
            'user_id' => $user->um_id ?? $user->id,
            'user_name' => $user->user_fullname ?? $user->name,
            'email' => $user->email,
            'activity' => "Restored Product: {$productName} - {$variant}",
        ]);
    }
}
