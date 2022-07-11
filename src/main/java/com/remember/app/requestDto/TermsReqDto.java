package com.remember.app.requestDto;

import com.remember.app.entity.user.UserTerms;

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
public class TermsReqDto {
	
	private boolean age_flag;
	private boolean term_flag;
	private boolean privacy_flag;
	private boolean privacy_limit_flag;
	private boolean alert_flag;
	private String phone;
	
	public UserTerms toEntity() {
		return UserTerms.builder()
										  .age_flag(age_flag)
										  .term_flag(term_flag)
										  .privacy_flag(privacy_flag)
										  .privacy_limit_flag(privacy_limit_flag)
										  .alert_flag(alert_flag)
										  .build();
	}
	
}
