# Laravel Backend API

## Setup Instructions

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Configure database in `.env` file

5. Run migrations:
```bash
php artisan migrate
```

6. Seed database (optional):
```bash
php artisan db:seed
```

7. Start development server:
```bash
php artisan serve
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user/admin
- `POST /api/logout` - Logout user
- `GET /api/user` - Get authenticated user

### Products (Public)
- `GET /api/products` - List all products (with search/filter)
- `GET /api/products/{id}` - Get product details

### Products (Admin Only)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product

### Cart (User Only)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove cart item

### Orders (User Only)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order from cart

### Orders (Admin Only)
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}/payment-status` - Update payment status
- `PUT /api/admin/orders/{id}/delivery-status` - Update delivery status

