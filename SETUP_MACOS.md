# RainbowForest E-commerce Microservices Platform - macOS Setup

A complete Spring Boot microservices-based e-commerce platform with service discovery, API gateway, and distributed session management.

**🍎 This guide is specifically for macOS systems. For Windows setup, see [SETUP_WINDOWS.md](SETUP_WINDOWS.md). For Ubuntu/Debian setup, see [SETUP_README.md](SETUP_README.md).**

## 🏗️ Architecture Overview

This platform consists of 6 microservices that work together to provide a complete e-commerce solution:

- **Eureka Server** (Port 8761) - Service registry and discovery (finds and manages all services)
- **API Gateway** (Port 8900) - Main entry point with Zuul routing (single access point for all APIs)
- **User Service** (Port 8811) - User management and authentication (handles user accounts and login)
- **Product Catalog Service** (Port 8810) - Product management (manages product inventory)
- **Product Recommendation Service** (Port 8812) - Product recommendations (suggests products to users)
- **Order Service** (Port 8813) - Shopping cart and order management (handles purchases and orders)

## 📋 Prerequisites - Complete Installation Guide for macOS

**🍎 macOS 10.15+ Systems**: This guide is designed for macOS Catalina (10.15) and later versions, including macOS Big Sur, Monterey, Ventura, and Sonoma. Commands use Terminal and Homebrew package manager.

### Step 1: Install Homebrew Package Manager

Homebrew is the most popular package manager for macOS that makes installing software much easier.

**Open Terminal** (Applications → Utilities → Terminal or press Cmd+Space and type "Terminal")

```bash
# Check if Homebrew is already installed
brew --version
# If you get an error, Homebrew is not installed

# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Follow the installation prompts and enter your password when requested

# Add Homebrew to your PATH (for Apple Silicon Macs)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# For Intel Macs, Homebrew is installed to /usr/local and should be in PATH automatically

# Verify installation
brew --version
# Should show Homebrew version

# Update Homebrew
brew update
```

### Step 2: Install Java 11

Java 11 is required for this project (newer versions may cause compatibility issues).

```bash
# Install Java 11 using Homebrew
brew install openjdk@11

# Create symlink for system Java wrappers to find this JDK
sudo ln -sfn /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk

# For Intel Macs, use this path instead:
# sudo ln -sfn /usr/local/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk

# Add Java to your PATH and set JAVA_HOME
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zprofile
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@11"' >> ~/.zprofile

# For Intel Macs, use these paths instead:
# echo 'export PATH="/usr/local/opt/openjdk@11/bin:$PATH"' >> ~/.zprofile
# echo 'export JAVA_HOME="/usr/local/opt/openjdk@11"' >> ~/.zprofile

# Reload your shell configuration
source ~/.zprofile

# Verify installation
java -version
# Should show: openjdk version "11.x.x"

# Check JAVA_HOME is set correctly
echo $JAVA_HOME
# Should show Java installation path
```

### Step 3: Install Maven

Maven is the build tool used to compile and run the microservices.

```bash
# Install Maven using Homebrew
brew install maven

# Verify installation
mvn -version
# Should show Maven version 3.6+ and Java 11

# If mvn command is not found, reload your shell
source ~/.zprofile
mvn -version
```

### Step 4: Install Docker Desktop

Docker Desktop is used to run SQL Server and Redis databases on macOS.

```bash
# Install Docker Desktop using Homebrew Cask
brew install --cask docker

# Alternative: Download manually from https://www.docker.com/products/docker-desktop/

# Start Docker Desktop
open /Applications/Docker.app

# Wait for Docker Desktop to start (you'll see the Docker whale icon in your menu bar)

# Verify Docker is running
docker --version
# Should show Docker version

# Test Docker installation
docker run hello-world
# Should download and run a test container successfully
```

**⚠️ Important**: Make sure Docker Desktop is running (whale icon in menu bar) before proceeding to the next steps.

### Step 5: Install Git (if not already installed)

Git is usually pre-installed on macOS, but you can install the latest version via Homebrew.

```bash
# Check if Git is installed
git --version

# Install latest Git (optional, if you want the newest version)
brew install git

# Verify installation
git --version
```

