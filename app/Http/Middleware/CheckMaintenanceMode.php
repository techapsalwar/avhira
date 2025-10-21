<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if maintenance mode is enabled
        $isMaintenanceMode = Cache::get('site_maintenance_mode', false);

        if (!$isMaintenanceMode) {
            return $next($request);
        }

        // Allow access to maintenance page itself (prevent redirect loop)
        if ($request->is('maintenance')) {
            return $next($request);
        }

        // Allow access to admin routes
        if ($request->is('admin*')) {
            return $next($request);
        }

        // Allow access to login routes
        if ($request->is('login') || $request->is('login/*')) {
            return $next($request);
        }

        // Allow access to logout
        if ($request->is('logout')) {
            return $next($request);
        }

        // Allow admins to view the site
        if (Auth::check() && Auth::user()->is_admin) {
            return $next($request);
        }

        // Show maintenance page for everyone else
        return redirect()->route('maintenance.show');
    }
}
