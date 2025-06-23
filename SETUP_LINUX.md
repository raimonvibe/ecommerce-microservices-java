# RainbowForest E-commerce Microservices Platform
## Ubuntu/Debian Setup Guide

A complete Spring Boot microservices-based e-commerce platform with service discovery, API gateway, and distributed session management.

> **🐧 Linux Systems Only**: This guide is specifically designed for Ubuntu 18.04+ and Debian 10+ systems using the `apt` package manager.  
> For other platforms, see: [Windows Setup](SETUP_WINDOWS.md) | [macOS Setup](SETUP_MACOS.md)

---

## 🏗️ System Architecture

This platform consists of **6 microservices** working together to provide a complete e-commerce solution:

| Service | Port | Purpose |
|---------|------|---------|
| **Eureka Server** | 8761 | Service discovery and registration |
| **API Gateway** | 8900 | Single entry point for all API requests |
| **User Service** | 8811 | User management and authentication |
| **Product Catalog Service** | 8810 | Product information and inventory |
| **Product Recommendation Service** | 8812 | AI-powered product suggestions |
| **Order Service** | 8813 | Shopping cart and order processing |

**Service Dependencies:**
- All services register with **Eureka Server** for discovery
- **API Gateway** routes requests to appropriate services
- Services communicate via **REST APIs** and **service discovery**

---

## 📋 Prerequisites

### System Requirements
- **OS**: Ubuntu 18.04+ or Debian 10+
- **RAM**: Minimum 8GB (recommended 16GB)
- **Storage**: 5GB free space
- **Network**: Internet connection for downloading dependencies

### Required Software Installation

#### 1. Install Java 11
Java 11 is required for this project. Newer versions may cause compatibility issues.

```bash
# Update package list
sudo apt update

# Install Java 11 OpenJDK
sudo apt install -y openjdk-11-jdk

# Verify installation
java -version
# Expected output: openjdk version "11.x.x"

# Set JAVA_HOME environment variable
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Make it permanent
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc

# Verify JAVA_HOME
echo $JAVA_HOME
# Expected output: /usr/lib/jvm/java-11-openjdk-amd64
```

#### 2. Install Maven
Maven 3.6.3+ is required for building the microservices.

```bash
# Install Maven
sudo apt install -y maven

# Verify installation
mvn -version
# Expected: Maven 3.6.3+ with Java 11

# If Maven version is too old, install manually:
# wget https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
# sudo tar xzf apache-maven-3.6.3-bin.tar.gz -C /opt
# sudo ln -s /opt/apache-maven-3.6.3 /opt/maven
# echo 'export PATH=/opt/maven/bin:$PATH' >> ~/.bashrc
# source ~/.bashrc
```

#### 3. Install Docker
Docker is used for SQL Server and Redis containers.

```bash
# Install Docker
sudo apt install -y docker.io

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (avoid sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

#### 4. Install Git
```bash
# Install Git
sudo apt install -y git

# Verify installation
git --version
```

#### 5. Verify Prerequisites
```bash
echo "=== Prerequisites Verification ==="
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
echo "=== Verification Complete ==="
```

---

## 🗄️ Infrastructure Setup

### Step 1: Start SQL Server Container

```bash
# Pull and start SQL Server 2019
docker run -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=Test1234!" \
  -p 1433:1433 \
  --name sqlserver \
  --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2019-latest

# Verify container is running
docker ps | grep sqlserver
```

### Step 2: Create Required Databases

**⚠️ CRITICAL**: Create these databases before starting microservices, or they will fail to start.

```bash
# Create all required databases
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "CREATE DATABASE users; 
      CREATE DATABASE product_catalog; 
      CREATE DATABASE product_recommendations; 
      CREATE DATABASE orders;"

# Verify databases were created
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "SELECT name FROM sys.databases;"
```

### Step 3: Start Redis Container

```bash
# Pull and start Redis
docker run --name redis \
  -p 6379:6379 \
  -d redis:latest

# Verify Redis is running
docker ps | grep redis
```

### Step 4: Verify Infrastructure

```bash
echo "=== Infrastructure Status ==="
echo "SQL Server:"
docker exec sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "SELECT @@VERSION;" 2>/dev/null && echo "✅ Connected" || echo "❌ Failed"

echo -e "\nRedis:"
docker exec redis redis-cli ping 2>/dev/null && echo "✅ Connected" || echo "❌ Failed"

