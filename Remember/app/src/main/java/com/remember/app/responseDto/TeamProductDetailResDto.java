package com.remember.app.responseDto;

import java.util.List;

import com.remember.app.entity.card.Team;
import com.remember.app.entity.card.TeamGrade;

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
public class TeamProductDetailResDto {

	private Team team;
	private List<TeamGrade> team_product_list;
	
}
