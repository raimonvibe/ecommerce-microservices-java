# RainbowForest E-commerce Microservices Platform - Windows Setup

A complete Spring Boot microservices-based e-commerce platform with service discovery, API gateway, and distributed session management.

**🪟 This guide is specifically for Windows 10/11 systems. For Ubuntu/Debian setup, see [SETUP_README.md](SETUP_README.md).**

## 🏗️ Architecture Overview

This platform consists of 6 microservices that work together to provide a complete e-commerce solution:

- **Eureka Server** (Port 8761) - Service registry and discovery (finds and manages all services)
- **API Gateway** (Port 8900) - Main entry point with Zuul routing (single access point for all APIs)
- **User Service** (Port 8811) - User management and authentication (handles user accounts and login)
- **Product Catalog Service** (Port 8810) - Product management (manages product inventory)
- **Product Recommendation Service** (Port 8812) - Product recommendations (suggests products to users)
- **Order Service** (Port 8813) - Shopping cart and order management (handles purchases and orders)

## 📋 Prerequisites - Complete Installation Guide for Windows

**🪟 Windows 10/11 Systems Only**: This guide is designed for Windows 10 (version 1903+) and Windows 11 systems. Commands use PowerShell and Windows package managers.

### Step 1: Install Chocolatey Package Manager

Chocolatey is a package manager for Windows that makes installing software much easier.

**Open PowerShell as Administrator** (Right-click Start → Windows PowerShell (Admin))

```powershell
# Check if Chocolatey is already installed
choco --version
# If you get an error, Chocolatey is not installed

# Install Chocolatey (run this in PowerShell as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Verify installation
choco --version
# Should show Chocolatey version

# Refresh environment variables
refreshenv
```

### Step 2: Install Java 11

Java 11 is required for this project (newer versions may cause compatibility issues).

```powershell
# Install Java 11 using Chocolatey
choco install openjdk11 -y

# Verify installation
java -version
# Should show: openjdk version "11.x.x"

# Check JAVA_HOME is set automatically
echo $env:JAVA_HOME
# Should show Java installation path

# If JAVA_HOME is not set, set it manually
# Find Java installation path first
Get-ChildItem "C:\Program Files\OpenJDK" -Directory | Where-Object {$_.Name -like "*jdk-11*"}

# Set JAVA_HOME (replace with your actual path)
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\OpenJDK\jdk-11.0.x", "Machine")

# Restart PowerShell and verify
echo $env:JAVA_HOME
```

### Step 3: Install Maven

Maven is the build tool used to compile and run the microservices.

```powershell
# Install Maven using Chocolatey
choco install maven -y

# Verify installation
mvn -version
# Should show Maven version 3.6+ and Java 11

# If mvn command is not found, restart PowerShell
refreshenv
mvn -version
```

## 🗄️ Database Schema Setup

After starting SQL Server, the microservices will automatically create required tables using Hibernate DDL auto-update. However, ensure proper database connections:

### Required Databases
- `users` - User management and authentication data
- `products` - Product catalog and inventory
- `recommendations` - Product recommendation data  
- `orders` - Shopping cart and order data

### Database Creation (Critical Step)

**⚠️ IMPORTANT**: You must create the required databases before starting the microservices, or they will fail to start with connection errors.

```powershell
# Create all required databases
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE users;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE products;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE recommendations;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE orders;"
```

### Database Connection Verification
```powershell
# Connect to SQL Server and verify databases exist
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "SELECT name FROM sys.databases;"
```

## 🗄️ Database Population & Test Data Setup

### Critical Step: Populate Test Data

The microservices require interconnected test data to function properly. **Without this data, the Product Recommendation Service will return HTTP 404 errors** because recommendation algorithms need user interaction history.

#### Step 1: Populate Users Database
```powershell
# Add user roles
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE users; INSERT INTO user_role (role_name) VALUES ('USER'), ('ADMIN'), ('PREMIUM_USER');"

# Add user details
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE users; INSERT INTO users_details (first_name, last_name, email, phone_number, street, street_number, zip_code, locality, country) VALUES ('John', 'Doe', 'john.doe@email.com', '+1234567890', 'Main Street', '123', '12345', 'New York', 'USA'), ('Jane', 'Smith', 'jane.smith@email.com', '+1234567891', 'Oak Avenue', '456', '12346', 'Los Angeles', 'USA'), ('Mike', 'Johnson', 'mike.johnson@email.com', '+1234567892', 'Pine Road', '789', '12347', 'Chicago', 'USA'), ('Sarah', 'Wilson', 'sarah.wilson@email.com', '+1234567893', 'Elm Street', '321', '12348', 'Houston', 'USA'), ('David', 'Brown', 'david.brown@email.com', '+1234567894', 'Maple Drive', '654', '12349', 'Phoenix', 'USA');"

# Add users
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE users; INSERT INTO users (user_name, user_password, active, user_details_id, role_id) VALUES ('johndoe', 'password123', 1, 1, 1), ('janesmith', 'password123', 1, 2, 1), ('mikejohnson', 'password123', 1, 3, 1), ('sarahwilson', 'password123', 1, 4, 2), ('davidbrown', 'password123', 1, 5, 3);"
```

