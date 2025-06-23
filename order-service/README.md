# Order Service

## Overview
Manages shopping cart functionality and order processing for the e-commerce platform.

## API Endpoints

### Shopping Cart
- **GET** `/cart` - Get cart contents
  - **Required Header**: `Cookie: JSESSIONID=session-id`
- **POST** `/cart?productId={id}&quantity={qty}` - Add item to cart
- **DELETE** `/cart?productId={id}` - Remove item from cart

### Orders
- **GET** `/orders` - Get user orders
- **POST** `/orders` - Create new order
- **GET** `/orders/{id}` - Get order by ID

## Database Schema
- **Tables**: 
  - `orders.dbo.orders` - Order information
  - `orders.dbo.items` - Order items
  - `orders.dbo.products` - Product references
  - `orders.dbo.users` - User references

## Configuration
- **Port**: 8813
- **Database**: `orders` database in SQL Server
- **Eureka Service ID**: `order-service`
- **Session Management**: Redis-based sessions

## Common Issues

### Missing Session Cookie
**Problem**: Cart operations fail without proper session
**Solution**: Include `Cookie: JSESSIONID=session-id` header in requests

### Redis Connection Issues
**Problem**: Session management fails
**Solution**:
1. Ensure Redis container is running
2. Check Redis connection in `application.properties`
3. Verify Redis port 6379 is accessible

## Testing
```bash
# Test cart (requires session cookie)
curl -X GET http://localhost:8813/cart \
  -H "Cookie: JSESSIONID=your-session-id"

# Test via API Gateway
curl -X GET http://localhost:8900/api/shop/cart \
  -H "Cookie: JSESSIONID=your-session-id"

# Add item to cart
curl -X POST "http://localhost:8900/api/shop/cart?productId=1&quantity=2" \
  -H "Cookie: JSESSIONID=your-session-id"
```
