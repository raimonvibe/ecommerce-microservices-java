# RainbowForest E-commerce Microservices Platform - Linux Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the RainbowForest E-commerce Microservices Platform on Ubuntu/Debian Linux systems.

## Prerequisites

### System Requirements
- Ubuntu 18.04+ or Debian 9+ (64-bit)
- Minimum 8GB RAM
- 20GB free disk space
- Internet connection for downloading dependencies

### Required Software

#### 1. Java 11 Installation
```bash
# Update package index
sudo apt update

# Install OpenJDK 11
sudo apt install openjdk-11-jdk

# If you have multiple Java versions, set Java 11 as default
sudo update-alternatives --config java
# Select Java 11 from the list

# Verify installation
java -version

# Set JAVA_HOME (add to ~/.bashrc for persistence)
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Maven Installation
```bash
# Install Maven
sudo apt install maven

# Verify installation
mvn -version
```

#### 3. Docker Installation
```bash
# Install Docker
sudo apt install docker.io

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (logout/login required)
sudo usermod -aG docker $USER

# Verify installation
docker --version
```

#### 4. Git Installation
```bash
# Install Git
sudo apt install git

# Verify installation
git --version
```

## Infrastructure Setup

### Database Setup

#### SQL Server Container
```bash
# Pull and run SQL Server container
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Test1234!" \
  -p 1433:1433 --name sqlserver --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2019-latest

# Verify container is running
docker ps

# Test connection
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "SELECT 1 AS test_connection"
```

#### Create Required Databases
```bash
# Create databases for each microservice
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
CREATE DATABASE UserServiceDB;
CREATE DATABASE ProductCatalogDB;
CREATE DATABASE OrderServiceDB;
CREATE DATABASE RecommendationServiceDB;
"

# Verify databases were created
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "SELECT name FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb');"
```

#### Redis Container
```bash
# Pull and run Redis container
docker run --name redis -p 6379:6379 -d redis:6.2-alpine

# Verify container is running
docker ps

# Test connection
docker exec -it redis redis-cli ping
```

## Project Setup

### 1. Clone Repository
```bash
# Clone the project
git clone https://github.com/raimonvibe/ecommerce-microservices-java.git
cd ecommerce-microservices-java
```

### 2. Configure Database Connections

Before building, ensure database connection strings are properly configured in each service's `application.properties` file.

#### User Service Configuration
Check `user-service/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=UserServiceDB;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=Test1234!
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.SQLServer2012Dialect
spring.jpa.show-sql=true
```

#### Product Catalog Service Configuration
Check `product-catalog-service/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=ProductCatalogDB;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=Test1234!
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.SQLServer2012Dialect
```

#### Order Service Configuration
Check `order-service/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OrderServiceDB;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=Test1234!
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.SQLServer2012Dialect
```

#### Product Recommendation Service Configuration
Check `product-recommendation-service/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=RecommendationServiceDB;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=Test1234!
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.SQLServer2012Dialect
```

### 3. Build All Services
```bash
# Build Eureka Server
cd eureka-server
mvn clean package -DskipTests
cd ..

# Build API Gateway
cd api-gateway
mvn clean package -DskipTests
cd ..

# Build User Service
cd user-service
mvn clean package -DskipTests
cd ..

# Build Product Catalog Service
cd product-catalog-service
mvn clean package -DskipTests
cd ..

# Build Order Service
cd order-service
mvn clean package -DskipTests
cd ..

# Build Product Recommendation Service
cd product-recommendation-service
mvn clean package -DskipTests
cd ..
```

## Service Startup

### Startup Order (Critical!)
Services must be started in the following order to ensure proper registration and dependency resolution:

#### 1. Start Eureka Server (Service Discovery)
```bash
cd eureka-server
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar
```

**Wait for Eureka to fully start** (about 30-45 seconds) before starting other services. You should see:
```
Started EurekaServerApplication in X.XXX seconds
```

#### 2. Verify Eureka is Running
```bash
# In a new terminal, check Eureka health
curl http://localhost:8761/actuator/health
# Should return: {"status":"UP"}

