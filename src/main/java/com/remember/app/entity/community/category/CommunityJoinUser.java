package com.remember.app.entity.community.category;

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
public class CommunityJoinUser {
	
	private int id;
	private int sub_category_id;
	private int user_id;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
}
