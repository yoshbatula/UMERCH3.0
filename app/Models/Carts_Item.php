<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Carts_Item extends Model
{
    protected $table = '_carts_items';

    protected $primaryKey = 'cart_item_id';

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'variant',
        'price',
    ];
}