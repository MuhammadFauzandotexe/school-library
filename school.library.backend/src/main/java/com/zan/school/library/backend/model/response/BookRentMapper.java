package com.zan.school.library.backend.model.response;

import com.zan.school.library.backend.entity.BookRent;

public class BookRentMapper {

    public static BookRentResponseDto toDto(BookRent rent) {
        if (rent == null) {
            return null;
        }

        BookRentResponseDto dto = new BookRentResponseDto();
        dto.setId(rent.getId());
        dto.setRentDate(rent.getRentDate());
        dto.setDueDate(rent.getDueDate());
        dto.setReturnDate(rent.getReturnDate());
        dto.setStatus(rent.getStatus());

        if (rent.getMember() != null) {
            dto.setMember(rent.getMember().getName());
        } else {
            dto.setMember(null);
        }

        if (rent.getBook() != null) {
            dto.setBook(rent.getBook().getTitle());
        } else {
            dto.setBook(null);
        }

        return dto;
    }

}