package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/card")
public class CardController {

	@GetMapping("")
	public String main() {
		return "/card/home";
	}
	
	@GetMapping("/team-empty")
	public String teamEmpty() {
		return "/card/team/team_empty";
	}
}