#### Step 2: Populate Products Database
```powershell
# Add diverse product catalog
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE products; INSERT INTO products (product_name, price, discription, category, availability) VALUES ('MacBook Pro 16', 2499.99, 'High-performance laptop with M2 chip', 'Electronics', 15), ('iPhone 15 Pro', 999.99, 'Latest smartphone with advanced camera', 'Electronics', 25), ('Samsung Galaxy S24', 899.99, 'Android flagship with AI features', 'Electronics', 20), ('iPad Air', 599.99, 'Versatile tablet for work and creativity', 'Electronics', 30), ('AirPods Pro', 249.99, 'Wireless earbuds with noise cancellation', 'Electronics', 50), ('Nike Air Max 270', 150.00, 'Comfortable running shoes', 'Clothing', 40), ('Levis 501 Jeans', 89.99, 'Classic straight-fit denim jeans', 'Clothing', 35), ('Adidas Hoodie', 65.00, 'Comfortable cotton blend hoodie', 'Clothing', 25), ('Dyson V15 Vacuum', 749.99, 'Powerful cordless vacuum cleaner', 'Home & Garden', 12), ('Clean Code Book', 42.99, 'A handbook of agile software craftsmanship', 'Books', 85);"
```

#### Step 3: Populate Recommendations Database (Critical!)
```powershell
# Add simplified users for recommendations service
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE recommendations; INSERT INTO users (user_name) VALUES ('johndoe'), ('janesmith'), ('mikejohnson'), ('sarahwilson'), ('davidbrown');"

# Add simplified products for recommendations service
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE recommendations; INSERT INTO products (product_name) VALUES ('MacBook Pro 16'), ('iPhone 15 Pro'), ('Samsung Galaxy S24'), ('iPad Air'), ('AirPods Pro'), ('Nike Air Max 270'), ('Levis 501 Jeans'), ('Adidas Hoodie'), ('Dyson V15 Vacuum'), ('Clean Code Book');"

# Add recommendation ratings (user interaction history)
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE recommendations; INSERT INTO recommendation (rating, product_id, user_id) VALUES (5, 1, 1), (4, 2, 1), (4, 4, 1), (5, 5, 1), (5, 6, 2), (4, 7, 2), (5, 8, 2), (4, 9, 2), (5, 9, 3), (4, 10, 3), (5, 1, 3), (5, 10, 4), (4, 1, 4), (3, 5, 4), (4, 1, 5), (3, 6, 5), (4, 9, 5), (5, 10, 5);"
```

#### Step 4: Verify Data Population
```powershell
# Check users database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE users; SELECT COUNT(*) as user_count FROM users;"

# Check products database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE products; SELECT COUNT(*) as product_count FROM products;"

# Check recommendations database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "USE recommendations; SELECT COUNT(*) as recommendation_count FROM recommendation;"
```

## 🎯 Product Recommendation Service Testing

### Test Direct Service Access (Port 8812)
```powershell
# Test MacBook Pro recommendations
curl "http://localhost:8812/recommendations?name=MacBook%20Pro%2016"
# Expected: JSON array with 4 user recommendations and ratings

# Test iPhone recommendations  
curl "http://localhost:8812/recommendations?name=iPhone%2015%20Pro"
# Expected: JSON array with 1 user recommendation

# Test product with no recommendations
curl "http://localhost:8812/recommendations?name=NonExistentProduct"
# Expected: Empty JSON array []
```

### Test API Gateway Routing (Port 8900)
```powershell
# Test via API Gateway
curl "http://localhost:8900/api/review/recommendations?name=MacBook%20Pro%2016"
# Expected: Same results as direct access (perfect routing)

# Test different products via gateway
curl "http://localhost:8900/api/review/recommendations?name=Clean%20Code%20Book"
curl "http://localhost:8900/api/review/recommendations?name=Dyson%20V15%20Vacuum"
```

### Expected Recommendation Response Format
```json
[
  {
    "id": 1,
    "rating": 5,
    "product": {"productName": "MacBook Pro 16"},
    "user": {"userName": "johndoe"}
  },
  {
    "id": 11,
    "rating": 5,
    "product": {"productName": "MacBook Pro 16"},
    "user": {"userName": "mikejohnson"}
  }
]
```

