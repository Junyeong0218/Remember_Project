package com.remember.app.requestDto;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.remember.app.entity.user.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class EmailSignupReqDto {
	
	private String email;
	private String password;
	
	public User toEntity(BCryptPasswordEncoder passwordEncoder) {
		return User.builder()
							   .email(email)
							   .password(passwordEncoder.encode(password))
							   .role("ROLE_USER")
							   .build();
	}
}
