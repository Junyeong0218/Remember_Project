package com.remember.app.entity.card;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {
	private int id;
	private int user_id;
	private String group_name;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
}