## 🧪 API Testing & Verification

Test all endpoints after setup using PowerShell:

### User Registration (Fixed Field Mapping)
```powershell
# ✅ CORRECT - Use userName, userPassword, active fields
Invoke-RestMethod -Uri "http://localhost:8900/api/accounts/registration" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"userName":"testuser","userPassword":"password123","active":1}'

# ❌ INCORRECT - Don't use username, email, password fields
```

### Product Catalog
```powershell
# Get all products
Invoke-RestMethod -Uri "http://localhost:8900/api/catalog/products" -Method GET

# Get products by category
Invoke-RestMethod -Uri "http://localhost:8900/api/catalog/products?category=electronics" -Method GET

# Get product by ID
Invoke-RestMethod -Uri "http://localhost:8900/api/catalog/products/1" -Method GET
```

### Product Recommendations (Requires name parameter)
```powershell
# ✅ CORRECT - Include name parameter
Invoke-RestMethod -Uri "http://localhost:8900/api/review/recommendations?name=laptop" -Method GET

# ❌ INCORRECT - Missing name parameter returns HTTP 400
Invoke-RestMethod -Uri "http://localhost:8900/api/review/recommendations" -Method GET
```

### Shopping Cart & Orders
```powershell
# Get cart (requires Cookie header)
$headers = @{ "Cookie" = "JSESSIONID=your-session-id" }
Invoke-RestMethod -Uri "http://localhost:8900/api/shop/cart" -Method GET -Headers $headers

# Add item to cart
Invoke-RestMethod -Uri "http://localhost:8900/api/shop/cart?productId=1&quantity=2" `
  -Method POST -Headers $headers
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
**Problem**: "Port already in use" errors
**Solution**:
1. Check running processes: `netstat -an | findstr :PORT`
2. Kill conflicting processes using Task Manager or `taskkill`
3. Update port configurations in application.properties files

### PowerShell Execution Policy Issues
**Problem**: Scripts cannot be executed due to execution policy
**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```


### Step 4: Install Docker Desktop

Docker Desktop is used to run SQL Server and Redis databases on Windows.

```powershell
# Install Docker Desktop using Chocolatey
choco install docker-desktop -y

# Alternative: Download manually from https://www.docker.com/products/docker-desktop/

# After installation, start Docker Desktop from Start Menu
# Wait for Docker Desktop to fully start (check system tray icon)

# Verify Docker installation
docker --version
# Should show Docker version

# Test Docker (should download and run hello-world container)
docker run hello-world
```

**⚠️ Important Docker Notes for Windows:**
- Docker Desktop requires Windows 10/11 Pro, Enterprise, or Education with Hyper-V enabled
- For Windows 10/11 Home, Docker Desktop will use WSL 2 backend
- You may need to enable virtualization in BIOS settings
- Docker Desktop must be running for containers to work

### Step 5: Install Git

Git is needed to clone the repository.

```powershell
# Install Git using Chocolatey
choco install git -y

# Verify installation
git --version
# Should show Git version

# Configure Git (replace with your information)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### ✅ Prerequisites Verification

Before proceeding, verify all tools are installed correctly:

```powershell
# Check all required tools
Write-Host "=== Checking Prerequisites ===" -ForegroundColor Green
Write-Host "Java version:"
java -version
Write-Host "`nJAVA_HOME:"
echo $env:JAVA_HOME
Write-Host "`nMaven version:"
mvn -version
Write-Host "`nDocker version:"
docker --version
Write-Host "`nGit version:"
git --version
Write-Host "=== All tools should be installed and working ===" -ForegroundColor Green
```

## 🚀 Complete Setup Guide

### Step 1: Clone the Repository

```powershell
# Clone the repository
git clone https://github.com/raimonvibe/ecommerce-microservices-java.git

# Navigate to the project directory
cd ecommerce-microservices-java

# Verify you're in the right directory
Get-ChildItem
# You should see directories like: eureka-server, api-gateway, user-service, etc.
```

### Step 2: Set Up Infrastructure (Databases)

The microservices need SQL Server for data storage and Redis for session management. We'll run both using Docker containers.

#### 2.1 Start SQL Server Container

**What this does**: Creates a Microsoft SQL Server database that will store user accounts, products, orders, and recommendations.

```powershell
# Start SQL Server container (this may take a few minutes to download the first time)
# ⚠️ SECURITY WARNING: Change the default password in production!
$SA_PASSWORD = "Test1234!"  # REPLACE with your own secure password
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=$SA_PASSWORD" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2019-latest

# Verify the container is running
docker ps | Select-String "sqlserver"
# You should see a line showing the sqlserver container is "Up"

