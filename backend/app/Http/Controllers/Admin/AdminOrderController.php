<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * Display all orders (admin)
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'orderItems.product']);

        // Search by order ID
        if ($orderId = $request->get('order_id')) {
            $query->where('id', $orderId);
        }

        // Search by order number
        if ($orderNumber = $request->get('order_number')) {
            $query->where('order_number', 'like', '%' . $orderNumber . '%');
        }

        // Search by user email or name
        if ($search = $request->get('user_search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('email', 'like', '%' . $search . '%')
                  ->orWhere('name', 'like', '%' . $search . '%');
            });
        }

        // Filter by payment status
        if ($paymentStatus = $request->get('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        // Filter by order / delivery status
        if ($deliveryStatus = $request->get('delivery_status')) {
            $query->where('delivery_status', $deliveryStatus);
        }

        // Filter by user
        if ($userId = $request->get('user_id')) {
            $query->where('user_id', $userId);
        }

        // Pagination & ordering
        $perPage = (int) $request->get('per_page', 15);
        $perPage = $perPage > 0 && $perPage <= 100 ? $perPage : 15;

        $orders = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($orders);
    }

    /**
     * Display the specified order (admin)
     */
    public function show($id)
    {
        $order = Order::with(['user', 'orderItems.product', 'statusHistory.changedBy'])
            ->findOrFail($id);

        return response()->json($order);
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Request $request, $id)
    {
        $request->validate([
            'payment_status' => 'required|in:pending,paid,failed,refunded',
            'notes' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);

        $order->updatePaymentStatus(
            $request->payment_status,
            $request->user()->id,
            $request->notes
        );

        return response()->json([
            'message' => 'Payment status updated',
            'order' => $order->load('statusHistory'),
        ]);
    }

    /**
     * Update delivery status
     */
    public function updateDeliveryStatus(Request $request, $id)
    {
        $request->validate([
            'delivery_status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);

        $order->updateDeliveryStatus(
            $request->delivery_status,
            $request->user()->id,
            $request->notes
        );

        return response()->json([
            'message' => 'Delivery status updated',
            'order' => $order->load('statusHistory'),
        ]);
    }
}

