<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * eSewa (Sandbox) payment integration controller.
 *
 * Uses test merchant ID EPAYTEST and the UAT (sandbox) endpoint only.
 * Flow:
 * 1) User creates an order with payment_method = 'esewa'.
 * 2) Frontend calls initiate() with the created order.
 * 3) User is redirected to eSewa sandbox for payment.
 * 4) eSewa redirects back to success() or failure() callback.
 * 5) On success, we verify with eSewa and mark payment / order as paid.
 */
class EsewaPaymentController extends Controller
{
    /**
     * eSewa sandbox product/merchant code.
     *
     * For sandbox, eSewa provides the code "EPAYTEST".
     *
     * @var string
     */
    private const MERCHANT_CODE = 'EPAYTEST';

    /**
     * eSewa sandbox secret key for HMAC signature (UAT).
     * This key should be stored in .env as ESEWA_SECRET_KEY
     *
     * @var string
     */
    private $secretKey;

    /**
     * eSewa sandbox payment URL (ePay v2 RC endpoint).
     *
     * @var string
     */
    private const PAYMENT_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    /**
     * Constructor - Load secret key from .env
     */
    public function __construct()
    {
        $this->secretKey = config('app.esewa_secret_key') ?? env('ESEWA_SECRET_KEY', '8g7h8cs9m48ot8ot9nd96z011111');
    }

    /**
     * Initiate eSewa payment for an order.
     *
     * Returns the URL and parameters that the frontend should POST
     * to eSewa sandbox.
     */
    public function initiate(Request $request, Order $order)
    {
        // Ensure the order belongs to the current user
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow eSewa for pending payments
        if ($order->payment_status !== 'pending') {
            return response()->json(['message' => 'Order is not pending payment'], 422);
        }

        $amount = (float) $order->total_amount;

        // eSewa v2 amount breakdown (all in test mode)
        $taxAmount = 0;          // tax_amount
        $serviceCharge = 0;      // product_service_charge
        $deliveryCharge = 0;     // product_delivery_charge
        $totalAmount = $amount;  // total_amount = amount + tax + charges (here just amount)

        // Unique transaction UUID for this payment (alphanumeric only - no hyphens for eSewa)
        $transactionUuid = $order->id . now()->format('YmdHis');

        $productCode = self::MERCHANT_CODE;

        // Backend callback URLs (called by eSewa after payment) - use route() helper for correct URLs
        $successUrl = route('esewa.success', ['order_id' => $order->id]);
        $failureUrl = route('esewa.failure', ['order_id' => $order->id]);

        // Format amounts with 2 decimal places
        $amountStr = number_format($amount, 2, '.', '');
        $taxAmountStr = number_format($taxAmount, 2, '.', '');
        $serviceChargeStr = number_format($serviceCharge, 2, '.', '');
        $deliveryChargeStr = number_format($deliveryCharge, 2, '.', '');
        $totalAmountStr = number_format($totalAmount, 2, '.', '');

        // Signed fields for eSewa v2 - exactly these 3 fields in this exact order
        $signedFieldNames = 'total_amount,transaction_uuid,product_code';
        
        // Create the exact message string with FORMATTED amount (No extra spaces!)
        $message = "total_amount=$totalAmountStr,transaction_uuid=$transactionUuid,product_code=EPAYTEST";
        
        // Generate the Signature (Standard HMAC-SHA256) using the secret key from config
        $s = hash_hmac('sha256', $message, $this->secretKey, true);
        $signature = base64_encode($s);

        $params = [
            'amount' => $amountStr,
            'tax_amount' => $taxAmountStr,
            'total_amount' => $totalAmountStr,
            'transaction_uuid' => $transactionUuid,
            'product_code' => $productCode,
            'product_service_charge' => $serviceChargeStr,
            'product_delivery_charge' => $deliveryChargeStr,
            'success_url' => $successUrl,
            'failure_url' => $failureUrl,
            'signed_field_names' => $signedFieldNames,
            'signature' => $signature,
        ];

        // Debug logging - log the EXACT signature data
        Log::info('eSewa Payment Initiation', [
            'order_id' => $order->id,
            'total_amount' => $totalAmountStr,
            'total_amount_type' => gettype($totalAmountStr),
            'transaction_uuid' => $transactionUuid,
            'product_code' => $productCode,
            'message_string' => $message,
            'message_base64_encoded' => base64_encode($message),
            'signed_field_names' => $signedFieldNames,
            'signature' => $signature,
            'signature_type' => gettype($signature),
            'success_url' => $successUrl,
            'failure_url' => $failureUrl,
            'payment_url' => self::PAYMENT_URL,
            'all_params' => $params,
        ]);

        return response()->json([
            'payment_url' => self::PAYMENT_URL,
            'params' => $params,
        ]);
    }

