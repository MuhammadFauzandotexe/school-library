package com.zan.school.library.backend.controller;

import com.zan.school.library.backend.entity.Member;
import com.zan.school.library.backend.model.request.RegisterRequestDto;
import com.zan.school.library.backend.model.response.ApiResponse;
import com.zan.school.library.backend.model.request.MemberRequestDto;
import com.zan.school.library.backend.model.response.MemberResponseDto;
import com.zan.school.library.backend.service.AuthenticationService;
import com.zan.school.library.backend.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    private final AuthenticationService authenticationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MemberResponseDto>>> getAllMembers() {

        List<MemberResponseDto> members = memberService.getAllMembers();

        ApiResponse<List<MemberResponseDto>> response = ApiResponse.success(
                HttpStatus.OK,
                "Successfully retrieved all members.",
                members
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMemberById(@PathVariable Long id) {
        MemberResponseDto member = memberService.getMemberById(id);

        ApiResponse<MemberResponseDto> response = ApiResponse.success(
                HttpStatus.OK,
                "Member retrieved successfully.",
                member
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponseDto>> createMember(@RequestBody MemberRequestDto memberRequestDto) {

        RegisterRequestDto registerRequestDto = new RegisterRequestDto();
        BeanUtils.copyProperties(memberRequestDto,registerRequestDto);
        registerRequestDto.setRoles(Set.of("USER"));
        authenticationService.registerUser(registerRequestDto);

        ApiResponse<MemberResponseDto> response = ApiResponse.success(
                HttpStatus.CREATED,
                "Member created successfully.",
                null
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MemberResponseDto>> updateMember(@PathVariable Long id, @RequestBody Member memberDetails) {
        MemberResponseDto updatedMember = memberService.updateMember(id, memberDetails);

        ApiResponse<MemberResponseDto> response = ApiResponse.success(
                HttpStatus.OK,
                "Member updated successfully.",
                updatedMember
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMember(@PathVariable Long id) {

        memberService.deleteMember(id);

        ApiResponse<Void> response = ApiResponse.success(
                HttpStatus.NO_CONTENT,
                "Member deleted successfully.",
                null
        );

        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }
}