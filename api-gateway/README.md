# API Gateway

## Overview
Central entry point for all microservices, providing routing, load balancing, and session management.

## Routing Configuration

### Service Routes
- `/api/accounts/**` → `user-service`
- `/api/catalog/**` → `product-catalog-service`
- `/api/review/**` → `product-recommendation-service`
- `/api/shop/**` → `order-service`

### Route Examples
- `http://localhost:8900/api/accounts/registration` → User Service registration
- `http://localhost:8900/api/catalog/products` → Product Catalog products
- `http://localhost:8900/api/review/recommendations` → Product Recommendations
- `http://localhost:8900/api/shop/cart` → Order Service cart

## Configuration
- **Port**: 8900
- **Load Balancer**: Zuul
- **Service Discovery**: Eureka Client
- **Session Store**: Redis

## Features
- **Service Discovery**: Automatic routing to registered services
- **Load Balancing**: Distributes requests across service instances
- **Session Management**: Redis-based session storage
- **CORS Support**: Cross-origin request handling

## Common Issues

### Service Not Found (404)
**Problem**: API Gateway cannot route to service
**Solution**:
1. Check if target service is registered with Eureka
2. Verify service is running and healthy
3. Check routing configuration in `application.properties`

### Session Issues
**Problem**: Session data not persisting
**Solution**:
1. Ensure Redis is running
2. Check Redis connection configuration
3. Verify session cookies are being set

## Testing
```bash
# Test gateway health
curl -X GET http://localhost:8900/

# Test service routing
curl -X GET http://localhost:8900/api/catalog/products
curl -X GET http://localhost:8900/api/accounts/users
curl -X GET "http://localhost:8900/api/review/recommendations?name=laptop"
```

## Monitoring
- **Eureka Dashboard**: http://localhost:8761
- **Gateway Health**: http://localhost:8900/actuator/health (if actuator enabled)
