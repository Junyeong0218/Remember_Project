package com.remember.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.remember.app.principal.PrincipalOauth2UserService;

import lombok.RequiredArgsConstructor;

@SuppressWarnings("deprecation")
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	private final PrincipalOauth2UserService principalOauth2UserService;

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.httpBasic().disable();
		http.authorizeRequests()
				 .antMatchers("/api/v1/auth/signup/*", "/api/v1/auth/signin/*")
				 .permitAll()
				 .antMatchers("/api/v1/*")
				 .authenticated()
				 .anyRequest()
				 .permitAll()
				 .and()
				 .formLogin()
				 .loginPage("/auth/signup")
				 .loginPage("/auth/signin")
				 .loginProcessingUrl("/auth/signin")
				 .defaultSuccessUrl("/card")
				 .and()
				 .oauth2Login()
				 .loginPage("/auth/signup")
				 .loginPage("/auth/signin")
				 .userInfoEndpoint()
				 .userService(principalOauth2UserService)
				 .and()
				 .defaultSuccessUrl("/card");
	}
}