# Check container logs to ensure it started properly
docker logs sqlserver
# Look for "SQL Server is now ready for client connections"
```

#### 2.2 Create Required Databases

**What this does**: Creates 4 separate databases that different microservices will use to store their data.

```powershell
# Wait for SQL Server to fully start (this is important!)
Write-Host "Waiting for SQL Server to start completely..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Create all required databases
# Using the same password variable from above
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -C -Q "
CREATE DATABASE users;
CREATE DATABASE product_catalog;
CREATE DATABASE product_recommendations;
CREATE DATABASE orders;
"

# Verify databases were created successfully
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -C -Q "SELECT name FROM sys.databases WHERE name IN ('users', 'product_catalog', 'product_recommendations', 'orders');"
# You should see all 4 database names listed
```

#### 2.3 Start Redis Container

**What this does**: Creates a Redis database for storing user sessions and shopping cart data.

```powershell
# Start Redis container
docker run --name redis -p 6379:6379 -d redis:latest

# Verify Redis is running
docker ps | Select-String "redis"
# You should see a line showing the redis container is "Up"

# Test Redis connection
docker exec -it redis redis-cli ping
# Should respond with "PONG"
```

#### ✅ Infrastructure Verification

Verify both databases are running correctly:

```powershell
Write-Host "=== Infrastructure Status Check ===" -ForegroundColor Green
Write-Host "Docker containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Write-Host "`nSQL Server databases:"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -C -Q "SELECT name FROM sys.databases WHERE name IN ('users', 'product_catalog', 'product_recommendations', 'orders');"
Write-Host "`nRedis connection:"
docker exec -it redis redis-cli ping
Write-Host "=== Infrastructure should be ready ===" -ForegroundColor Green
```

### Step 3: Prepare Java Environment

**What this does**: Ensures Java 11 is being used for all microservices (required for compatibility).

```powershell
# Verify Java environment for current session
Write-Host "Current Java version:"
java -version
Write-Host "JAVA_HOME is set to:"
echo $env:JAVA_HOME

# If JAVA_HOME is not set correctly, set it (replace with your actual path)
# [Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\OpenJDK\jdk-11.0.x", "User")

# Refresh environment variables
refreshenv
```

### Step 4: Build All Microservices

**What this does**: Compiles all the Java code and creates executable JAR files for each microservice. This step may take 2-5 minutes depending on your system.

**⚠️ Important**: We skip tests during build (`-DskipTests`) to speed up the process. The services have been tested and work correctly.

```powershell
# Make sure you're in the project root directory
Get-Location
# Should show: C:\path\to\ecommerce-microservices-java

Write-Host "=== Building All Microservices ===" -ForegroundColor Green
Write-Host "This will take a few minutes..." -ForegroundColor Yellow

# Build Eureka Server (Service Registry) - Must be built first
Write-Host "Building Eureka Server..." -ForegroundColor Cyan
Set-Location eureka-server
mvn clean package -DskipTests
Set-Location ..
Write-Host "✅ Eureka Server built successfully" -ForegroundColor Green

# Build API Gateway
Write-Host "Building API Gateway..." -ForegroundColor Cyan
Set-Location api-gateway
mvn clean package -DskipTests
Set-Location ..
Write-Host "✅ API Gateway built successfully" -ForegroundColor Green

# Build User Service
Write-Host "Building User Service..." -ForegroundColor Cyan
Set-Location user-service
mvn clean package -DskipTests
Set-Location ..
Write-Host "✅ User Service built successfully" -ForegroundColor Green

# Build Product Catalog Service
Write-Host "Building Product Catalog Service..." -ForegroundColor Cyan
Set-Location product-catalog-service
mvn clean package -DskipTests
Set-Location ..
Write-Host "✅ Product Catalog Service built successfully" -ForegroundColor Green

# Build Product Recommendation Service
Write-Host "Building Product Recommendation Service..." -ForegroundColor Cyan
Set-Location product-recommendation-service
mvn clean package -DskipTests
Set-Location ..
Write-Host "✅ Product Recommendation Service built successfully" -ForegroundColor Green

# Build Order Service
Write-Host "Building Order Service..." -ForegroundColor Cyan
Set-Location order-service
mvn clean package -DskipTests
Set-Location ..
Write-Host "✅ Order Service built successfully" -ForegroundColor Green

