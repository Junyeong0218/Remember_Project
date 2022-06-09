package com.remember.app.entity.user;

import java.time.LocalDateTime;

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
	
	private String profile_img;
	private String name;
	private String company_name;
	private String department_name;
	private String position_name;
	
}
