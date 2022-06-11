package com.remember.app.dto;

import com.remember.app.entity.card.Card;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CardInsertReqDto {
	private int user_id;
	private String name;
	private String phone;
	private String email;
	private String company_name;
	private String part_name;
	private String position_name;
	
	public Card cardMstToEntity() {
		return Card.builder()
				.user_id(user_id)
				.name(name)
				.phone(phone)
				.email(email)
				.company_name(company_name)
				.part_name(part_name)
				.position_name(position_name)
				.build();
	}
}