    /**
     * eSewa ePay v2 success callback.
     *
     * eSewa redirects here with:
     * - order_id : our order id (we added this to success_url)
     * - data     : base64-encoded JSON with transaction details
     *
     * We verify the signature from eSewa and then mark the
     * payment and order as paid.
     */
    public function success(Request $request, $order_id)
    {
        $orderId = $order_id;
        $token = $request->query('data');

        if (!$orderId || !$token) {
            return $this->redirectToFrontendFailure(null, 'Missing parameters from eSewa (v2).');
        }

        /** @var Order|null $order */
        $order = Order::find($orderId);
        if (!$order) {
            return $this->redirectToFrontendFailure(null, 'Order not found.');
        }

        // Decode base64 payload from eSewa
        $json = base64_decode($token, true);
        if ($json === false) {
            return $this->redirectToFrontendFailure($order, 'Invalid payment payload from eSewa.');
        }

        $payload = json_decode($json, true);
        if (!is_array($payload)) {
            return $this->redirectToFrontendFailure($order, 'Invalid payment JSON from eSewa.');
        }

        // Status must be COMPLETE
        if (($payload['status'] ?? null) !== 'COMPLETE') {
            return $this->redirectToFrontendFailure($order, 'Payment not completed.');
        }

        // Verify signature from eSewa
        $receivedSignature = $payload['signature'] ?? null;
        $signedFieldNames = $payload['signed_field_names'] ?? null;

        if (!$receivedSignature || !$signedFieldNames) {
            return $this->redirectToFrontendFailure($order, 'Missing signature fields from eSewa.');
        }

        $fields = array_filter(array_map('trim', explode(',', $signedFieldNames)));
        $chunks = [];
        foreach ($fields as $field) {
            if (!array_key_exists($field, $payload)) {
                continue;
            }
            $chunks[] = $field . '=' . $payload[$field];
        }

        if (empty($chunks)) {
            return $this->redirectToFrontendFailure($order, 'No signed fields to verify.');
        }

        // Reconstruct message: total_amount={value},transaction_uuid={value},product_code={value}
        $message = implode(',', $chunks);
        
        // eSewa v2 signature verification: Base64(HMAC-SHA256(message, secretKey))
        $s = hash_hmac('sha256', $message, $this->secretKey, true);
        $expectedSignature = base64_encode($s);

        Log::info('eSewa Payment Verification', [
            'order_id' => $order->id,
            'signed_field_names' => $signedFieldNames,
            'message_string' => $message,
            'message_base64_encoded' => base64_encode($message),
            'received_signature' => $receivedSignature,
            'expected_signature' => $expectedSignature,
            'signature_match' => hash_equals($expectedSignature, $receivedSignature),
            'payload_status' => $payload['status'] ?? null,
            'all_payload' => $payload,
        ]);

        if (!hash_equals($expectedSignature, $receivedSignature)) {
            return $this->redirectToFrontendFailure($order, 'Payment signature verification failed.');
        }

        $transactionCode = $payload['transaction_code'] ?? null;

        // Mark payment and order as paid
        /** @var Payment|null $payment */
        $payment = Payment::where('order_id', $order->id)
            ->where('provider', 'esewa')
            ->latest()
            ->first();

        if ($payment) {
            $payment->status = 'paid';
            $payment->paid_at = now();
            $payment->transaction_id = $transactionCode;
            $payment->raw_response = $json;
            $payment->save();
        }

        // Update order payment status and store basic transaction info in notes field
        $order->updatePaymentStatus('paid', $order->user_id, 'ESEWA v2 payment success (code: ' . $transactionCode . ')');
        $order->notes = trim(
            ($order->notes ?? '') .
            "\n[eSewa] status: COMPLETE, code: {$transactionCode}, transaction_uuid: " . ($payload['transaction_uuid'] ?? '')
        );
        $order->save();

        return $this->redirectToFrontendSuccess($order, $transactionCode ?? '');
    }

