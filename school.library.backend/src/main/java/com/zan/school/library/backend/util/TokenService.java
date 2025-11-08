package com.zan.school.library.backend.util;

import com.zan.school.library.backend.entity.Member;
import com.zan.school.library.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class TokenService {

    private final JwtEncoder jwtEncoder;

    public String generateJwt(Authentication auth) {

        User userDetails = (User) auth.getPrincipal();

        Member memberProfile = userDetails.getMember();

        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(3600))
                .subject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .claim("memberId", memberProfile != null ? memberProfile.getMemberId() : null)
                .claim("memberDbId", memberProfile != null ? memberProfile.getId() : null)
                .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}