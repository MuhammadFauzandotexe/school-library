package com.zan.school.library.backend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.UUID;

@Entity
@Table(name="m_roles")
public class Role implements GrantedAuthority {

    @Getter
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    @Column(name="role_id")
    private UUID roleId;

    @Setter
    @Column(unique = true, nullable = false)
    private String authority;

    public Role(){
        super();
    }

    public Role(String authority){
        this.authority = authority;
    }

    public Role(UUID roleId, String authority){
        this.roleId = roleId;
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return this.authority;
    }

    public void setRoleId(UUID roleId){
        this.roleId = roleId;
    }
}
