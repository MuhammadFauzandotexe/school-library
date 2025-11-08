package com.zan.school.library.backend.model.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
public class RegisterRequestDto {

    private String username;
    private String password;
    private String email;
    private String name;
    private Set<String> roles;

}
