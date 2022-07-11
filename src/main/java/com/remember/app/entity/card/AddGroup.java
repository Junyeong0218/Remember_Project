package com.remember.app.entity.card;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AddGroup {
	private int id;
	private int group_id;
	private int card_id;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
}
