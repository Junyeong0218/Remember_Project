package com.remember.app.requestDto;

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
public class UpdateCardsBelongTeamGroupReqDto {

	private int cardId;
	private List<Integer> card_id_list;
	private List<Integer> add_belong_id_list;
	private int default_group_id;
	
}