# Check Eureka dashboard
curl -s http://localhost:8761/ | grep -i eureka
# Should return HTML content with Eureka title
```

#### 3. Start Business Services
Open new terminals for each service and start them **one at a time**, waiting 10-15 seconds between each:

**User Service:**
```bash
cd user-service
java -jar target/user-service-0.0.1-SNAPSHOT.jar
```

**Product Catalog Service:**
```bash
cd product-catalog-service
java -jar target/product-catalog-service-0.0.1-SNAPSHOT.jar
```

**Order Service:**
```bash
cd order-service
java -jar target/order-service-0.0.1-SNAPSHOT.jar
```

**Product Recommendation Service:**
```bash
cd product-recommendation-service
java -jar target/product-recommendation-service-0.0.1-SNAPSHOT.jar
```

#### 4. Start API Gateway (Last)
```bash
cd api-gateway
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
```

### Background Service Execution (Optional)
To run services in the background:
```bash
# Example for User Service
cd user-service
nohup java -jar target/user-service-0.0.1-SNAPSHOT.jar > ../user-service.log 2>&1 &
echo $! > ../user-service.pid
cd ..
```

## Service Ports
- **Eureka Server**: 8761
- **API Gateway**: 8900
- **User Service**: 8080
- **Product Catalog Service**: 8081
- **Order Service**: 8082
- **Product Recommendation Service**: 8083
- **SQL Server**: 1433
- **Redis**: 6379

## Verification

### 1. Check Eureka Dashboard
Open browser and navigate to: http://localhost:8761

You should see all services registered in the Eureka dashboard:
- API-GATEWAY
- USER-SERVICE
- PRODUCT-CATALOG-SERVICE
- ORDER-SERVICE
- PRODUCT-RECOMMENDATION-SERVICE

### 2. Health Checks
```bash
# Eureka Server
curl http://localhost:8761/actuator/health
# Expected: {"status":"UP"}

# User Service
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}

# Product Catalog Service
curl http://localhost:8081/actuator/health
# Expected: {"status":"UP"}

# Order Service
curl http://localhost:8082/actuator/health
# Expected: {"status":"UP"}

# Product Recommendation Service
curl http://localhost:8083/actuator/health
# Expected: {"status":"UP"}

# API Gateway
curl http://localhost:8900/actuator/health
# Expected: {"status":"UP"}
```

### 3. Service Registration Verification
```bash
# Check registered services in Eureka
curl -s http://localhost:8761/eureka/apps | grep -o '<name>[^<]*</name>' | sed 's/<[^>]*>//g'
# Should list all service names
```

### 4. API Testing
```bash
# Test user registration via API Gateway
curl -X POST http://localhost:8900/api/accounts/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Test user login
curl -X POST http://localhost:8900/api/accounts/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Test product catalog via API Gateway
curl http://localhost:8900/api/catalog/products

# Test recommendations via API Gateway
curl http://localhost:8900/api/review/recommendations
```

## Troubleshooting

### Common Issues

#### Java Version Issues
```bash
# Check current Java version
java -version
# Should show Java 11

# List available Java versions
sudo update-alternatives --config java

# Set correct Java version if needed
sudo update-alternatives --config java
# Select Java 11 from the list
```

#### Database Connection Issues
```bash
# Check if SQL Server container is running
docker ps | grep sqlserver

# Test SQL Server connection
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "SELECT 1"

# Check if databases exist
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "SELECT name FROM sys.databases"

# Recreate databases if needed
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
DROP DATABASE IF EXISTS UserServiceDB;
DROP DATABASE IF EXISTS ProductCatalogDB;
DROP DATABASE IF EXISTS OrderServiceDB;
DROP DATABASE IF EXISTS RecommendationServiceDB;
CREATE DATABASE UserServiceDB;
CREATE DATABASE ProductCatalogDB;
CREATE DATABASE OrderServiceDB;
CREATE DATABASE RecommendationServiceDB;
"
```

#### Service Startup Issues
```bash
# Check service logs for errors
tail -f service-name.log

# Common error: Service not registering with Eureka
# Solution: Ensure Eureka is fully started before starting other services

# Common error: Database connection failed
# Solution: Verify database configuration and container status

# Common error: Port already in use
netstat -tulpn | grep :8080
# Kill process using the port if needed
sudo fuser -k 8080/tcp
```

#### Port Conflicts
```bash
# Check if ports are in use
netstat -tulpn | grep :8761
netstat -tulpn | grep :8900

