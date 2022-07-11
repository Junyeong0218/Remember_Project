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
public class UpdateAllCardsBelongGroupsReqDto {

	private int userId;
	private int cardId;
	private int groupId;
	private List<Integer> not_selected_card_id_list;
	private List<Integer> group_id_list;
	private int default_card_group_id;
	
}
