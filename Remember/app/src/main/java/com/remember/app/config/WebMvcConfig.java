package com.remember.app.config;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import com.remember.app.IntercepterHandler.CustomLoginIntercepter;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	@Value("${file.path}")
	private String filePath;
	
	@Value("${module.path}")
	private String modulePath;
	
	private List<String> excludePathPatterns = Arrays.asList("/static/**", "/image/**", "", "/auth/signin", "/api/**");
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new CustomLoginIntercepter())
						.addPathPatterns("/**")
						.excludePathPatterns(excludePathPatterns)
						.order(0);
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		WebMvcConfigurer.super.addResourceHandlers(registry);
		registry.addResourceHandler("/image/**", "/module/**")
						.addResourceLocations("file:///" + filePath, "file:///" + modulePath)
						.setCachePeriod(60 * 60)
						.resourceChain(true)
						.addResolver(new PathResourceResolver() {
							@Override
							protected Resource getResource(String resourcePath, Resource location) throws IOException {
								resourcePath = URLDecoder.decode(resourcePath, StandardCharsets.UTF_8);
								return super.getResource(resourcePath, location);
							}
						});
	}
}
