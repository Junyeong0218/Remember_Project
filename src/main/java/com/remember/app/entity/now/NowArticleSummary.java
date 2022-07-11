package com.remember.app.entity.now;

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
public class NowArticleSummary {
	private int id;
	
	private LocalDateTime create_date;
	
	private int category_id;
	private String category_name;
	
	private String title;
	private String summary;
	
	private String file_name;
}
