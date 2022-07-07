package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/card")
public class CardController {

	@GetMapping(value = {"", "/{inviteCode}"})
	public String main(@PathVariable(required = false) String inviteCode) {
		System.out.println(inviteCode);
		return "/card/home";
	}
	
	@GetMapping("/team-empty")
	public String teamEmpty() {
		return "/card/team_empty";
	}
	
	@GetMapping("/team")
	public String team() {
		return "/card/team";
	}
}
