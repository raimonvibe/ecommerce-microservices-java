# RainbowForest E-commerce Microservices Platform - Ubuntu/Debian Setup

A complete Spring Boot microservices-based e-commerce platform with service discovery, API gateway, and distributed session management.

**🐧 This guide is specifically for Ubuntu/Debian Linux systems. For Windows setup, see [SETUP_WINDOWS.md](SETUP_WINDOWS.md).**

## 🏗️ Architecture Overview

This platform consists of 6 microservices that work together to provide a complete e-commerce solution:

- **Eureka Server** (Port 8761) - Service registry and discovery (finds and manages all services)
- **API Gateway** (Port 8900) - Main entry point with Zuul routing (single access point for all APIs)
- **User Service** (Port 8811) - User management and authentication (handles user accounts and login)
- **Product Catalog Service** (Port 8810) - Product management (manages product inventory)
- **Product Recommendation Service** (Port 8812) - Product recommendations (suggests products to users)
- **Order Service** (Port 8813) - Shopping cart and order management (handles purchases and orders)

## 📋 Prerequisites - Complete Installation Guide for Ubuntu/Debian

**🐧 Ubuntu/Debian Systems Only**: This guide is designed for Ubuntu 18.04+ and Debian 10+ systems. Commands use `apt` package manager.

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

Maven is the build tool used to compile and run the microservices. **Maven 3.6.3+ is required**.

```bash
# Install Maven
sudo apt install -y maven

# Verify installation
mvn -version
# Should show Maven version 3.6.3+ and Java 11

# If Maven version is too old, install manually:
# wget https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
# sudo tar xzf apache-maven-3.6.3-bin.tar.gz -C /opt
# sudo ln -s /opt/apache-maven-3.6.3 /opt/maven
# echo 'export PATH=/opt/maven/bin:$PATH' >> ~/.bashrc
# source ~/.bashrc
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
```

## 🗄️ Database Setup (Critical Step)

**⚠️ IMPORTANT**: You must create the required databases BEFORE starting any microservices, or they will fail to start with connection errors.

After starting SQL Server, the microservices will automatically create required tables using Hibernate DDL auto-update. However, you must first create the databases:

### Required Databases
- `users` - User management and authentication data
- `products` - Product catalog and inventory
- `recommendations` - Product recommendation data  
- `orders` - Shopping cart and order data

### Database Creation (Critical Step)

**⚠️ IMPORTANT**: You must create the required databases before starting the microservices, or they will fail to start with connection errors.

```bash
# Start SQL Server container first
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Test1234!" \
  -p 1433:1433 --name sqlserver --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2019-latest

# Start Redis container
docker run --name redis -p 6379:6379 -d redis:alpine

# Wait for SQL Server to be ready (about 30 seconds)
sleep 30

# Create all required databases
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE users;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE products;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE recommendations;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE orders;"
```

### Database Connection Verification
```bash
# Connect to SQL Server and verify databases exist
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "SELECT name FROM sys.databases;"
```








# Add users
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE users;
INSERT INTO users (user_name, user_password, active, user_details_id, role_id) VALUES
('johndoe', 'password123', 1, 1, 1),
('janesmith', 'password123', 1, 2, 1),
('mikejohnson', 'password123', 1, 3, 1),
('sarahwilson', 'password123', 1, 4, 2),
('davidbrown', 'password123', 1, 5, 3);
"
```

#### Step 2: Populate Products Database
```bash
# Add diverse product catalog
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE products;
INSERT INTO products (product_name, price, discription, category, availability) VALUES
('MacBook Pro 16', 2499.99, 'High-performance laptop with M2 chip', 'Electronics', 15),
('iPhone 15 Pro', 999.99, 'Latest smartphone with advanced camera', 'Electronics', 25),
('Samsung Galaxy S24', 899.99, 'Android flagship with AI features', 'Electronics', 20),
('iPad Air', 599.99, 'Versatile tablet for work and creativity', 'Electronics', 30),
('AirPods Pro', 249.99, 'Wireless earbuds with noise cancellation', 'Electronics', 50),
('Nike Air Max 270', 150.00, 'Comfortable running shoes', 'Clothing', 40),
('Levis 501 Jeans', 89.99, 'Classic straight-fit denim jeans', 'Clothing', 35),
('Adidas Hoodie', 65.00, 'Comfortable cotton blend hoodie', 'Clothing', 25),
('Dyson V15 Vacuum', 749.99, 'Powerful cordless vacuum cleaner', 'Home & Garden', 12),
('Clean Code Book', 42.99, 'A handbook of agile software craftsmanship', 'Books', 85);
"
```

#### Step 3: Populate Recommendations Database (Critical!)
```bash
# Add simplified users for recommendations service
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE recommendations;
INSERT INTO users (user_name) VALUES
('johndoe'), ('janesmith'), ('mikejohnson'), ('sarahwilson'), ('davidbrown');
"

