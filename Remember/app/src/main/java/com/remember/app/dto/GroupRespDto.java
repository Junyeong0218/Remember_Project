package com.remember.app.dto;

import java.util.List;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.GroupCard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class GroupRespDto {
	private String group_name;
	private List<Card> card_list;
	
}
