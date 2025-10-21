<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    /**
     * Display the maintenance mode page
     */
    public function show()
    {
        return Inertia::render('Maintenance', [
            'message' => Cache::get('maintenance_message', 'We are currently performing scheduled maintenance. Please check back soon!'),
        ]);
    }

    /**
     * Toggle maintenance mode (Admin only)
     */
    public function toggle(Request $request)
    {
        $isEnabled = Cache::get('site_maintenance_mode', false);
        
        // Toggle the state
        Cache::forever('site_maintenance_mode', !$isEnabled);
        
        // Optional: Store custom message
        if ($request->has('message') && !empty($request->message)) {
            Cache::forever('maintenance_message', $request->message);
        }

        return back()->with('success', 'Maintenance mode ' . (!$isEnabled ? 'enabled' : 'disabled'));
    }

    /**
     * Get maintenance mode status
     */
    public function status()
    {
        return response()->json([
            'enabled' => Cache::get('site_maintenance_mode', false),
            'message' => Cache::get('maintenance_message', 'We are currently performing scheduled maintenance. Please check back soon!'),
        ]);
    }
}
