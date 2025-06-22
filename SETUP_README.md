# RainbowForest E-commerce Microservices Platform

A complete Spring Boot microservices-based e-commerce platform with service discovery, API gateway, and distributed session management.

## 🏗️ Architecture Overview

This platform consists of 6 microservices:

- **Eureka Server** (Port 8761) - Service registry and discovery
- **API Gateway** (Port 8900) - Main entry point with Zuul routing
- **User Service** (Port 8811) - User management and authentication
- **Product Catalog Service** (Port 8810) - Product management
- **Product Recommendation Service** (Port 8812) - Product recommendations
- **Order Service** (Port 8813) - Shopping cart and order management

## 📋 Prerequisites

### Required Software
- **Java 11** (OpenJDK recommended)
- **Maven 3.6+**
- **Docker** (for infrastructure dependencies)
- **Git**

### Infrastructure Dependencies
- **Microsoft SQL Server 2016+** (via Docker)
- **Redis 3.2+** (via Docker)

## 🚀 Quick Start Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/RainbowForest/e-commerce-microservices.git
cd e-commerce-microservices
```

### Step 2: Set Up Infrastructure

#### Start SQL Server Container
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Test1234!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2019-latest
```

#### Create Required Databases
```bash
# Wait for SQL Server to start (about 30 seconds)
sleep 30

# Create databases
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Test1234! -Q "
CREATE DATABASE users;
CREATE DATABASE product_catalog;
CREATE DATABASE product_recommendations;
CREATE DATABASE orders;
"
```

#### Start Redis Container
```bash
docker run --name redis -p 6379:6379 -d redis:latest
```

### Step 3: Set Java Environment
```bash
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
# Add to your ~/.bashrc for persistence
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
```

### Step 4: Build All Services
```bash
# Build each service (in order)
cd eureka-server && mvn clean package -DskipTests && cd ..
cd api-gateway && mvn clean package -DskipTests && cd ..
cd user-service && mvn clean package -DskipTests && cd ..
cd product-catalog-service && mvn clean package -DskipTests && cd ..
cd product-recommendation-service && mvn clean package -DskipTests && cd ..
cd order-service && mvn clean package -DskipTests && cd ..
```

### Step 5: Start Services (In Order)

**Important**: Start services in this exact order to ensure proper dependency resolution.

