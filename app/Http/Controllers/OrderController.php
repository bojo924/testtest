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
        $regularOrders = Order::with('orderItems.product')
                             ->where('user_id', Auth::id())
                             ->where('order_type', 'regular')
                             ->latest()
                             ->paginate(5, ['*'], 'regular_page');

        $customOrders = Order::with('orderItems.product')
                            ->where('user_id', Auth::id())
                            ->where('order_type', 'custom')
                            ->latest()
                            ->paginate(5, ['*'], 'custom_page');

        return Inertia::render('Orders/Index', [
            'regularOrders' => $regularOrders,
            'customOrders' => $customOrders
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
            if (isset($item->is_custom) && $item->is_custom) {
                return $item->quantity * $item->custom_price;
            }
            return $item->quantity * $item->product->price;
        });

        DB::transaction(function () use ($request, $cartItems, $total) {
            // Determine order type based on cart items
            $hasCustomItems = $cartItems->contains(function ($item) {
                return isset($item->is_custom) && $item->is_custom;
            });

            $orderType = $hasCustomItems ? 'custom' : 'regular';

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => Order::generateOrderNumber(),
                'status' => 'pending',
                'total_amount' => $total,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
                'phone' => $request->phone,
                'notes' => $request->notes,
                'order_type' => $orderType
            ]);

            // Create order items and decrement stock
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                $isCustom = isset($cartItem->is_custom) && $cartItem->is_custom;

                // Check stock availability for regular products
                if (!$isCustom && $product->stock < $cartItem->quantity) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                // Create order item
                $orderItemData = [
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'price' => $isCustom ? $cartItem->custom_price : $product->price,
                    'product_name' => $isCustom ? "Custom T-Shirt ({$cartItem->custom_color})" : $product->name,
                    'product_image' => $product->image,
                    'is_custom' => $isCustom,
                ];

                if ($isCustom) {
                    $orderItemData['custom_color'] = $cartItem->custom_color;
                    $orderItemData['custom_design_path'] = $cartItem->custom_design_path;
                }

                OrderItem::create($orderItemData);

                // Decrement stock only for regular products (custom t-shirts don't use stock)
                if (!$isCustom) {
                    $product->decrement('stock', $cartItem->quantity);
                }
            }

            // Clear cart (don't restore stock since order is confirmed)
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

            foreach ($cart as $key => $item) {
                $product = Product::with('category')->find($item['product_id']);
                if ($product) {
                    $cartItem = (object) [
                        'id' => $key,
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'is_custom' => $item['is_custom'] ?? false,
                        'custom_color' => $item['custom_color'] ?? null,
                        'custom_design_path' => $item['custom_design_path'] ?? null,
                        'custom_price' => $item['custom_price'] ?? null,
                        'tshirt_image' => $item['tshirt_image'] ?? null,
                    ];

                    $cartItems->push($cartItem);
                }
            }

            return $cartItems;
        }
    }
}
