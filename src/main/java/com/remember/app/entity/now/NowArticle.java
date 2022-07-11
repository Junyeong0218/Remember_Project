package com.remember.app.entity.now;

import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class NowArticle {
	private int id;
	private int user_id;
	private int category_id;
	private String title;
	private String summary;
	private String contents;
	private String insight_title;
	private String insight_contents;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	
}
