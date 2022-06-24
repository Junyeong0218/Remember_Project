package com.remember.app.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.remember.app.entity.card.AddGroup;
import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.CardMemoDetail;
import com.remember.app.entity.card.CardRepository;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupCard;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.entity.card.Team;
import com.remember.app.entity.card.TeamCardBook;
import com.remember.app.entity.card.TeamCardBookSummary;
import com.remember.app.entity.card.TeamCardDetail;
import com.remember.app.entity.card.TeamGroup;
import com.remember.app.entity.card.TeamGroupSummary;
import com.remember.app.entity.card.TeamUserProfile;
import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.AddTeamReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.responseDto.GroupRespDto;
import com.remember.app.responseDto.TeamCardDetailResDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {
	
	private final CardRepository cardRepository;
	
	@Override
	public List<Card> getCards(int user_id) {
		return cardRepository.getCards(user_id);
	}
	
	@Override
	public int insertNewCard(Card card) {
		System.out.println(card);
		return cardRepository.insertCard(card);

	}
	
	@Override
	public int insertGroup(Group group) {
		return cardRepository.insertGroup(group);
	}
	
	@Override
	public List<GroupSummary> getGroups(int user_id) {
		
		return cardRepository.getGroup(user_id);
	}
	
	@Override
	public GroupRespDto getGroupId(int group_id) {
		List<GroupCard> details = cardRepository.getGroupByGroupId(group_id);
		GroupRespDto respDto = new GroupRespDto();
		if(details.size() == 0) return respDto;
		
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
	public Card getUserCard(int cardId) {
		return cardRepository.getUserCard(cardId);
	}
	
	@Override
	public int addGroupUser(AddGroupReqDto addGroupReqDto) {
		
		AddGroup addGroup = addGroupReqDto.toAddEntity();
		
		return cardRepository.addUserGroup(addGroup);
	}
	
	@Override
	public List<Card> getCardSummaryList(int user_id) {
		return cardRepository.getCardSummaryList(user_id);
	}
	
	// -------------------------------------------------
	// team 관련 services
	
	@Override
	public boolean insertTeam(AddTeamReqDto addTeamReqDto) {
		Team team = addTeamReqDto.toTeamEntity();
		if(cardRepository.insertTeam(team) == 1) {
			addTeamReqDto.setId(team.getId());
			int result = cardRepository.joinTeam(addTeamReqDto.toJoinEntity());
			result += cardRepository.insertTeamUserProfile(addTeamReqDto.toProfileEntity());
			
			TeamCardBook cardBook = addTeamReqDto.toTeamCardBookEntity();
			result += cardRepository.insertTeamCardBook(cardBook);
			
			addTeamReqDto.setCard_book_id(cardBook.getId());
			System.out.println(addTeamReqDto);
			System.out.println(addTeamReqDto.toTeamCardBookJoinUserEntity());
			result += cardRepository.insertTeamCardBookJoinUser(addTeamReqDto.toTeamCardBookJoinUserEntity());
			System.out.println(result);
			if(result == 4) {
				return true;
			}
		}
		return false;
	}
	
	@Override
	public List<Team> getTeamList(int userId) {
		return cardRepository.getTeamList(userId);
	}
	
	@Override
	public List<TeamCardBookSummary> getCardBookList(int teamId) {
		return cardRepository.getCardBookList(teamId);
	}
	
	@Override
	public List<TeamGroupSummary> getTeamGroupList(int cardBookId) {
		return cardRepository.getTeamGroupList(cardBookId);
	}
	
	@Override
	public List<Card> getAllCardListInCardBook(int cardBookId, int page) {
		return cardRepository.getAllCardListInCardBook(cardBookId, page * 10);
	}
	
	@Override
	public List<Card> getCardListInSpecificGroup(int groupId, int page) {
		return cardRepository.getCardListInSpecificGroup(groupId, page * 10);
	}
	
	@Override
	public TeamCardDetailResDto getTeamCardDetail(int cardId) {
		List<TeamCardDetail> details = cardRepository.getTeamCardDetail(cardId);
		System.out.println(details);
		
		TeamCardDetailResDto dto = new TeamCardDetailResDto();
		List<TeamGroup> groupList = new ArrayList<TeamGroup>();
		List<CardMemoDetail> memoList = new ArrayList<CardMemoDetail>();
		
		for(int i = 0; i < details.size(); i++) {
			TeamCardDetail detail = details.get(i);
			if(i == 0) {
				dto.setCard(detail.toCardEntity());
				dto.setReg_user_nickname(detail.getReg_user_nickname());
			}
			TeamGroup group = detail.toTeamGroupEntity();
			if(group != null && ! groupList.contains(group)) groupList.add(group);
			
			CardMemoDetail memo = detail.toMemoDetailEntity();
			if(memo != null && ! memoList.contains(memo)) memoList.add(memo);
		}
		dto.setGroup_list(groupList);
		dto.setMemo_list(memoList);
		
		return dto;
	}
	
	@Override
	public List<TeamUserProfile> getTeamJoinUsers(int teamId) {
		return null;
	}
	
	@Override
	public List<TeamUserProfile> getCardBookJoinUsers(int cardBookId) {
		return null;
	}
	
}
