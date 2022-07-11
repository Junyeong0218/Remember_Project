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
public class Comment {

	private int id;
	private int article_id;
	private int user_id;
	private String contents;
	private boolean use_nickname;
	private int related_comment_id;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	private boolean deleted;
	private LocalDateTime deleted_date;
	
}
