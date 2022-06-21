package com.remember.app.requestDto;

import com.remember.app.entity.card.Team;
import com.remember.app.entity.card.TeamGroup;
import com.remember.app.entity.card.TeamJoinUser;
import com.remember.app.entity.card.TeamUserProfile;

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
public class AddTeamReqDto {

	private int id;
	private int made_user_id;
	private String title;
	private String nickname;
	private String group_name;
	
	public Team toTeamEntity() {
		return Team.builder()
								.made_user_id(made_user_id)
								.title(title)
								.build();
	}
	
	public TeamJoinUser toJoinEntity() {
		return TeamJoinUser.builder()
												 .team_id(id)
												 .joined_user_id(made_user_id)
												 .build();
	}
	
	public TeamGroup toTeamGroupEntity() {
		return TeamGroup.builder()
											.team_id(id)
											.group_name(group_name)
											.build();
	}
	
	public TeamUserProfile toProfileEntity() {
		return TeamUserProfile.builder()
													  .user_id(made_user_id)
													  .nickname(nickname)
													  .build();
	}
}
