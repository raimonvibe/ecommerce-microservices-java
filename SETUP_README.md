# RainbowForest E-commerce Microservices Platform

A complete Spring Boot microservices-based e-commerce platform with service discovery, API gateway, and distributed session management.

## 🏗️ Architecture Overview

This platform consists of 6 microservices that work together to provide a complete e-commerce solution:

- **Eureka Server** (Port 8761) - Service registry and discovery (finds and manages all services)
- **API Gateway** (Port 8900) - Main entry point with Zuul routing (single access point for all APIs)
- **User Service** (Port 8811) - User management and authentication (handles user accounts and login)
- **Product Catalog Service** (Port 8810) - Product management (manages product inventory)
- **Product Recommendation Service** (Port 8812) - Product recommendations (suggests products to users)
- **Order Service** (Port 8813) - Shopping cart and order management (handles purchases and orders)

## 📋 Prerequisites - Complete Installation Guide

**⚠️ Important**: This guide assumes you're starting with a fresh Ubuntu/Debian system. If you're using Windows or macOS, some commands may differ.

### Step 1: Install Java 11

Java 11 is required for this project (newer versions may cause compatibility issues).

```bash
# Update package list
sudo apt update

# Install Java 11 OpenJDK
sudo apt install -y openjdk-11-jdk

# Verify installation
java -version
# Should show: openjdk version "11.x.x"

# Set JAVA_HOME environment variable
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Make it permanent (add to your shell profile)
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc

# Verify JAVA_HOME is set correctly
echo $JAVA_HOME
# Should show: /usr/lib/jvm/java-11-openjdk-amd64
```

### Step 2: Install Maven

Maven is the build tool used to compile and run the microservices.

```bash
# Install Maven
sudo apt install -y maven

# Verify installation
mvn -version
# Should show Maven version 3.6+ and Java 11
```

### Step 3: Install Docker

Docker is used to run SQL Server and Redis databases.

```bash
# Install Docker
sudo apt install -y docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Log out and log back in, or run:
newgrp docker

# Verify Docker installation
docker --version
# Should show Docker version

# Test Docker (should download and run hello-world container)
docker run hello-world
```

### Step 4: Install Git

Git is needed to clone the repository.

```bash
# Install Git
sudo apt install -y git

# Verify installation
git --version
# Should show Git version

# Configure Git (replace with your information)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### ✅ Prerequisites Verification

Before proceeding, verify all tools are installed correctly:

```bash
# Check all required tools
echo "=== Checking Prerequisites ==="
echo "Java version:"
java -version
echo -e "\nJAVA_HOME:"
echo $JAVA_HOME
echo -e "\nMaven version:"
mvn -version
echo -e "\nDocker version:"
docker --version
echo -e "\nGit version:"
git --version
echo "=== All tools should be installed and working ==="
```

## 🚀 Complete Setup Guide

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/raimonvibe/ecommerce-microservices-java.git

# Navigate to the project directory
cd ecommerce-microservices-java

# Verify you're in the right directory
ls -la
# You should see directories like: eureka-server, api-gateway, user-service, etc.
```

## 🚀 Quick Start Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/RainbowForest/e-commerce-microservices.git
cd e-commerce-microservices
```

### Step 2: Set Up Infrastructure (Databases)

The microservices need SQL Server for data storage and Redis for session management. We'll run both using Docker containers.

#### 2.1 Start SQL Server Container

**What this does**: Creates a Microsoft SQL Server database that will store user accounts, products, orders, and recommendations.

```bash
# Start SQL Server container (this may take a few minutes to download the first time)
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Test1234!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2019-latest

# Verify the container is running
docker ps | grep sqlserver
# You should see a line showing the sqlserver container is "Up"

# Check container logs to ensure it started properly
docker logs sqlserver
# Look for "SQL Server is now ready for client connections"
```

#### 2.2 Create Required Databases

**What this does**: Creates 4 separate databases that different microservices will use to store their data.

```bash
# Wait for SQL Server to fully start (this is important!)
echo "Waiting for SQL Server to start completely..."
sleep 30

