package com.remember.app.requestDto;

import com.remember.app.entity.user.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PasswordDto {

	private String origin_password;
	private String new_password;
	
	public User toUserEntity(int user_id) {
		return User.builder()
							   .id(user_id)
							   .password(new_password)
							   .build();
	}
	
	public User toUserEntityForCheck(int user_id) {
		return User.builder()
							   .id(user_id)
							   .password(origin_password)
							   .build();
	}
}
