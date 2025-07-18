<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the cart
     */
    public function index()
    {
        $cartItems = $this->getCartItems();
        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'total' => $total
        ]);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $quantity = $request->quantity;

        // Check stock availability
        if ($product->stock < $quantity) {
            return redirect()->back()
                ->with('error', 'Not enough stock available.');
        }

        if (Auth::check()) {
            // For authenticated users, store in database
            $cartItem = CartItem::where('user_id', Auth::id())
                               ->where('product_id', $product->id)
                               ->first();

            if ($cartItem) {
                $newQuantity = $cartItem->quantity + $quantity;
                if ($product->stock < $newQuantity) {
                    return redirect()->back()
                        ->with('error', 'Not enough stock available.');
                }
                $cartItem->update(['quantity' => $newQuantity]);
                // Don't decrement stock here - only reserve when order is placed
            } else {
                CartItem::create([
                    'user_id' => Auth::id(),
                    'product_id' => $product->id,
                    'quantity' => $quantity
                ]);
                // Don't decrement stock here - only reserve when order is placed
            }
        } else {
            // For guests, store in session
            $cart = session()->get('cart', []);
            $productId = $product->id;

            if (isset($cart[$productId])) {
                $newQuantity = $cart[$productId]['quantity'] + $quantity;
                if ($product->stock < $newQuantity) {
                    return redirect()->back()
                        ->with('error', 'Not enough stock available.');
                }
                $cart[$productId]['quantity'] = $newQuantity;
                // Don't decrement stock here - only reserve when order is placed
            } else {
                $cart[$productId] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity
                ];
                // Don't decrement stock here - only reserve when order is placed
            }

            session()->put('cart', $cart);
        }

        return redirect()->back()
            ->with('success', 'Product added to cart successfully.');
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $quantity = $request->quantity;
        $product = $cartItem->product;

        // Check stock availability
        if ($product->stock < $quantity) {
            return redirect()->back()
                ->with('error', 'Not enough stock available.');
        }

        $cartItem->update(['quantity' => $quantity]);
        // Don't adjust stock here - only when order is placed

        return redirect()->back()
            ->with('success', 'Cart updated successfully.');
    }

    /**
     * Update session cart item quantity
     */
    public function updateSession(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $quantity = $request->quantity;
        $cart = session()->get('cart', []);

        if (isset($cart[$product->id])) {
            // Check stock availability
            if ($product->stock < $quantity) {
                return redirect()->back()
                    ->with('error', 'Not enough stock available.');
            }

            $cart[$product->id]['quantity'] = $quantity;
            session()->put('cart', $cart);
            // Don't adjust stock here - only when order is placed
        }

        return redirect()->back()
            ->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove item from cart
     */
    public function remove(CartItem $cartItem)
    {
        // No need to restore stock since it wasn't decremented when added to cart
        $cartItem->delete();

        return redirect()->back()
            ->with('success', 'Item removed from cart.');
    }

    /**
     * Remove item from session cart
     */
    public function removeSession(Product $product)
    {
        $cart = session()->get('cart', []);

        // No need to restore stock since it wasn't decremented when added to cart
        unset($cart[$product->id]);
        session()->put('cart', $cart);

        return redirect()->back()
            ->with('success', 'Item removed from cart.');
    }

    /**
     * Clear entire cart
     */
    public function clear()
    {
        if (Auth::check()) {
            // Restore stock for all cart items before deleting
            $cartItems = CartItem::with('product')->where('user_id', Auth::id())->get();
            foreach ($cartItems as $cartItem) {
                $cartItem->product->increment('stock', $cartItem->quantity);
            }
            CartItem::where('user_id', Auth::id())->delete();
        } else {
            // Restore stock for session cart items
            $cart = session()->get('cart', []);
            foreach ($cart as $item) {
                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->increment('stock', $item['quantity']);
                }
            }
            session()->forget('cart');
        }

        return redirect()->back()
            ->with('success', 'Cart cleared successfully.');
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

                    // Add total_price property for custom items
                    if ($cartItem->is_custom) {
                        $cartItem->total_price = $cartItem->quantity * $cartItem->custom_price;
                    } else {
                        $cartItem->total_price = $cartItem->quantity * $product->price;
                    }

                    $cartItems->push($cartItem);
                }
            }

            return $cartItems;
        }
    }
}
