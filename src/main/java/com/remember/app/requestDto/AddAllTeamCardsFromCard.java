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
public class AddAllTeamCardsFromCard {

	private List<Integer> card_book_id_list;
	private int groupId;
	private int userId;
	private List<Integer> not_selected_card_id_list;
	private boolean memo_include_flag;
	
}
