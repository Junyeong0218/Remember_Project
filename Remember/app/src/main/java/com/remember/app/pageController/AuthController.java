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
	
	@GetMapping("/signup")
	public String signup() {
		return "/auth/signup";
	}
	
	@GetMapping("/signup/terms")
	public String terms() {
		return "/auth/signup/terms";
	}
}
