# RainbowForest E-commerce Microservices Platform
## macOS Setup Guide

A complete Spring Boot microservices-based e-commerce platform with service discovery, API gateway, and distributed session management.

> **🍎 macOS Systems Only**: This guide is specifically designed for macOS 10.15+ (Catalina and later) using the Homebrew package manager.  
> For other platforms, see: [Windows Setup](SETUP_WINDOWS.md) | [Linux Setup](SETUP_LINUX.md)

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
- **OS**: macOS 10.15+ (Catalina, Big Sur, Monterey, Ventura, Sonoma)
- **RAM**: Minimum 8GB (recommended 16GB)
- **Storage**: 5GB free space
- **Network**: Internet connection for downloading dependencies

### Required Software Installation

#### 1. Install Homebrew Package Manager
Homebrew is the most popular package manager for macOS.

```bash
# Check if Homebrew is already installed
brew --version

# If not installed, install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# For Apple Silicon Macs, add Homebrew to PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# For Intel Macs, Homebrew is installed to /usr/local and should be in PATH automatically

# Update Homebrew
brew update

# Verify installation
brew --version
```

#### 2. Install Java 11
Java 11 is required for this project. Newer versions may cause compatibility issues.

```bash
# Install Java 11 using Homebrew
brew install openjdk@11

# Create symlink for system Java wrappers
sudo ln -sfn /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk

# For Intel Macs, use:
# sudo ln -sfn /usr/local/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk

# Set JAVA_HOME environment variable
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home

# Make it permanent
echo 'export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home' >> ~/.zshrc
source ~/.zshrc

# Verify installation
java -version
# Expected output: openjdk version "11.x.x"

# Verify JAVA_HOME
echo $JAVA_HOME
# Expected output: /Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
```

#### 3. Install Maven
Maven 3.6.3+ is required for building the microservices.

```bash
# Install Maven using Homebrew
brew install maven

# Verify installation
mvn -version
# Expected: Maven 3.6.3+ with Java 11

# If you need a specific Maven version, you can install manually:
# brew install maven@3.6
# brew link maven@3.6 --force
```

#### 4. Install Docker Desktop
Docker is used for SQL Server and Redis containers.

```bash
# Install Docker Desktop using Homebrew Cask
brew install --cask docker

# Alternative: Download from https://www.docker.com/products/docker-desktop

# Start Docker Desktop application
open /Applications/Docker.app

# Wait for Docker to start (check the menu bar icon)
# Verify installation
docker --version
docker run hello-world
```

#### 5. Install Git
```bash
# Install Git using Homebrew (if not already installed)
brew install git

# Verify installation
git --version
```

#### 6. Verify Prerequisites
```bash
echo "=== Prerequisites Verification ==="
echo "Java version:"
java -version
echo ""
echo "Maven version:"
mvn -version
echo ""
echo "Docker version:"
docker --version
echo ""
echo "Git version:"
git --version
echo ""
echo "JAVA_HOME:"
echo $JAVA_HOME
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
      CREATE DATABASE products; 
      CREATE DATABASE recommendations; 
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
echo "Docker containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "SQL Server databases:"
docker exec sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "SELECT name FROM sys.databases WHERE name IN ('users', 'products', 'recommendations', 'orders');"

echo ""
echo "Redis connection test:"
docker exec redis redis-cli ping
```

---

## 🚀 Build and Deploy Microservices

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/raimonvibe/ecommerce-microservices-java.git
cd ecommerce-microservices-java

# Verify project structure
ls -la
```

### Step 2: Build All Microservices

**⚠️ IMPORTANT**: Build all services before starting any of them.

```bash
# Build Eureka Server
cd eureka-server
mvn clean compile -DskipTests
cd ..

# Build User Service
cd user-service
mvn clean compile -DskipTests
cd ..

# Build Product Catalog Service
cd product-catalog-service
mvn clean compile -DskipTests
cd ..

# Build Product Recommendation Service
cd product-recommendation-service
mvn clean compile -DskipTests
cd ..

# Build Order Service
cd order-service
mvn clean compile -DskipTests
cd ..

# Build API Gateway
cd api-gateway
mvn clean compile -DskipTests
cd ..

