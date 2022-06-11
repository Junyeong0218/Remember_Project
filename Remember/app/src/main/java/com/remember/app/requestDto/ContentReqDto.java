package com.remember.app.requestDto;

import com.remember.app.entity.now.Now;

import lombok.Data;

@Data
public class ContentReqDto {
	private int remember_article_id;
	private String file_name;
	
	public Now toEntity(int id) {
		return Now.builder()
				.id(id)
				.remember_article_id(remember_article_id)
				.file_name(file_name)
				.build();
	}
}
