<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display customer's order history
     */
    public function index()
    {
        $orders = Order::with('orderItems.product')
                      ->where('user_id', Auth::id())
                      ->latest()
                      ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Show checkout page
     */
    public function checkout()
    {
        $cartItems = $this->getCartItems();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty.');
        }

        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return Inertia::render('Orders/Checkout', [
            'cartItems' => $cartItems,
            'total' => $total,
            'user' => Auth::user()
        ]);
    }

    /**
     * Process the order
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.street' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.state' => 'required|string|max:255',
            'shipping_address.zip' => 'required|string|max:20',
            'billing_address' => 'required|array',
            'billing_address.street' => 'required|string|max:255',
            'billing_address.city' => 'required|string|max:255',
            'billing_address.state' => 'required|string|max:255',
            'billing_address.zip' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string|max:500'
        ]);

        $cartItems = $this->getCartItems();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty.');
        }

        // Calculate total
        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        DB::transaction(function () use ($request, $cartItems, $total) {
            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => Order::generateOrderNumber(),
                'status' => 'pending',
                'total_amount' => $total,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
                'phone' => $request->phone,
                'notes' => $request->notes
            ]);

            // Create order items and update stock
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;

                // Check stock availability
                if ($product->stock < $cartItem->quantity) {
                    throw new \Exception("Not enough stock for product: {$product->name}");
                }

                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'price' => $product->price,
                    'product_name' => $product->name,
                    'product_image' => $product->image
                ]);

                // Update product stock
                $product->decrement('stock', $cartItem->quantity);
            }

            // Clear cart
            if (Auth::check()) {
                CartItem::where('user_id', Auth::id())->delete();
            } else {
                session()->forget('cart');
            }
        });

        return redirect()->route('orders.index')
            ->with('success', 'Order placed successfully!');
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load('orderItems.product');

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Get cart items based on authentication status
     */
    private function getCartItems()
    {
        if (Auth::check()) {
            return CartItem::with('product.category')
                          ->where('user_id', Auth::id())
                          ->get();
        } else {
            $cart = session()->get('cart', []);
            $cartItems = collect();

            foreach ($cart as $item) {
                $product = Product::with('category')->find($item['product_id']);
                if ($product) {
                    $cartItems->push((object) [
                        'id' => $item['product_id'],
                        'product' => $product,
                        'quantity' => $item['quantity']
                    ]);
                }
            }

            return $cartItems;
        }
    }
}
