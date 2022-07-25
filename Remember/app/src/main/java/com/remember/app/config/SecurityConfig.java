package com.remember.app.config;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.filter.CorsFilter;

import com.remember.app.exceptionHandler.FormLoginAuthenticationExceptionHandler;
import com.remember.app.exceptionHandler.OAuth2AuthenticationExceptionHandler;
import com.remember.app.principal.PrincipalOauth2UserService;

import lombok.RequiredArgsConstructor;

@SuppressWarnings("deprecation")
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	private final PrincipalOauth2UserService principalOauth2UserService;
	
	private final CorsFilter corsFilter;
	
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.httpBasic().disable();
		http.authorizeRequests()
					.antMatchers("/", "/index", "/auth/signin", "/auth/signup")
						.anonymous()
					.antMatchers("/now/upload", "/api/v1/now/article")
						.access("hasRole('ROLE_CONNECTORS')")
					.antMatchers("/career/profile/registration", "/user/setting")
						.access("hasRole('ROLE_USER')")
			 		.anyRequest()
			 			.permitAll()
				 .and()
				 	.addFilter(corsFilter)
				 	.formLogin()
				 		.failureHandler(new FormLoginAuthenticationExceptionHandler())
				 		.loginPage("/auth/signup")
				 		.loginPage("/auth/signin/email")
				 		.loginPage("/auth/signin/phone")
				 		.loginPage("/auth/signin")
				 		.loginProcessingUrl("/auth/signin")
				 			.defaultSuccessUrl("/card")
				 .and()
				 	.oauth2Login()
				 		.failureHandler(new OAuth2AuthenticationExceptionHandler())
				 		.loginPage("/auth/signup")
				 		.loginPage("/auth/signin")
				 		.loginPage("/auth/signin/phone")
				 		.userInfoEndpoint()
				 		.userService(principalOauth2UserService)
				 .and()
				 	.successHandler(new AuthenticationSuccessHandler() {
						@Override
						public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
																								Authentication authentication) throws IOException, ServletException {
							String originUri = (String) request.getSession().getAttribute("originUri");
							System.out.println("security_config : " + originUri);
							if(originUri != null) {
								request.getSession().removeAttribute("originUri");
								response.sendRedirect(originUri);
							} else {
								response.sendRedirect("/card");
							}
						}
					})
				 .and()
				 	.logout()
				 	.logoutSuccessUrl("/");
	}
}