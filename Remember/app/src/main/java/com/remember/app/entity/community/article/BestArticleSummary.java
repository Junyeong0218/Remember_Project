package com.remember.app.entity.community.article;

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
public class BestArticleSummary {

	private int id;
	private int sub_category_id;
	private String category_name;
	private String title;
	private int view_count;
	private int comment_count;
	private int like_count;
	
}
