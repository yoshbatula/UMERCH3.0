<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email_or_identifier',
        'ip_address',
        'user_agent',
        'success',
        'attempted_at',
    ];

    protected $casts = [
        'success' => 'boolean',
        'attempted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user associated with this login attempt
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get failed attempts for a user in the last N minutes
     */
    public function scopeFailedRecently($query, $userId, $minutes = 15)
    {
        return $query->where('user_id', $userId)
                     ->where('success', false)
                     ->where('attempted_at', '>=', now()->subMinutes($minutes))
                     ->orderBy('attempted_at', 'desc');
    }

    /**
     * Scope to get failed attempts from an IP in the last N minutes
     */
    public function scopeFailedFromIpRecently($query, $ipAddress, $minutes = 15)
    {
        return $query->where('ip_address', $ipAddress)
                     ->where('success', false)
                     ->where('attempted_at', '>=', now()->subMinutes($minutes))
                     ->orderBy('attempted_at', 'desc');
    }
}
