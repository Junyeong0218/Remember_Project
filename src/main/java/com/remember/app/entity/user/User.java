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
public class User {

	private int id;
	private String email;
	private String password;
	private String name;
	private String nickname;
	private String phone;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	private String role;
	
}
