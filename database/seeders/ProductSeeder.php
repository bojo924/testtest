<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        $products = [
            // Men's Clothing
            [
                'name' => 'Classic White Shirt',
                'description' => 'A timeless white dress shirt perfect for any occasion. Made from premium cotton with a comfortable fit.',
                'price' => 49.99,
                'stock' => 25,
                'category_name' => 'Men\'s Clothing',
                'slug' => 'classic-white-shirt'
            ],
            [
                'name' => 'Denim Jeans',
                'description' => 'High-quality denim jeans with a modern fit. Durable and comfortable for everyday wear.',
                'price' => 79.99,
                'stock' => 30,
                'category_name' => 'Men\'s Clothing',
                'slug' => 'denim-jeans'
            ],
            [
                'name' => 'Casual Polo Shirt',
                'description' => 'Comfortable polo shirt made from breathable fabric. Perfect for casual outings.',
                'price' => 34.99,
                'stock' => 40,
                'category_name' => 'Men\'s Clothing',
                'slug' => 'casual-polo-shirt'
            ],

            // Women's Clothing
            [
                'name' => 'Elegant Summer Dress',
                'description' => 'Beautiful summer dress with floral patterns. Light and comfortable for warm weather.',
                'price' => 89.99,
                'stock' => 20,
                'category_name' => 'Women\'s Clothing',
                'slug' => 'elegant-summer-dress'
            ],
            [
                'name' => 'Professional Blazer',
                'description' => 'Sophisticated blazer perfect for business meetings and formal occasions.',
                'price' => 129.99,
                'stock' => 15,
                'category_name' => 'Women\'s Clothing',
                'slug' => 'professional-blazer'
            ],
            [
                'name' => 'Casual Blouse',
                'description' => 'Versatile blouse that can be dressed up or down. Available in multiple colors.',
                'price' => 45.99,
                'stock' => 35,
                'category_name' => 'Women\'s Clothing',
                'slug' => 'casual-blouse'
            ],

            // Shoes
            [
                'name' => 'Running Sneakers',
                'description' => 'High-performance running shoes with excellent cushioning and support.',
                'price' => 119.99,
                'stock' => 50,
                'category_name' => 'Shoes',
                'slug' => 'running-sneakers'
            ],
            [
                'name' => 'Leather Dress Shoes',
                'description' => 'Premium leather dress shoes perfect for formal occasions and business wear.',
                'price' => 159.99,
                'stock' => 20,
                'category_name' => 'Shoes',
                'slug' => 'leather-dress-shoes'
            ],
            [
                'name' => 'Casual Canvas Shoes',
                'description' => 'Comfortable canvas shoes perfect for everyday casual wear.',
                'price' => 59.99,
                'stock' => 45,
                'category_name' => 'Shoes',
                'slug' => 'casual-canvas-shoes'
            ],

            // Accessories
            [
                'name' => 'Leather Wallet',
                'description' => 'Premium leather wallet with multiple card slots and bill compartments.',
                'price' => 39.99,
                'stock' => 60,
                'category_name' => 'Accessories',
                'slug' => 'leather-wallet'
            ],
            [
                'name' => 'Designer Sunglasses',
                'description' => 'Stylish sunglasses with UV protection. Perfect for sunny days.',
                'price' => 89.99,
                'stock' => 25,
                'category_name' => 'Accessories',
                'slug' => 'designer-sunglasses'
            ],
            [
                'name' => 'Classic Watch',
                'description' => 'Elegant timepiece with a classic design. Water-resistant and durable.',
                'price' => 199.99,
                'stock' => 15,
                'category_name' => 'Accessories',
                'slug' => 'classic-watch'
            ],

            // Sportswear
            [
                'name' => 'Athletic T-Shirt',
                'description' => 'Moisture-wicking athletic shirt perfect for workouts and sports activities.',
                'price' => 24.99,
                'stock' => 55,
                'category_name' => 'Sportswear',
                'slug' => 'athletic-t-shirt'
            ],
            [
                'name' => 'Yoga Pants',
                'description' => 'Comfortable and flexible yoga pants made from premium stretch fabric.',
                'price' => 49.99,
                'stock' => 40,
                'category_name' => 'Sportswear',
                'slug' => 'yoga-pants'
            ],

            // Outerwear
            [
                'name' => 'Winter Jacket',
                'description' => 'Warm and waterproof winter jacket perfect for cold weather conditions.',
                'price' => 179.99,
                'stock' => 20,
                'category_name' => 'Outerwear',
                'slug' => 'winter-jacket'
            ],
            [
                'name' => 'Light Cardigan',
                'description' => 'Soft and comfortable cardigan perfect for layering in mild weather.',
                'price' => 69.99,
                'stock' => 30,
                'category_name' => 'Outerwear',
                'slug' => 'light-cardigan'
            ]
        ];

        foreach ($products as $productData) {
            $category = $categories->where('name', $productData['category_name'])->first();

            if ($category) {
                Product::create([
                    'name' => $productData['name'],
                    'description' => $productData['description'],
                    'price' => $productData['price'],
                    'stock' => $productData['stock'],
                    'slug' => $productData['slug'],
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}
