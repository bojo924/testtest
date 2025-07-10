<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Men\'s Clothing',
                'description' => 'Stylish clothing for men including shirts, pants, jackets and more.',
                'slug' => 'mens-clothing'
            ],
            [
                'name' => 'Women\'s Clothing',
                'description' => 'Fashionable clothing for women including dresses, tops, skirts and more.',
                'slug' => 'womens-clothing'
            ],
            [
                'name' => 'Shoes',
                'description' => 'Comfortable and stylish footwear for all occasions.',
                'slug' => 'shoes'
            ],
            [
                'name' => 'Accessories',
                'description' => 'Complete your look with our range of accessories.',
                'slug' => 'accessories'
            ],
            [
                'name' => 'Sportswear',
                'description' => 'Athletic wear and sports equipment for active lifestyles.',
                'slug' => 'sportswear'
            ],
            [
                'name' => 'Outerwear',
                'description' => 'Jackets, coats, and outerwear for all weather conditions.',
                'slug' => 'outerwear'
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
