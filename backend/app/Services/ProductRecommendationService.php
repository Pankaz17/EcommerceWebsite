<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;

/**
 * Product Recommendation Service
 *
 * Returns related products for a given product using priority:
 * 1. Same category
 * 2. Same brand
 * 3. Similar price range (±20%)
 * 4. Same color (if available)
 *
 * Excludes the current product and limits to 4–8 items.
 */
class ProductRecommendationService
{
    /** Default min and max number of recommendations to return */
    private const MIN_RECOMMENDATIONS = 4;
    private const MAX_RECOMMENDATIONS = 8;

    /** Price range tolerance (20% = 0.2) */
    private const PRICE_TOLERANCE = 0.2;

    /**
     * Get recommended products for the given product.
     *
     * @param Product|int $product Product model or product ID
     * @param int $limit Max number of recommendations (default 8)
     * @return Collection<int, Product>
     */
    public function getRecommendations($product, int $limit = self::MAX_RECOMMENDATIONS): Collection
    {
        $product = $product instanceof Product ? $product : Product::find($product);
        if (!$product) {
            return collect();
        }

        $limit = max(self::MIN_RECOMMENDATIONS, min($limit, self::MAX_RECOMMENDATIONS));
        $excludeId = $product->id;

        $baseQuery = function () use ($excludeId) {
            return Product::query()
                ->where('id', '!=', $excludeId)
                ->where('status', 'active')
                ->where('stock_quantity', '>', 0);
        };

        $collectedIds = collect();

        // 1. Same category (highest priority)
        if (!empty($product->category)) {
            $collectedIds = $collectedIds->merge(
                (clone $baseQuery())->where('category', $product->category)->pluck('id')
            );
        }
        if ($collectedIds->unique()->count() >= $limit) {
            return $this->fetchByIdsOrdered($collectedIds->unique()->take($limit)->values()->all());
        }

        // 2. Same brand (fill remaining)
        if (!empty($product->brand)) {
            $existing = $collectedIds->unique()->toArray();
            $brandIds = (clone $baseQuery())->where('brand', $product->brand)->pluck('id');
            foreach ($brandIds as $id) {
                if (!in_array($id, $existing, true)) {
                    $collectedIds->push($id);
                    $existing[] = $id;
                    if (count($existing) >= $limit) {
                        break;
                    }
                }
            }
        }
        if ($collectedIds->unique()->count() >= $limit) {
            return $this->fetchByIdsOrdered($collectedIds->unique()->take($limit)->values()->all());
        }

        // 3. Similar price range (±20%)
        $priceMin = (float) $product->price * (1 - self::PRICE_TOLERANCE);
        $priceMax = (float) $product->price * (1 + self::PRICE_TOLERANCE);
        $existing = $collectedIds->unique()->toArray();
        $priceIds = (clone $baseQuery())->whereBetween('price', [$priceMin, $priceMax])->pluck('id');
        foreach ($priceIds as $id) {
            if (!in_array($id, $existing, true)) {
                $collectedIds->push($id);
                $existing[] = $id;
                if (count($existing) >= $limit) {
                    break;
                }
            }
        }
        if ($collectedIds->unique()->count() >= $limit) {
            return $this->fetchByIdsOrdered($collectedIds->unique()->take($limit)->values()->all());
        }

        // 4. Same color (if available)
        if (!empty($product->color)) {
            $existing = $collectedIds->unique()->toArray();
            $colorIds = (clone $baseQuery())->where('color', $product->color)->pluck('id');
            foreach ($colorIds as $id) {
                if (!in_array($id, $existing, true)) {
                    $collectedIds->push($id);
                    $existing[] = $id;
                    if (count($existing) >= $limit) {
                        break;
                    }
                }
            }
        }

        $orderedIds = $collectedIds->unique()->take($limit)->values()->all();
        return $this->fetchByIdsOrdered($orderedIds);
    }

    /**
     * Fetch products by IDs preserving the given order.
     *
     * @param array<int> $ids
     * @return Collection<int, Product>
     */
    private function fetchByIdsOrdered(array $ids): Collection
    {
        if (empty($ids)) {
            return collect();
        }
        $ids = array_map('intval', $ids);
        return Product::query()
            ->whereIn('id', $ids)
            ->orderByRaw('FIELD(id, ' . implode(',', $ids) . ')')
            ->get();
    }
}
