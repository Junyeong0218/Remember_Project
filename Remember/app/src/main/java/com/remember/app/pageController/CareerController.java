package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/career")
public class CareerController {

	@GetMapping("/registration")
	public String registration() {
		return "/career/profile_registration";
	}
}
