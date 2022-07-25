package com.remember.app.pageController;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserSetController {
	
	@GetMapping("/user/setting")
	public String User(HttpServletResponse response) {
		ResponseCookie cookie = ResponseCookie.from("Lax", "Lax")
																						  .path("/")
//														  								  .path("/user/setting")
														  								  .sameSite("Lax")
														  								  .httpOnly(true)
														  								  .domain("localhost")
														  								  .build();
		response.setHeader("Set-Cookie", cookie.toString());
		return "card/user_set";
	}
	
	@GetMapping("/user/setting/redirect/naver/oauth")
	public String naverPopupOAuth() {
		return "card/user_set_redirect";
	}
}
