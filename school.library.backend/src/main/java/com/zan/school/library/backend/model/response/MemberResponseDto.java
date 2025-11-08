package com.zan.school.library.backend.model.response;

import com.zan.school.library.backend.entity.Member;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@Getter
public class MemberResponseDto {

    private Long id;

    private String memberId;

    private String name;

    private String email;

    private LocalDate joinDate;

    private String username;

    public static MemberResponseDto mapFrom(Member member) {

        MemberResponseDto dto = new MemberResponseDto();

        dto.id = member.getId();
        dto.memberId = member.getMemberId();
        dto.name = member.getName();
        dto.email = member.getEmail();
        dto.joinDate = member.getJoinDate();

        if (member.getUser() != null) {
            dto.username = member.getUser().getUsername();
        } else {
            dto.username = "*******";
        }
        return dto;
    }
}