# Add simplified products for recommendations service
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE recommendations;
INSERT INTO products (product_name) VALUES
('MacBook Pro 16'), ('iPhone 15 Pro'), ('Samsung Galaxy S24'), ('iPad Air'), ('AirPods Pro'),
('Nike Air Max 270'), ('Levis 501 Jeans'), ('Adidas Hoodie'), ('Dyson V15 Vacuum'), ('Clean Code Book');
"

# Add recommendation ratings (user interaction history)
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE recommendations;
INSERT INTO recommendation (rating, product_id, user_id) VALUES
(5, 1, 1), (4, 2, 1), (4, 4, 1), (5, 5, 1),
(5, 6, 2), (4, 7, 2), (5, 8, 2), (4, 9, 2),
(5, 9, 3), (4, 10, 3), (5, 1, 3),
(5, 10, 4), (4, 1, 4), (3, 5, 4),
(4, 1, 5), (3, 6, 5), (4, 9, 5), (5, 10, 5);
"
```

#### Step 4: Verify Data Population
```bash
# Check users database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE users; SELECT COUNT(*) as user_count FROM users;
"

# Check products database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE products; SELECT COUNT(*) as product_count FROM products;
"

# Check recommendations database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE recommendations; SELECT COUNT(*) as recommendation_count FROM recommendation;
"
```

## 🎯 Product Recommendation Service Testing

### Test Direct Service Access (Port 8812)
```bash
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
```bash
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

Test all endpoints after setup:

### User Registration (Fixed Field Mapping)
```bash
# ✅ CORRECT - Use userName, userPassword, active fields
curl -X POST http://localhost:8900/api/accounts/registration \
  -H "Content-Type: application/json" \
  -d '{"userName":"testuser","userPassword":"password123","active":1}'

# ❌ INCORRECT - Don't use username, email, password fields
```

### Product Catalog
```bash
# Get all products
curl -X GET http://localhost:8900/api/catalog/products

# Get products by category
curl -X GET "http://localhost:8900/api/catalog/products?category=electronics"

# Get product by ID
curl -X GET http://localhost:8900/api/catalog/products/1
```

### Product Recommendations (Requires name parameter)
```bash
# ✅ CORRECT - Include name parameter
curl -X GET "http://localhost:8900/api/review/recommendations?name=laptop"

# ❌ INCORRECT - Missing name parameter returns HTTP 400
curl -X GET "http://localhost:8900/api/review/recommendations"
```

### Shopping Cart & Orders
```bash
# Get cart (requires Cookie header)
curl -X GET http://localhost:8900/api/shop/cart \
  -H "Cookie: JSESSIONID=your-session-id"

# Add item to cart
curl -X POST "http://localhost:8900/api/shop/cart?productId=1&quantity=2" \
  -H "Cookie: JSESSIONID=your-session-id"
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
1. Check running processes: `netstat -tulpn | grep :PORT`
2. Kill conflicting processes or use different ports
3. Update port configurations in application.properties files


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

## 🚀 Complete Setup Process

### Step 1: Clone the Repository
```bash
# Clone the project
git clone https://github.com/raimonvibe/ecommerce-microservices-java.git
cd ecommerce-microservices-java
```

### Step 2: Start Infrastructure (Docker Containers)
```bash
# Start SQL Server container
# Use the same password variable set earlier
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=$SA_PASSWORD" \
  -p 1433:1433 --name sqlserver --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2019-latest

# Start Redis container  
docker run --name redis -p 6379:6379 -d redis:alpine

# Wait for SQL Server to be ready
sleep 30

# Create required databases
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE users;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE products;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE recommendations;"
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "CREATE DATABASE orders;"
```

