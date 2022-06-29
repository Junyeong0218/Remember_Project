package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.CardBelongTeamGroup;
import com.remember.app.entity.card.CardDetail;
import com.remember.app.entity.card.CardMemo;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.entity.card.Team;
import com.remember.app.entity.card.TeamCardBook;
import com.remember.app.entity.card.TeamCardBookSummary;
import com.remember.app.entity.card.TeamDetail;
import com.remember.app.entity.card.TeamGroup;
import com.remember.app.entity.card.TeamGroupSummary;
import com.remember.app.entity.card.TeamJoinUser;
import com.remember.app.entity.card.TeamUserProfile;
import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.AddTeamReqDto;
import com.remember.app.requestDto.CardDeleteReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.responseDto.GroupRespDto;
import com.remember.app.responseDto.TeamCardDetailResDto;


public interface CardService {
	
	public List<Card> getCards(int user_id);
	
	public int insertNewCard(Card card);
	
	public CardDetail getCardDetail(int card_id);
	
	public int insertGroup(Group group);
	
	public int deleteCard(int card_id);
	
	public int deleteCards(CardDeleteReqDto cardDeleteReqDto);
	
	public int updateCard(CardUpdateReqDto cardUpdateReqDto);
	
	public List<GroupSummary> getGroups(int user_id);
	
	public GroupRespDto getGroupId(int group_id);
	
	public int updateGroupCard(Group group);
	
	public int deleteGroupCard(Group group);
	
	public Card getUserCard(int cardId);
	
	public int addGroupUser(AddGroupReqDto addGroupReqDto);
	
	public List<Card> getCardSummaryList(int user_id, int page);
	
	
	
	// -------------------------------------------------
	// team 관련 services
	
	public boolean insertTeam(AddTeamReqDto addTeamReqDto);
	
	public boolean deleteTeam(Team team);
	
	public boolean updateTeamName(Team team);
	
	public TeamUserProfile getTeamUserProfile(int userId);
	
	public boolean updateProfileNickname(TeamUserProfile teamUserProfile);
	
	public boolean leaveTeam(TeamJoinUser teamJoinUser);
	
	public boolean updateCardBookName(TeamCardBook teamCardBook);
	
	public boolean insertTeamGroup(TeamGroup teamGroup);
	
	public List<TeamDetail> getTeamList(int userId);
	
	public List<TeamCardBookSummary> getCardBookList(int teamId);
	
	public List<TeamGroupSummary> getTeamGroupList(int cardBookId);
	
	public List<Card> getAllCardListInCardBook(int cardBookId, int page);
	
	public List<Card> getCardListInSpecificGroup(int groupId, int page);
	
	public TeamCardDetailResDto getTeamCardDetail(int cardId);
	
	public List<TeamUserProfile> getTeamJoinUsers(int teamId, int userId, int page);

	public List<TeamUserProfile> getCardBookJoinUsers(int cardBookId, int page);
	
	public boolean insertTeamCardMemo(CardMemo cardMemo);
	
	public boolean updateTeamCardMemo(CardMemo cardMemo);
	
	public boolean deleteTeamCardMemo(int cardMemoId);
	
	public List<CardBelongTeamGroup> getGroupBelongFlags(int cardId);
	
}
