<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Show the admin dashboard
     */
    public function dashboard()
    {
        $stats = [
            'total_products' => Product::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_orders' => Order::count(),
            'regular_orders' => Order::where('order_type', 'regular')->count(),
            'custom_orders' => Order::where('order_type', 'custom')->count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_revenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
            'custom_revenue' => Order::where('order_type', 'custom')->where('status', '!=', 'cancelled')->sum('total_amount'),
            'recent_orders' => Order::with('user')->latest()->take(5)->get(),
            'recent_custom_orders' => Order::with('user', 'orderItems')->where('order_type', 'custom')->latest()->take(3)->get(),
            'low_stock_products' => Product::where('stock', '<=', 10)->take(5)->get(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}
