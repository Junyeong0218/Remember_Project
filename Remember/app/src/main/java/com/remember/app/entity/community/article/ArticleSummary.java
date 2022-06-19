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
public class ArticleSummary {

	private int id;
	
	private int user_id;
	private String nickname;
	private String department_name;
	private String profile_img;
	
	private int sub_category_id;
	private String category_name;
	
	private int tag_id;
	private String tag_name;
	
	private String title;
	private String contents;
	private String file_name;
	private LocalDateTime create_date;
	private int view_count;
	private int like_count;
	private int comment_count;
	
}
