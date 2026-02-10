<?php

// Test script to verify InventoryLog creation
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\InventoryLog;
use App\Models\Products;

// Check if a product exists
$product = Products::first();

if (!$product) {
    echo "No products found in database\n";
    exit(1);
}

echo "Testing with product: " . $product->product_name . "\n";
echo "Product ID: " . $product->product_id . "\n\n";

// Try to create a test log
try {
    $log = InventoryLog::create([
        'product_id' => $product->product_id,
        'item_name' => $product->product_name . ' - TEST',
        'type' => 'Stock In',
        'quantity' => 5,
        'total' => 15,
        'admin_action' => 'Test Admin'
    ]);
    
    echo "✓ Successfully created test log with ID: " . $log->id . "\n";
    echo "  Created at: " . $log->created_at . "\n\n";
    
    // Now verify it can be fetched back
    $fetched = InventoryLog::find($log->id);
    if ($fetched) {
        echo "✓ Successfully fetched the test log back\n";
        echo "  Item Name: " . $fetched->item_name . "\n";
    } else {
        echo "✗ Could not fetch the test log back\n";
    }
    
    // Check total count
    $count = InventoryLog::count();
    echo "\n✓ Total inventory logs in database: " . $count . "\n";
    
    // Delete the test log
    $log->delete();
    echo "✓ Cleaned up test log\n";
    
} catch (\Exception $e) {
    echo "✗ Error creating test log: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
