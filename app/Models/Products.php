<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table = '_products';

    protected $fillable = [
        'product_name',
        'product_image',
        'product_description',
        'product_price',
        'product_stock',
        'variant',
    ];
}
