package com.zan.school.library.backend.service;

import com.zan.school.library.backend.entity.Member;
import com.zan.school.library.backend.exception.ResourceNotFoundException;
import com.zan.school.library.backend.model.response.MemberResponseDto;
import com.zan.school.library.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public List<MemberResponseDto> getAllMembers() {
        return memberRepository.findAll().stream().map(MemberResponseDto::mapFrom)
                .collect(Collectors.toList());
    }

    public MemberResponseDto getMemberById(Long id) {
        return MemberResponseDto.mapFrom(memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id)));
    }

    public MemberResponseDto createMember(Member member) {
        return MemberResponseDto.mapFrom(memberRepository.save(member));
    }

    public MemberResponseDto updateMember(Long id, Member memberDetails) {
        Member member = findById(id);
        member.setName(memberDetails.getName());
        member.setEmail(memberDetails.getEmail());
        return MemberResponseDto.mapFrom(memberRepository.save(member));
    }

    public void deleteMember(Long id) {
        Member member = findById(id);
        memberRepository.delete(member);
    }

    private Member findById(Long id){
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }
}