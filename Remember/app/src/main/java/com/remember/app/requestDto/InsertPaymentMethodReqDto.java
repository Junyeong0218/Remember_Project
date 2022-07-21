package com.remember.app.requestDto;

import java.time.LocalDateTime;

import com.remember.app.entity.card.PaymentMethod;
import com.remember.app.entity.card.ProductPayment;

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
public class InsertPaymentMethodReqDto {

	private int user_id;
	private String card_number;
	private String expiration_date;
	private String password;
	private String birthday;
	private String name;
	private String phone;
	private String email;
	
	private boolean free_flag;
	
	private int team_id;
	private int grade_id;
	private int price;
	
	public PaymentMethod toMethodEntity() {
		return PaymentMethod.builder()
													  .user_id(user_id)
													  .card_name("")
													  .card_number(card_number)
													  .expiration_date(expiration_date)
													  .password(password)
													  .birthday(birthday)
													  .name(name)
													  .phone(phone)
													  .email(email)
													  .build();
	}
	
	public ProductPayment toPaymentEntity() {
		return ProductPayment.builder()
													  .team_id(team_id)
													  .grade_id(grade_id)
													  .user_id(user_id)
													  .price(price)
													  .create_date(LocalDateTime.now())
													  .update_date(LocalDateTime.now())
													  .next_payment_date(LocalDateTime.now().plusMonths(1))
													  .build();
	}
	
}