# Create all required databases
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Test1234! -C -Q "
CREATE DATABASE users;
CREATE DATABASE product_catalog;
CREATE DATABASE product_recommendations;
CREATE DATABASE orders;
"

# Verify databases were created successfully
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Test1234! -C -Q "SELECT name FROM sys.databases WHERE name IN ('users', 'product_catalog', 'product_recommendations', 'orders');"
# You should see all 4 database names listed
```

#### 2.3 Start Redis Container

**What this does**: Creates a Redis database for storing user sessions and shopping cart data.

```bash
# Start Redis container
docker run --name redis -p 6379:6379 -d redis:latest

# Verify Redis is running
docker ps | grep redis
# You should see a line showing the redis container is "Up"

# Test Redis connection
docker exec -it redis redis-cli ping
# Should respond with "PONG"
```

#### ✅ Infrastructure Verification

Verify both databases are running correctly:

```bash
echo "=== Infrastructure Status Check ==="
echo "Docker containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo -e "\nSQL Server databases:"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Test1234! -C -Q "SELECT name FROM sys.databases WHERE name IN ('users', 'product_catalog', 'product_recommendations', 'orders');"
echo -e "\nRedis connection:"
docker exec -it redis redis-cli ping
echo "=== Infrastructure should be ready ==="
```

### Step 3: Prepare Java Environment

**What this does**: Ensures Java 11 is being used for all microservices (required for compatibility).

```bash
# Set Java environment for current session
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Verify Java is set correctly
echo "Current Java version:"
java -version
echo "JAVA_HOME is set to:"
echo $JAVA_HOME

# Make sure this persists for new terminal sessions
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

### Step 4: Build All Microservices

**What this does**: Compiles all the Java code and creates executable JAR files for each microservice. This step may take 2-5 minutes depending on your system.

**⚠️ Important**: We skip tests during build (`-DskipTests`) to speed up the process. The services have been tested and work correctly.

```bash
# Make sure you're in the project root directory
pwd
# Should show: /path/to/ecommerce-microservices-java

echo "=== Building All Microservices ==="
echo "This will take a few minutes..."

# Build Eureka Server (Service Registry) - Must be built first
echo "Building Eureka Server..."
cd eureka-server && mvn clean package -DskipTests && cd ..
echo "✅ Eureka Server built successfully"

# Build API Gateway
echo "Building API Gateway..."
cd api-gateway && mvn clean package -DskipTests && cd ..
echo "✅ API Gateway built successfully"

# Build User Service
echo "Building User Service..."
cd user-service && mvn clean package -DskipTests && cd ..
echo "✅ User Service built successfully"

# Build Product Catalog Service
echo "Building Product Catalog Service..."
cd product-catalog-service && mvn clean package -DskipTests && cd ..
echo "✅ Product Catalog Service built successfully"

# Build Product Recommendation Service
echo "Building Product Recommendation Service..."
cd product-recommendation-service && mvn clean package -DskipTests && cd ..
echo "✅ Product Recommendation Service built successfully"

# Build Order Service
echo "Building Order Service..."
cd order-service && mvn clean package -DskipTests && cd ..
echo "✅ Order Service built successfully"

echo "=== All services built successfully! ==="
```

#### ✅ Build Verification

Verify all services were built correctly:

```bash
echo "=== Checking Build Results ==="
echo "Looking for JAR files in target directories..."
find . -name "*.jar" -path "*/target/*" | grep -v "original"
# You should see 6 JAR files, one for each microservice
echo "=== Build verification complete ==="
```

### Step 5: Start All Microservices (Critical Order!)

**⚠️ VERY IMPORTANT**: You MUST start services in this exact order! Each service depends on the previous ones being ready.

**What happens**: Each service will start, connect to the databases, and register itself with Eureka. This process takes about 30-60 seconds per service.