    /**
     * eSewa failure callback.
     *
     * We simply mark the payment as failed and redirect back
     * to the frontend with appropriate message.
     */
    public function failure(Request $request, $order_id)
    {
        $orderId = $order_id;
        $order = $orderId ? Order::find($orderId) : null;

        if ($order) {
            /** @var Payment|null $payment */
            $payment = Payment::where('order_id', $order->id)
                ->where('provider', 'esewa')
                ->latest()
                ->first();

            if ($payment && $payment->status === 'pending') {
                $payment->status = 'failed';
                $payment->save();
            }

            $order->updatePaymentStatus('failed', $order->user_id, 'ESEWA payment failed or cancelled.');
        }

        return $this->redirectToFrontendFailure($order, 'Payment cancelled or failed.');
    }

    /**
     * Redirect user to frontend success page.
     */
    protected function redirectToFrontendSuccess(Order $order, string $refId)
    {
        $frontendBase = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');

        $url = $frontendBase . '/payment/esewa/success?order_id=' . $order->id . '&refId=' . urlencode($refId);

        return redirect()->away($url);
    }

    /**
     * Redirect user to frontend failure page.
     */
    protected function redirectToFrontendFailure(?Order $order, string $message)
    {
        $frontendBase = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');

        $query = http_build_query([
            'order_id' => $order?->id,
            'message' => $message,
        ]);

        $url = $frontendBase . '/payment/esewa/failure' . ($query ? ('?' . $query) : '');

        return redirect()->away($url);
    }

    /**
     * Test endpoint to verify signature generation (for debugging only)
     * Visit: /api/payment/esewa/test-signature
     */
    public function testSignature()
    {
        // Test values
        $totalAmount = 100.00;
        $transactionUuid = '1' . now()->format('YmdHis');
        $productCode = self::MERCHANT_CODE;

        $totalAmountStr = number_format($totalAmount, 2, '.', '');

        $signedFieldNames = 'total_amount,transaction_uuid,product_code';
        
        // Create message string for signature with FORMATTED amount
        $message = "total_amount={$totalAmountStr},transaction_uuid={$transactionUuid},product_code={$productCode}";
        
        // eSewa v2 signature: Base64(HMAC-SHA256(message, secretKey))
        $s = hash_hmac('sha256', $message, $this->secretKey, true);
        $signature = base64_encode($s);

        return response()->json([
            'message' => 'eSewa Signature Test (eSewa v2 Standard)',
            'test_data' => [
                'total_amount' => $totalAmountStr,
                'transaction_uuid' => $transactionUuid,
                'product_code' => $productCode,
            ],
            'signed_field_names' => $signedFieldNames,
            'message_string' => $message,
            'signature' => $signature,
            'algorithm' => 'Base64(HMAC-SHA256(message, secretKey))',
        ]);
    }

    /**
     * Test endpoint to see what would be sent for a specific order (for debugging only)
     * POST /api/payment/esewa/test-order/{orderId}
     * Pass empty body or any body, no auth needed for testing
     */
    public function testOrderSignature($orderId)
    {
        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $amount = (float) $order->total_amount;
        $totalAmount = $amount;
        $transactionUuid = $order->id . now()->format('YmdHis');
        $productCode = self::MERCHANT_CODE;

        $amountStr = number_format($amount, 2, '.', '');
        $totalAmountStr = number_format($totalAmount, 2, '.', '');
        $taxAmountStr = '0.00';
        $serviceChargeStr = '0.00';
        $deliveryChargeStr = '0.00';

        $signedFieldNames = 'total_amount,transaction_uuid,product_code';
        
        // Create message string for signature with FORMATTED amount
        $message = "total_amount={$totalAmountStr},transaction_uuid={$transactionUuid},product_code={$productCode}";
        
        // eSewa v2 signature: Base64(HMAC-SHA256(message, secretKey))
        $s = hash_hmac('sha256', $message, $this->secretKey, true);
        $signature = base64_encode($s);

        return response()->json([
            'message' => 'eSewa Test for Order #' . $orderId,
            'order_id' => $order->id,
            'total_amount' => $totalAmountStr,
            'transaction_uuid' => $transactionUuid,
            'product_code' => $productCode,
            'message_string' => $message,
            'signed_field_names' => $signedFieldNames,
            'signature' => $signature,
            'would_send_to_esewa' => self::PAYMENT_URL,
        ]);
    }
}

