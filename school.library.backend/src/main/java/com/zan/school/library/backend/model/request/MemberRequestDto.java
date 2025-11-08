package com.zan.school.library.backend.model.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MemberRequestDto {

    private String email;
    private String name;
    private String username;
    private String password;

}
