package com.remember.app.pageController;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

	@GetMapping("/error")
	public void errorPageHandle(HttpServletRequest request, HttpServletResponse response) throws IOException {
		if(request.getUserPrincipal() == null) {
			response.sendRedirect("");
		} else {
			response.sendRedirect("/card");
		}
	}
}