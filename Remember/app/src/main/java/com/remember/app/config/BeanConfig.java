package com.remember.app.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

	@Bean
	public Map<String, String> phoneCodeMap() {
		return new HashMap<String, String>();
	}
	
	@Value("${file.path}")
	private String filePath;
	
	@Bean
	public String filePath() {
		return filePath;
	}
}
