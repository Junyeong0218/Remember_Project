package com.remember.app.entity.card;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.remember.app.responseDto.CardBelongTeamGroupsResDto;

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
public class CardBelongTeamGroup {

	private int id;
	private int card_id;
	private int team_group_id;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	private String group_name;
	private boolean belong_flag;
	
	public CardBelongTeamGroupsResDto toMultipleDto() {
		List<CardBelongTeamGroup> groupList = new ArrayList<CardBelongTeamGroup>();
		groupList.add(this);
		
		return CardBelongTeamGroupsResDto.builder()
																				   .card_id(card_id)
																				   .team_group_list(groupList)
																				   .build();
	}
	
}
