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
public class JoinedCategory {
	
	private int main_category_id;
	private String category_kor_name;
	
	private int sub_category_id;
	private String category_name;
	
}
