package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("user")
public class UserSetController {
	
	@GetMapping("/setting")
	public String User() {
		return "card/user_set";
	}
}