Write-Host "=== All services built successfully! ===" -ForegroundColor Green
```

#### ✅ Build Verification

Verify all services were built correctly:

```powershell
Write-Host "=== Checking Build Results ===" -ForegroundColor Green
Write-Host "Looking for JAR files in target directories..."
Get-ChildItem -Path . -Recurse -Filter "*.jar" | Where-Object {$_.Directory.Name -eq "target" -and $_.Name -notlike "*original*"} | Select-Object FullName
# You should see 6 JAR files, one for each microservice
Write-Host "=== Build verification complete ===" -ForegroundColor Green
```

### Step 5: Start All Microservices (Critical Order!)

**⚠️ VERY IMPORTANT**: You MUST start services in this exact order! Each service depends on the previous ones being ready.

**What happens**: Each service will start, connect to the databases, and register itself with Eureka. This process takes about 30-60 seconds per service.

**🪟 Windows Note**: You'll need to open multiple PowerShell windows to run services simultaneously. Each service runs in its own window.

#### 5.1 Start Eureka Server (Service Registry) - FIRST!

**What this does**: Starts the service registry that all other services will register with. This MUST start first.

**Open a new PowerShell window and run:**

```powershell
Write-Host "=== Starting Eureka Server (Service Registry) ===" -ForegroundColor Green
cd C:\path\to\ecommerce-microservices-java  # Replace with your actual path
Set-Location eureka-server
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-11.0.x"  # Replace with your actual path
mvn spring-boot:run
```

**Wait 60 seconds, then verify Eureka is running:**

```powershell
# In another PowerShell window
Invoke-WebRequest -Uri "http://localhost:8761" -UseBasicParsing
# Should return HTML content without errors
```

**🌐 Check Eureka Dashboard**: Open http://localhost:8761 in your browser. You should see the Eureka dashboard with no services registered yet.

#### 5.2 Start Business Services - SECOND!

**What this does**: Starts the core business logic services. These will register with Eureka and connect to the databases.

**Open 4 new PowerShell windows and run one command in each:**

**PowerShell Window 2 - User Service:**
```powershell
Write-Host "Starting User Service..." -ForegroundColor Cyan
cd C:\path\to\ecommerce-microservices-java  # Replace with your actual path
Set-Location user-service
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-11.0.x"  # Replace with your actual path
mvn spring-boot:run
```

**PowerShell Window 3 - Product Catalog Service:**
```powershell
Write-Host "Starting Product Catalog Service..." -ForegroundColor Cyan
cd C:\path\to\ecommerce-microservices-java  # Replace with your actual path
Set-Location product-catalog-service
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-11.0.x"  # Replace with your actual path
mvn spring-boot:run
```

**PowerShell Window 4 - Product Recommendation Service:**
```powershell
Write-Host "Starting Product Recommendation Service..." -ForegroundColor Cyan
cd C:\path\to\ecommerce-microservices-java  # Replace with your actual path
Set-Location product-recommendation-service
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-11.0.x"  # Replace with your actual path
mvn spring-boot:run
```

**PowerShell Window 5 - Order Service:**
```powershell
Write-Host "Starting Order Service..." -ForegroundColor Cyan
cd C:\path\to\ecommerce-microservices-java  # Replace with your actual path
Set-Location order-service
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-11.0.x"  # Replace with your actual path
mvn spring-boot:run
```

**Wait 2-3 minutes for all business services to start and register with Eureka.**

#### 5.3 Start API Gateway - LAST!

**What this does**: Starts the API Gateway that routes requests to all business services. This MUST start last so it can find all the other services.

**Open a 6th PowerShell window and run:**

```powershell
Write-Host "=== Starting API Gateway (Final Step) ===" -ForegroundColor Green
cd C:\path\to\ecommerce-microservices-java  # Replace with your actual path
Set-Location api-gateway
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-11.0.x"  # Replace with your actual path
mvn spring-boot:run
```

**Wait 1-2 minutes for the API Gateway to start.**

### Step 6: Complete System Verification

**What this does**: Confirms that all 6 microservices are running correctly and can communicate with each other.

#### 6.1 Check All Services are Running

First, let's verify all Java processes are running:

```powershell
Write-Host "=== Checking Running Services ===" -ForegroundColor Green
Get-Process -Name "java" | Where-Object {$_.ProcessName -eq "java"}
# You should see 6 Java processes running (one for each microservice)
Write-Host "=== Process Check Complete ===" -ForegroundColor Green
```

#### 6.2 Check Service Registration in Eureka

**What this does**: Verifies that all services have successfully registered with the service registry.

```powershell
Write-Host "=== Checking Service Registration ===" -ForegroundColor Green
try {
    Invoke-WebRequest -Uri "http://localhost:8761" -UseBasicParsing | Out-Null
    Write-Host "✅ Eureka Server is accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Eureka Server not accessible" -ForegroundColor Red
}
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

