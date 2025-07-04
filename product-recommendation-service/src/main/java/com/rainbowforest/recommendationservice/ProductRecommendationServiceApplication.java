package com.rainbowforest.recommendationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableFeignClients
@EnableEurekaClient
@EnableJpaRepositories
@ComponentScan(basePackages = "com.rainbowforest.recommendationservice")
public class ProductRecommendationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductRecommendationServiceApplication.class, args);
    }
}
