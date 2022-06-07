package com.remember.app.entity.community.category;

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
public class SubCategoryDetail {

	private int id;
	private int main_category_id;
	private String category_name;
	
	private int article_count;
}