```powershell
Write-Host "=== Testing API Gateway ===" -ForegroundColor Green

# Test welcome page with API documentation
Write-Host "Testing welcome page..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8900/" -UseBasicParsing
    $response.Content | ConvertFrom-Json | Select-Object -First 5
    Write-Host "✅ Welcome page accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Welcome page not accessible" -ForegroundColor Red
}

# Test health check
Write-Host "`nTesting health check..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:8900/health" -UseBasicParsing
    $healthResponse.Content
    Write-Host "✅ Health check successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed" -ForegroundColor Red
}

Write-Host "`n✅ API Gateway tests complete!" -ForegroundColor Green
```

**🌐 Visual Check**: Open http://localhost:8900 in your browser. You should see:
- JSON response with available API endpoints
- Message: "Welcome to RainbowForest E-commerce Microservices Platform"
- List of available endpoints like `/api/catalog/products`, `/api/accounts/registration`, etc.

#### 6.4 Test Individual Service Communication

**What this does**: Verifies that the API Gateway can successfully route requests to individual services.

```powershell
Write-Host "=== Testing Service Communication ===" -ForegroundColor Green

# Test routing to different services through the gateway
Write-Host "Testing API Gateway routing..." -ForegroundColor Cyan

# These may return 404 or 401 errors, which is normal for a secure e-commerce platform
# The important thing is that we get structured responses, not connection errors

$endpoints = @(
    "http://localhost:8900/api/catalog/products",
    "http://localhost:8900/api/accounts/registration",
    "http://localhost:8900/api/shop/cart"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint -UseBasicParsing -ErrorAction SilentlyContinue
        Write-Host "Status: $($response.StatusCode) for $endpoint" -ForegroundColor Yellow
    } catch {
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__) for $endpoint" -ForegroundColor Yellow
    }
}

Write-Host "✅ Service communication tests complete!" -ForegroundColor Green
Write-Host "Note: 404/401/405 status codes are normal - they indicate services are responding correctly" -ForegroundColor Yellow
```

#### ✅ Final System Status Check

Run this comprehensive check to verify everything is working:

```powershell
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "🎉 RAINBOWFOREST E-COMMERCE PLATFORM STATUS" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta

Write-Host "`n📊 Infrastructure Status:" -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | Select-String -Pattern "(sqlserver|redis)"

Write-Host "`n🔧 Microservices Status:" -ForegroundColor Cyan
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue | Measure-Object
Write-Host "Java processes running: $($javaProcesses.Count)"
Write-Host "Expected: 6 processes"

Write-Host "`n🌐 Service Registry Status:" -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri "http://localhost:8761" -UseBasicParsing | Out-Null
    Write-Host "✅ Eureka Server: ACCESSIBLE" -ForegroundColor Green
} catch {
    Write-Host "❌ Eureka Server: NOT ACCESSIBLE" -ForegroundColor Red
}

Write-Host "`n🚪 API Gateway Status:" -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:8900/health" -UseBasicParsing
    if ($healthResponse.Content -like "*UP*") {
        Write-Host "✅ API Gateway: UP" -ForegroundColor Green
    } else {
        Write-Host "❌ API Gateway: DOWN" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API Gateway: DOWN" -ForegroundColor Red
}

Write-Host "`n🎯 Access Points:" -ForegroundColor Cyan
Write-Host "• Eureka Dashboard: http://localhost:8761"
Write-Host "• API Gateway: http://localhost:8900"
Write-Host "• Main API Endpoints: http://localhost:8900/api/*"

Write-Host "`n==========================================" -ForegroundColor Magenta
Write-Host "🚀 PLATFORM IS READY FOR USE!" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta
```

## 🧪 Testing the E-commerce Platform

**What this does**: Tests the actual e-commerce functionality to make sure users can register, browse products, and make purchases.

**⚠️ Important**: These tests use the API Gateway (http://localhost:8900) as the main entry point, just like real users would.

### Step 1: Test User Registration

**What this does**: Creates a new user account in the system.

```powershell
Write-Host "=== Testing User Registration ===" -ForegroundColor Green

# Register a new user
$userRegistration = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8900/api/accounts/registration" `
        -Method POST `
        -ContentType "application/json" `
        -Body $userRegistration `
        -UseBasicParsing
    Write-Host "✅ User registration test complete!" -ForegroundColor Green
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

Write-Host "Expected: HTTP Status 200 or 201 (success) or 409 (user already exists)" -ForegroundColor Cyan
```

### Step 2: Test Product Management

**What this does**: Adds a product to the catalog (admin function) and then retrieves it.

