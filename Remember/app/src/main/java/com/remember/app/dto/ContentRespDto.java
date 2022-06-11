package com.remember.app.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ContentRespDto {
	public int id;
	public int remember_article_id;
	public String file_name;
	public int create_date;
	public int update_date;
}
