package com.remember.app.exceptionHandler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class FormLoginAuthenticationExceptionHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		UsernameNotFoundException usernameException = (UsernameNotFoundException) exception;

		response.getWriter().print("<script>alert(\"" + usernameException.getMessage() + "\"); location.replace(\"/auth/signin\")</script>");
	}
}
