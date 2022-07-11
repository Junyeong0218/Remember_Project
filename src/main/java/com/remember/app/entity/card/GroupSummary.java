package com.remember.app.entity.card;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupSummary {
	private int id;
	private String group_name;
	private int card_count;
	private int total_count;
	
}
