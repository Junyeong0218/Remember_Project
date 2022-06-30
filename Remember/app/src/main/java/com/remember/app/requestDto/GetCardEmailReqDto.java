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
public class GetCardEmailReqDto {

	private int groupId;
	private int cardBookId;
	private List<Integer> card_id_list;
	private List<Integer> not_selected_id_list;
	
}
