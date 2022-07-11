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
public class CardInsertReqDto {

	private int user_id;
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
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	
	private MultipartFile profile_image;
	
	private int card_book_id;
	
	public Card ToCardEntity() {
		return Card.builder()
								.user_id(user_id)
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