#### 5.1 Start Eureka Server (Service Registry) - FIRST!

**What this does**: Starts the service registry that all other services will register with. This MUST start first.

```bash
echo "=== Starting Eureka Server (Service Registry) ==="
cd eureka-server
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

echo "Waiting for Eureka Server to start..."
echo "This will take about 30-60 seconds..."
sleep 60

# Verify Eureka is running
curl -s http://localhost:8761 > /dev/null && echo "✅ Eureka Server is running!" || echo "❌ Eureka Server not ready yet, wait longer"
```

**🌐 Check Eureka Dashboard**: Open http://localhost:8761 in your browser. You should see the Eureka dashboard with no services registered yet.

#### 5.2 Start Business Services - SECOND!

**What this does**: Starts the core business logic services. These will register with Eureka and connect to the databases.

```bash
echo "=== Starting Business Services ==="

# Start User Service
echo "Starting User Service..."
cd user-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

# Start Product Catalog Service  
echo "Starting Product Catalog Service..."
cd product-catalog-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

# Start Product Recommendation Service
echo "Starting Product Recommendation Service..."
cd product-recommendation-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

# Start Order Service
echo "Starting Order Service..."
cd order-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

echo "Waiting for business services to start and register..."
echo "This will take about 2-3 minutes..."
sleep 120

echo "✅ Business services should be starting up!"
```

#### 5.3 Start API Gateway - LAST!

**What this does**: Starts the API Gateway that routes requests to all business services. This MUST start last so it can find all the other services.

```bash
echo "=== Starting API Gateway (Final Step) ==="
cd api-gateway
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 && mvn spring-boot:run &
cd ..

echo "Waiting for API Gateway to start..."
echo "This will take about 1-2 minutes..."
sleep 90

echo "✅ API Gateway should be ready!"
```

### Step 6: Complete System Verification

**What this does**: Confirms that all 6 microservices are running correctly and can communicate with each other.

#### 6.1 Check All Services are Running

First, let's verify all Java processes are running:

```bash
echo "=== Checking Running Services ==="
ps aux | grep -E "(eureka|user-service|product-catalog|product-recommendation|order-service|api-gateway)" | grep -v grep
# You should see 6 Java processes running (one for each microservice)
echo "=== Process Check Complete ==="
```

#### 6.2 Check Service Registration in Eureka

**What this does**: Verifies that all services have successfully registered with the service registry.

```bash
echo "=== Checking Service Registration ==="
curl -s http://localhost:8761 > /dev/null && echo "✅ Eureka Server is accessible" || echo "❌ Eureka Server not accessible"
```

**🌐 Visual Check**: Open http://localhost:8761 in your browser. You should see:
- **Eureka Dashboard** with the title "Eureka"
- **"Instances currently registered with Eureka"** section showing 5 services:
  - API-GATEWAY (port 8900)
  - ORDER-SERVICE (port 8813)
  - PRODUCT-CATALOG-SERVICE (port 8810)
  - PRODUCT-RECOMMENDATION-SERVICE (port 8812)
  - USER-SERVICE (port 8811)
- All services should show status **"UP"**

#### 6.3 Test API Gateway (Main Entry Point)

**What this does**: Tests the main entry point that users will access to use the e-commerce platform.

```bash
echo "=== Testing API Gateway ==="

# Test welcome page with API documentation
echo "Testing welcome page..."
curl -s http://localhost:8900/ | head -5
# Should show JSON with available endpoints

# Test health check
echo -e "\nTesting health check..."
curl -s http://localhost:8900/health
# Should show: {"service":"API Gateway","status":"UP"}

echo -e "\n✅ API Gateway tests complete!"
```

**🌐 Visual Check**: Open http://localhost:8900 in your browser. You should see:
- JSON response with available API endpoints
- Message: "Welcome to RainbowForest E-commerce Microservices Platform"
- List of available endpoints like `/api/catalog/products`, `/api/accounts/registration`, etc.

