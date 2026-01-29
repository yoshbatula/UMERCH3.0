<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockIn extends Model
{
    protected $table = 'stock_ins';
    // Use the correct primary key defined in the migration
    protected $primaryKey = 'stock_in_id';

    protected $fillable = [
        'product_id',
        'variant',
        'stock_qty',
        'cost',
        'stock_in_date'
    ];
}