echo "=== All microservices built successfully ==="
```

### Step 3: Start Microservices

**⚠️ CRITICAL**: Start services in this exact order. Each service must be fully started before starting the next one.

#### 3.1 Start Eureka Server (Service Discovery)
```bash
cd eureka-server
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
mvn spring-boot:run

# Wait for "Started EurekaServerApplication" message
# Keep this terminal open and running
```

#### 3.2 Start User Service
Open a new terminal window:
```bash
cd ecommerce-microservices-java/user-service
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
mvn spring-boot:run

# Wait for "Started UserServiceApplication" message
# Keep this terminal open and running
```

#### 3.3 Start Product Catalog Service
Open a new terminal window:
```bash
cd ecommerce-microservices-java/product-catalog-service
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
mvn spring-boot:run

# Wait for "Started ProductCatalogServiceApplication" message
# Keep this terminal open and running
```

#### 3.4 Start Product Recommendation Service
Open a new terminal window:
```bash
cd ecommerce-microservices-java/product-recommendation-service
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
mvn spring-boot:run

# Wait for "Started ProductRecommendationServiceApplication" message
# Keep this terminal open and running
```

#### 3.5 Start Order Service
Open a new terminal window:
```bash
cd ecommerce-microservices-java/order-service
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
mvn spring-boot:run

# Wait for "Started OrderServiceApplication" message
# Keep this terminal open and running
```

#### 3.6 Start API Gateway
Open a new terminal window:
```bash
cd ecommerce-microservices-java/api-gateway
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
mvn spring-boot:run

# Wait for "Started ApiGatewayApplication" message
# Keep this terminal open and running
```

---

## ✅ Verification and Testing

### Step 1: Verify Service Registration

Open your web browser and navigate to:
```
http://localhost:8761
```

You should see the **Eureka Dashboard** with all 5 microservices registered:
- API-GATEWAY
- USER-SERVICE  
- PRODUCT-CATALOG-SERVICE
- PRODUCT-RECOMMENDATION-SERVICE
- ORDER-SERVICE

All services should show status **UP**.

### Step 2: Test API Gateway

Navigate to:
```
http://localhost:8900
```

You should see a JSON response with available endpoints and platform information.

### Step 3: Test Individual Services

#### User Service
```bash
# Test user registration endpoint
curl -X GET http://localhost:8900/api/accounts/users

# Test direct service (bypass gateway)
curl -X GET http://localhost:8811/users
```

#### Product Catalog Service
```bash
# Test product catalog endpoint
curl -X GET http://localhost:8900/api/catalog/products

# Test direct service (bypass gateway)
curl -X GET http://localhost:8810/products
```

#### Product Recommendation Service
```bash
# Test recommendations endpoint
curl -X GET http://localhost:8900/api/review/recommendations

# Test direct service (bypass gateway)
curl -X GET http://localhost:8812/recommendations
```

#### Order Service
```bash
# Test order service endpoint
curl -X GET http://localhost:8900/api/shop/cart

# Test direct service (bypass gateway)
curl -X GET http://localhost:8813/orders
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. Java Version Issues
```bash
# Check Java version
java -version

# If wrong version, ensure JAVA_HOME is set correctly
echo $JAVA_HOME

# Reset JAVA_HOME if needed
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
```

#### 2. Port Already in Use
```bash
# Check what's using a port (e.g., 8761)
lsof -i :8761

# Kill process if needed
kill -9 <PID>
```

#### 3. Docker Issues
```bash
# Restart Docker Desktop
# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Restart infrastructure
# Follow Step 1-3 in Infrastructure Setup
```

#### 4. Database Connection Issues
```bash
# Verify SQL Server is running
docker ps | grep sqlserver

# Test database connection
docker exec sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "SELECT @@VERSION;"

# Recreate databases if needed
docker exec sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "Test1234!" -C \
  -Q "DROP DATABASE IF EXISTS users; CREATE DATABASE users;"
```

#### 5. Service Registration Issues
```bash
# Check Eureka Server logs
# Look for registration messages in service logs
# Ensure services start in correct order
# Wait for each service to fully start before starting the next
```

### Service Startup Order Issues

If services fail to register with Eureka:

1. **Stop all services** (Ctrl+C in each terminal)
2. **Restart Eureka Server first**
3. **Wait 30 seconds** for Eureka to fully initialize
4. **Start other services one by one** with 10-second intervals

