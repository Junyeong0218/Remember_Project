package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {

	@GetMapping("/signin")
	public String signin() {
		return "/auth/signin";
	}
	
	@GetMapping("/signin/email")
	public String signinEmail() {
		return "/auth/signin_email";
	}
	
	@GetMapping("/signin/phone")
	public String signinPhone() {
		return "/auth/signin_phone";
	}
	
	@GetMapping("/signup")
	public String terms() {
		return "/auth/signup";
	}

}

	


	