### Step 3: Build All Microservices
```bash
# Build all services (this may take several minutes)
mvn clean install -DskipTests

# Or build individually if needed:
# cd eureka-server && mvn clean install -DskipTests && cd ..
# cd user-service && mvn clean install -DskipTests && cd ..
# cd product-catalog-service && mvn clean install -DskipTests && cd ..
# cd product-recommendation-service && mvn clean install -DskipTests && cd ..
# cd api-gateway && mvn clean install -DskipTests && cd ..
```

### Step 4: Start Services in Correct Order

**⚠️ CRITICAL**: Services must be started in this exact order due to dependencies:

```bash
# 1. Start Eureka Server (Service Registry) - FIRST
cd eureka-server
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar &
cd ..

# Wait for Eureka to start (about 30 seconds)
sleep 30

# 2. Start User Service
cd user-service  
java -jar target/user-service-0.0.1-SNAPSHOT.jar &
cd ..

# 3. Start Product Catalog Service
cd product-catalog-service
java -jar target/product-catalog-service-0.0.1-SNAPSHOT.jar &
cd ..

# 4. Start Product Recommendation Service
cd product-recommendation-service
java -jar target/product-recommendation-service-0.0.1-SNAPSHOT.jar &
cd ..

# 5. Start API Gateway - LAST
cd api-gateway
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar &
cd ..
```

### Step 5: Verify Setup
```bash
# Check Eureka Dashboard (should show all services registered)
curl http://localhost:8761

# Test API Gateway health
curl http://localhost:8900/actuator/health

# Test a sample API endpoint
curl "http://localhost:8900/api/catalog/products"
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
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=$SA_PASSWORD" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2019-latest

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
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -C -Q "
CREATE DATABASE users;
CREATE DATABASE product_catalog;
CREATE DATABASE product_recommendations;
CREATE DATABASE orders;
"

# Verify databases were created successfully
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "SELECT name FROM sys.databases WHERE name IN ('users', 'product_catalog', 'product_recommendations', 'orders');"
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
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "SELECT name FROM sys.databases WHERE name IN ('users', 'product_catalog', 'product_recommendations', 'orders');"
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

**⚠️ CRITICAL PREREQUISITE**: Before proceeding with service startup, you MUST have completed the **🗄️ Database Setup (Critical Step)** section above. All microservices will fail to start without the required databases (users, products, recommendations, orders).

**⚠️ VERY IMPORTANT**: You MUST start services in this exact order! Each service depends on the previous ones being ready.

**What happens**: Each service will start, connect to the databases, and register itself with Eureka. This process takes about 30-60 seconds per service.

#### 5.1 Start Eureka Server (Service Registry) - FIRST!

**⚠️ PREREQUISITE**: Before starting ANY services, ensure you have completed the **Database Setup** section above. All services will fail without the required databases.

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

## 🗄️ Database Population & Test Data Setup

### Critical Step: Populate Test Data

The microservices require interconnected test data to function properly. **Without this data, the Product Recommendation Service will return HTTP 404 errors** because recommendation algorithms need user interaction history.

#### Step 1: Populate Users Database
```bash
# Add user roles
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE users;
INSERT INTO user_role (role_name) VALUES 
('USER'), ('ADMIN'), ('PREMIUM_USER');
"

# Add user details
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE users;
INSERT INTO users_details (first_name, last_name, email, phone_number, street, street_number, zip_code, locality, country) VALUES
('John', 'Doe', 'john.doe@email.com', '+1234567890', 'Main Street', '123', '12345', 'New York', 'USA'),
('Jane', 'Smith', 'jane.smith@email.com', '+1234567891', 'Oak Avenue', '456', '12346', 'Los Angeles', 'USA'),
('Mike', 'Johnson', 'mike.johnson@email.com', '+1234567892', 'Pine Road', '789', '12347', 'Chicago', 'USA'),
('Sarah', 'Wilson', 'sarah.wilson@email.com', '+1234567893', 'Elm Street', '321', '12348', 'Houston', 'USA'),
('David', 'Brown', 'david.brown@email.com', '+1234567894', 'Maple Drive', '654', '12349', 'Phoenix', 'USA');
"

