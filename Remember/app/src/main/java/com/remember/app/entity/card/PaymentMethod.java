package com.remember.app.entity.card;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = {"id", "card_name", "create_date", "update_date", "usability"})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentMethod {

	private String id;
	private int user_id;
	private String card_name;
	private String card_number;
	private String expiration_date;
	private String password;
	private String birthday;
	private String name;
	private String phone;
	private String email;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	private boolean usability;
	
}
