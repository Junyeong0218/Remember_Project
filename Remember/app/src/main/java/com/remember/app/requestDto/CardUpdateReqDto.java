package com.remember.app.requestDto;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

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
	private MultipartFile profile_img;
	private String origin_profile_img;
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
	
	public Card toUpdateCardEntity() {
		return Card.builder()
				.id(id)
				.name(name)
				.profile_img(origin_profile_img)
				.phone(phone)
				.email(email)
				.company_name(company_name)
				.department_name(department_name)
				.position_name(position_name)
				.landline_phone(landline_phone)
				.fax(fax)
				.address(address)
				.sub_address(sub_address)
				.build();
	}
}
