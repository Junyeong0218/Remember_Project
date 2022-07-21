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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPayment {

	private String id;
	private int team_id;
	private int grade_id;
	private int user_id;
	private String method_id;
	private int price;
	private LocalDateTime create_date;
	private LocalDateTime update_date;
	private LocalDateTime next_payment_date;
	
}