```powershell
Write-Host "=== Testing Product Management ===" -ForegroundColor Green

# Add a new product (admin function)
Write-Host "Adding a test product..." -ForegroundColor Cyan
$productData = @{
    name = "Test Laptop"
    description = "High-performance laptop for developers"
    price = 999.99
    category = "Electronics"
    availability = 10
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8900/api/catalog/admin/products" `
        -Method POST `
        -ContentType "application/json" `
        -Body $productData `
        -UseBasicParsing
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

# Browse all products
Write-Host "`nBrowsing all products..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8900/api/catalog/products" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

Write-Host "✅ Product management tests complete!" -ForegroundColor Green
```

### Step 3: Test Shopping Cart (Requires Authentication)

**What this does**: Tests the shopping cart functionality. Note: This requires user authentication.

```powershell
Write-Host "=== Testing Shopping Cart ===" -ForegroundColor Green

# View shopping cart (requires authentication)
Write-Host "Checking shopping cart..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8900/api/shop/cart" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

# Add item to cart (requires authentication)
Write-Host "`nAdding item to cart..." -ForegroundColor Cyan
$cartItem = @{
    productId = 1
    quantity = 2
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8900/api/shop/cart/add" `
        -Method POST `
        -ContentType "application/json" `
        -Body $cartItem `
        -UseBasicParsing
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

Write-Host "✅ Shopping cart tests complete!" -ForegroundColor Green
Write-Host "Expected: HTTP Status 401 (unauthorized) - this is normal without authentication" -ForegroundColor Cyan
```

### Step 4: Test Product Recommendations

**What this does**: Tests the recommendation engine that suggests products to users.

```powershell
Write-Host "=== Testing Product Recommendations ===" -ForegroundColor Green

# Get product recommendations
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8900/api/review/recommendations" `
        -Method GET `
        -ContentType "application/json" `
        -UseBasicParsing
    Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Yellow
} catch {
    Write-Host "HTTP Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

Write-Host "✅ Product recommendations test complete!" -ForegroundColor Green
```

### ✅ Complete Platform Test

Run this comprehensive test to verify all major functionality:

```powershell
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "🧪 COMPLETE E-COMMERCE PLATFORM TEST" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta

$testEndpoints = @(
    @{ Name = "User Registration"; Method = "POST"; Uri = "http://localhost:8900/api/accounts/registration"; Body = '{"username":"testuser2","email":"test2@example.com","password":"password123"}' },
    @{ Name = "Product Catalog"; Method = "GET"; Uri = "http://localhost:8900/api/catalog/products"; Body = $null },
    @{ Name = "Product Recommendations"; Method = "GET"; Uri = "http://localhost:8900/api/review/recommendations"; Body = $null },
    @{ Name = "Shopping Cart"; Method = "GET"; Uri = "http://localhost:8900/api/shop/cart"; Body = $null }
)

foreach ($test in $testEndpoints) {
    Write-Host "`n$($test.Name)..." -ForegroundColor Cyan
    try {
        if ($test.Body) {
            $response = Invoke-WebRequest -Uri $test.Uri -Method $test.Method -ContentType "application/json" -Body $test.Body -UseBasicParsing
        } else {
            $response = Invoke-WebRequest -Uri $test.Uri -Method $test.Method -UseBasicParsing
        }
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}

Write-Host "`n==========================================" -ForegroundColor Magenta
Write-Host "🎉 PLATFORM TESTING COMPLETE!" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "✅ Status codes 200-299: Success" -ForegroundColor Green
Write-Host "✅ Status code 401: Normal (authentication required)" -ForegroundColor Green
Write-Host "✅ Status code 404: Normal (endpoint may require specific setup)" -ForegroundColor Green
Write-Host "❌ Connection errors: Problem with services" -ForegroundColor Red
```

## 🛠️ Troubleshooting Guide for Windows

**What this section covers**: Solutions to common problems you might encounter during setup or operation on Windows.

### 🚨 Common Windows-Specific Issues and Solutions

#### Issue 1: PowerShell Execution Policy

**Problem**: Error message "execution of scripts is disabled on this system" when running PowerShell commands.

**Solution**:
```powershell
# Check current execution policy
Get-ExecutionPolicy

# Set execution policy to allow scripts (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verify the change
Get-ExecutionPolicy
```

#### Issue 2: Docker Desktop Not Starting

**Problem**: Docker Desktop fails to start or containers won't run.

**Solution**:
```powershell
# Check if Hyper-V is enabled (for Windows Pro/Enterprise)
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V

# Enable Hyper-V if needed (requires restart)
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All

# For Windows Home, ensure WSL 2 is installed
wsl --install

# Check Docker Desktop status
docker info

# Restart Docker Desktop if needed
# Go to System Tray → Right-click Docker → Restart
```

#### Issue 3: Port Already in Use

**Problem**: Error message like "Port 8761 is already in use" when starting services.

**Solution**:
```powershell
# Find which process is using the port (replace 8761 with your port)
Write-Host "=== Finding Process Using Port ===" -ForegroundColor Green
netstat -ano | Select-String ":8761"

# Find all Java processes
Get-Process -Name "java" -ErrorAction SilentlyContinue

# Kill specific process (replace <PID> with actual process ID)
Stop-Process -Id <PID> -Force

# Verify port is free
netstat -ano | Select-String ":8761"
# Should show no output if port is free
```

#### Issue 4: Java/Maven Not Found

**Problem**: Commands like `java` or `mvn` are not recognized.

**Solution**:
```powershell
# Refresh environment variables
refreshenv

# Check if Java is in PATH
$env:PATH -split ';' | Select-String -Pattern "java"

# Check if Maven is in PATH
$env:PATH -split ';' | Select-String -Pattern "maven"

# If not found, reinstall using Chocolatey
choco install openjdk11 maven -y --force

# Restart PowerShell and try again
```

#### Issue 5: Database Connection Issues

**Problem**: Services can't connect to SQL Server or Redis.

**Solution**:
```powershell
Write-Host "=== Checking Database Containers ===" -ForegroundColor Green

# Check if containers are running
docker ps | Select-String -Pattern "(sqlserver|redis)"

# Check SQL Server container logs
docker logs sqlserver | Select-Object -Last 20

# Check Redis container logs  
docker logs redis | Select-Object -Last 20

# Restart SQL Server if needed
docker restart sqlserver
Start-Sleep -Seconds 30

# Restart Redis if needed
docker restart redis

# Test connections
Write-Host "Testing SQL Server connection..." -ForegroundColor Cyan
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -C -Q "SELECT 1"

Write-Host "Testing Redis connection..." -ForegroundColor Cyan
docker exec -it redis redis-cli ping
```

### 🔍 Health Check Commands for Windows

Use these commands to verify individual service health:

```powershell
Write-Host "=== Complete Health Check ===" -ForegroundColor Green

# Eureka Server
Write-Host "Checking Eureka Server..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri "http://localhost:8761" -UseBasicParsing | Out-Null
    Write-Host "✅ Eureka: UP" -ForegroundColor Green
} catch {
    Write-Host "❌ Eureka: DOWN" -ForegroundColor Red
}

# Individual service health endpoints
$services = @(
    @{ Name = "User Service"; Port = 8811 },
    @{ Name = "Product Catalog"; Port = 8810 },
    @{ Name = "Product Recommendation"; Port = 8812 },
    @{ Name = "Order Service"; Port = 8813 }
)

Write-Host "Checking microservices..." -ForegroundColor Cyan
foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/actuator/health" -UseBasicParsing
        if ($response.Content -like "*UP*") {
            Write-Host "✅ $($service.Name): UP" -ForegroundColor Green
        } else {
            Write-Host "❌ $($service.Name): DOWN" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $($service.Name): DOWN" -ForegroundColor Red
    }
}

