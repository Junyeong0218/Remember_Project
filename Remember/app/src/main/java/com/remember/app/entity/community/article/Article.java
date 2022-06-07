package com.remember.app.entity.community.article;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Article {

	private int id;
	private int user_id;
	private int sub_category_id;
	private String title;
	private String contents;
	private int view_count;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
}
