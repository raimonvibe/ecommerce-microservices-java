package com.rainbowforest.apigateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to RainbowForest E-commerce Microservices Platform");
        response.put("status", "API Gateway is running");
        response.put("version", "1.0.0");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("User Management", "/api/accounts/users");
        endpoints.put("User Registration", "/api/accounts/registration");
        endpoints.put("Product Catalog", "/api/catalog/products");
        endpoints.put("Add Product (Admin)", "/api/catalog/admin/products");
        endpoints.put("Shopping Cart", "/api/shop/cart");
        endpoints.put("Product Recommendations", "/api/review/recommendations");
        endpoints.put("Service Registry", "/eureka");
        
        response.put("available_endpoints", endpoints);
        
        Map<String, String> usage = new HashMap<>();
        usage.put("note", "All API endpoints require the /api prefix");
        usage.put("example", "GET /api/catalog/products - Browse all products");
        usage.put("authentication", "Some endpoints require authentication (cart, orders)");
        
        response.put("usage_info", usage);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "API Gateway");
        return ResponseEntity.ok(response);
    }
}
