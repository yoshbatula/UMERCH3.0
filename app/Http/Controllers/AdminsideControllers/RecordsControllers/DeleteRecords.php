<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class DeleteRecords extends Controller {

    // Function to delete a user record

    public function deleteUser($id) {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }
}