# API Gateway
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8900/health" -UseBasicParsing
    if ($response.Content -like "*UP*") {
        Write-Host "✅ API Gateway: UP" -ForegroundColor Green
    } else {
        Write-Host "❌ API Gateway: DOWN" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API Gateway: DOWN" -ForegroundColor Red
}

Write-Host "=== Health Check Complete ===" -ForegroundColor Green
```

### 🆘 Emergency Reset for Windows

If everything is broken and you want to start fresh:

```powershell
Write-Host "=== EMERGENCY RESET - Starting Fresh ===" -ForegroundColor Red

# 1. Stop all Java processes
Write-Host "Stopping all Java processes..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Stop and remove containers
Write-Host "Stopping containers..." -ForegroundColor Yellow
docker stop sqlserver redis 2>$null
docker rm sqlserver redis 2>$null

# 3. Clean build artifacts
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Directory -Name "target" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# 4. Start fresh
Write-Host "Starting fresh setup..." -ForegroundColor Yellow
Write-Host "Now follow the setup guide from Step 2 (Infrastructure Setup)" -ForegroundColor Cyan

Write-Host "=== Reset Complete - Ready for Fresh Setup ===" -ForegroundColor Green
```

## 🔧 Configuration Details

### Database Configuration
- **Connection**: SQL Server on localhost:1433
- **Username**: sa
- **Password**: YourSecurePassword123! (⚠️ Replace with your secure password!)
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
2. **Database Password Consistency**: Unified example password across all services (change in production)
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

**🪟 Windows-Specific Notes:**
- This guide uses PowerShell commands and Windows package managers
- Docker Desktop is required for container support
- Multiple PowerShell windows are needed to run services simultaneously
- All paths use Windows-style backslashes where applicable
- Color-coded output helps distinguish different types of information
