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
public class TeamAndCardBooks {

	private int team_id;
	private int grade_id;
	private String grade;
	private int max_card_count;
	private String title;
	
	private int card_book_id;
	private String card_book_name;
	private int card_count;
	
	public TeamDetail toTeamEntity() {
		return TeamDetail.builder()
											.id(team_id)
											.grade_id(grade_id)
											.grade(grade)
											.max_card_count(max_card_count)
											.title(title)
											.build();
	}
	
	public TeamCardBookSummary toCardBookSummaryEntity() {
		return TeamCardBookSummary.builder()
																	  .id(card_book_id)
																	  .card_book_name(card_book_name)
																	  .card_count(card_count)
																	  .build();
	}
}