## 🚀 Quick Start Guide

**⚡ Fast Track**: If you have all prerequisites installed, follow these steps to get the platform running quickly.

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/raimonvibe/ecommerce-microservices-java.git

# Navigate to project directory
cd ecommerce-microservices-java

# Verify you're in the right directory
ls -la
# Should show microservice directories and setup files
```

### Step 2: Infrastructure Setup (SQL Server + Redis)

**What this does**: Sets up the required databases (SQL Server for data storage, Redis for session management).

```bash
echo "=== Setting up Infrastructure (SQL Server + Redis) ==="

# Start SQL Server container
echo "Starting SQL Server..."
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Test1234!" \
   -p 1433:1433 --name sqlserver --hostname sqlserver \
   -d mcr.microsoft.com/mssql/server:2019-latest

# Start Redis container
echo "Starting Redis..."
docker run --name redis -p 6379:6379 -d redis:6.2-alpine

# Wait for containers to start
echo "Waiting for containers to initialize..."
sleep 30

# Verify containers are running
docker ps | grep -E "(sqlserver|redis)"

echo "✅ Infrastructure setup complete!"
```

### Step 3: Create Databases

**What this does**: Creates the required databases for each microservice.

```bash
echo "=== Creating Databases ==="

# Wait a bit more for SQL Server to be fully ready
sleep 30

# Create databases
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Test1234! -C -Q "
CREATE DATABASE users;
CREATE DATABASE product_catalog;
CREATE DATABASE product_recommendations;
CREATE DATABASE orders;
"

echo "✅ Databases created successfully!"
```

### Step 4: Start Services (Requires 6 Terminal Windows)

**⚠️ Important**: You need to open 6 separate Terminal windows/tabs for this step. Each service runs in its own terminal.

**Terminal 1 - Eureka Server (Service Registry)**
```bash
cd ecommerce-microservices-java/eureka-server
mvn spring-boot:run
```

**Wait 60 seconds** for Eureka to fully start, then open the next terminals:

**Terminal 2 - User Service**
```bash
cd ecommerce-microservices-java/user-service
mvn spring-boot:run
```

**Terminal 3 - Product Catalog Service**
```bash
cd ecommerce-microservices-java/product-catalog-service
mvn spring-boot:run
```

**Terminal 4 - Product Recommendation Service**
```bash
cd ecommerce-microservices-java/product-recommendation-service
mvn spring-boot:run
```

**Terminal 5 - Order Service**
```bash
cd ecommerce-microservices-java/order-service
mvn spring-boot:run
```

**Wait 2 minutes** for all business services to register with Eureka, then:

**Terminal 6 - API Gateway (Main Entry Point)**
```bash
cd ecommerce-microservices-java/api-gateway
mvn spring-boot:run
```

### Step 5: Verify Everything is Running

**What this does**: Checks that all services are up and registered properly.

```bash
echo "=== Verifying Platform Status ==="

# Check Eureka Dashboard (should show all 5 services registered)
echo "Opening Eureka Dashboard..."
open http://localhost:8761

# Check API Gateway (main entry point)
echo "Testing API Gateway..."
curl -s http://localhost:8900 && echo "✅ API Gateway is responding"

# Check individual service health
echo "Checking service health..."
curl -s http://localhost:8811/actuator/health | grep -q "UP" && echo "✅ User Service: UP"
curl -s http://localhost:8810/actuator/health | grep -q "UP" && echo "✅ Product Catalog: UP"
curl -s http://localhost:8812/actuator/health | grep -q "UP" && echo "✅ Product Recommendation: UP"
curl -s http://localhost:8813/actuator/health | grep -q "UP" && echo "✅ Order Service: UP"

echo "🎉 Platform is ready! Access it at: http://localhost:8900"
```

## 🧪 Testing the Platform

**What this section covers**: Complete testing procedures to verify all functionality works correctly. Run these tests to make sure users can register, browse products, and make purchases.

**⚠️ Important**: These tests use the API Gateway (http://localhost:8900) as the main entry point, just like real users would.

### Step 1: Test User Registration

**What this does**: Creates a new user account in the system.

```bash
echo "=== Testing User Registration ==="

