<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class DeleteRecords extends Controller {

    // Function to delete a user record
    // Note: When a user is deleted, their orders and sales data are preserved in the database.
    // The user_id in orders table will be set to NULL, and orders will display "Deleted User" in transactions.

    public function deleteUser($id) {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }
}