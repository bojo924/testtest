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
                // Decrease stock by the added quantity
                $product->decrement('stock', $quantity);
            } else {
                CartItem::create([
                    'user_id' => Auth::id(),
                    'product_id' => $product->id,
                    'quantity' => $quantity
                ]);
                // Decrease stock by the added quantity
                $product->decrement('stock', $quantity);
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
                // Decrease stock by the added quantity
                $product->decrement('stock', $quantity);
            } else {
                $cart[$productId] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity
                ];
                // Decrease stock by the added quantity
                $product->decrement('stock', $quantity);
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
        $oldQuantity = $cartItem->quantity;
        $quantityDifference = $quantity - $oldQuantity;

        // Check stock availability (current stock + what we're returning - what we're taking)
        $availableStock = $product->stock + $oldQuantity;
        if ($availableStock < $quantity) {
            return redirect()->back()
                ->with('error', 'Not enough stock available.');
        }

        $cartItem->update(['quantity' => $quantity]);

        // Adjust stock based on quantity change
        if ($quantityDifference > 0) {
            // Quantity increased, decrease stock
            $product->decrement('stock', $quantityDifference);
        } elseif ($quantityDifference < 0) {
            // Quantity decreased, increase stock
            $product->increment('stock', abs($quantityDifference));
        }

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
            $oldQuantity = $cart[$product->id]['quantity'];
            $quantityDifference = $quantity - $oldQuantity;

            // Check stock availability (current stock + what we're returning - what we're taking)
            $availableStock = $product->stock + $oldQuantity;
            if ($availableStock < $quantity) {
                return redirect()->back()
                    ->with('error', 'Not enough stock available.');
            }

            $cart[$product->id]['quantity'] = $quantity;
            session()->put('cart', $cart);

            // Adjust stock based on quantity change
            if ($quantityDifference > 0) {
                // Quantity increased, decrease stock
                $product->decrement('stock', $quantityDifference);
            } elseif ($quantityDifference < 0) {
                // Quantity decreased, increase stock
                $product->increment('stock', abs($quantityDifference));
            }
        }

        return redirect()->back()
            ->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove item from cart
     */
    public function remove(CartItem $cartItem)
    {
        // Restore stock when item is removed
        $cartItem->product->increment('stock', $cartItem->quantity);

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

        // Restore stock when item is removed
        if (isset($cart[$product->id])) {
            $quantity = $cart[$product->id]['quantity'];
            $product->increment('stock', $quantity);
        }

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