echo -e "\nContainers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 🔨 Build All Microservices

Build all services before starting them to ensure no compilation errors.

```bash
# Navigate to project root
cd /path/to/ecommerce-microservices-java

# Build all services in order
echo "=== Building Eureka Server ==="
cd eureka-server && mvn clean package -DskipTests && cd ..

echo "=== Building User Service ==="
cd user-service && mvn clean package -DskipTests && cd ..

echo "=== Building Product Catalog Service ==="
cd product-catalog-service && mvn clean package -DskipTests && cd ..

echo "=== Building Product Recommendation Service ==="
cd product-recommendation-service && mvn clean package -DskipTests && cd ..

echo "=== Building Order Service ==="
cd order-service && mvn clean package -DskipTests && cd ..

echo "=== Building API Gateway ==="
cd api-gateway && mvn clean package -DskipTests && cd ..

echo "=== All Services Built Successfully ==="
```

---

## 🚀 Start Microservices

**⚠️ IMPORTANT**: Start services in the exact order specified below for proper service registration.

### Phase 1: Start Eureka Server (Service Discovery)

```bash
# Terminal 1: Start Eureka Server
cd eureka-server
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
mvn spring-boot:run

# Wait for this message: "Started EurekaServerApplication"
# Then wait 60 seconds for full initialization
```

**Wait 60 seconds** before proceeding to ensure Eureka Server is fully operational.

### Phase 2: Start Business Services (Parallel)

Open **4 separate terminals** and start these services simultaneously:

```bash
# Terminal 2: User Service
cd user-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
mvn spring-boot:run

# Terminal 3: Product Catalog Service  
cd product-catalog-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
mvn spring-boot:run

# Terminal 4: Product Recommendation Service
cd product-recommendation-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
mvn spring-boot:run

# Terminal 5: Order Service
cd order-service
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
mvn spring-boot:run
```

**Wait 120 seconds** for all services to register with Eureka before starting the API Gateway.

### Phase 3: Start API Gateway (Final Step)

```bash
# Terminal 6: API Gateway
cd api-gateway
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
mvn spring-boot:run

# Wait for: "Started ApiGatewayApplication"
```

---

## ✅ Verification & Testing

### 1. Check Service Registration

Visit the Eureka Dashboard: **http://localhost:8761**

You should see all 5 services registered:
- API-GATEWAY
- USER-SERVICE  
- PRODUCT-CATALOG-SERVICE
- PRODUCT-RECOMMENDATION-SERVICE
- ORDER-SERVICE

### 2. Test API Gateway

Visit: **http://localhost:8900**

Expected response:
```json
{
  "message": "Welcome to RainbowForest E-commerce Microservices Platform",
  "version": "1.0.0",
  "status": "API Gateway is running"
}
```

### 3. Test Individual Services

```bash
# Health checks
curl http://localhost:8761/actuator/health  # Eureka Server
curl http://localhost:8811/actuator/health  # User Service
curl http://localhost:8810/actuator/health  # Product Catalog
curl http://localhost:8812/actuator/health  # Product Recommendation
curl http://localhost:8813/actuator/health  # Order Service
curl http://localhost:8900/actuator/health  # API Gateway

# API endpoints via Gateway
curl http://localhost:8900/api/catalog/products
curl http://localhost:8900/api/accounts/registration
```

### 4. Service Status Summary

```bash
echo "=== Service Status Summary ==="
echo "Eureka Server: http://localhost:8761"
echo "API Gateway: http://localhost:8900"
echo "User Service: http://localhost:8811"
echo "Product Catalog: http://localhost:8810"
echo "Product Recommendation: http://localhost:8812"
echo "Order Service: http://localhost:8813"
echo ""
echo "All services should show 'UP' status in Eureka dashboard"
```

---

## 📊 Sample Data Population (Optional)

### Add Sample Users

