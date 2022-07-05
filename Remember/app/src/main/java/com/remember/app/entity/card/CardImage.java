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
public class CardImage {

	private int id;
	private int card_id;
	private String card_image;
	private boolean is_front;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof CardImage) {
			CardImage target = (CardImage) obj;
			if(target.id == this.id) {
				return true;
			}
		}
		return false;
	}
	
}
