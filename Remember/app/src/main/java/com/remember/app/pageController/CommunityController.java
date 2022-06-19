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
	
	@GetMapping("/{categoryId}")
	public String category(@PathVariable(required = false) Integer categoryId) {
		return "/community/category";
	}
	
	@GetMapping(value = {"/detail/{articleId}", "/{categoryId}/detail/{articleId}"})
	public String detail(@PathVariable(required = false) Integer categoryId,@PathVariable(required = false) Integer articleId) {
		return "/community/article_detail";
	}
}
