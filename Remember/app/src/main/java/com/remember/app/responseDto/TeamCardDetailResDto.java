package com.remember.app.responseDto;

import java.util.List;

import com.remember.app.entity.card.TeamGroup;

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
public class TeamCardDetailResDto {

	private List<TeamGroup> group_list;
}
