package com.zan.school.library.backend.model.response;

import com.zan.school.library.backend.entity.RentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookRentResponseDto {
    private Long id;

    private LocalDate rentDate;

    private LocalDate dueDate;

    private LocalDate returnDate;

    private RentStatus status;

    private String member;

    private String book;
}