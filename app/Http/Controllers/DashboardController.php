<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the customer dashboard
     */
    public function index()
    {
        $user = Auth::user();

        $stats = [
            'total_orders' => Order::where('user_id', $user->id)->count(),
            'pending_orders' => Order::where('user_id', $user->id)->where('status', 'pending')->count(),
            'recent_orders' => Order::where('user_id', $user->id)->latest()->take(3)->get(),
        ];

        $featuredProducts = Product::with('category')
                                  ->where('stock', '>', 0)
                                  ->latest()
                                  ->take(8)
                                  ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'featuredProducts' => $featuredProducts
        ]);
    }
}