```bash
# Create user details
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "USE users;
      INSERT INTO users_details (first_name, last_name, email, phone_number, street, street_number, zip_code, locality, country) 
      VALUES 
        ('John', 'Doe', 'john.doe@email.com', '+1234567890', 'Main Street', '123', '12345', 'New York', 'USA'),
        ('Jane', 'Smith', 'jane.smith@email.com', '+1234567891', 'Oak Avenue', '456', '12346', 'Los Angeles', 'USA'),
        ('Mike', 'Johnson', 'mike.johnson@email.com', '+1234567892', 'Pine Road', '789', '12347', 'Chicago', 'USA');"

# Create user accounts
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "USE users;
      INSERT INTO users (user_name, user_password, active, user_details_id, role_id) 
      VALUES 
        ('johndoe', 'password123', 1, 1, 1),
        ('janesmith', 'password123', 1, 2, 1),
        ('mikejohnson', 'password123', 1, 3, 1);"
```

### Add Sample Products

```bash
# Add product categories
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "USE product_catalog;
      INSERT INTO categories (category_name, category_description) 
      VALUES 
        ('Electronics', 'Electronic devices and gadgets'),
        ('Clothing', 'Fashion and apparel'),
        ('Books', 'Books and literature');"

# Add sample products
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "USE product_catalog;
      INSERT INTO products (product_name, product_description, product_price, units_in_stock, category_id) 
      VALUES 
        ('Laptop Pro', 'High-performance laptop', 1299.99, 50, 1),
        ('Smartphone X', 'Latest smartphone model', 899.99, 100, 1),
        ('Cotton T-Shirt', 'Comfortable cotton t-shirt', 29.99, 200, 2);"
```

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### Issue 1: Port Already in Use
**Error**: `Port 8XXX is already in use`

**Solution**:
```bash
# Find process using the port
sudo netstat -tulpn | grep :8761

# Kill the process
sudo kill -9 <PID>

# Or kill all Java processes
pkill -f java
```

#### Issue 2: Database Connection Failed
**Error**: `Unable to create requested service [JdbcEnvironment]`

**Solutions**:
```bash
# Check SQL Server container
docker ps | grep sqlserver

# Restart SQL Server if needed
docker restart sqlserver

# Verify database exists
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "SELECT name FROM sys.databases;"

# Check database names match application.properties
```

#### Issue 3: Service Not Registering with Eureka
**Error**: Service doesn't appear in Eureka dashboard

**Solutions**:
```bash
# Check Eureka Server is running
curl http://localhost:8761/actuator/health

# Verify service logs for registration messages
# Look for: "Registering application SERVICE-NAME with eureka"

# Check network connectivity
ping localhost
```

#### Issue 4: Maven Build Failures
**Error**: Build compilation errors

**Solutions**:
```bash
# Verify Java version
java -version  # Must be Java 11

# Check JAVA_HOME
echo $JAVA_HOME

# Clean and rebuild
mvn clean compile

# Skip tests if needed
mvn clean package -DskipTests
```

#### Issue 5: Docker Container Issues
**Error**: Container won't start or connect

**Solutions**:
```bash
# Check Docker service
sudo systemctl status docker

# View container logs
docker logs sqlserver
docker logs redis

# Restart containers
docker restart sqlserver redis

# Remove and recreate if needed
docker rm -f sqlserver redis
# Then recreate using setup commands
```

### Emergency Reset Procedure

If everything breaks and you need to start fresh:

```bash
# Stop all services (Ctrl+C in each terminal)

# Kill all Java processes
pkill -f java

# Remove Docker containers
docker rm -f sqlserver redis

# Clean Maven builds
find . -name "target" -type d -exec rm -rf {} +

# Restart from infrastructure setup
```

### Health Check Commands

```bash
# Quick system health check
echo "=== System Health Check ==="

echo "Java:"
java -version 2>&1 | head -1

echo "Maven:"
mvn -version 2>&1 | head -1

echo "Docker:"
docker --version

echo "Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}"

echo "Services:"
for port in 8761 8811 8810 8812 8813 8900; do
  curl -s http://localhost:$port/actuator/health 2>/dev/null && echo "Port $port: ✅" || echo "Port $port: ❌"
done
```

---

## 📚 API Documentation

### Available Endpoints (via API Gateway - Port 8900)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/catalog/products` | GET | List all products |
| `/api/catalog/products/{id}` | GET | Get product by ID |
| `/api/catalog/admin/products` | POST | Add new product (Admin) |
| `/api/accounts/registration` | POST | User registration |
| `/api/accounts/users` | GET | List users |
| `/api/review/recommendations` | GET | Get product recommendations |
| `/api/shop/cart` | GET/POST | Shopping cart operations |
| `/eureka` | GET | Service registry info |

