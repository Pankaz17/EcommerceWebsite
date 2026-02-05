<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Services\BestSellerService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display user's orders
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('orderItems.product')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($orders);
    }

    /**
     * Display the specified order
     */
    public function show(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->with(['orderItems.product', 'statusHistory.changedBy'])
            ->findOrFail($id);

        return response()->json($order);
    }

    /**
     * Create order from cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'payment_method' => 'required|string|in:cod,dummy,esewa',
        ]);

        $cartItems = CartItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
            ], 422);
        }

        // Validate stock and calculate total
        $total = 0;
        foreach ($cartItems as $cartItem) {
            $product = $cartItem->product;
            
            if (!$product->isActive()) {
                return response()->json([
                    'message' => "Product {$product->name} is not available",
                ], 422);
            }

            if (!$product->isInStock($cartItem->quantity)) {
                return response()->json([
                    'message' => "Insufficient stock for {$product->name}",
                ], 422);
            }

            $total += $cartItem->subtotal;
        }

        // Create order with initial payment & delivery status
        $order = Order::create([
            'user_id' => $request->user()->id,
            'total_amount' => $total,
            'shipping_address' => $request->shipping_address,
            'phone' => $request->phone ?? $request->user()->phone,
            'notes' => $request->notes,
            'payment_status' => 'pending',
            'delivery_status' => 'pending',
        ]);

        // Create order items and update stock
        foreach ($cartItems as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->product->price,
                'selected_size' => $cartItem->selected_size,
                'selected_color' => $cartItem->selected_color,
            ]);

            // Update product stock
            $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
        }

        // Create payment record based on selected payment method
        $paymentMethod = $request->payment_method;
        $provider = $paymentMethod === 'esewa' ? 'esewa' : 'offline';

        $paymentData = [
            'order_id' => $order->id,
            'user_id' => $request->user()->id,
            'amount' => $total,
            'currency' => 'USD',
            'provider' => $provider,
            'method' => $paymentMethod,
            'status' => 'pending',
        ];

        // For dummy and eSewa, immediately mark as paid (simple simulation)
        if (in_array($paymentMethod, ['dummy', 'esewa'], true)) {
            $paymentData['status'] = 'paid';
            $paymentData['paid_at'] = now();

            // Also update order payment_status and history
            $order->updatePaymentStatus('paid', $request->user()->id, strtoupper($paymentMethod) . ' payment success');
        }

        Payment::create($paymentData);

        // Clear cart and invalidate best sellers cache
        CartItem::where('user_id', $request->user()->id)->delete();
        BestSellerService::clearCache();

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('orderItems.product'),
        ], 201);
    }
}

