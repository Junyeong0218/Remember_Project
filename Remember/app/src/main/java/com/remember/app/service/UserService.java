package com.remember.app.service;

import com.remember.app.entity.user.User;
import com.remember.app.entity.user.UserDetail;
import com.remember.app.entity.user.UserOauthDetail;
import com.remember.app.requestDto.EmailSignupReqDto;
import com.remember.app.requestDto.TermsReqDto;
import com.remember.app.requestDto.UserDetailReqDto;
import com.remember.app.responseDto.UserLoginFlagsResDto;

public interface UserService {

	public boolean signupWithEmail(TermsReqDto termsDto, EmailSignupReqDto emailSignupReqDto);
	
	public UserLoginFlagsResDto getAvailableLogins(String phone);
	
	public boolean insertUserDetail(UserDetailReqDto userDetailReqDto);
	
	public UserDetail getUserDetailById(int id);
	
	public boolean deleteUser(int id);
	
	public boolean insertNewOAuthDetail(UserOauthDetail userOauthDetail);
	
	public boolean deleteOAuthDetail(int id);
	
	public boolean insertNewPassword(User user);
	
	public boolean checkOriginPassword(User user);
	
	public boolean updatePassword(User user);
	
}
