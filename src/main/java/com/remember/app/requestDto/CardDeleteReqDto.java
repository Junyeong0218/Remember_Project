package com.remember.app.requestDto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CardDeleteReqDto {
	
	private int user_id;
	private int card_id;
	private int group_id;
	
	private List<Integer> card_id_list;
	private List<Integer> not_selected_card_id_list;
	
}
