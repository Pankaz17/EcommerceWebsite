<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BrandCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed Brands
        $brands = [
            ['name' => 'Modest Fashion', 'description' => 'Premium modest fashion brand', 'status' => 'active'],
        ];

        foreach ($brands as $brand) {
            Brand::firstOrCreate(['name' => $brand['name']], $brand);
        }

        // Seed Categories
        $categories = [
            ['name' => 'Abaya', 'description' => 'Elegant abaya collection', 'status' => 'active'],
            ['name' => 'Hijab', 'description' => 'Beautiful hijab collection', 'status' => 'active'],
            ['name' => 'Pakistani Suit', 'description' => 'Traditional Pakistani suits', 'status' => 'active'],
            ['name' => 'Accessories', 'description' => 'Hijab accessories and pins', 'status' => 'active'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}
