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
public class Team {

	private int id;
	private int made_user_id;
	private int grade_id;
	private String title;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	private boolean deleted;
	private LocalDateTime deleted_date;
	
}
