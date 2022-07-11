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
public class UserOauthDetail {
	
	private int id;
	private int user_id;
	private String oauth_username;
	private String provider;
	private LocalDateTime create_date;
	private LocalDateTime update_date;

}
