package com.remember.app.exceptionHandler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class FormLoginAuthenticationExceptionHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		
		response.setContentType("text/html; charset=UTF-8");
		response.getWriter().print("<script>alert(\"" + exception.getMessage() + "\"); location.replace(\"/auth/signin\")</script>");
	}
}
