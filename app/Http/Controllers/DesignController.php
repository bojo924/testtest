<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\CartItem;
use App\Models\Product;

class DesignController extends Controller
{
    /**
     * Show the t-shirt design page.
     */
    public function tshirt()
    {
        return Inertia::render('Design/TShirt');
    }

    /**
     * Add custom t-shirt to cart
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'color' => 'required|in:white,black',
            'design' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
            'quantity' => 'integer|min:1|max:10'
        ]);

        $quantity = $request->input('quantity', 1);
        $color = $request->input('color');
        $customPrice = 299.00; // Fixed price for custom t-shirts

        // Store the uploaded design
        $designPath = null;
        if ($request->hasFile('design')) {
            $designPath = $request->file('design')->store('custom-designs', 'public');
        }

        // Find or create a base t-shirt product (we'll use this as reference)
        $baseProduct = Product::where('name', 'Custom T-Shirt')->first();
        if (!$baseProduct) {
            // Create a base custom t-shirt product if none exists
            $baseProduct = Product::create([
                'name' => 'Custom T-Shirt',
                'description' => 'Custom designed t-shirt - unlimited stock',
                'price' => $customPrice,
                'stock' => 999999, // Very high stock for custom items (essentially unlimited)
                'category_id' => 1, // Assuming category 1 exists
                'slug' => 'custom-t-shirt',
                'image' => 'white.jpg' // Default image
            ]);
        }

        // Set the t-shirt base image based on color
        $tshirtImage = $color === 'black' ? 'black.jpg' : 'white.jpg';

        if (Auth::check()) {
            // For authenticated users, store in database
            CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $baseProduct->id,
                'quantity' => $quantity,
                'is_custom' => true,
                'custom_color' => $color,
                'custom_design_path' => $designPath,
                'custom_price' => $customPrice,
                'tshirt_image' => $tshirtImage,
            ]);
        } else {
            // For guests, store in session
            $cart = session()->get('cart', []);
            $customId = 'custom_' . time() . '_' . rand(1000, 9999);

            $cart[$customId] = [
                'product_id' => $baseProduct->id,
                'quantity' => $quantity,
                'is_custom' => true,
                'custom_color' => $color,
                'custom_design_path' => $designPath,
                'custom_price' => $customPrice,
                'tshirt_image' => $tshirtImage,
            ];

            session()->put('cart', $cart);
        }

        return redirect()->back()
            ->with('success', 'Custom t-shirt added to cart successfully!');
    }
}
