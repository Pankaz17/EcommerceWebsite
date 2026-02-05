<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{
    /**
     * Display a listing of brands
     */
    public function index()
    {
        $brands = Brand::orderBy('name')->get();
        return response()->json($brands);
    }

    /**
     * Store a newly created brand
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:brands,name',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $brand = Brand::create($validated);

        return response()->json($brand, 201);
    }

    /**
     * Update the specified brand
     */
    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('brands')->ignore($brand->id),
            ],
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $brand->update($validated);

        return response()->json($brand);
    }

    /**
     * Remove the specified brand
     */
    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        // Check if brand is used in products
        $productCount = \App\Models\Product::where('brand', $brand->name)->count();
        if ($productCount > 0) {
            return response()->json([
                'message' => 'Cannot delete brand. It is being used by ' . $productCount . ' product(s).',
            ], 422);
        }

        $brand->delete();

        return response()->json(['message' => 'Brand deleted successfully']);
    }
}
