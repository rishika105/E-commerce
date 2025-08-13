package com.ecom.models;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

public enum Role {
    USER, SELLER, ADMIN;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(this.name()));
    }
}
