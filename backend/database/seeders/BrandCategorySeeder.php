<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BrandCategorySeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['name' => 'Nike', 'description' => 'Performance footwear and sportswear', 'status' => 'active'],
            ['name' => 'Adidas', 'description' => 'Three stripes. Sport-inspired silhouettes.', 'status' => 'active'],
            ['name' => 'New Balance', 'description' => 'Comfort-first running and lifestyle', 'status' => 'active'],
            ['name' => 'ASICS', 'description' => 'Running tech and stability', 'status' => 'active'],
            ['name' => 'StrideLab', 'description' => 'In-house curated athletic line', 'status' => 'active'],
        ];

        foreach ($brands as $brand) {
            Brand::firstOrCreate(['name' => $brand['name']], $brand);
        }

        $categories = [
            ['name' => 'Running', 'description' => 'Road and trail runners', 'status' => 'active'],
            ['name' => 'Sneakers', 'description' => 'Lifestyle and everyday kicks', 'status' => 'active'],
            ['name' => 'Casual', 'description' => 'Comfortable daily wear', 'status' => 'active'],
            ['name' => 'Boots', 'description' => 'Weather-ready and rugged', 'status' => 'active'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}
