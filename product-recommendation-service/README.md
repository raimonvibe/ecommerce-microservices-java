# Product Recommendation Service

## Overview
Provides product recommendations and ratings functionality for the e-commerce platform.

## API Endpoints

### Recommendations
- **GET** `/recommendations?name={productName}` - Get recommendations by product name
  - **Required Parameter**: `name` - Product name to get recommendations for
- **POST** `/{userId}/recommendations/{productId}?rating={rating}` - Add recommendation
- **DELETE** `/recommendations/{id}` - Delete recommendation

## Database Schema
- **Table**: `recommendations.dbo.recommendation`
- **Fields**:
  - `id` (Primary Key)
  - Product and User references via Feign clients
  - `rating` - Recommendation rating

## Configuration
- **Port**: 8812
- **Database**: `recommendations` database in SQL Server
- **Eureka Service ID**: `product-recommendation-service`

## Common Issues

### HTTP 400 Missing Parameter
**Problem**: "Required String parameter 'name' is not present"
**Solution**: Always include `?name=productName` parameter when getting recommendations

### HTTP 404 Endpoints Not Found
**Problem**: Endpoints return 404 despite service running
**Solution**:
1. Check component scanning configuration in main application class
2. Restart the service
3. Verify controller package structure

### Feign Client Issues
**Problem**: Cannot connect to User or Product services
**Solution**:
1. Ensure User Service and Product Catalog Service are running
2. Check Eureka registration for dependent services
3. Verify network connectivity between services

## Testing
```bash
# Test recommendations with required name parameter
curl -X GET "http://localhost:8812/recommendations?name=laptop"

# Test via API Gateway
curl -X GET "http://localhost:8900/api/review/recommendations?name=laptop"

# Test missing parameter (should return 400)
curl -X GET "http://localhost:8900/api/review/recommendations"
```