### Sample API Calls

```bash
# Get all products
curl -X GET http://localhost:8900/api/catalog/products

# Register new user
curl -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "user@example.com"
  }'

# Get recommendations (requires authentication)
curl -X GET http://localhost:8900/api/review/recommendations \
  -H "Authorization: Bearer <token>"
```

---

## 🔒 Security Notes

- **Default passwords** are used for development only
- **SQL Server SA password**: `Test1234!`
- **User passwords**: `password123` (hashed in production)
- **Change all passwords** before production deployment
- **Enable HTTPS** for production environments
- **Configure proper authentication** and authorization

---

## 🚀 Production Deployment

For production deployment:

1. **Change all default passwords**
2. **Use external databases** (not Docker containers)
3. **Configure SSL/TLS certificates**
4. **Set up proper logging and monitoring**
5. **Configure load balancing**
6. **Set up CI/CD pipelines**
7. **Enable security features**

---

## 📞 Support & Resources

### Getting Help
1. **Check this troubleshooting guide** first
2. **Verify all prerequisites** are installed correctly
3. **Ensure services start in correct order**
4. **Check service logs** for detailed error messages
5. **Review Eureka dashboard** for service registration status

### Useful Commands Reference

```bash
# View all running Java processes
jps -l

# Check port usage
sudo netstat -tulpn | grep :8XXX

# View Docker container logs
docker logs <container-name>

# Maven clean build
mvn clean package -DskipTests

# Kill all Java processes
pkill -f java
```

### File Structure
```
ecommerce-microservices-java/
├── eureka-server/          # Service discovery
├── api-gateway/           # API routing
├── user-service/          # User management
├── product-catalog-service/    # Product catalog
├── product-recommendation-service/  # Recommendations
├── order-service/         # Order processing
├── SETUP_LINUX.md        # This file
├── SETUP_WINDOWS.md       # Windows setup
└── README.md             # Project overview
```

---

## 🧪 Complete E-commerce Platform Testing

**What this does**: Tests the actual e-commerce functionality to make sure users can register, browse products, and make purchases.

### Complete End-to-End Test

```bash
echo "=========================================="
echo "🧪 COMPLETE E-COMMERCE PLATFORM TEST"
echo "=========================================="

# Test 1: User Registration
echo "=== Test 1: User Registration ==="
curl -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{"userName":"testuser","userPassword":"password123","active":1}' \
  -w "\nHTTP Status: %{http_code}\n"

# Test 2: Product Catalog
echo "=== Test 2: Product Catalog ==="
curl -X GET http://localhost:8900/api/catalog/products \
  -w "\nHTTP Status: %{http_code}\n"

# Test 3: Product Recommendations
echo "=== Test 3: Product Recommendations ==="
curl -X GET "http://localhost:8900/api/review/recommendations?name=MacBook%20Pro%2016" \
  -w "\nHTTP Status: %{http_code}\n"

# Test 4: Service Health Checks
echo "=== Test 4: Service Health Checks ==="
echo "Eureka Server:"
curl -s http://localhost:8761 | grep -q "Eureka" && echo "✅ UP" || echo "❌ DOWN"

echo "API Gateway:"
curl -s http://localhost:8900 | grep -q "Welcome" && echo "✅ UP" || echo "❌ DOWN"

echo "User Service:"
curl -s http://localhost:8811/actuator/health | grep -q "UP" && echo "✅ UP" || echo "❌ DOWN"

echo "Product Catalog:"
curl -s http://localhost:8810/actuator/health | grep -q "UP" && echo "✅ UP" || echo "❌ DOWN"

echo "Product Recommendations:"
curl -s http://localhost:8812/actuator/health | grep -q "UP" && echo "✅ UP" || echo "❌ DOWN"

echo "Order Service:"
curl -s http://localhost:8813/actuator/health | grep -q "UP" && echo "✅ UP" || echo "❌ DOWN"

echo "=========================================="
echo "✅ E-commerce platform test complete!"
echo "=========================================="
```

## 🔧 Common Issues & Solutions

### HTTP 500 User Registration

**Problem**: "Cannot insert the value NULL into column 'user_name'"
**Solution**: Use correct JSON field names: `userName`, `userPassword`, `active`

### HTTP 400 Product Recommendations  

**Problem**: "Required String parameter 'name' is not present"
**Solution**: Always include `?name=productName` parameter

