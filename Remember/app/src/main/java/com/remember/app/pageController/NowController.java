package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/now")
public class NowController {

	@GetMapping("")
	public String home() {
		return "/now/home";
	}
	
	@GetMapping("/{articleId}")
	public String detail(@PathVariable int articleId) {
		return "/now/article_detail";
	}
}
