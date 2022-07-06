package com.remember.app.entity.card;

import java.util.List;

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
public class CardBooksInTeam {

	private TeamDetail team_detail;
	private List<TeamCardBookSummary> card_books;
	
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof TeamDetail) {
			TeamDetail target = (TeamDetail) obj;
			if(target.getId() == this.team_detail.getId()) {
				return true;
			}
		}
		return false;
	}
	
}
