package com.remember.app.requestDto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateCardsBelongGroupsReqDto {
	
	private int cardId;
	private List<Integer> card_id_list;
	private List<Integer> group_id_list;
	private int default_card_group_id;

}