### HTTP 404 API Endpoints

**Problem**: Service registered with Eureka but endpoints return 404
**Solution**: 
1. Check service logs for component scanning issues
2. Verify service is accessible directly on its port
3. Check API Gateway routing configuration
4. Restart the specific microservice if needed

### Database Connection Issues

**Problem**: Services fail to start with database connection errors
**Solution**:
1. Ensure SQL Server container is running: `docker ps`
2. Verify database credentials in application.properties
3. Check if required databases exist in SQL Server
4. Restart services after database issues are resolved

### Port Conflicts

**Problem**: "Port already in use" errors during startup
**Solution**:

```bash
# Find process using the port
lsof -i :8761  # Replace with your port
netstat -tulpn | grep 8761

# Kill the process
kill <PID>

# Force kill if needed
kill -9 <PID>
```

## 🛠️ Comprehensive Troubleshooting Guide

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
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C -Q "SELECT 1"

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
echo "=== Diagnosing Build Issues ==="

# Check Java version
java -version
echo "JAVA_HOME: $JAVA_HOME"

# Verify JAVA_HOME is set correctly
if [ -z "$JAVA_HOME" ]; then
    echo "❌ JAVA_HOME not set"
    export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
    echo "✅ JAVA_HOME set to: $JAVA_HOME"
fi

# Clean and rebuild specific service
cd <service-directory>
mvn clean compile

# If build still fails, try full clean install
mvn clean install -DskipTests

# Check for dependency issues
mvn dependency:tree
```

#### Issue 5: HTTP 500 Internal Server Errors

**Problem**: API calls return HTTP 500 errors.

**Solution**:

```bash
echo "=== Diagnosing HTTP 500 Errors ==="

# Check service logs for stack traces
# Look for error messages in the service terminal output

# Common causes and solutions:
echo "Common HTTP 500 causes:"
echo "1. Database connection issues - check database containers"
echo "2. Missing required fields in JSON requests"
echo "3. Null pointer exceptions - check service logs"
echo "4. Database schema mismatches - verify table structures"

# Test database connectivity from service
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "SELECT name FROM sys.databases;"
```

#### Issue 6: Memory Issues

**Problem**: Services crash with OutOfMemoryError.

**Solution**:

```bash
echo "=== Checking System Resources ==="

# Check available memory
free -h

# Check Java processes memory usage
ps aux | grep java | awk '{print $2, $4, $11}' | sort -k2 -nr

# If memory is low, increase JVM heap size
export MAVEN_OPTS="-Xmx1024m -Xms512m"

# Or start services with specific memory settings
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx512m"
```

#### Issue 7: Complete System Reset

**Problem**: Multiple issues, need fresh start.

**Solution**:

```bash
echo "=== Complete System Reset ==="

# Stop all services (Ctrl+C in all terminals)
echo "1. Stop all running services"

# Stop and remove containers
docker stop sqlserver redis 2>/dev/null || true
docker rm sqlserver redis 2>/dev/null || true

# Clean Maven builds
find . -name "target" -type d -exec rm -rf {} + 2>/dev/null || true

# Restart containers
echo "2. Restarting infrastructure..."
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Test1234!" \
  -p 1433:1433 --name sqlserver --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2019-latest

docker run --name redis -p 6379:6379 -d redis:latest

# Wait for containers to start
sleep 30

# Recreate databases
echo "3. Recreating databases..."
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "CREATE DATABASE users; CREATE DATABASE product_catalog; CREATE DATABASE product_recommendations; CREATE DATABASE orders;"

