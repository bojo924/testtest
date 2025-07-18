<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(Request $request)
    {
        $query = Order::with('user');

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Search by order number or customer name
        if ($request->has('search') && $request->search) {
            $query->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
            'orderType' => 'all'
        ]);
    }

    /**
     * Display regular orders only
     */
    public function regular(Request $request)
    {
        $query = Order::with('user')->where('order_type', 'regular');

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Search by order number or customer name
        if ($request->has('search') && $request->search) {
            $query->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
            'orderType' => 'regular'
        ]);
    }

    /**
     * Display custom t-shirt orders only
     */
    public function custom(Request $request)
    {
        $query = Order::with('user', 'orderItems')->where('order_type', 'custom');

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Search by order number or customer name
        if ($request->has('search') && $request->search) {
            $query->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
            'orderType' => 'custom'
        ]);
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        $order->load(['user', 'orderItems.product']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled'
        ]);

        $oldStatus = $order->status;
        $newStatus = $request->status;

        // If order is being cancelled, restore stock
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            $order->load('orderItems.product');
            foreach ($order->orderItems as $orderItem) {
                if ($orderItem->product) {
                    $orderItem->product->increment('stock', $orderItem->quantity);
                }
            }
        }

        // If order was cancelled and now being reactivated, reserve stock again
        if ($oldStatus === 'cancelled' && $newStatus !== 'cancelled') {
            $order->load('orderItems.product');
            foreach ($order->orderItems as $orderItem) {
                if ($orderItem->product) {
                    // Check if enough stock is available
                    if ($orderItem->product->stock < $orderItem->quantity) {
                        return redirect()->back()
                            ->with('error', "Not enough stock available for {$orderItem->product->name}. Available: {$orderItem->product->stock}, Required: {$orderItem->quantity}");
                    }
                    $orderItem->product->decrement('stock', $orderItem->quantity);
                }
            }
        }

        $order->update(['status' => $newStatus]);

        return redirect()->back()
            ->with('success', 'Order status updated successfully.');
    }
}
