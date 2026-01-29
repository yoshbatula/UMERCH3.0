<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    protected $table = '_orders';

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'user_id',
        'status',
        'receipt_form',
        'order_date',
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'order_id', 'order_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
