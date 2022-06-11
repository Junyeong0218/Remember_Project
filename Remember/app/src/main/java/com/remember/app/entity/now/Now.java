package com.remember.app.entity.now;

import java.time.LocalDateTime;

import com.remember.app.responseDto.ContentRespDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Now {
	private int id;
	private int remember_article_id;
	private String name;
	private String file_name;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	public ContentRespDto toDto() {
		return ContentRespDto.builder()
				.id(id)
				.remember_article_id(remember_article_id)
				.file_name(file_name)
				.build();
	}
}
