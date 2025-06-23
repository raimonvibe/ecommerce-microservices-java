# User Service

## Overview
Handles user registration, authentication, and user management for the e-commerce platform.

## API Endpoints

### User Registration
- **POST** `/registration`
- **Required Fields**: `userName`, `userPassword`, `active`
- **Example Request**:
```json
{
  "userName": "testuser",
  "userPassword": "password123", 
  "active": 1
}
```
- **Success Response**: HTTP 201 with user object

### User Management
- **GET** `/users` - List all users
- **GET** `/users/{id}` - Get user by ID
- **GET** `/users?name={userName}` - Get user by name
- **POST** `/users` - Add new user (admin endpoint)

## Database Schema
- **Table**: `users.dbo.users`
- **Required Fields**: 
  - `user_name` (NOT NULL) - Maps to `userName` in JSON
  - `user_password` - Maps to `userPassword` in JSON
  - `active` - User status (1 = active, 0 = inactive)

## Configuration
- **Port**: 8811
- **Database**: `users` database in SQL Server
- **Eureka Service ID**: `user-service`

## Common Issues

### HTTP 500 Registration Error
**Problem**: "Cannot insert the value NULL into column 'user_name'"
**Solution**: Ensure `userName` field is provided in registration requests, not `username`

### Database Connection Issues
**Problem**: Service fails to start with database errors
**Solution**: 
1. Verify SQL Server is running
2. Check database connection string in `application.properties`
3. Ensure `users` database exists

## Testing
```bash
# Test registration with correct fields
curl -X POST http://localhost:8811/registration \
  -H "Content-Type: application/json" \
  -d '{"userName":"testuser","userPassword":"password123","active":1}'

# Test via API Gateway
curl -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{"userName":"testuser","userPassword":"password123","active":1}'
```