# Register a new user
curl -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{"userName":"testuser","userPassword":"password123","active":1}' \
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
  -d '{"productName":"MacBook Pro","price":2499.99,"discription":"Apple MacBook Pro with M2 chip","category":"Electronics","availability":5}' \
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
  -d '{"userName":"testuser2","userPassword":"password123","active":1}' \
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

## 🛠️ Troubleshooting Guide for macOS

**What this section covers**: Solutions to common problems you might encounter during setup or operation on macOS.

### 🚨 Common macOS-Specific Issues and Solutions

#### Issue 1: Homebrew Installation Problems

**Problem**: Homebrew installation fails or commands not found after installation.

**Solution**:
```bash
# Check if Homebrew is in your PATH
echo $PATH | grep -E "(homebrew|brew)"

# For Apple Silicon Macs, add Homebrew to PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile

# For Intel Macs, Homebrew should be at /usr/local/bin
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile

# Verify Homebrew is working
brew doctor

# Fix common Homebrew issues
brew update
brew upgrade
```

#### Issue 2: Java/Maven Not Found After Installation

**Problem**: Commands like `java` or `mvn` are not recognized after Homebrew installation.

**Solution**:
```bash
# Check current Java version
java -version

# Check JAVA_HOME
echo $JAVA_HOME

# For Apple Silicon Macs, set correct paths
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zprofile
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@11"' >> ~/.zprofile

# For Intel Macs, use these paths
echo 'export PATH="/usr/local/opt/openjdk@11/bin:$PATH"' >> ~/.zprofile
echo 'export JAVA_HOME="/usr/local/opt/openjdk@11"' >> ~/.zprofile

# Reload shell configuration
source ~/.zprofile

# Verify Maven can find Java
mvn -version
```

#### Issue 3: Docker Desktop Not Starting

**Problem**: Docker Desktop fails to start or containers won't run.

**Solution**:
```bash
# Check if Docker Desktop is running
docker info

# If not running, start Docker Desktop
open /Applications/Docker.app

# Wait for Docker to start (watch for whale icon in menu bar)
sleep 30

# Check Docker status
docker ps

# If still having issues, restart Docker Desktop
pkill -f Docker
sleep 10
open /Applications/Docker.app

# Verify Docker is working
docker run hello-world
```

#### Issue 4: Port Already in Use

**Problem**: Error message like "Port 8761 is already in use" when starting services.

**Solution**:
```bash
# Find which process is using the port (replace 8761 with your port)
echo "=== Finding Process Using Port ==="
lsof -i :8761

# Find all Java processes
ps aux | grep java | grep spring-boot:run

# Kill specific process (replace <PID> with actual process ID)
kill <PID>

# If process won't die, force kill it
kill -9 <PID>

# Verify port is free
lsof -i :8761
# Should show no output if port is free
```

#### Issue 5: Database Connection Issues

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

#### Issue 6: Permission Denied Errors

**Problem**: Permission denied when running Docker or other commands.

**Solution**:
```bash
# Add your user to the docker group (if it exists)
sudo dscl . -append /Groups/docker GroupMembership $(whoami)

# For Docker Desktop on macOS, this usually isn't needed
# Instead, make sure Docker Desktop is running with proper permissions

# Check Docker permissions
docker run hello-world

# If still having issues, try running Docker Desktop with admin privileges
# Right-click Docker.app → Get Info → Check "Run as administrator"
```

### 🔍 Health Check Commands for macOS

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

# API Gateway
curl -s http://localhost:8900/health | grep -q "UP" && echo "✅ API Gateway: UP" || echo "❌ API Gateway: DOWN"

echo "=== Health Check Complete ==="
```

### 🆘 Emergency Reset for macOS

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

---

**🍎 macOS-Specific Notes:**
- This guide uses Terminal and bash commands optimized for macOS
- Homebrew is the recommended package manager for macOS
- Docker Desktop for Mac is required for container support
- Multiple Terminal windows/tabs are needed to run services simultaneously
- Paths differ between Apple Silicon (M1/M2) and Intel Macs - both are covered
- Commands are tested on macOS Catalina (10.15) and later versions
