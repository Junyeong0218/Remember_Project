package com.remember.app.entity.card;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.CardDeleteReqDto;

@Mapper
public interface CardRepository {
	
	public List<Card> getCards(int user_id);
	
	public CardDetail getCardDetail(int card_id);
	
	public int insertCard(Card card);
	
	public int insertGroup(Group group);
	
	public int updateCard(Card card);
	
	public int deleteCard(int card_id);
	
	public int deleteCards(CardDeleteReqDto cardDeleteReqDto);
	
	public List<GroupSummary> getGroup(int user_id);
	
	public List<GroupCard> getGroupByGroupId(int group_id);
	
	public int updateGroup(Group group);
	
	public int deleteGroup(Group group);
	
	public Card getUserCard(int cardId);
	
	public int addCardBelongGroups(AddGroupReqDto addGroupReqDto);
	
	public int addCardsBelongDefaultGroup(AddGroupReqDto addGroupReqDto);
	
	public int deleteCardsBelongGroup(AddGroupReqDto addGroupReqDto);
	
	public List<Card> getCardSummaryList(int user_id, int page);
	
	// -------------------------------------------------
	// team 관련 repository methods
	
	public int insertTeam(Team team);
	
	public int updateTeamToDelete(Team team);
	
	public int joinTeam(TeamJoinUser teamJoinUser);
	
	public int leaveTeam(TeamJoinUser teamJoinUser);
	
	public int getAdmincCountInTeam(TeamJoinUser teamJoinUser);

	public int insertTeamCardBook(TeamCardBook teamCardBook);
	
	public int updateTeamCardBookName(TeamCardBook teamCardBook);
	
	public int insertTeamCardBookJoinUser(TeamCardBookJoinUser teamCardBookJoinUser);
	
	public int insertTeamUserProfile(TeamUserProfile teamUserProfile);
	
	public int updateProfileNickname(TeamUserProfile teamUserProfile);
	
	public int insertTeamGroup(TeamGroup teamGroup);
	
	public int updateTeamName(Team team);

	public TeamUserProfile getTeamUserProfile(int userId);
	
	public List<TeamDetail> getTeamList(int userId);
	
	public List<TeamCardBookSummary> getCardBookList(int teamId);
	
	public List<TeamGroupSummary> getTeamGroupList(int cardBookId);
	
	public List<Card> getAllCardListInCardBook(int cardBookId, int page);
	
	public List<Card> getCardListInSpecificGroup(int groupId, int page);
	
	public List<TeamCardDetail> getTeamCardDetail(int cardId);

	public List<TeamUserProfile> getTeamJoinUsers(int teamId, int userId, int page);

	public List<TeamUserProfile> getCardBookJoinUsers(int teamCardBookId, int page);
	
	public int insertTeamCardMemo(CardMemo cardMemo);
	
	public int updateTeamCardMemo(CardMemo cardMemo);
	
	public int deleteTeamCardMemo(int cardMemoId);
	
	public List<CardBelongTeamGroup> getGroupBelongFlags(int cardId);
}
