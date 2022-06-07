package com.remember.app.pageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class IndexController {
	
	@GetMapping("")
	public String redirectIndex() {
		return "index";
	}
	
	@GetMapping("index")
	public String index() {
		return "index";
	}

}
