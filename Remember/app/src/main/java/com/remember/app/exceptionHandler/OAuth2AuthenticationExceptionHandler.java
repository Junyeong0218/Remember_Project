package com.remember.app.exceptionHandler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class OAuth2AuthenticationExceptionHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		OAuth2AuthenticationException oAuth2Exception = (OAuth2AuthenticationException) exception;
		OAuth2Error error = (OAuth2Error) oAuth2Exception.getError();
		System.out.println(error.getDescription());
		
		response.setContentType("text/html; charset=UTF-8");
		response.getWriter().write("<script>alert(\"" + error.getDescription() + "\"); location.replace(\"" + error.getUri() + "\");</script>");
	}
}
