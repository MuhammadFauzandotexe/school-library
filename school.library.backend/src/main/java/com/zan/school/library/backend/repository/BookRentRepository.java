package com.zan.school.library.backend.repository;

import com.zan.school.library.backend.entity.BookRent;
import com.zan.school.library.backend.entity.RentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRentRepository extends JpaRepository<BookRent, Long> {
    List<BookRent> findByMemberIdAndStatus(Long memberId, RentStatus status);
}