<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        $categories = Category::orderBy('name')->get();
        return response()->json($categories);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $category = Category::create($validated);

        return response()->json($category, 201);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories')->ignore($category->id),
            ],
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    /**
     * Remove the specified category
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Check if category is used in products
        $productCount = \App\Models\Product::where('category', $category->name)->count();
        if ($productCount > 0) {
            return response()->json([
                'message' => 'Cannot delete category. It is being used by ' . $productCount . ' product(s).',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
