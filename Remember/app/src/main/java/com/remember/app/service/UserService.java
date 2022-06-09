package com.remember.app.service;

import com.remember.app.requestDto.EmailSignupReqDto;
import com.remember.app.requestDto.TermsReqDto;

public interface UserService {

	public boolean signupWithEmail(TermsReqDto termsDto, EmailSignupReqDto emailSignupReqDto);
}
