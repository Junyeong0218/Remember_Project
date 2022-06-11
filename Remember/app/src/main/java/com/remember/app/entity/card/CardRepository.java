package com.remember.app.entity.card;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CardRepository {
	public Card getCard(int user_id);
	public int insertCard(Card card);
	public int insertGroup(Group group);
	public int updateCard(Card card);
	public int deleteCard(int user_id);
	public List<GroupSummary> getGroup(int user_id);
	public List<GroupCard> getGroupByGroupId(int group_id);
	public int updateGroup(Group group);
	public int deleteGroup(Group group);
	public Card get(int cardId);
	public int addUserGroup(int cardId);
}