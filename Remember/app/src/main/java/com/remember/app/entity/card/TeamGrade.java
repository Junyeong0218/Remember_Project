package com.remember.app.entity.card;

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
public class TeamGrade {

	private int id;
	private String grade;
	private String name;
	private int price;
	private boolean memo_alert_flag;
	private boolean card_map_flag;
	private boolean extract_to_excel_flag;
	private boolean show_sended_info_flag;
	private boolean save_phone_flag;
	private boolean user_permission_flag;
	private boolean restore_card_flag;
	private boolean open_api_flag;
	private int max_card_book_count;
	private int max_card_count;
	
	private boolean is_using;
	private boolean free_flag;
	
}
