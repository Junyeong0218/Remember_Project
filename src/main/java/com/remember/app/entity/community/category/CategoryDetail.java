package com.remember.app.entity.community.category;

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
public class CategoryDetail {

	private int sub_category_id;
	private String category_name;
	
	private int join_count;
	
	private boolean join_flag;
	
	private int tag_id;
	private String tag_name;
	
	private int article_id;
	private String article_title;
	
}