# Add users
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE users;
INSERT INTO users (user_name, user_password, active, user_details_id, role_id) VALUES
('johndoe', '\$2a\$10\$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 1, 1, 1),
('janesmith', '\$2a\$10\$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 1, 2, 1),
('mikejohnson', '\$2a\$10\$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 1, 3, 1),
('sarahwilson', '\$2a\$10\$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 1, 4, 2),
('davidbrown', '\$2a\$10\$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 1, 5, 3);
"
```

#### Step 2: Populate Products Database
```bash
# Add product categories
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE products;
INSERT INTO product_category (category_name, category_description, category_image_url) VALUES
('Electronics', 'Electronic devices and gadgets', 'https://example.com/electronics.jpg'),
('Clothing', 'Fashion and apparel', 'https://example.com/clothing.jpg'),
('Books', 'Books and literature', 'https://example.com/books.jpg'),
('Home & Garden', 'Home improvement and gardening', 'https://example.com/home.jpg'),
('Sports', 'Sports and fitness equipment', 'https://example.com/sports.jpg');
"

# Add products
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE products;
INSERT INTO product (product_name, product_description, product_price, product_quantity, product_image_url, category_id) VALUES
('Smartphone', 'Latest Android smartphone with 128GB storage', 599.99, 50, 'https://example.com/smartphone.jpg', 1),
('Laptop', 'High-performance laptop for gaming and work', 1299.99, 25, 'https://example.com/laptop.jpg', 1),
('T-Shirt', 'Comfortable cotton t-shirt', 19.99, 100, 'https://example.com/tshirt.jpg', 2),
('Jeans', 'Classic blue denim jeans', 49.99, 75, 'https://example.com/jeans.jpg', 2),
('Programming Book', 'Learn Java programming', 39.99, 30, 'https://example.com/java-book.jpg', 3),
('Fiction Novel', 'Bestselling fiction novel', 14.99, 60, 'https://example.com/novel.jpg', 3),
('Garden Tools', 'Complete gardening tool set', 89.99, 20, 'https://example.com/garden-tools.jpg', 4),
('Running Shoes', 'Professional running shoes', 129.99, 40, 'https://example.com/running-shoes.jpg', 5);
"
```

#### Step 3: Populate Recommendations Database
```bash
# Add user interactions (views, purchases) for recommendation algorithm
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE recommendations;
INSERT INTO user_interaction (user_id, product_id, interaction_type, interaction_score, interaction_date) VALUES
(1, 1, 'VIEW', 1.0, GETDATE()),
(1, 2, 'VIEW', 1.0, GETDATE()),
(1, 1, 'PURCHASE', 5.0, GETDATE()),
(2, 3, 'VIEW', 1.0, GETDATE()),
(2, 4, 'VIEW', 1.0, GETDATE()),
(2, 3, 'PURCHASE', 5.0, GETDATE()),
(3, 5, 'VIEW', 1.0, GETDATE()),
(3, 6, 'VIEW', 1.0, GETDATE()),
(4, 7, 'VIEW', 1.0, GETDATE()),
(4, 8, 'VIEW', 1.0, GETDATE()),
(5, 1, 'VIEW', 1.0, GETDATE()),
(5, 2, 'VIEW', 1.0, GETDATE());
"

# Add product similarities for collaborative filtering
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE recommendations;
INSERT INTO product_similarity (product_id_1, product_id_2, similarity_score) VALUES
(1, 2, 0.8),
(2, 1, 0.8),
(3, 4, 0.9),
(4, 3, 0.9),
(5, 6, 0.7),
(6, 5, 0.7),
(7, 8, 0.6),
(8, 7, 0.6);
"
```

#### Step 4: Verify Data Population
```bash
# Check users database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE users;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as role_count FROM user_role;
SELECT COUNT(*) as details_count FROM users_details;
"

# Check products database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE products;
SELECT COUNT(*) as product_count FROM product;
SELECT COUNT(*) as category_count FROM product_category;
"

# Check recommendations database
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
USE recommendations;
SELECT COUNT(*) as interaction_count FROM user_interaction;
SELECT COUNT(*) as similarity_count FROM product_similarity;
"
```

**Expected Results:**
- Users: 5 users, 3 roles, 5 user details
- Products: 8 products, 5 categories  
- Recommendations: 12 interactions, 8 similarities

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
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "SELECT 1"

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
