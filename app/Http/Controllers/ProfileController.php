<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
	public function show()
	{
		$user = Auth::user();
		return Inertia::render('Profile', [
			'user' => $user,
		]);
	}

	public function update(Request $request)
	{
		$user = Auth::user();
		$validated = $request->validate([
			'name' => 'required|string|max:255',
			'phone' => 'nullable|string|max:20',
			'address' => 'nullable|string|max:255',
			'city' => 'nullable|string|max:100',
			'state' => 'nullable|string|max:100',
			'country' => 'nullable|string|max:100',
			'pincode' => 'nullable|string|max:20',
		]);
		$user->update($validated);
		return redirect()->route('profile.show')->with('success', 'Profile updated successfully.');
	}
}
