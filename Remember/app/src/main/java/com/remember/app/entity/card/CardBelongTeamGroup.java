package com.remember.app.entity.card;

import java.time.LocalDateTime;

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
	
}
