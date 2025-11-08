package com.zan.school.library.backend.model.response;

import com.zan.school.library.backend.entity.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.UUID;
import java.util.Set;
import java.util.stream.Collectors;

@Setter
@Getter
public class UserDto {
    private UUID id;
    private String username;
    private Set<String> authorities;

    public UserDto(User user) {
        this.id = user.getUserId();
        this.username = user.getUsername();

        this.authorities =  user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }
}