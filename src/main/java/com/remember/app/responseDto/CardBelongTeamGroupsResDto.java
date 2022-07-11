package com.remember.app.responseDto;

import java.util.List;

import com.remember.app.entity.card.CardBelongTeamGroup;

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
public class CardBelongTeamGroupsResDto {

	private int card_id;
	private List<CardBelongTeamGroup> team_group_list;
	
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof CardBelongTeamGroupsResDto) {
			CardBelongTeamGroupsResDto target = (CardBelongTeamGroupsResDto) obj;
			if(target.card_id == this.card_id) {
				return true;
			}
		}
		return false;
	}
}
