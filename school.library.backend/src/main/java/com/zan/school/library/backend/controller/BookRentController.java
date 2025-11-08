package com.zan.school.library.backend.controller;

import com.zan.school.library.backend.entity.BookRent;
import com.zan.school.library.backend.model.request.RentRequestDto;
import com.zan.school.library.backend.model.response.ApiResponse;
import com.zan.school.library.backend.model.response.BookRentResponseDto;
import com.zan.school.library.backend.service.BookRentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class BookRentController {

    private final BookRentService bookRentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookRentResponseDto>>> getAllRentals() {
        List<BookRentResponseDto> rentals = bookRentService.getAllRentals();
        ApiResponse<List<BookRentResponseDto>> response = ApiResponse.success(
                HttpStatus.OK,
                "Successfully retrieved all book rentals.",
                rentals
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookRentResponseDto>> getRentalById(@PathVariable Long id) {
        BookRentResponseDto rent = bookRentService.getRentalById(id);
        ApiResponse<BookRentResponseDto> response = ApiResponse.success(
                HttpStatus.OK,
                "Book rental retrieved successfully.",
                rent
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/rent")
    public ResponseEntity<ApiResponse<BookRentResponseDto>> rentBook(@RequestBody RentRequestDto rentRequest) {
        BookRentResponseDto bookRentResponseDto = bookRentService.rentBook(rentRequest.memberId, rentRequest.bookId);
        ApiResponse<BookRentResponseDto> response = ApiResponse.success(
                HttpStatus.CREATED,
                "Book rented successfully.",
                bookRentResponseDto
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/return/{rentId}")
    public ResponseEntity<ApiResponse<BookRentResponseDto>> returnBook(@PathVariable Long rentId) {
        BookRentResponseDto returnedRent = bookRentService.returnBook(rentId);
        ApiResponse<BookRentResponseDto> response = ApiResponse.success(
                HttpStatus.OK,
                "Book returned successfully.",
                returnedRent
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRental(@PathVariable Long id) {
        bookRentService.deleteRental(id);
        ApiResponse<Void> response = ApiResponse.success(
                HttpStatus.OK,
                "Book rental deleted successfully.",
                null
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}