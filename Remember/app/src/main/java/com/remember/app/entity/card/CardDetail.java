package com.remember.app.entity.card;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CardDetail {

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
	private LocalDateTime create_date;
	
	private int group_id;
	private String group_name;
	
	private int memo_id;
	private int memo_user_id;
	private String contents;
	private LocalDateTime memo_create_date;
	private LocalDateTime memo_update_date;
	
	
	public Card toCardEntity() {
		return Card.builder()
					.id(id)
					.name(name)
					.profile_img(profile_img)
					.phone(phone)
					.email(email)
					.company_name(company_name)
					.department_name(department_name)
					.position_name(position_name)
					.landline_phone(landline_phone)
					.fax(fax)
					.address(address)
					.sub_address(sub_address)
					.create_date(create_date)
					.build();
	}
	
	public Group toGroupEntity() {
		if(group_id == 0) return null;
		
		return Group.builder()
				.id(group_id)
				.group_name(group_name)
				.create_date(create_date)
				.build();
	}
	
	public CardMemoDetail toMemoDetailEntity() {
		if(memo_id == 0) return null;
		
		return CardMemoDetail.builder()
							.id(memo_id)
							.user_id(memo_user_id)
							.contents(contents)
							.create_date(memo_create_date)
							.update_date(memo_update_date)
							.build();
	}
	
}
