package com.remember.app.entity.card;

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
public class TeamCardDetail {

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
	
	private int user_id;
	private String reg_user_nickname;
	
	private int card_image_id;
	private String card_image;
	private boolean is_front;
	
	private int group_id;
	private String group_name;
	private LocalDateTime join_date;
	
	private int memo_id;
	private int memo_user_id;
	private String memo_nickname;
	private String contents;
	private LocalDateTime memo_create_date;
	private LocalDateTime memo_update_date;
	
	public Card toCardEntity() {
		return Card.builder()
								.id(id)
								.name(name)
								.user_id(user_id)
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
	
	public TeamGroup toTeamGroupEntity() {
		if(group_id == 0) return null;
		
		return TeamGroup.builder()
											.id(group_id)
											.group_name(group_name)
											.create_date(join_date)
											.build();
	}
	
	public CardMemoDetail toMemoDetailEntity() {
		if(memo_id == 0) return null;
		
		return CardMemoDetail.builder()
													   .id(memo_id)
													   .user_id(memo_user_id)
													   .nickname(memo_nickname)
													   .contents(contents)
													   .create_date(memo_create_date)
													   .update_date(memo_update_date)
													   .build();
	}
	
	public CardImage toCardImageEntity() {
		return CardImage.builder()
											.id(card_image_id)
											.card_id(id)
											.card_image(card_image)
											.is_front(is_front)
											.build();
	}
}
