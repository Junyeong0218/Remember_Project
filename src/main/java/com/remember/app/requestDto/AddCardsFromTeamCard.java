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
public class AddCardsFromTeamCard {

	private int userId;
	private List<Integer> card_id_list;
	private boolean memo_include_flag;
	
}