# Kill processes using specific ports if needed
sudo fuser -k 8761/tcp
sudo fuser -k 8900/tcp
```

#### Docker Issues
```bash
# Restart Docker service
sudo systemctl restart docker

# Remove and recreate containers if needed
docker stop sqlserver redis
docker rm sqlserver redis

# Recreate containers with setup commands above
```

#### Service Registration Issues
- Ensure Eureka Server is fully started before starting other services
- Wait 30-45 seconds after starting Eureka before starting business services
- Check service logs for connection errors
- Verify network connectivity between services
- Ensure all services are using the correct Eureka URL: http://localhost:8761/eureka

### Log Analysis
```bash
# View service logs in real-time
tail -f service-name.log

# Search for specific errors
grep -i "error\|exception\|failed" service-name.log

# Check database connection logs
grep -i "database\|connection\|hibernate" service-name.log
```

### Memory Issues
If services fail to start due to memory issues:
```bash
# Start services with reduced memory allocation
java -Xmx512m -jar target/service-name.jar

# Or increase available memory
java -Xmx1024m -jar target/service-name.jar
```

## Emergency Reset

### Stop All Services
```bash
# Find Java processes
ps aux | grep java

# Kill specific processes (replace PID with actual process ID)
kill -9 <PID>

# Or kill all Java processes (use with caution)
pkill -f java

# If using background execution with PID files
if [ -f eureka-server.pid ]; then kill $(cat eureka-server.pid) && rm eureka-server.pid; fi
if [ -f user-service.pid ]; then kill $(cat user-service.pid) && rm user-service.pid; fi
if [ -f product-catalog-service.pid ]; then kill $(cat product-catalog-service.pid) && rm product-catalog-service.pid; fi
if [ -f order-service.pid ]; then kill $(cat order-service.pid) && rm order-service.pid; fi
if [ -f product-recommendation-service.pid ]; then kill $(cat product-recommendation-service.pid) && rm product-recommendation-service.pid; fi
if [ -f api-gateway.pid ]; then kill $(cat api-gateway.pid) && rm api-gateway.pid; fi
```

### Reset Docker Containers
```bash
# Stop and remove specific containers
docker stop sqlserver redis
docker rm sqlserver redis

# Recreate containers
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Test1234!" \
  -p 1433:1433 --name sqlserver --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2019-latest

docker run --name redis -p 6379:6379 -d redis:6.2-alpine

# Recreate databases
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Test1234!" -C -Q "
CREATE DATABASE UserServiceDB;
CREATE DATABASE ProductCatalogDB;
CREATE DATABASE OrderServiceDB;
CREATE DATABASE RecommendationServiceDB;
"
```

### Clean Build
```bash
# Clean all Maven builds
find . -name "target" -type d -exec rm -rf {} +

# Remove log files
rm -f *.log *.pid

# Rebuild all services
# Follow build steps from "Project Setup" section
```

## Additional Notes

### Development Mode
For development, you can run services with Spring Boot DevTools for hot reloading:
```bash
mvn spring-boot:run
```

### Production Considerations
- Use environment-specific configuration files
- Set up proper logging configuration
- Configure security settings
- Set up monitoring and health checks
- Use Docker Compose for container orchestration
- Configure persistent volumes for databases
- Set up load balancing for high availability

### Database Persistence
The current setup uses `create-drop` for Hibernate DDL. For production:
- Change `spring.jpa.hibernate.ddl-auto` to `validate` or `update`
- Set up database migrations with Flyway or Liquibase
- Configure backup strategies
- Use persistent volumes for Docker containers

### Monitoring and Logging
```bash
# Enable Spring Boot Actuator endpoints for monitoring
# Add to application.properties:
management.endpoints.web.exposure.include=health,info,metrics,prometheus

# Access metrics
curl http://localhost:8080/actuator/metrics
curl http://localhost:8080/actuator/info
```

## Support
For issues or questions:
- Check the project README.md
- Review service logs for error details
- Ensure all prerequisites are properly installed
- Verify network connectivity and port availability
- Check database connectivity and configuration
- Ensure proper service startup sequence
