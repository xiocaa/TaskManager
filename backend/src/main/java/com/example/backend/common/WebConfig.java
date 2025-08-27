package com.example.backend.common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired CurrentUserResolver cur;
    @Override public void addCorsMappings(CorsRegistry r) {
        r.addMapping("/**").allowedMethods("*").allowedOrigins("*").allowedHeaders("*");
    }
    @Override public void addInterceptors(InterceptorRegistry registry) { registry.addInterceptor(cur); }
}