echo "=== Reset Complete - Ready for Fresh Setup ==="
```

## 🌐 Complete API Reference

All API endpoints require the `/api` prefix when accessed through the API Gateway.

### User Management (`/api/accounts/**`)

#### User Registration
- **Endpoint**: `POST /api/accounts/registration`
- **Description**: Register a new user account
- **Request Body**:
```json
{
  "userName": "string",
  "userPassword": "string", 
  "active": 1
}
```
- **Response**: User registration confirmation
- **Example**:
```bash
curl -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{"userName":"newuser","userPassword":"password123","active":1}'
```

#### User Login
- **Endpoint**: `POST /api/accounts/login`
- **Description**: Authenticate user and create session
- **Request Body**:
```json
{
  "userName": "string",
  "userPassword": "string"
}
```
- **Response**: Authentication token/session
- **Example**:
```bash
curl -X POST http://localhost:8900/api/accounts/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"johndoe","userPassword":"password123"}'
```

#### User Profile Management
- **Get Profile**: `GET /api/accounts/profile`
- **Update Profile**: `PUT /api/accounts/profile`
- **Delete Account**: `DELETE /api/accounts/profile`

### Product Catalog (`/api/catalog/**`)

#### Get All Products
- **Endpoint**: `GET /api/catalog/products`
- **Description**: Retrieve all available products
- **Query Parameters**: 
  - `category` (optional): Filter by product category
  - `page` (optional): Page number for pagination
  - `size` (optional): Number of items per page
- **Example**:
```bash
# Get all products
curl -X GET http://localhost:8900/api/catalog/products

# Get products by category
curl -X GET "http://localhost:8900/api/catalog/products?category=Electronics"

# Get paginated results
curl -X GET "http://localhost:8900/api/catalog/products?page=0&size=10"
```

#### Get Product by ID
- **Endpoint**: `GET /api/catalog/products/{id}`
- **Description**: Retrieve specific product details
- **Path Parameters**: `id` - Product ID
- **Example**:
```bash
curl -X GET http://localhost:8900/api/catalog/products/1
```

#### Product Management (Admin Only)
- **Create Product**: `POST /api/catalog/products`
- **Update Product**: `PUT /api/catalog/products/{id}`
- **Delete Product**: `DELETE /api/catalog/products/{id}`

### Shopping Cart & Orders (`/api/shop/**`)

#### Cart Management
- **Get Cart**: `GET /api/shop/cart`
- **Add to Cart**: `POST /api/shop/cart?productId={id}&quantity={qty}`
- **Update Cart Item**: `PUT /api/shop/cart/{itemId}`
- **Remove from Cart**: `DELETE /api/shop/cart/{itemId}`
- **Clear Cart**: `DELETE /api/shop/cart`

**Examples**:
```bash
# Get user's cart (requires session)
curl -X GET http://localhost:8900/api/shop/cart \
  -H "Cookie: JSESSIONID=your-session-id"

# Add item to cart
curl -X POST "http://localhost:8900/api/shop/cart?productId=1&quantity=2" \
  -H "Cookie: JSESSIONID=your-session-id"

# Update cart item quantity
curl -X PUT http://localhost:8900/api/shop/cart/1 \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=your-session-id" \
  -d '{"quantity": 3}'
```

#### Order Processing
- **Checkout**: `POST /api/shop/checkout`
- **Get Orders**: `GET /api/shop/orders`
- **Get Order Details**: `GET /api/shop/orders/{id}`
- **Cancel Order**: `PUT /api/shop/orders/{id}/cancel`

### Product Recommendations (`/api/review/**`)

#### Get Recommendations
- **Endpoint**: `GET /api/review/recommendations`
- **Description**: Get product recommendations based on user behavior
- **Required Parameters**: `name` - Product name to get recommendations for
- **Example**:
```bash
# Get recommendations for MacBook
curl -X GET "http://localhost:8900/api/review/recommendations?name=MacBook%20Pro%2016"

# Get recommendations for books
curl -X GET "http://localhost:8900/api/review/recommendations?name=Clean%20Code%20Book"
```

#### Submit Product Review
- **Endpoint**: `POST /api/review/reviews`
- **Description**: Submit a product review and rating
- **Request Body**:
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Excellent product!"
}
```

## 🔧 Advanced Configuration

### Database Configuration Details

#### SQL Server Configuration
- **Host**: localhost
- **Port**: 1433
- **Username**: sa
- **Password**: Test1234!
- **Databases**: 
  - `users` - User accounts and authentication
  - `product_catalog` - Product information and categories
  - `product_recommendations` - User ratings and recommendations
  - `orders` - Shopping cart and order data

#### Redis Configuration
- **Host**: localhost
- **Port**: 6379
- **Usage**: Session storage, caching, temporary data

### Service Port Configuration

| Service | Port | Health Check | Direct Access |
|---------|------|--------------|---------------|
| Eureka Server | 8761 | http://localhost:8761 | Dashboard available |
| User Service | 8811 | http://localhost:8811/actuator/health | Direct API access |
| Product Catalog | 8810 | http://localhost:8810/actuator/health | Direct API access |
| Product Recommendations | 8812 | http://localhost:8812/actuator/health | Direct API access |
| Order Service | 8813 | http://localhost:8813/actuator/health | Direct API access |
| API Gateway | 8900 | http://localhost:8900 | Main entry point |

### Environment Variables for Production

For production deployment, replace hardcoded values with environment variables:

```bash
# Database configuration
export DB_HOST=your-database-host
export DB_PORT=1433
export DB_USERNAME=your-username
export DB_PASSWORD=your-secure-password

# Redis configuration
export REDIS_HOST=your-redis-host
export REDIS_PORT=6379

# Service discovery
export EUREKA_SERVER_URL=http://your-eureka-server:8761/eureka

# Security
export JWT_SECRET=your-jwt-secret
export SESSION_SECRET=your-session-secret
```

## 🔒 Security Features & Best Practices

### Current Security Implementation

- **Authentication**: Basic authentication for protected endpoints
- **Session Management**: Redis-based sessions with secure cookies
- **CORS**: Configured for cross-origin requests
- **Security Headers**: XSS protection, content type options, frame options
- **Input Validation**: Server-side validation for all API endpoints

### Development vs Production Security

**⚠️ Development Environment**: This setup uses hardcoded passwords for development convenience.

**🔒 Production Requirements**:
- Use environment variables for all credentials
- Implement proper SSL/TLS encryption
- Use secure password hashing (bcrypt with high rounds)
- Enable proper authentication and authorization
- Implement rate limiting
- Add API key authentication
- Use secure session configuration
- Enable HTTPS only
- Implement proper logging and monitoring

### Security Checklist for Production

```bash
# 1. Update all default passwords
# 2. Enable HTTPS/SSL
# 3. Configure firewall rules
# 4. Set up proper logging
# 5. Enable security headers
# 6. Implement rate limiting
# 7. Use secure session configuration
# 8. Add API authentication
# 9. Enable database encryption
# 10. Set up monitoring and alerts
```

## 📊 Monitoring & Health Checks

### Service Health Monitoring

#### Automated Health Check Script

```bash
#!/bin/bash
# health_check.sh - Monitor all microservices

echo "=========================================="
echo "🏥 MICROSERVICES HEALTH CHECK"
echo "=========================================="

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_text=$3
    
    if curl -s "$url" | grep -q "$expected_text"; then
        echo "✅ $service_name: HEALTHY"
        return 0
    else
        echo "❌ $service_name: UNHEALTHY"
        return 1
    fi
}

# Check all services
check_service "Eureka Server" "http://localhost:8761" "Eureka"
check_service "API Gateway" "http://localhost:8900" "Welcome"
check_service "User Service" "http://localhost:8811/actuator/health" "UP"
check_service "Product Catalog" "http://localhost:8810/actuator/health" "UP"
check_service "Product Recommendations" "http://localhost:8812/actuator/health" "UP"
check_service "Order Service" "http://localhost:8813/actuator/health" "UP"

# Check database connectivity
echo "=== Database Health ==="
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C -Q "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ SQL Server: HEALTHY"
else
    echo "❌ SQL Server: UNHEALTHY"
fi

docker exec -it redis redis-cli ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Redis: HEALTHY"
else
    echo "❌ Redis: UNHEALTHY"
fi

echo "=========================================="
echo "Health check complete!"
echo "=========================================="
```

### Performance Monitoring

#### Resource Usage Monitoring

```bash
# Monitor system resources
echo "=== System Resource Usage ==="
echo "Memory usage:"
free -h

echo "CPU usage:"
top -bn1 | grep "Cpu(s)"

echo "Disk usage:"
df -h

echo "Java processes:"
ps aux | grep java | grep -v grep
```

#### Service Response Time Testing

```bash
# Test API response times
echo "=== API Response Time Testing ==="

# Test API Gateway
time curl -s http://localhost:8900 > /dev/null

# Test Product Catalog
time curl -s http://localhost:8900/api/catalog/products > /dev/null

# Test Recommendations
time curl -s "http://localhost:8900/api/review/recommendations?name=MacBook" > /dev/null
```

## 🚀 Production Deployment Guide

### Docker Containerization

#### Creating Docker Images

Each service can be containerized using custom Dockerfiles:

```dockerfile
# Example Dockerfile for a microservice
FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Docker Compose for Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  eureka-server:
    build: ./eureka-server
    ports:
      - "8761:8761"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    
  api-gateway:
    build: ./api-gateway
    ports:
      - "8900:8900"
    depends_on:
      - eureka-server
    environment:
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka
      
  # Additional services...
```

### Load Balancing & Scaling

The platform supports horizontal scaling:

```bash
# Scale services using Docker Compose
docker-compose up --scale user-service=3 --scale product-catalog-service=2

# Or using Kubernetes
kubectl scale deployment user-service --replicas=3
kubectl scale deployment product-catalog-service --replicas=2
```

### SSL/HTTPS Configuration

```bash
# Generate SSL certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Configure Spring Boot for HTTPS
# Add to application.properties:
# server.ssl.key-store=classpath:keystore.p12
# server.ssl.key-store-password=password
# server.ssl.keyStoreType=PKCS12
# server.ssl.keyAlias=tomcat
```

## 📝 Development Notes & Technical Details

### Technology Stack Details

- **Java**: OpenJDK 11 (LTS version for stability)
- **Framework**: Spring Boot 2.1.5, Spring Cloud Greenwich.SR1
- **Database**: Microsoft SQL Server 2019 (containerized)
- **Cache**: Redis (latest, containerized)
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Build Tool**: Maven 3.6+
- **Container Platform**: Docker

### Key Architecture Decisions

1. **Microservices Pattern**: Each business domain has its own service
2. **Service Discovery**: Eureka for dynamic service registration
3. **API Gateway**: Single entry point for all client requests
4. **Database per Service**: Each microservice has its own database
5. **Shared Session Store**: Redis for cross-service session management

### Database Schema Overview

#### Users Database
- `users` - User accounts
- `user_role` - User roles (USER, ADMIN, PREMIUM_USER)
- `users_details` - Extended user information

#### Product Catalog Database
- `product` - Product information
- `product_category` - Product categories

#### Product Recommendations Database
- `product_recommendation` - User ratings and recommendations

#### Orders Database
- `orders` - Order information
- `order_items` - Individual order items

### Key Fixes Applied During Development

1. **Java Version Standardization**: All services use Java 11 for compatibility
2. **Database Configuration**: Fixed database name mismatches between services and setup instructions
3. **Eureka Registration**: Improved service discovery configuration
4. **API Gateway Routing**: Enhanced request routing and CORS configuration
5. **Error Handling**: Added comprehensive error handling and logging
6. **Session Management**: Configured Redis for proper session handling

## 📞 Support & Troubleshooting

### Getting Help

For issues or questions:
1. **Check this troubleshooting guide** - Most common issues are covered above
2. **Verify prerequisites** - Ensure all required software is installed correctly
3. **Check service startup order** - Services must be started in the correct sequence
4. **Review service logs** - Check terminal output for detailed error messages
5. **Test infrastructure** - Verify SQL Server and Redis containers are running

### Common Error Patterns

#### Connection Refused Errors
- **Cause**: Service not started or wrong port
- **Solution**: Check service status and port configuration

#### Database Connection Errors
- **Cause**: SQL Server container not running or wrong credentials
- **Solution**: Restart containers and verify database creation

#### Eureka Registration Issues
- **Cause**: Network connectivity or timing issues
- **Solution**: Restart services in correct order with proper delays

#### HTTP 404 Errors
- **Cause**: API Gateway routing issues or service not registered
- **Solution**: Check Eureka dashboard and service logs

### Debug Mode

Enable debug logging by adding to application.properties:

```properties
logging.level.com.yourpackage=DEBUG
logging.level.org.springframework.cloud=DEBUG
logging.level.com.netflix.eureka=DEBUG
```

## 📄 License & Legal

This project is part of the RainbowForest organization. Please refer to the original repository for license information.

### Third-Party Dependencies

- Spring Boot - Apache License 2.0
- Spring Cloud - Apache License 2.0
- Netflix Eureka - Apache License 2.0
- Microsoft SQL Server JDBC Driver - MIT License
- Redis - BSD License

---

**🎉 Congratulations!** You now have a fully functional e-commerce microservices platform running on your Ubuntu/Debian system.

The platform includes service discovery, API gateway routing, user management, product catalog, recommendations, and order processing - all working together as a complete e-commerce solution.
