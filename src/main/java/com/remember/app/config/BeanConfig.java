package com.remember.app.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.remember.app.filter.FilePathFilter;

@Configuration
public class BeanConfig {

	@Bean
	public Map<String, String> phoneCodeMap() {
		return new HashMap<String, String>();
	}
	
//	@Value("${file.path}")
//	private String filePath;
//	
//	@Value("${module.path}")
//	private String modulePath;
//	
//	@Bean
//	public String filePath() {
//		return filePath;
//	}
//	
//	@Bean
//	public String modulePath() {
//		return modulePath;
//	}
	
	@Bean
	public FilterRegistrationBean<?> filter() {
		FilterRegistrationBean<FilePathFilter> bean = new FilterRegistrationBean<FilePathFilter>(new FilePathFilter());
		bean.addUrlPatterns("/**");
		bean.setOrder(1);
		return bean;
	}
}