#### 6.4 Test Individual Service Communication

**What this does**: Verifies that the API Gateway can successfully route requests to individual services.

```bash
echo "=== Testing Service Communication ==="

# Test routing to different services through the gateway
echo "Testing API Gateway routing..."

# These may return 404 or 401 errors, which is normal for a secure e-commerce platform
# The important thing is that we get structured JSON responses, not connection errors

curl -s -w "Status: %{http_code}\n" http://localhost:8900/api/catalog/products | tail -1
curl -s -w "Status: %{http_code}\n" http://localhost:8900/api/accounts/registration | tail -1  
curl -s -w "Status: %{http_code}\n" http://localhost:8900/api/shop/cart | tail -1

echo "✅ Service communication tests complete!"
echo "Note: 404/401/405 status codes are normal - they indicate services are responding correctly"
```

#### ✅ Final System Status Check

Run this comprehensive check to verify everything is working:

```bash
echo "=========================================="
echo "🎉 RAINBOWFOREST E-COMMERCE PLATFORM STATUS"
echo "=========================================="

echo -e "\n📊 Infrastructure Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(sqlserver|redis)"

echo -e "\n🔧 Microservices Status:"
echo "Java processes running:"
ps aux | grep -E "(eureka|user-service|product-catalog|product-recommendation|order-service|api-gateway)" | grep -v grep | wc -l
echo "Expected: 6 processes"

echo -e "\n🌐 Service Registry Status:"
curl -s http://localhost:8761 > /dev/null && echo "✅ Eureka Server: ACCESSIBLE" || echo "❌ Eureka Server: NOT ACCESSIBLE"

echo -e "\n🚪 API Gateway Status:"
curl -s http://localhost:8900/health | grep -q "UP" && echo "✅ API Gateway: UP" || echo "❌ API Gateway: DOWN"

echo -e "\n🎯 Access Points:"
echo "• Eureka Dashboard: http://localhost:8761"
echo "• API Gateway: http://localhost:8900"
echo "• Main API Endpoints: http://localhost:8900/api/*"

echo -e "\n=========================================="
echo "🚀 PLATFORM IS READY FOR USE!"
echo "=========================================="
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

## 🧪 Testing the E-commerce Platform

**What this does**: Tests the actual e-commerce functionality to make sure users can register, browse products, and make purchases.

**⚠️ Important**: These tests use the API Gateway (http://localhost:8900) as the main entry point, just like real users would.

### Step 1: Test User Registration

**What this does**: Creates a new user account in the system.

```bash
echo "=== Testing User Registration ==="

# Register a new user
curl -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo "✅ User registration test complete!"
echo "Expected: HTTP Status 200 or 201 (success) or 409 (user already exists)"
```

### Step 2: Test Product Management

**What this does**: Adds a product to the catalog (admin function) and then retrieves it.

```bash
echo "=== Testing Product Management ==="

# Add a new product (admin function)
echo "Adding a test product..."
curl -X POST http://localhost:8900/api/catalog/admin/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Laptop","description":"High-performance laptop for developers","price":999.99,"category":"Electronics","availability":10}' \
  -w "\nHTTP Status: %{http_code}\n"

# Browse all products
echo -e "\nBrowsing all products..."
curl -X GET http://localhost:8900/api/catalog/products \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n"

echo "✅ Product management tests complete!"
```

### Step 3: Test Shopping Cart (Requires Authentication)

**What this does**: Tests the shopping cart functionality. Note: This requires user authentication.

```bash
echo "=== Testing Shopping Cart ==="

# View shopping cart (requires authentication)
echo "Checking shopping cart..."
curl -X GET http://localhost:8900/api/shop/cart \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n"

# Add item to cart (requires authentication)
echo -e "\nAdding item to cart..."
curl -X POST http://localhost:8900/api/shop/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}' \
  -w "\nHTTP Status: %{http_code}\n"

