package com.remember.app.requestDto;

import java.time.LocalDateTime;

import com.remember.app.entity.card.Card;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CardUpdateReqDto {
	private int id;
	private String name;
	private String phone;
	private String email;
	private String company_name;
	private String part_name;
	private String position_name;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	public Card toUpdateCardEntity() {
		return Card.builder()
				.id(id)
				.name(name)
				.phone(phone)
				.email(email)
				.company_name(company_name)
				.part_name(part_name)
				.position_name(position_name)
				.build();
	}
}
