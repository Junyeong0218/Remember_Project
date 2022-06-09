package com.remember.app.restController;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.requestDto.EmailSignupReqDto;
import com.remember.app.requestDto.TermsReqDto;
import com.remember.app.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthRestController {
	
	private final UserService userService;
	
	@PostMapping("/signup/phone")
	public boolean savePhoneStatus(HttpServletRequest request, TermsReqDto dto) {
		try {
			request.getSession().setAttribute("dto", dto);
			System.out.println("controller : " + request.getSession().getId());
			System.out.println(request.getSession().getAttribute("dto"));
			return true;
		} catch (Exception e) {
			System.out.println("catched");
			return false;
		}
	}
	
	@PostMapping("/signup/email")
	public boolean signupWithEmail(HttpServletRequest request, EmailSignupReqDto emailSignupReqDto) {
		TermsReqDto termsDto = (TermsReqDto) request.getSession().getAttribute("dto");
		System.out.println(termsDto);
		System.out.println(emailSignupReqDto);
		
		return userService.signupWithEmail(termsDto, emailSignupReqDto);
	}
}
