# Product Catalog Service

## Overview
Manages product inventory, categories, and product information for the e-commerce platform.

## API Endpoints

### Product Retrieval
- **GET** `/products` - Get all products
- **GET** `/products?category={category}` - Get products by category
- **GET** `/products?name={name}` - Get products by name
- **GET** `/products/{id}` - Get product by ID

### Admin Product Management
- **POST** `/admin/products` - Add new product (admin only)
- **DELETE** `/admin/products/{id}` - Delete product (admin only)

## Database Schema
- **Table**: `products.dbo.products`
- **Fields**:
  - `id` (Primary Key)
  - `product_name` (NOT NULL)
  - `price` (NOT NULL)
  - `discription` - Product description
  - `category` (NOT NULL)
  - `availability` (NOT NULL) - Stock quantity

## Configuration
- **Port**: 8810
- **Database**: `products` database in SQL Server
- **Eureka Service ID**: `product-catalog-service`

## Common Issues

### HTTP 404 Endpoints Not Found
**Problem**: All endpoints return 404 despite service running
**Solution**: 
1. Check component scanning configuration in main application class
2. Restart the service
3. Verify controller package structure

### Database Connection Issues
**Problem**: Service fails to start with database errors
**Solution**:
1. Verify SQL Server is running
2. Check database connection string in `application.properties`
3. Ensure `products` database exists

## Testing
```bash
# Test direct service access
curl -X GET http://localhost:8810/products

# Test via API Gateway
curl -X GET http://localhost:8900/api/catalog/products

# Test by category
curl -X GET "http://localhost:8900/api/catalog/products?category=electronics"

# Test by ID
curl -X GET http://localhost:8900/api/catalog/products/1
```
