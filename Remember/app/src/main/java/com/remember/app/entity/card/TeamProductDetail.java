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
public class TeamProductDetail {
	
	private int team_id;
	private int made_user_id;
	private String title;
	
	private int grade_id;
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
	
	private boolean is_using;
	private boolean free_flag;
	
	public Team toTeamEntity() {
		return Team.builder()
								.id(team_id)
								.made_user_id(made_user_id)
								.title(title)
								.build();
	}
	
	public TeamGrade toGradeEntity() {
		return TeamGrade.builder()
											.id(grade_id)
											.grade(grade)
											.name(name)
											.price(price)
											.memo_alert_flag(memo_alert_flag)
											.card_map_flag(card_map_flag)
											.extract_to_excel_flag(extract_to_excel_flag)
											.show_sended_info_flag(show_sended_info_flag)
											.save_phone_flag(save_phone_flag)
											.user_permission_flag(user_permission_flag)
											.restore_card_flag(restore_card_flag)
											.open_api_flag(open_api_flag)
											.is_using(is_using)
											.free_flag(free_flag)
											.build();
	}
}
