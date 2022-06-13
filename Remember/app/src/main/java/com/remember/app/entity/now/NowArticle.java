package com.remember.app.entity.now;

import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

public class NowArticle {
	private int id;
	private int user_id;
	private int category_id;
	private String title;
	private String contents;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	
}
