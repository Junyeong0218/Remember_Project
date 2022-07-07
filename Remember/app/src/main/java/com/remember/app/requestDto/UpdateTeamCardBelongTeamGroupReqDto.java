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
public class UpdateTeamCardBelongTeamGroupReqDto {

	private int card_id;
	private int card_book_id;
	private int group_id;
	
	private List<Integer> card_id_list;
	private List<Integer> not_selected_card_id_list;
	private List<Integer> group_id_list;
	
	private int default_group_id;
	
}
