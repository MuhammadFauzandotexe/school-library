package com.zan.school.library.backend.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRentMemberDto {
    private Long id;
    private String memberId;
    private String name;
}