package com.remember.app.entity.card;

import java.time.LocalDateTime;

import com.remember.app.responseDto.GroupRespDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class GroupCard {
	private int id;
	private int user_id;
	private String name;
	private String phone;
	private String email;
	private String company_name;
	private String department_name;
	private String position_name;
	private String group_name;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	

	public Card toCardEntity() {
		return Card.builder()
				   .id(id)
				   .user_id(user_id)
				   .name(name)
				   .phone(phone)
				   .email(email)
				   .company_name(company_name)
				   .department_name(department_name)
				   .position_name(position_name)
				   .create_date(create_date)
				   .update_date(update_date)
				   .build();
	}
}
