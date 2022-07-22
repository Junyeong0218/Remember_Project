package com.remember.app.pageController;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("user")
public class UserSetController {
	
	@GetMapping("/setting")
	public String User(HttpServletResponse response) {
		ResponseCookie cookie = ResponseCookie.from("Lax", "Lax")
														  								  .path("/user/setting")
														  								  .sameSite("Lax")
														  								  .httpOnly(true)
														  								  .domain("localhost")
														  								  .build();
		response.setHeader("Set-Cookie", cookie.toString());
		return "card/user_set";
	}
}
