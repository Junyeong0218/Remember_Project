package com.remember.app.entity.card;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Card {
	private int id;
	private int user_id;
	private String name;
	private String phone;
	private String email;
	private String company_name;
	private String department_name;
	private String position_name;
	private String landline_phone;
	private String fax;
	private String address;
	private String sub_address;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	private int total_count;
}
