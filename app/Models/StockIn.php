<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockIn extends Model
{
    protected $table = 'stock_ins';

    protected $fillable = [
        'product_id',
        'stock_qty',
        'cost',
        'stock_in_date'
    ];
}

