<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table = '_products';

    // Use the correct primary key column name
    protected $primaryKey = 'product_id';

    protected $fillable = [
        'product_name',
        'product_image',
        'product_description',
        'product_price',
        'product_stock',
        'variant',
    ];
}
