package com.remember.app.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.CardRepository;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupCard;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.requestDto.CardInsertReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.responseDto.GroupRespDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {
	
	private final CardRepository cardRepository;
	
	@Override
	public Card getCard(int user_id) {
		
		return cardRepository.getCard(user_id);
	}
	
	@Override
	public int insertNewCard(CardInsertReqDto cardInsertReqDto) {
		Card card = cardInsertReqDto.cardMstToEntity();
		System.out.println(card);
		return cardRepository.insertCard(card);

	}
	
	@Override
	public int insertGroup(int user_id,String group_name) {
		Group group = Group.builder()
				.user_id(user_id)
				.group_name(group_name)
				.build();
		return cardRepository.insertGroup(group);
	}
	
	@Override
	public List<GroupSummary> getGroups(int user_id) {
		return cardRepository.getGroup(user_id);
	}
	
	@Override
	public GroupRespDto getGroupId(int group_id) {
		List<GroupCard> details = cardRepository.getGroupByGroupId(group_id);
		if(details.size() == 0) return null;
		
		GroupRespDto respDto = new GroupRespDto();
		respDto.setGroup_name(details.get(0).getGroup_name());
		List<Card> card_list = new ArrayList<Card>();
		for(GroupCard detail : details) {
			card_list.add(detail.toCardEntity());
		}
		respDto.setCard_list(card_list);
		return respDto;
	}
	
	@Override
	public int updateCard(CardUpdateReqDto cardUpdateReqDto) {
		Card updateCard = cardUpdateReqDto.toUpdateCardEntity();
		
		return cardRepository.updateCard(updateCard);
	}
	
	@Override
	public int deleteCard(int user_id) {
		
		return cardRepository.deleteCard(user_id);
	}
	
	@Override
	public int updateGroupCard(Group group) {
		
		return cardRepository.updateGroup(group);
	}
	
	@Override
	public int deleteGroupCard(Group group) {
		
		return cardRepository.deleteGroup(group);
	}
	
	@Override
	public Card get(int cardId) {
		// TODO Auto-generated method stub
		return cardRepository.get(cardId);
	}
	
	@Override
	public int addUserMyGroup(int cardId) {
		
		return cardRepository.addUserGroup(cardId);
	}
}
