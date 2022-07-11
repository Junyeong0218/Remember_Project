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
public class TeamCardBook {

	private int id;
	private int team_id;
	private String card_book_name;
	private LocalDateTime create_date;
	private LocalDateTime update_date;;

}
