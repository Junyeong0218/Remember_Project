package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.entity.card.Team;
import com.remember.app.entity.card.TeamCardBookSummary;
import com.remember.app.entity.card.TeamGroupSummary;
import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.AddTeamReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.responseDto.GroupRespDto;


public interface CardService {
	
	public List<Card> getCards(int user_id);
	
	public int insertNewCard(Card card);
	
	public int insertGroup(Group group);
	
	public int deleteCard(int user_id);
	
	public int updateCard(CardUpdateReqDto cardUpdateReqDto);
	
	public List<GroupSummary> getGroups(int user_id);
	
	public GroupRespDto getGroupId(int group_id);
	
	public int updateGroupCard(Group group);
	
	public int deleteGroupCard(Group group);
	
	public Card getUserCard(int cardId);
	
	public int addGroupUser(AddGroupReqDto addGroupReqDto);
	
	public List<Card> getCardSummaryList(int user_id);
	
	
	
	// -------------------------------------------------
	// team 관련 services
	
	public boolean insertTeam(AddTeamReqDto addTeamReqDto);
	
	public List<Team> getTeamList(int userId);
	
	public List<TeamCardBookSummary> getCardBookList(int teamId);
	
	public List<TeamGroupSummary> getTeamGroupList(int cardBookId);
	
	public List<Card> getAllCardListInCardBook(int cardBookId, int page);
	
	public List<Card> getCardListInSpecificGroup(int groupId, int page);
	
}
