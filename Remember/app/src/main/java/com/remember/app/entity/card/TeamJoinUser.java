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
public class TeamJoinUser {

	private int id;
	private int team_id;
	private int joined_user_id;
	private String role;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
}
