package com.remember.app.entity.card;

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
public class TeamGrade {

	private int id;
	private String grade;
	private int max_card_book_count;
	private int max_card_count;
	
}
