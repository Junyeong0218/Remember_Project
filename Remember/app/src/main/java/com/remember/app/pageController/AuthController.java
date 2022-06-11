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
	
	@GetMapping("/signup/type")
	public String selectatype() {
		return "/auth/signup/select_type";
	}
	
	@GetMapping("/signup/email")
	public String emailCertificate() {
		return "/auth/signup/email_certificate";
	}

	@GetMapping("/signup/phone")
	public String phoneCertificate() {
		return "/auth/signup/phone_certificate";
	}
	
	@GetMapping("/signup/terms")
	public String terms() {
		return "/auth/signup/terms";
	}
}

	


	
