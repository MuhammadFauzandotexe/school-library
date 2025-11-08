package com.zan.school.library.backend.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Setter
@Getter
public class ApiResponse<T> {

    private LocalDateTime timestamp;
    private HttpStatus status;
    private int statusCode;
    private String message;
    private T data;
    private String error;

    public ApiResponse(HttpStatus status, String message, T data) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.statusCode = status.value();
        this.message = message;
        this.data = data;
    }

    public ApiResponse(HttpStatus status, String message, String error) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.statusCode = status.value();
        this.message = message;
        this.error = error;
    }

    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> success(HttpStatus status, String message, T data) {
        return new ApiResponse<>(status, message, data);
    }

    public static <T> ApiResponse<T> error(HttpStatus status, String message, String errorDetail) {
        return new ApiResponse<>(status, message, errorDetail);
    }

}