<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Order this payment belongs to
            $table->foreignId('order_id')
                ->constrained()
                ->onDelete('cascade');

            // Optional: who initiated the payment (useful for audits)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Monetary info
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');

            // Gateway / method details
            $table->string('provider', 50)->nullable();      // e.g. 'stripe', 'paypal'
            $table->string('method', 50)->nullable();        // e.g. 'card', 'bank_transfer'
            $table->string('transaction_id', 191)->nullable()->unique();

            // Status tracking – allows multiple attempts per order if needed
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded'])
                ->default('pending');

            $table->timestamp('paid_at')->nullable();

            $table->text('raw_response')->nullable();        // optional JSON payload from gateway

            $table->timestamps();

            // Indexes
            $table->index('order_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};