#### 5.1 Start Eureka Server (Service Registry)
```bash
cd eureka-server
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..
```
Wait for Eureka to fully start (check http://localhost:8761)

#### 5.2 Start Business Services
```bash
# User Service
cd user-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

# Product Catalog Service
cd product-catalog-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

# Product Recommendation Service
cd product-recommendation-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

# Order Service
cd order-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..
```

#### 5.3 Start API Gateway (Last)
```bash
cd api-gateway
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..
```

### Step 6: Verify Installation

#### Check Service Registration
Visit http://localhost:8761 to see all services registered with Eureka.

#### Test API Gateway
```bash
# Welcome page with API documentation
curl http://localhost:8900/

# Health check
curl http://localhost:8900/health

# Test product catalog
curl http://localhost:8900/api/catalog/products
```

## 🌐 API Endpoints

All API endpoints require the `/api` prefix when accessed through the API Gateway.

### User Management (`/api/accounts/**`)
- `POST /api/accounts/registration` - Register new user
- `GET /api/accounts/users` - List all users
- `POST /api/accounts/login` - User login

### Product Catalog (`/api/catalog/**`)
- `GET /api/catalog/products` - Browse all products
- `POST /api/catalog/admin/products` - Add new product (admin)
- `GET /api/catalog/products/{id}` - Get specific product

### Shopping Cart & Orders (`/api/shop/**`)
- `GET /api/shop/cart` - View shopping cart (requires auth)
- `POST /api/shop/cart/add` - Add item to cart (requires auth)
- `POST /api/shop/orders` - Place order (requires auth)
- `GET /api/shop/orders` - View order history (requires auth)

### Product Recommendations (`/api/review/**`)
- `GET /api/review/recommendations` - Get product recommendations

## 🧪 Testing the Platform

### Create Test Data

#### Register a User
```bash
curl -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

#### Add a Product (Admin)
```bash
curl -X POST http://localhost:8900/api/catalog/admin/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Laptop","description":"High-performance laptop","price":999.99,"category":"Electronics","availability":10}'
```

#### Test Shopping Cart
```bash
# Add item to cart (requires authentication)
curl -X POST http://localhost:8900/api/shop/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'
```

## 🔧 Configuration Details

### Database Configuration
- **Connection**: SQL Server on localhost:1433
- **Username**: sa
- **Password**: Test1234!
- **Databases**: users, product_catalog, product_recommendations, orders

### Session Management
- **Redis**: localhost:6379
- **Session Store**: Redis-based with HttpOnly cookies
- **Cookie Settings**: SameSite=Lax for security

### Service Ports
- Eureka Server: 8761
- API Gateway: 8900 (main entry point)
- User Service: 8811
- Product Catalog: 8810
- Product Recommendation: 8812
- Order Service: 8813

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
ps aux | grep java | grep spring-boot:run
# Kill specific process
kill <PID>
```

#### Database Connection Issues
```bash
# Check SQL Server container
docker ps | grep sqlserver
# Restart if needed
docker restart sqlserver
```

#### Service Not Registering with Eureka
1. Ensure Eureka Server is running first
2. Check service logs for connection errors
3. Verify network connectivity between services

#### Build Failures
```bash
# Clean and rebuild specific service
cd <service-directory>
mvn clean package -DskipTests
```

### Health Checks
```bash
# Check individual service health
curl http://localhost:8811/actuator/health  # User Service
curl http://localhost:8810/actuator/health  # Product Catalog
curl http://localhost:8812/actuator/health  # Product Recommendation
curl http://localhost:8813/actuator/health  # Order Service
curl http://localhost:8900/actuator/health  # API Gateway
```

## 🔒 Security Features

- **Authentication**: Basic authentication for protected endpoints
- **Session Management**: Redis-based sessions with secure cookies
- **CORS**: Configured for cross-origin requests
- **Security Headers**: XSS protection, content type options, frame options

## 📊 Monitoring

- **Service Registry**: http://localhost:8761 (Eureka Dashboard)
- **API Gateway**: http://localhost:8900 (Welcome page with endpoint documentation)
- **Health Endpoints**: Available on all services at `/actuator/health`

## 🚀 Production Deployment

### Docker Deployment
Each service can be containerized using the provided Dockerfiles (if available) or by creating custom Docker images.

### Environment Variables
Set the following environment variables for production:
- `SPRING_PROFILES_ACTIVE=prod`
- `DATABASE_URL=<production-database-url>`
- `REDIS_URL=<production-redis-url>`
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=<eureka-server-url>`

### Load Balancing
The platform supports horizontal scaling. Multiple instances of each service can be deployed and will automatically register with Eureka for load balancing.

## 📝 Development Notes

### Key Fixes Applied
1. **Java Version Standardization**: All services use Java 11 for compatibility
2. **Database Password Consistency**: Unified password "Test1234!" across all services
3. **API Gateway Routing**: Fixed Zuul routing configuration for catalog service
4. **Root Path Handler**: Added WelcomeController to provide API documentation instead of 404 errors

### Architecture Patterns
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Netflix Zuul
- **Session Management**: Spring Session with Redis
- **Database**: JPA/Hibernate with SQL Server
- **Build Tool**: Maven
- **Framework**: Spring Boot 2.1.5, Spring Cloud Greenwich.SR1

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Ensure services are started in the correct order
4. Check service logs for detailed error messages

## 📄 License

This project is part of the RainbowForest organization. Please refer to the original repository for license information.