### Memory Issues

If you encounter OutOfMemoryError:

```bash
# Increase Maven memory
export MAVEN_OPTS="-Xmx2048m -XX:MaxPermSize=512m"

# Or start services with more memory
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx1024m"
```

---

## 🔧 Configuration Details

### Database Configuration

Each microservice connects to its own database:

| Service | Database Name | Port |
|---------|---------------|------|
| User Service | `users` | 1433 |
| Product Catalog Service | `products` | 1433 |
| Product Recommendation Service | `recommendations` | 1433 |
| Order Service | `orders` | 1433 |

**Database Connection String:**
```
jdbc:sqlserver://localhost;databaseName={database_name}
Username: sa
Password: Test1234!
```

### Service Ports

| Service | Port | URL |
|---------|------|-----|
| Eureka Server | 8761 | http://localhost:8761 |
| API Gateway | 8900 | http://localhost:8900 |
| User Service | 8811 | http://localhost:8811 |
| Product Catalog Service | 8810 | http://localhost:8810 |
| Product Recommendation Service | 8812 | http://localhost:8812 |
| Order Service | 8813 | http://localhost:8813 |

### Redis Configuration
- **Host:** localhost
- **Port:** 6379
- **No authentication required**

---

## 📚 API Documentation

### Available Endpoints (via API Gateway)

All endpoints are accessible through the API Gateway at `http://localhost:8900`:

#### User Management
- `GET /api/accounts/users` - List all users
- `POST /api/accounts/registration` - Register new user
- `GET /api/accounts/users/{id}` - Get user by ID

#### Product Catalog
- `GET /api/catalog/products` - List all products
- `GET /api/catalog/products/{id}` - Get product by ID
- `POST /api/catalog/admin/products` - Add new product (admin)

#### Product Recommendations
- `GET /api/review/recommendations` - Get product recommendations
- `GET /api/review/recommendations/{userId}` - Get recommendations for user

#### Order Management
- `GET /api/shop/cart` - Get shopping cart
- `POST /api/shop/cart` - Add item to cart
- `GET /api/shop/orders` - List orders
- `POST /api/shop/orders` - Create new order

#### Service Discovery
- `GET /eureka` - Access Eureka dashboard

### Direct Service Access

You can also access services directly (bypassing the API Gateway):

- User Service: `http://localhost:8811`
- Product Catalog: `http://localhost:8810`
- Product Recommendations: `http://localhost:8812`
- Order Service: `http://localhost:8813`

---

## 🚀 Production Deployment

### Environment Variables

For production deployment, set these environment variables:

```bash
# Database Configuration
export DB_HOST=your-sql-server-host
export DB_PORT=1433
export DB_USERNAME=your-username
export DB_PASSWORD=your-secure-password

# Redis Configuration
export REDIS_HOST=your-redis-host
export REDIS_PORT=6379

# Eureka Configuration
export EUREKA_SERVER_URL=http://your-eureka-server:8761/eureka
```

### Docker Compose (Alternative)

For easier deployment, you can use Docker Compose:

```yaml
version: '3.8'
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=Test1234!
    ports:
      - "1433:1433"
    
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
```

---

## 📞 Support

### Getting Help

1. **Check logs** in each service terminal for error messages
2. **Verify prerequisites** are correctly installed
3. **Ensure correct startup order** (Eureka first, then others)
4. **Check port availability** using `lsof -i :PORT`
5. **Verify database connectivity** using SQL Server tools

### Common Error Messages

- `Connection refused` → Service not started or wrong port
- `Database does not exist` → Run database creation commands
- `Service registration failed` → Eureka Server not running
- `Port already in use` → Kill existing process or use different port

---

## 🎯 Next Steps

Once the platform is running successfully:

1. **Explore the APIs** using the endpoints listed above
2. **Add sample data** through the admin endpoints
3. **Test the complete flow** from user registration to order placement
4. **Monitor services** through the Eureka dashboard
5. **Scale services** by running multiple instances on different ports

---

**🎉 Congratulations!** Your RainbowForest E-commerce Microservices Platform is now running on macOS!

For questions or issues, please refer to the troubleshooting section or check the individual service logs for detailed error information.
