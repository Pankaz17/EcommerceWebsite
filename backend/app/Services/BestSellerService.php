<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Best Seller Service
 *
 * Ranks products by total quantity sold (from order_items).
 * Results are cached for performance.
 */
class BestSellerService
{
    /** Cache key for best sellers list */
    private const CACHE_KEY = 'best_sellers_top_10';

    /** Cache TTL in seconds (5 minutes) */
    private const CACHE_TTL = 300;

    /**
     * Get top N best selling products by quantity sold.
     *
     * @param int $limit Default 10
     * @param bool $useCache Whether to use cache (default true)
     * @return Collection<int, array{product: Product, total_sold: int}>
     */
    public function getBestSellers(int $limit = 10, bool $useCache = true): Collection
    {
        $cacheKey = self::CACHE_KEY . '_' . $limit;

        if ($useCache) {
            try {
                return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($limit) {
                    return $this->computeBestSellers($limit);
                });
            } catch (\Throwable $e) {
                // Cache store may be misconfigured (e.g. database cache table missing).
                // Log and fall back to computing without cache to avoid 500 errors.
                logger()->error('BestSellerService cache error: ' . $e->getMessage());
                return $this->computeBestSellers($limit);
            }
        }

        return $this->computeBestSellers($limit);
    }

    /**
     * Compute best sellers from order_items (GROUP BY product_id, SUM(quantity)).
     *
     * @param int $limit
     * @return Collection<int, array{product: Product, total_sold: int}>
     */
    private function computeBestSellers(int $limit): Collection
    {
        $rows = DB::table('order_items')
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get();

        $productIds = $rows->pluck('product_id')->all();
        $totals = $rows->keyBy('product_id');

        $products = Product::query()
            ->whereIn('id', $productIds)
            ->where('status', 'active')
            ->get()
            ->keyBy('id');

        return $rows->map(function ($row) use ($products) {
            return [
                'product' => $products->get($row->product_id),
                'total_sold' => (int) $row->total_sold,
            ];
        })->filter(function ($item) {
            return $item['product'] !== null;
        })->values();
    }

    /**
     * Clear best sellers cache (e.g. when a new order is placed).
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_10');
    }
}
