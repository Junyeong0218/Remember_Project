package com.remember.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	@Value("${file.path}")
	private String filePath;
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		WebMvcConfigurer.super.addResourceHandlers(registry);
		registry.addResourceHandler("/image/**")
						.addResourceLocations("file:///" + filePath)
						.setCachePeriod(60 * 60)
						.resourceChain(true)
						.addResolver(new PathResourceResolver());
	}
}
