package com.zan.school.library.backend.controller;

import com.zan.school.library.backend.entity.Book;
import com.zan.school.library.backend.model.request.BookRequestDto;
import com.zan.school.library.backend.model.response.ApiResponse;
import com.zan.school.library.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Book>>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        ApiResponse<List<Book>> response = ApiResponse.success(
                HttpStatus.OK,
                "Successfully retrieved all books.",
                books
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        ApiResponse<Book> response = ApiResponse.success(
                HttpStatus.OK,
                "Book retrieved successfully.",
                book
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Book>> createBook(@RequestBody BookRequestDto bookRequestDto) {
        Book book = new Book();
        BeanUtils.copyProperties(bookRequestDto,book);
        Book createdBook = bookService.createBook(book);
        ApiResponse<Book> response = ApiResponse.success(
                HttpStatus.CREATED,
                "Book created successfully.",
                createdBook
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        Book updatedBook = bookService.updateBook(id, bookDetails);
        ApiResponse<Book> response = ApiResponse.success(
                HttpStatus.OK,
                "Book updated successfully.",
                updatedBook
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        ApiResponse<Void> response = ApiResponse.success(
                HttpStatus.NO_CONTENT,
                "Book deleted successfully.",
                null
        );
        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }
}