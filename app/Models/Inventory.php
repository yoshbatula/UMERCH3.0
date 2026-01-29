<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'inventories';

    protected $primaryKey = 'inventory_id';

    protected $fillable = [
        'product_id',
        'product_name',
        'status',
        'stock',
        'product_image',
        'DateTime',
    ];
}