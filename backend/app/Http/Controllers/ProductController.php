<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\BestSellerService;
use App\Services\ProductRecommendationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of products (public).
     * When search is provided, results are ranked by relevance:
     * 1. Exact product name match (highest)
     * 2. Category name match
     * 3. Brand match
     * 4. Description keyword match (lowest)
     */
    public function index(Request $request)
    {
        $query = Product::query();
        $search = $request->get('search');
        $hasSearch = !empty(trim((string) $search));

        if ($hasSearch) {
            $search = trim($search);
            $words = preg_split('/\s+/', $search, -1, PREG_SPLIT_NO_EMPTY);
            $query->where(function ($q) use ($search, $words) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('category', 'like', '%' . $search . '%')
                    ->orWhere('brand', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
                foreach ($words as $word) {
                    $q->orWhere('name', 'like', '%' . $word . '%')
                        ->orWhere('category', 'like', '%' . $word . '%')
                        ->orWhere('brand', 'like', '%' . $word . '%')
                        ->orWhere('description', 'like', '%' . $word . '%');
                }
            });

            // Weighted ranking: exact name (100) > name contains (70) > category (50) > brand (40) > description (20)
            $term = mb_strtolower($search);
            $termLike = '%' . $term . '%';
            $query->selectRaw(
                "products.*, (CASE WHEN LOWER(name) = ? THEN 100 WHEN LOWER(name) LIKE ? THEN 70 WHEN LOWER(COALESCE(category,'')) LIKE ? THEN 50 WHEN LOWER(COALESCE(brand,'')) LIKE ? THEN 40 WHEN LOWER(COALESCE(description,'')) LIKE ? THEN 20 ELSE 0 END) as search_rank",
                [$term, $termLike, $termLike, $termLike, $termLike]
            );
        }

        // Filter by price range
        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        // Filter by size (size is stored as string: JSON or comma-separated)
        if ($size = $request->get('size')) {
            $query->where(function ($q) use ($size) {
                $q->where('size', 'like', '%"' . $size . '"%')
                    ->orWhere('size', 'like', '%' . $size . '%');
            });
        }

        // Filter by brand
        if ($brand = $request->get('brand')) {
            $query->where('brand', $brand);
        }

        // Optional category filter
        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        // Filter by status (only active for public)
        if (!$request->user() || !$request->user()->isAdmin()) {
            $query->where('status', 'active');
        }

        // Sorting: when search is used, order by search_rank first (desc), then by sort param
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        if (!in_array($sortBy, ['price', 'created_at', 'name'])) {
            $sortBy = 'created_at';
        }
        $sortOrder = strtolower($sortOrder) === 'asc' ? 'asc' : 'desc';

        if ($hasSearch) {
            $query->orderByRaw('search_rank DESC')->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $perPage = $request->get('per_page', 15);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Get best selling products (top 10 by quantity sold).
     * Cached for performance.
     */
    public function bestSellers(Request $request)
    {
        $limit = min(20, max(1, (int) $request->get('limit', 10)));
        $service = new BestSellerService();
        $result = $service->getBestSellers($limit);

        $data = $result->map(function ($item) {
            return [
                'product' => $item['product'],
                'total_sold' => $item['total_sold'],
            ];
        });

        return response()->json(['data' => $data]);
    }

    /**
     * List products with low stock (quantity < 5) or out of stock (admin only).
     * Used for inventory alert dashboard widget.
     * Optional: Trigger email/admin notification when lowStockProducts are returned (e.g. via Laravel Notification or Event).
     */
    public function lowStock(Request $request)
    {
        $products = Product::query()
            ->where('stock_quantity', '<', Product::LOW_STOCK_THRESHOLD)
            ->orderBy('stock_quantity', 'asc')
            ->get();

        $data = $products->map(function (Product $p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'stock_quantity' => $p->stock_quantity,
                'status' => $p->status,
                'is_out_of_stock' => $p->isOutOfStock(),
                'is_low_stock' => $p->isLowStock(),
            ];
        });

        return response()->json(['data' => $data]);
    }

    /**
     * Display the specified product with optional recommendations (You May Also Like).
     */
    public function show(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $data = $product->toArray();

        // Include recommendations for product detail page (optional query param to skip)
        if ($request->boolean('recommendations', true)) {
            $recommendationService = new ProductRecommendationService();
            $data['recommendations'] = $recommendationService->getRecommendations($product)->toArray();
        }

        return response()->json($data);
    }

    /**
     * Store a newly created product (admin only)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'brand' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'size' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'stock_quantity' => 'required|integer|min:0',
            'status' => 'nullable|in:active,inactive',
        ]);

        $data = $request->all();

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    /**
     * Update the specified product (admin only)
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'brand' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'size' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'status' => 'nullable|in:active,inactive',
        ]);

        $data = $request->except(['image']);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    /**
     * Remove the specified product (admin only)
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Check if product has order items
        if ($product->orderItems()->count() > 0) {
            // Preserve order history: mark product as inactive instead of deleting
            $product->status = 'inactive';
            $product->save();

            return response()->json([
                'message' => 'Product has existing orders — marked as inactive instead of deleted',
                'product' => $product,
            ]);
        }

        // Delete image if exists
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
