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
	
	@GetMapping("/{categoryId}")
	public String nowList(@PathVariable(required = false) Integer categoryId) {
		return "now/category";
	}
	
	
	@GetMapping(value = {"/{articleId}", "/{categoryId}/{articleId}"})
	public String nowDetail(@PathVariable(required = false) Integer categoryId,@PathVariable(required = false) Integer articleId) {
		return "/now/article_detail";
	}
	

}
