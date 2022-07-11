package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/career")
public class CareerController {
	
	@GetMapping("")
	public String home() {
		return "career/main_career";
	}

	@GetMapping("/business")
	public String business() {
		return "career/business";
	}

	@GetMapping("/profile/registration")
	public String registration() {
		return "career/profile_registration";
	}
	
}