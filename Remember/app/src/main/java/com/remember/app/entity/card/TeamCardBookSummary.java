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
public class TeamCardBookSummary {

	private int id;
	private int team_id;
	private String card_book_name;
	
	private int join_count;
	
	private int card_count;
	
}
