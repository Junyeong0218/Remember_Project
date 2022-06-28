package com.remember.app.requestDto;

import org.springframework.web.multipart.MultipartFile;

import com.remember.app.entity.card.Card;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCardDetailReqDto {

	private int id;
	private String name;
	private String profile_img;
	private String phone;
	private String email;
	private String company_name;
	private String department_name;
	private String position_name;
	private String landline_phone;
	private String fax;
	private String address;
	private String sub_address;
	
	private MultipartFile profile_image;
	private MultipartFile front_card_image;
	private MultipartFile back_card_image;
	
	public Card toCardEntity() {
		return Card.builder()
								.id(id)
								.name(name)
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
