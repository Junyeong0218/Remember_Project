package com.remember.app.restController;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.requestDto.EmailSignupReqDto;
import com.remember.app.requestDto.TermsReqDto;
import com.remember.app.responseDto.UserLoginFlagsResDto;
import com.remember.app.service.PhoneCertificateService;
import com.remember.app.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthRestController {
	
	private final UserService userService;
	
	private final PhoneCertificateService phoneCertificateService;
	
	@GetMapping("/signup/account/list")
	public UserLoginFlagsResDto savePhoneStatus(HttpServletRequest request, TermsReqDto dto) {
		try {
			request.getSession().setAttribute("dto", dto);
			UserLoginFlagsResDto resDto =  userService.getAvailableLogins(dto.getPhone());
			System.out.println(resDto);
			return resDto == null ? new UserLoginFlagsResDto() : resDto;
		} catch (Exception e) {
			System.out.println("catched");
			return new UserLoginFlagsResDto();
		}
	}
	
	@PostMapping("/signup/phone/certificate")
	public boolean sendPhoneMessage(String phone) {
		return phoneCertificateService.sendMessage(phone);
	}
	
	@GetMapping("/signup/phone/certificate")
	public boolean isEqual(String code, String phone) {
		return phoneCertificateService.isEqual(code, phone);
	}
	
	@PostMapping("/signup/email")
	public boolean signupWithEmail(HttpServletRequest request, EmailSignupReqDto emailSignupReqDto) {
		TermsReqDto termsDto = (TermsReqDto) request.getSession().getAttribute("dto");
		System.out.println(termsDto);
		System.out.println(emailSignupReqDto);
		
		return userService.signupWithEmail(termsDto, emailSignupReqDto);
	}
}
