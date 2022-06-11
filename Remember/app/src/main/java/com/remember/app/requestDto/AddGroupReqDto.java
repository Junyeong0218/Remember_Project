package com.remember.app.requestDto;

import com.remember.app.entity.card.AddGroup;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AddGroupReqDto {
	private int cardId;
	private int groupId;
	
	public AddGroup toAddEntity() {
		return AddGroup.builder()
				.card_id(cardId)
				.group_id(groupId)
				.build();
	}
}
