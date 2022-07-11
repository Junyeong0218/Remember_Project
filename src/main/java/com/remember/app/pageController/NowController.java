package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/now")
public class NowController {
	
	@GetMapping(value = {"", "/category/{categoryId}"})
	public String home() {
		return "now/home";
	}	
	
	@GetMapping("/detail/{articleId}")
	public String nowDetail(@PathVariable(required = false) Integer categoryId,@PathVariable(required = false) Integer articleId) {
		return "now/article_detail";
	}
	
	@GetMapping("/upload")
	public String uploadArticle() {
		return "now/article_input";
	}
	

}
