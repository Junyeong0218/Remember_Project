package com.remember.app.responseDto;

import java.util.List;

import com.remember.app.entity.user.User;
import com.remember.app.entity.user.UserOauthDetail;

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
public class UserLoginFlagsResDto {

	private User user;
	private List<UserOauthDetail> oauthDetails;
}
