package com.zan.school.library.backend.controller;

import com.zan.school.library.backend.model.request.LoginRequestDto;
import com.zan.school.library.backend.model.request.RegisterRequestDto;
import com.zan.school.library.backend.model.response.ApiResponse;
import com.zan.school.library.backend.model.response.AuthResponseDto;
import com.zan.school.library.backend.model.response.UserDto;
import com.zan.school.library.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> registerUser(
            @RequestBody RegisterRequestDto registerDto) {

        UserDto registeredUser = authenticationService.registerUser(registerDto);

        ApiResponse<UserDto> response = ApiResponse.success(
                HttpStatus.CREATED,
                "User registered successfully",
                registeredUser
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDto>> loginUser(
            @RequestBody LoginRequestDto loginDto) {

        AuthResponseDto authResponse = authenticationService.loginUser(loginDto);

        ApiResponse<AuthResponseDto> response = ApiResponse.success(
                HttpStatus.OK,
                "User logged in successfully",
                authResponse
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
