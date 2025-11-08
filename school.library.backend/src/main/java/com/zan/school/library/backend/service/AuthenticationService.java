package com.zan.school.library.backend.service;

import com.zan.school.library.backend.entity.Member;
import com.zan.school.library.backend.entity.Role;
import com.zan.school.library.backend.entity.User;
import com.zan.school.library.backend.exception.DuplicateResourceException;
import com.zan.school.library.backend.model.request.LoginRequestDto;
import com.zan.school.library.backend.model.request.RegisterRequestDto;
import com.zan.school.library.backend.model.response.AuthResponseDto;
import com.zan.school.library.backend.model.response.UserDto;
import com.zan.school.library.backend.repository.MemberRepository;
import com.zan.school.library.backend.repository.RoleRepository;
import com.zan.school.library.backend.repository.UserRepository;
import com.zan.school.library.backend.util.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public UserDto registerUser(RegisterRequestDto registerDto) {

        userRepository.findByUsername(registerDto.getUsername())
                .ifPresent(user -> {
                    throw new DuplicateResourceException("Username '" + user.getUsername() + "' already taken.");
                });

        memberRepository.findByEmail(registerDto.getEmail())
                .ifPresent(member -> {
                    throw new DuplicateResourceException("Email '" + member.getEmail() + "' already taken.");
                });

        Member newMember = new Member();
        newMember.setName(registerDto.getName());
        newMember.setEmail(registerDto.getEmail());
        Member savedMember = memberRepository.save(newMember);

        String encodedPassword = passwordEncoder.encode(registerDto.getPassword());

        Set<Role> authorities = new HashSet<>();
        Set<String> requestedRoles = registerDto.getRoles();

        if (requestedRoles == null || requestedRoles.isEmpty()) {
            Role userRole = roleRepository.findByAuthority("USER")
                    .orElseThrow(() -> new RuntimeException("Default USER role not found."));
            authorities.add(userRole);
        } else {
            for (String roleName : requestedRoles) {
                Role role = roleRepository.findByAuthority(roleName)
                        .orElseThrow(() -> new RuntimeException("Role '" + roleName + "' not found."));
                authorities.add(role);
            }
        }

        User newUser = new User(registerDto.getUsername(), encodedPassword, authorities);
        newUser.setMember(savedMember);
        User savedUser = userRepository.save(newUser);

        return new UserDto(savedUser);
    }

    public AuthResponseDto loginUser(LoginRequestDto loginDto) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
        );

        String token = tokenService.generateJwt(auth);

        User user = (User) auth.getPrincipal();

        return new AuthResponseDto(new UserDto(user), token);
    }

}