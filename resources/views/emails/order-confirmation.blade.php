<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #be1e2d 0%, #9a1824 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .success-icon {
            width: 60px;
            height: 60px;
            background-color: #10b981;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
        }
        .content {
            padding: 40px 30px;
        }
        .order-number {
            background-color: #faf5f6;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .order-number h2 {
            margin: 0 0 10px 0;
            color: #be1e2d;
            font-size: 24px;
        }
        .order-number p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #be1e2d;
        }
        .order-items {
            background-color: #fafafa;
            border-radius: 8px;
            padding: 20px;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #e5e5e5;
        }
        .order-item:last-child {
            border-bottom: none;
        }
        .item-details {
            flex: 1;
        }
        .item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }
        .item-meta {
            font-size: 14px;
            color: #666;
        }
        .item-price {
            font-weight: bold;
            color: #be1e2d;
            white-space: nowrap;
            margin-left: 20px;
        }
        .address-box {
            background-color: #faf5f6;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #be1e2d;
        }
        .address-box p {
            margin: 5px 0;
            color: #555;
        }
        .total-section {
            background-color: #faf5f6;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 16px;
        }
        .total-row.final {
            border-top: 2px solid #be1e2d;
            padding-top: 15px;
            margin-top: 10px;
            font-size: 20px;
            font-weight: bold;
            color: #be1e2d;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .footer-links {
            margin-top: 20px;
        }
        .footer-links a {
            color: #be1e2d;
            text-decoration: none;
            margin: 0 10px;
        }
        .cta-button {
            display: inline-block;
            background-color: #be1e2d;
            color: #ffffff;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #9a1824;
        }
        .info-box {
            background-color: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .info-box p {
            margin: 5px 0;
            color: #1976D2;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="success-icon">✓</div>
            <h1>Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for shopping with Avhira</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Order Number -->
            <div class="order-number">
                <h2>Order #{{ $order->order_number }}</h2>
                <p>Placed on {{ $order->created_at->format('F d, Y \a\t h:i A') }}</p>
            </div>

            <!-- Greeting -->
            <p style="font-size: 16px; color: #333;">
                Hi <strong>{{ $order->user->name }}</strong>,
            </p>
            <p style="font-size: 16px; color: #555;">
                We've received your order and we're getting it ready. You'll receive a shipping confirmation email with tracking information once your order ships.
            </p>

            <!-- Order Items -->
            <div class="section">
                <div class="section-title">Order Items</div>
                <div class="order-items">
                    @foreach($order->orderItems as $item)
                    <div class="order-item">
                        <div class="item-details">
                            <div class="item-name">{{ $item->product_name }}</div>
                            <div class="item-meta">
                                Quantity: {{ $item->quantity }}
                                @if($item->size)
                                    | Size: {{ $item->size }}
                                @endif
                            </div>
                        </div>
                        <div class="item-price">
                            ₹{{ number_format($item->price * $item->quantity, 2) }}
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            <!-- Order Total -->
            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>₹{{ number_format($order->total_amount, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Shipping</span>
                    <span style="color: #10b981; font-weight: 600;">FREE</span>
                </div>
                <div class="total-row final">
                    <span>Total</span>
                    <span>₹{{ number_format($order->total_amount, 2) }}</span>
                </div>
            </div>

            <!-- Shipping Address -->
            <div class="section">
                <div class="section-title">Shipping Address</div>
                <div class="address-box">
                    <p><strong>{{ $order->user->name }}</strong></p>
                    <p>{{ $order->shipping_address }}</p>
                    <p>{{ $order->shipping_city }}, {{ $order->shipping_state }} - {{ $order->shipping_pincode }}</p>
                    <p>Phone: {{ $order->phone }}</p>
                </div>
            </div>

            <!-- What's Next -->
            <div class="info-box">
                <p><strong>📦 What happens next?</strong></p>
                <p>1. We'll prepare your order for shipping</p>
                <p>2. You'll receive tracking details once shipped</p>
                <p>3. Delivery within 3-5 business days</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/orders/' . $order->id) }}" class="cta-button">
                    Track Your Order
                </a>
            </div>

            <!-- Customer Support -->
            <div style="background-color: #fafafa; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #666;">Need help with your order?</p>
                <p style="margin: 0;">
                    <a href="mailto:avhirahouse@gmail.com" style="color: #be1e2d; text-decoration: none; font-weight: 600;">
                        Contact Support
                    </a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>AVHIRA</strong></p>
            <p style="margin: 0 0 15px 0;">Premium Clothing Brand</p>
            
            <div class="footer-links">
                <a href="{{ url('/') }}">Shop Now</a>
                <a href="{{ url('/products') }}">Products</a>
                <a href="{{ url('/categories') }}">Categories</a>
            </div>

            <p style="margin: 20px 0 0 0; font-size: 12px; color: #999;">
                You're receiving this email because you placed an order on Avhira.
                <br>
                © {{ date('Y') }} Avhira. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
