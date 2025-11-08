package com.zan.school.library.backend.model.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthResponseDto {

    private UserDto user;
    private String token;

    public AuthResponseDto(UserDto user, String token) {
        this.user = user;
        this.token = token;
    }

}
