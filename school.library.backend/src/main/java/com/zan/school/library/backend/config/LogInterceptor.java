package com.zan.school.library.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.util.Enumeration;

@Slf4j
public class LogInterceptor implements HandlerInterceptor {

    private static final String START_TIME = "startTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        long startTime = System.currentTimeMillis();
        request.setAttribute(START_TIME, startTime);

        log.info("Incoming request: {} {}", request.getMethod(), request.getRequestURI());

        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            log.debug("Header: {} = {}", name, request.getHeader(name));
        }

        if (request instanceof ContentCachingRequestWrapper cachedRequest) {
            String body = new String(cachedRequest.getContentAsByteArray(), request.getCharacterEncoding());
            if (!body.isBlank()) {
                log.debug("Request body: {}", body);
            }
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) throws Exception {
        Long startTime = (Long) request.getAttribute(START_TIME);
        if (startTime != null) {
            long duration = System.currentTimeMillis() - startTime;
            log.info("Completed {} {} with status {} in {} ms",
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus(),
                    duration);
        }

        if (ex != null) {
            log.error("Exception during {} {}: ", request.getMethod(), request.getRequestURI(), ex);
        }
    }
}
