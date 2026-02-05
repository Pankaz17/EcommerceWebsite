<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display the user's cart
     */
    public function index(Request $request)
    {
        $cartItems = CartItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->subtotal;
        });

        return response()->json([
            'cart_items' => $cartItems,
            'total' => $total,
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'selected_size' => 'nullable|string|max:20',
            'selected_color' => 'nullable|string|max:50',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product is active and in stock
        if (!$product->isActive()) {
            return response()->json([
                'message' => 'Product is not available',
            ], 422);
        }

        if (!$product->isInStock($request->quantity)) {
            return response()->json([
                'message' => 'Insufficient stock',
            ], 422);
        }

        // Check if item already exists in cart
        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->where('selected_size', $request->selected_size)
            ->where('selected_color', $request->selected_color)
            ->first();

        if ($cartItem) {
            // Update quantity
            $newQuantity = $cartItem->quantity + $request->quantity;
            if (!$product->isInStock($newQuantity)) {
                return response()->json([
                    'message' => 'Insufficient stock',
                ], 422);
            }
            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {
            // Create new cart item
            $cartItem = CartItem::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'selected_size' => $request->selected_size,
                'selected_color' => $request->selected_color,
            ]);
        }

        return response()->json([
            'message' => 'Item added to cart',
            'cart_item' => $cartItem->load('product'),
        ], 201);
    }

    /**
     * Update cart item
     */
    public function update(Request $request, $id)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $cartItem->product;

        if (!$product->isInStock($request->quantity)) {
            return response()->json([
                'message' => 'Insufficient stock',
            ], 422);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item updated',
            'cart_item' => $cartItem->load('product'),
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, $id)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from cart',
        ]);
    }
}

