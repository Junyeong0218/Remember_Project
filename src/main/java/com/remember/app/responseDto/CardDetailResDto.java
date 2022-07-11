package com.remember.app.responseDto;

import java.util.List;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.CardImage;
import com.remember.app.entity.card.CardMemoDetail;
import com.remember.app.entity.card.Group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CardDetailResDto {
	
	private Card card;
	private List<Group> group_list;
	private List<CardImage> card_images;
	private List<CardMemoDetail> memo_list;
	
}
