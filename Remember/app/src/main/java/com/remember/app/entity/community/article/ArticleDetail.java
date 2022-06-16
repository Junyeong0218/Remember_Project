package com.remember.app.entity.community.article;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ArticleDetail {
	
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
	
	private int view_count;
	private int like_count;
	private int comment_count;

	private LocalDateTime create_date;
	
	private boolean like_flag;
	
	private int comment_id;
	private int commented_user_id;
	private String commented_user_nickname;
	private String commented_user_department_name;
	private String commented_user_profile_img;
	private String comment_contents;
	private int related_comment_id;
	private LocalDateTime comment_create_date;
	private int comment_like_count;
	
}
