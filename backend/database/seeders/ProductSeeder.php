<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Abaya Products
            [
                'name' => 'Elegant Black Abaya',
                'description' => 'Beautifully designed black abaya with elegant embroidery. Perfect for everyday wear and special occasions. Made from premium quality fabric for comfort and durability.',
                'price' => 89.99,
                'brand' => 'Modest Fashion',
                'category' => 'Abaya',
                'size' => json_encode(['XS', 'S', 'M', 'L', 'XL']),
                'color' => 'Black',
                'stock_quantity' => 50,
                'status' => 'active',
            ],
            [
                'name' => 'Embroidered Navy Abaya',
                'description' => 'Stunning navy blue abaya with intricate embroidery details. Flowing design that combines modesty with modern style. Ideal for formal events.',
                'price' => 95.99,
                'brand' => 'Modest Fashion',
                'category' => 'Abaya',
                'size' => json_encode(['S', 'M', 'L', 'XL']),
                'color' => 'Navy Blue',
                'stock_quantity' => 35,
                'status' => 'active',
            ],
            [
                'name' => 'Casual Gray Abaya',
                'description' => 'Comfortable gray abaya for daily wear. Lightweight fabric with a relaxed fit. Perfect for shopping, work, or casual outings.',
                'price' => 75.99,
                'brand' => 'Modest Fashion',
                'category' => 'Abaya',
                'size' => json_encode(['XS', 'S', 'M', 'L', 'XL', 'Free Size']),
                'color' => 'Gray',
                'stock_quantity' => 60,
                'status' => 'active',
            ],

            // Hijab Products
            [
                'name' => 'Premium Cotton Hijab - Black',
                'description' => 'Soft and breathable cotton hijab in classic black. Easy to style and comfortable for all-day wear. Perfect for beginners and experienced wearers.',
                'price' => 19.99,
                'brand' => 'Modest Fashion',
                'category' => 'Hijab',
                'size' => json_encode(['Free Size']),
                'color' => 'Black',
                'stock_quantity' => 100,
                'status' => 'active',
            ],
            [
                'name' => 'Silk Chiffon Hijab - Navy',
                'description' => 'Luxurious silk chiffon hijab with elegant drape. Lightweight and flowy, perfect for special occasions. Available in beautiful navy blue.',
                'price' => 29.99,
                'brand' => 'Modest Fashion',
                'category' => 'Hijab',
                'size' => json_encode(['Free Size']),
                'color' => 'Navy Blue',
                'stock_quantity' => 80,
                'status' => 'active',
            ],
            [
                'name' => 'Jersey Hijab - Beige',
                'description' => 'Stretchy jersey hijab that stays in place all day. No pins needed! Perfect for active lifestyle. Available in versatile beige color.',
                'price' => 24.99,
                'brand' => 'Modest Fashion',
                'category' => 'Hijab',
                'size' => json_encode(['Free Size']),
                'color' => 'Beige',
                'stock_quantity' => 90,
                'status' => 'active',
            ],
            [
                'name' => 'Printed Hijab - Floral',
                'description' => 'Beautiful floral printed hijab made from premium viscose. Adds a touch of elegance to any outfit. Easy to care for and wrinkle-resistant.',
                'price' => 22.99,
                'brand' => 'Modest Fashion',
                'category' => 'Hijab',
                'size' => json_encode(['Free Size']),
                'color' => 'Floral Print',
                'stock_quantity' => 70,
                'status' => 'active',
            ],

            // Pakistani Suit Products
            [
                'name' => 'Embroidered Pakistani Suit - Green',
                'description' => 'Traditional Pakistani suit with intricate embroidery work. Includes kameez, shalwar, and dupatta. Perfect for weddings and celebrations.',
                'price' => 149.99,
                'brand' => 'Modest Fashion',
                'category' => 'Pakistani Suit',
                'size' => json_encode(['XS', 'S', 'M', 'L', 'XL']),
                'color' => 'Green',
                'stock_quantity' => 25,
                'status' => 'active',
            ],
            [
                'name' => 'Casual Pakistani Suit - Pink',
                'description' => 'Comfortable everyday Pakistani suit in soft pink. Lightweight fabric perfect for daily wear. Includes matching shalwar and dupatta.',
                'price' => 79.99,
                'brand' => 'Modest Fashion',
                'category' => 'Pakistani Suit',
                'size' => json_encode(['S', 'M', 'L', 'XL']),
                'color' => 'Pink',
                'stock_quantity' => 40,
                'status' => 'active',
            ],
            [
                'name' => 'Designer Pakistani Suit - Maroon',
                'description' => 'Elegant designer Pakistani suit with premium embroidery and embellishments. Perfect for special occasions and formal events.',
                'price' => 199.99,
                'brand' => 'Modest Fashion',
                'category' => 'Pakistani Suit',
                'size' => json_encode(['XS', 'S', 'M', 'L', 'XL']),
                'color' => 'Maroon',
                'stock_quantity' => 20,
                'status' => 'active',
            ],
            [
                'name' => 'Simple Pakistani Suit - White',
                'description' => 'Classic white Pakistani suit with minimal design. Versatile and elegant, suitable for both casual and semi-formal occasions.',
                'price' => 69.99,
                'brand' => 'Modest Fashion',
                'category' => 'Pakistani Suit',
                'size' => json_encode(['XS', 'S', 'M', 'L', 'XL']),
                'color' => 'White',
                'stock_quantity' => 45,
                'status' => 'active',
            ],

            // Hijab Accessories
            [
                'name' => 'Hijab Pins Set - Gold',
                'description' => 'Set of 10 elegant gold-plated hijab pins. Secure your hijab in place with style. Includes various sizes for different styling needs.',
                'price' => 9.99,
                'brand' => 'Modest Fashion',
                'category' => 'Accessories',
                'size' => json_encode(['Free Size']),
                'color' => 'Gold',
                'stock_quantity' => 150,
                'status' => 'active',
            ],
            [
                'name' => 'Hijab Scarf - Silk',
                'description' => 'Luxurious silk scarf that can be used as a hijab or accessory. Versatile and elegant, perfect for layering or standalone wear.',
                'price' => 34.99,
                'brand' => 'Modest Fashion',
                'category' => 'Accessories',
                'size' => json_encode(['Free Size']),
                'color' => 'Multicolor',
                'stock_quantity' => 65,
                'status' => 'active',
            ],
            [
                'name' => 'Hijab Belt - Embroidered',
                'description' => 'Beautiful embroidered belt to style your abaya or dress. Adjustable design fits all sizes. Adds elegance to any modest outfit.',
                'price' => 24.99,
                'brand' => 'Modest Fashion',
                'category' => 'Accessories',
                'size' => json_encode(['Free Size']),
                'color' => 'Gold & Silver',
                'stock_quantity' => 55,
                'status' => 'active',
            ],
            [
                'name' => 'Hijab Brooch - Pearl',
                'description' => 'Elegant pearl brooch for securing and decorating your hijab. Classic design that complements any outfit. Perfect gift item.',
                'price' => 14.99,
                'brand' => 'Modest Fashion',
                'category' => 'Accessories',
                'size' => json_encode(['Free Size']),
                'color' => 'Pearl White',
                'stock_quantity' => 85,
                'status' => 'active',
            ],
            [
                'name' => 'Hijab Cap - Cotton',
                'description' => 'Comfortable cotton undercap to wear under your hijab. Prevents slippage and adds volume. Breathable fabric for all-day comfort.',
                'price' => 12.99,
                'brand' => 'Modest Fashion',
                'category' => 'Accessories',
                'size' => json_encode(['Free Size']),
                'color' => 'Beige',
                'stock_quantity' => 120,
                'status' => 'active',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
