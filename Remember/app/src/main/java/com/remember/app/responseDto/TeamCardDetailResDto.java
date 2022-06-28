package com.remember.app.responseDto;

import java.util.List;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.CardImage;
import com.remember.app.entity.card.CardMemoDetail;
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

	private Card card;
	private String reg_user_nickname;
	private List<CardImage> card_images ;
	private List<TeamGroup> group_list;
	private List<CardMemoDetail> memo_list;
	
}