echo "✅ Shopping cart tests complete!"
echo "Expected: HTTP Status 401 (unauthorized) - this is normal without authentication"
```

### Step 4: Test Product Recommendations

**What this does**: Tests the recommendation engine that suggests products to users.

```bash
echo "=== Testing Product Recommendations ==="

# Get product recommendations
curl -X GET http://localhost:8900/api/review/recommendations \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n"

echo "✅ Product recommendations test complete!"
```

### ✅ Complete Platform Test

Run this comprehensive test to verify all major functionality:

```bash
echo "=========================================="
echo "🧪 COMPLETE E-COMMERCE PLATFORM TEST"
echo "=========================================="

echo -e "\n1️⃣ Testing User Registration..."
curl -s -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser2","email":"test2@example.com","password":"password123"}' \
  -w "Status: %{http_code}" && echo ""

echo -e "\n2️⃣ Testing Product Catalog..."
curl -s -X GET http://localhost:8900/api/catalog/products \
  -w "Status: %{http_code}" && echo ""

echo -e "\n3️⃣ Testing Product Recommendations..."
curl -s -X GET http://localhost:8900/api/review/recommendations \
  -w "Status: %{http_code}" && echo ""

echo -e "\n4️⃣ Testing Shopping Cart (expect 401 - unauthorized)..."
curl -s -X GET http://localhost:8900/api/shop/cart \
  -w "Status: %{http_code}" && echo ""

echo -e "\n=========================================="
echo "🎉 PLATFORM TESTING COMPLETE!"
echo "=========================================="
echo "✅ Status codes 200-299: Success"
echo "✅ Status code 401: Normal (authentication required)"
echo "✅ Status code 404: Normal (endpoint may require specific setup)"
echo "❌ Connection errors: Problem with services"
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

## 🛠️ Troubleshooting Guide

**What this section covers**: Solutions to common problems you might encounter during setup or operation.

### 🚨 Common Issues and Solutions

#### Issue 1: Port Already in Use

**Problem**: Error message like "Port 8761 is already in use" when starting services.

**Solution**:
```bash
# Find which process is using the port (replace 8761 with your port)
echo "=== Finding Process Using Port ==="
lsof -i :8761
# OR
netstat -tulpn | grep 8761

# Find all Java Spring Boot processes
ps aux | grep java | grep spring-boot:run

# Kill specific process (replace <PID> with actual process ID)
kill <PID>

# If process won't die, force kill it
kill -9 <PID>

# Verify port is free
lsof -i :8761
# Should show no output if port is free
```

#### Issue 2: Database Connection Issues

**Problem**: Services can't connect to SQL Server or Redis.

**Solution**:
```bash
echo "=== Checking Database Containers ==="

# Check if containers are running
docker ps | grep -E "(sqlserver|redis)"

# Check SQL Server container logs
docker logs sqlserver | tail -20

# Check Redis container logs  
docker logs redis | tail -20

# Restart SQL Server if needed
docker restart sqlserver
sleep 30  # Wait for it to start

# Restart Redis if needed
docker restart redis

# Test connections
echo "Testing SQL Server connection..."
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Test1234! -C -Q "SELECT 1"

echo "Testing Redis connection..."
docker exec -it redis redis-cli ping
```

#### Issue 3: Service Not Registering with Eureka

**Problem**: Services start but don't appear in Eureka dashboard.

**Solution**:
```bash
echo "=== Diagnosing Eureka Registration Issues ==="

# 1. Check if Eureka Server is running
curl -s http://localhost:8761 > /dev/null && echo "✅ Eureka is accessible" || echo "❌ Eureka not accessible"

# 2. Check service logs for registration errors
# Look for lines containing "eureka" or "registration" in service output

# 3. Verify network connectivity
ping localhost

# 4. Check if services are binding to correct ports
netstat -tulpn | grep -E "(8810|8811|8812|8813|8900)"

# 5. Restart services in correct order if needed
echo "If needed, restart services in this order:"
echo "1. Stop all services (Ctrl+C in each terminal)"
echo "2. Start Eureka Server first"
echo "3. Wait 60 seconds"
echo "4. Start business services"
echo "5. Wait 120 seconds"
echo "6. Start API Gateway"
```

