package com.example.backend.common;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.*;
@Component
public class CurrentUserResolver implements HandlerInterceptor {
    public static final String ATTR = "currentUser";
    @Override public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object h){
        String id = req.getHeader("X-User-Id");
        if (id!=null && !id.isBlank()) req.setAttribute(ATTR, new CurrentUser(Long.valueOf(id)));
        return true;
    }
}


