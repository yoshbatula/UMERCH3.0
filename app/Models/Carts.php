<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Carts extends Model
{
    protected $table = '_carts';

    protected $primaryKey = 'cart_id';

    protected $fillable = [
        'user_id',
    ];
}