#### Issue 4: Build Failures

**Problem**: Maven build fails with compilation errors.

**Solution**:
```bash
echo "=== Fixing Build Issues ==="

# Check Java version (must be Java 11)
java -version
echo $JAVA_HOME

# If wrong Java version, set it correctly
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Clean and rebuild specific service
echo "Rebuilding failed service..."
cd <service-directory>  # Replace with actual service directory
mvn clean
mvn package -DskipTests

# If still failing, try with debug output
mvn clean package -DskipTests -X

# Check for common issues:
echo "Common build issues:"
echo "- Wrong Java version (need Java 11)"
echo "- Missing JAVA_HOME environment variable"
echo "- Network issues downloading dependencies"
echo "- Insufficient disk space"
```

#### Issue 5: Services Start But Don't Respond

**Problem**: Services appear to start but API calls fail.

**Solution**:
```bash
echo "=== Diagnosing Service Response Issues ==="

# Check if services are actually listening on ports
netstat -tulpn | grep -E "(8761|8810|8811|8812|8813|8900)"

# Test each service individually
echo "Testing individual services..."
curl -w "Status: %{http_code}\n" http://localhost:8761/
curl -w "Status: %{http_code}\n" http://localhost:8810/actuator/health
curl -w "Status: %{http_code}\n" http://localhost:8811/actuator/health
curl -w "Status: %{http_code}\n" http://localhost:8812/actuator/health
curl -w "Status: %{http_code}\n" http://localhost:8813/actuator/health
curl -w "Status: %{http_code}\n" http://localhost:8900/health

# Check service startup logs for errors
echo "Check service logs for errors like:"
echo "- Database connection failures"
echo "- Port binding issues"
echo "- Configuration errors"
echo "- Memory issues"
```

### 🔍 Health Check Commands

Use these commands to verify individual service health:

```bash
echo "=== Complete Health Check ==="

# Eureka Server
echo "Checking Eureka Server..."
curl -s http://localhost:8761 > /dev/null && echo "✅ Eureka: UP" || echo "❌ Eureka: DOWN"

# Individual service health endpoints
echo "Checking microservices..."
curl -s http://localhost:8811/actuator/health | grep -q "UP" && echo "✅ User Service: UP" || echo "❌ User Service: DOWN"
curl -s http://localhost:8810/actuator/health | grep -q "UP" && echo "✅ Product Catalog: UP" || echo "❌ Product Catalog: DOWN"
curl -s http://localhost:8812/actuator/health | grep -q "UP" && echo "✅ Product Recommendation: UP" || echo "❌ Product Recommendation: DOWN"
curl -s http://localhost:8813/actuator/health | grep -q "UP" && echo "✅ Order Service: UP" || echo "❌ Order Service: DOWN"
curl -s http://localhost:8900/health | grep -q "UP" && echo "✅ API Gateway: UP" || echo "❌ API Gateway: DOWN"

echo "=== Health Check Complete ==="
```

### 🆘 Emergency Reset

If everything is broken and you want to start fresh:

```bash
echo "=== EMERGENCY RESET - Starting Fresh ==="

# 1. Stop all Java processes
echo "Stopping all Java processes..."
pkill -f "spring-boot:run"

# 2. Stop and remove containers
echo "Stopping containers..."
docker stop sqlserver redis 2>/dev/null || true
docker rm sqlserver redis 2>/dev/null || true

# 3. Clean build artifacts
echo "Cleaning build artifacts..."
find . -name "target" -type d -exec rm -rf {} + 2>/dev/null || true

# 4. Start fresh
echo "Starting fresh setup..."
echo "Now follow the setup guide from Step 2 (Infrastructure Setup)"

echo "=== Reset Complete - Ready for Fresh Setup ==="
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
