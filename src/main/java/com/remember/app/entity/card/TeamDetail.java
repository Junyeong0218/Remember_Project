package com.remember.app.entity.card;

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
public class TeamDetail {

	private int id;
	private int made_user_id;
	private String owner_nickname;
	
	private int grade_id;
	private String grade;
	private int max_card_book_count;
	private int max_card_count;
	
	private String title;
	private LocalDateTime create_date;
	private String invite_code;
	
	private int total_join_user_count;
	private int total_card_count;
	
	private int invited_user_id;
	private boolean join_flag;
}
