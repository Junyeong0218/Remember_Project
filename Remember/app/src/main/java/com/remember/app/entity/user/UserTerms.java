package com.remember.app.entity.user;

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
public class UserTerms {

	private int id;
	private int user_id;
	private boolean age_flag;
	private boolean term_flag;
	private boolean privacy_flag;
	private boolean privacy_limit_flag;
	private boolean alert_flag;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
}
