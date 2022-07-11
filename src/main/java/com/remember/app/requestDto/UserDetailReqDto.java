package com.remember.app.requestDto;

import com.remember.app.entity.user.User;
import com.remember.app.entity.user.UserDetail;

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
public class UserDetailReqDto {

	private int user_id;
	private String name;
	private String nickname;
	private String company_name;
	private String department_name;
	
	public User toUserEntity() {
		return User.builder()
							   .id(user_id)
							   .name(name)
							   .nickname(nickname)
							   .build();
	}
	
	public UserDetail toUserDetailEntity() {
		return UserDetail.builder()
										  .id(user_id)
										  .name(name)
										  .nickname(nickname)
										  .company_name(company_name)
										  .department_name(department_name)
										  .build();
	}
}
