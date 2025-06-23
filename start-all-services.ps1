# Pad naar je project
$projectRoot = "D:\Documenten\Projecten\ecommerce-microservices-java\ecommerce-microservices-java"
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-11.0.26.4-hotspot"

# Eureka Server
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Write-Host '=== Starting Eureka Server (Service Registry) ===' -ForegroundColor Green;
     cd '$projectRoot\eureka-server';
     \$env:JAVA_HOME = '$javaHome';
     mvn spring-boot:run"
)

# User Service
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Write-Host '=== Starting User Service ===' -ForegroundColor Cyan;
     cd '$projectRoot\user-service';
     \$env:JAVA_HOME = '$javaHome';
     mvn spring-boot:run"
)

# Product Catalog Service
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Write-Host '=== Starting Product Catalog Service ===' -ForegroundColor Cyan;
     cd '$projectRoot\product-catalog-service';
     \$env:JAVA_HOME = '$javaHome';
     mvn spring-boot:run"
)

# Product Recommendation Service
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Write-Host '=== Starting Product Recommendation Service ===' -ForegroundColor Cyan;
     cd '$projectRoot\product-recommendation-service';
     \$env:JAVA_HOME = '$javaHome';
     mvn spring-boot:run"
)

# Order Service
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Write-Host '=== Starting Order Service ===' -ForegroundColor Cyan;
     cd '$projectRoot\order-service';
     \$env:JAVA_HOME = '$javaHome';
     mvn spring-boot:run"
)

# API Gateway
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "Write-Host '=== Starting API Gateway (Final Step) ===' -ForegroundColor Green;
     cd '$projectRoot\api-gateway';
     \$env:JAVA_HOME = '$javaHome';
     mvn spring-boot:run"
)
