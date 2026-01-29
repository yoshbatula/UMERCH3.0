<?php
namespace App\Http\Controllers\UsersideControllers\CartsController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Carts_Item;

class RemoveCart extends Controller {
    public function removeFromCart($cartItemId) {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            Carts_Item::destroy($cartItemId);
            return response()->json(['message' => 'Item removed successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error removing item'], 500);
        }
    }
}
