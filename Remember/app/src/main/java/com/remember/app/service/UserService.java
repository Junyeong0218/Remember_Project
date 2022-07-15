package com.remember.app.service;

import com.remember.app.entity.user.UserDetail;
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
}
