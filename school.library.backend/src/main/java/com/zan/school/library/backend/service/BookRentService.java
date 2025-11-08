package com.zan.school.library.backend.service;

import com.zan.school.library.backend.entity.Book;
import com.zan.school.library.backend.entity.BookRent;
import com.zan.school.library.backend.entity.Member;
import com.zan.school.library.backend.entity.RentStatus;
import com.zan.school.library.backend.exception.ResourceNotFoundException;
import com.zan.school.library.backend.model.response.BookRentMapper;
import com.zan.school.library.backend.model.response.BookRentResponseDto;
import com.zan.school.library.backend.repository.BookRentRepository;
import com.zan.school.library.backend.repository.BookRepository;
import com.zan.school.library.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookRentService {


    private final BookRentRepository bookRentRepository;

    private final BookRepository bookRepository;

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<BookRentResponseDto> getAllRentals() {

        List<BookRent> rentals = bookRentRepository.findAll();

        return rentals.stream()
                .map(BookRentMapper::toDto)
                .collect(Collectors.toList());
    }

    public BookRentResponseDto getRentalById(Long id) {
        BookRent bookRent = bookRentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental not found with id: " + id));
        return BookRentMapper.toDto(bookRent);
    }

    @Transactional
    public BookRentResponseDto rentBook(Long memberId, Long bookId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (book.getStock() <= 0) {
            throw new RuntimeException("Book is out of stock");
        }

        book.setStock(book.getStock() - 1);
        bookRepository.save(book);

        BookRent rent = new BookRent();
        rent.setMember(member);
        rent.setBook(book);
        rent.setRentDate(LocalDate.now());
        rent.setDueDate(LocalDate.now().plusDays(7));
        rent.setStatus(RentStatus.BORROWED);

        BookRent save = bookRentRepository.save(rent);
        return BookRentMapper.toDto(save);
    }

    @Transactional
    public BookRentResponseDto returnBook(Long rentId) {
        BookRent rent = findRentById(rentId);

        if (rent.getStatus() == RentStatus.RETURNED) {
            throw new RuntimeException("Book already returned");
        }

        rent.setReturnDate(LocalDate.now());
        if (LocalDate.now().isAfter(rent.getDueDate())) {
            rent.setStatus(RentStatus.OVERDUE);
        } else {
            rent.setStatus(RentStatus.RETURNED);
        }

        Book book = rent.getBook();
        book.setStock(book.getStock() + 1);
        bookRepository.save(book);

        BookRent save = bookRentRepository.save(rent);
        return BookRentMapper.toDto(save);
    }

    public BookRent findRentById(Long id) {
        return bookRentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental not found with id: " + id));
    }

    public void deleteRental(Long id) {
        // Logika untuk menghapus rental, misalnya:
        // bookRentRepository.deleteById(id);
    }
}