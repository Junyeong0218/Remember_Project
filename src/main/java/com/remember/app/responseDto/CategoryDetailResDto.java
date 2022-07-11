package com.remember.app.responseDto;

import java.util.List;

import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.Tag;

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
public class CategoryDetailResDto {

	private int id;
	private String category_name;
	
	private int join_count;
	
	private boolean join_flag;
	
	private List<Tag> tag_list;
	
	private ArticleSummary article_summary;
}
