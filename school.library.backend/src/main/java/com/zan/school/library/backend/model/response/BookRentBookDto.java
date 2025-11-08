package com.zan.school.library.backend.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRentBookDto {
    private Long id;
    private String isbn;
    private String title;
    private String author;
}