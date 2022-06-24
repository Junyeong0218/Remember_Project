package com.remember.app.entity.card;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CardRepository {
	
	public List<Card> getCards(int user_id);
	
	public int insertCard(Card card);
	
	public int insertGroup(Group group);
	
	public int updateCard(Card card);
	
	public int deleteCard(int user_id);
	
	public List<GroupSummary> getGroup(int user_id);
	
	public List<GroupCard> getGroupByGroupId(int group_id);
	
	public int updateGroup(Group group);
	
	public int deleteGroup(Group group);
	
	public Card getUserCard(int cardId);
	
	public int addUserGroup(AddGroup addGroup);
	
	public List<Card> getCardSummaryList(int user_id);
	
	// -------------------------------------------------
	// team 관련 repository methods
	
	public int insertTeam(Team team);
	
	public int joinTeam(TeamJoinUser teamJoinUser);

	public int insertTeamCardBook(TeamCardBook teamCardBook);
	
	public int insertTeamCardBookJoinUser(TeamCardBookJoinUser teamCardBookJoinUser);
	
	public int insertTeamUserProfile(TeamUserProfile teamUserProfile);
	
	public int insertTeamGroup(TeamGroup teamGroup);
	
	public List<Team> getTeamList(int userId);
	
	public List<TeamCardBookSummary> getCardBookList(int teamId);
	
	public List<TeamGroupSummary> getTeamGroupList(int cardBookId);
	
	public List<Card> getAllCardListInCardBook(int cardBookId, int page);
	
	public List<Card> getCardListInSpecificGroup(int groupId, int page);
	
	public List<TeamCardDetail> getTeamCardDetail(int cardId);

	public List<TeamUserProfile> getTeamJoinUsers(int teamId);

	public List<TeamUserProfile> getCardBookJoinUsers(int cardBookId);
}
