package com.remember.app.entity.user;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDetail {

	private int id;
	private String email;
	private String password;
	private String nickname;
	private String phone;
	private String role;
	private LocalDateTime create_date;
	
	private String oauth_username;
	private String provider;
	private LocalDateTime oauth_create_date;
	
	private String profile_img;
	private String name;
	private String company_name;
	private String department_name;
	private String position_name;
	
	public User toUserEntity() {
		return User.builder()
							   .id(id)
							   .email(email)
							   .nickname(nickname)
							   .phone(phone)
							   .role(role)
							   .create_date(create_date)
							   .build();
	}
	
	public UserOauthDetail toOauthDetailEntity() {
		return UserOauthDetail.builder()
													   .id(id)
													   .oauth_username(oauth_username)
													   .provider(provider)
													   .create_date(oauth_create_date)
													   .build();
	}
	
}
