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
public class CardMemo {

	private int id;
	private int card_id;
	private int user_id;
	private String contents;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof CardMemo) {
			CardMemo target = (CardMemo) obj;
			if(this.id == target.id) {
				return true;
			}
		}
		return false;
	}
	
}
