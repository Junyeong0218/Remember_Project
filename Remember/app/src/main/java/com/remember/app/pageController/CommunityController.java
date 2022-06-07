package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/community")
public class CommunityController {

	@GetMapping("")
	public String home() {
		return "/community/home";
	}
	
	@GetMapping("/{articleId}")
	public String detail(@PathVariable int articleId) {
		return "/community/article_detail";
	}
}
