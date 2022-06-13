package com.remember.app.principal;

import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.remember.app.entity.user.UserDetail;

public class PrincipalDetails implements UserDetails, OAuth2User {
	private static final long serialVersionUID = 1L;
	
	private UserDetail userDetail;
	private Map<String, Object> attributes;
	
	public PrincipalDetails(UserDetail userDetail) {
		this.userDetail = userDetail;
	}
	
	public PrincipalDetails(UserDetail userDetail, Map<String, Object> attributes) {
		this.userDetail = userDetail;
		this.attributes = attributes;
	}
	
	public UserDetail getUser() {
		return userDetail;
	}
	
	@Override
	public Map<String, Object> getAttributes() {
		return attributes;
	}

	@Override
	public String getName() {
		return userDetail.getName();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getPassword() {
		return userDetail.getPassword();
	}

	@Override
	public String getUsername() {
		return userDetail.getEmail();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
	
}
