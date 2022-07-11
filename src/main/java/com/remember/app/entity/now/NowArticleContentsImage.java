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
public class NowArticleContentsImage {
	private int id;
	private int article_id;
	private String file_name;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
}
