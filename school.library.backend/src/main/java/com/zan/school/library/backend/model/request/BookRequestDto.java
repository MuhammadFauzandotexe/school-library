package com.zan.school.library.backend.model.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BookRequestDto {
    private String isbn;
    private String title;
    private String author;
    private String publisher;
    private int publicationYear;
    private int stock;
}
