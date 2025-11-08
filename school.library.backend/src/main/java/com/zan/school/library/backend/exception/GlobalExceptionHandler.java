package com.zan.school.library.backend.exception;

import com.zan.school.library.backend.model.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.ConstraintViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        ApiResponse<Object> apiResponse = ApiResponse.error(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                "Resource not found on the server."
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({ConstraintViolationException.class, DataIntegrityViolationException.class})
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolationAndDataIntegrity(
            Exception ex, WebRequest request) {

        String errorMessage = "Data validation or integrity error.";
        String errorDetail = ex.getMessage();

        if (ex instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException dataEx = (DataIntegrityViolationException) ex;
            if (dataEx.getRootCause() instanceof org.postgresql.util.PSQLException) {
                org.postgresql.util.PSQLException psqlEx = (org.postgresql.util.PSQLException) dataEx.getRootCause();
                String sqlState = psqlEx.getSQLState();
                String detail = psqlEx.getMessage();

                if ("23505".equals(sqlState) && detail != null) {
                    errorMessage = "Duplicate entry detected.";
                    errorDetail = detail;
                } else {
                    errorMessage = "Database integrity violation.";
                    errorDetail = psqlEx.getMessage();
                }
            } else {
                errorMessage = "Database integrity violation.";
                errorDetail = dataEx.getMessage();
            }
        } else if (ex instanceof ConstraintViolationException) {
            ConstraintViolationException constraintEx = (ConstraintViolationException) ex;
            errorMessage = "Input validation failed.";
            errorDetail = constraintEx.getConstraintViolations().stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining("; "));
        }

        ApiResponse<Object> apiResponse = ApiResponse.error(
                HttpStatus.BAD_REQUEST,
                errorMessage,
                errorDetail
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUsernameNotFoundException(
            UsernameNotFoundException ex, WebRequest request) {

        ApiResponse<Object> apiResponse = ApiResponse.error(
                HttpStatus.BAD_REQUEST,
                "Invalid credentials.",
                ex.getMessage()
        );

        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResourceException(
            DuplicateResourceException ex, WebRequest request) {

        ApiResponse<Object> apiResponse = ApiResponse.error(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                "Attempted to create a duplicate resource."
        );

        return new ResponseEntity<>(apiResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentialsException(
            BadCredentialsException ex, WebRequest request) {

        ApiResponse<Object> apiResponse = ApiResponse.error(
                HttpStatus.UNAUTHORIZED,
                "Invalid username or password.",
                "Bad credentials."
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericRuntimeException(
            RuntimeException ex, WebRequest request) {

        ex.printStackTrace();

        ApiResponse<Object> apiResponse = ApiResponse.error(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred.",
                ex.getMessage());
        return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}