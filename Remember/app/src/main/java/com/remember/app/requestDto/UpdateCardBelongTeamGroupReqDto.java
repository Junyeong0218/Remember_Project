package com.remember.app.requestDto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCardBelongTeamGroupReqDto {

	private int card_id;
	private List<Integer> add_id_list;
	private List<Integer> remove_id_list;
	private boolean remove_all_flag;
	private int default_team_group_id;
	
}
