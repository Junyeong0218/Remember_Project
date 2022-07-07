package com.remember.app.requestDto;

import com.remember.app.entity.card.TeamCardBookJoinUser;
import com.remember.app.entity.card.TeamJoinUser;
import com.remember.app.entity.card.TeamUserProfile;

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
public class JoinTeamReqDto {

	private int team_id;
	private int card_book_id;
	private int user_id;
	private String nickname;
	
	public TeamJoinUser toJoinEntity() {
		return TeamJoinUser.builder()
												.team_id(team_id)
												.joined_user_id(user_id)
												.role("USER")
												.build();
	}
	
	public TeamUserProfile toProfileEntity() {
		return TeamUserProfile.builder()
													  .team_id(team_id)
													  .user_id(user_id)
													  .nickname(nickname)
													  .build();
	}
	
	public TeamCardBookJoinUser toCardBookJoinEntity() {
		return TeamCardBookJoinUser.builder()
																	.team_card_book_id(card_book_id)
																	.joined_user_id(user_id)
																	.role("USER")
																	.build();
	}
	
}
