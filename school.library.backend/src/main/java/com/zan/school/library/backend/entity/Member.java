package com.zan.school.library.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "m_members")
@Setter
@Getter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String memberId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private LocalDate joinDate;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<BookRent> rentals;

    @OneToOne(mappedBy = "member", fetch = FetchType.LAZY)
    @JsonIgnore
    private User user;

    @PrePersist
    public void onPrePersist() {

        if (this.joinDate == null) {
            this.joinDate = LocalDate.now();
        }

        if (this.memberId == null) {
            this.memberId = "M-" + System.currentTimeMillis();
        }
    }

}