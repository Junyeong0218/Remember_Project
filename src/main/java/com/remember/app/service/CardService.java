package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.CardBooksInTeam;
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
import com.remember.app.requestDto.AddAllCardsFromTeamCard;
import com.remember.app.requestDto.AddAllTeamCardsFromCard;
import com.remember.app.requestDto.AddCardsFromTeamCard;
import com.remember.app.requestDto.AddTeamCardsFromCard;
import com.remember.app.requestDto.AddTeamReqDto;
import com.remember.app.requestDto.CardDeleteReqDto;
import com.remember.app.requestDto.CardInsertReqDto;
import com.remember.app.requestDto.DeleteTeamCardsReqDto;
import com.remember.app.requestDto.GetCardEmailReqDto;
import com.remember.app.requestDto.JoinTeamReqDto;
import com.remember.app.requestDto.UpdateAllCardsBelongGroupsReqDto;
import com.remember.app.requestDto.UpdateCardDetailReqDto;
import com.remember.app.requestDto.UpdateCardsBelongGroupsReqDto;
import com.remember.app.requestDto.UpdateTeamCardBelongTeamGroupReqDto;
import com.remember.app.responseDto.CardDetailResDto;
import com.remember.app.responseDto.TeamCardDetailResDto;


public interface CardService {
	
	public int insertNewCard(CardInsertReqDto cardInsertReqDto);
	
	public CardDetailResDto getCardDetail(int card_id);
	
	public int insertGroup(Group group);
	
	public boolean deleteCard(int cardId);
	
	public boolean deleteCards(CardDeleteReqDto cardDeleteReqDto);
	
	public boolean deleteAllCardsInGroup(CardDeleteReqDto cardDeleteReqDto);

	public boolean deleteAllCards(CardDeleteReqDto cardDeleteReqDto);
	
	public boolean updateCard(UpdateCardDetailReqDto updateCardDetailReqDto);
	
	public List<GroupSummary> getGroups(int user_id);
	
	public int updateGroupCard(Group group);
	
	public int deleteGroupCard(Group group);
	
	public Card getUserCard(int cardId);
	
	public boolean updateCardBelongGroups(UpdateCardsBelongGroupsReqDto updateCardsBelongGroupsReqDto);

	public boolean updateCardsBelongGroups(UpdateCardsBelongGroupsReqDto updateCardsBelongGroupsReqDto);
	
	public boolean updateAllCardsInGroupBelongGroups(UpdateAllCardsBelongGroupsReqDto updateAllCardsBelongGroupsReqDto);

	public boolean updateAllCardsBelongGroups(UpdateAllCardsBelongGroupsReqDto updateAllCardsBelongGroupsReqDto);
	
	public List<Card> getCardSummaryList(int user_id, int page, String card_order_flag);
	
	public List<Card> getCardSummaryListInSpecificGroup(int group_id, int page, String card_order_flag);

	public int insertCardMemo(CardMemo cardMemo);
	
	public boolean updateCardMemo(CardMemo cardMemo);

    public boolean deleteCardMemo(int cardMemoId);
	
	public boolean insertTeamCardFromCard(int userId, int cardId, int cardBookId, boolean memo_include_flag);
	
	public boolean insertTeamCardsFromCard(AddTeamCardsFromCard addTeamCardsFromCard);

	public boolean insertAllTeamCardsFromCardInGroup(AddAllTeamCardsFromCard addAllTeamCardsFromCard);
	
	public boolean insertAllTeamCardsFromCard(AddAllTeamCardsFromCard addAllTeamCardsFromCard);
	
	// -------------------------------------------------
	// team 관련 services
	
	public boolean insertTeam(AddTeamReqDto addTeamReqDto);
	
	public boolean deleteTeam(Team team);
	
	public boolean updateTeamName(Team team);
	
	public TeamDetail getInvitedTeamInfo(TeamDetail teamDetail);
	
	public String generateInviteCode(int teamId);
	
	public boolean isTeamJoined(int userId);
	
	public boolean joinInvitedTeam(JoinTeamReqDto joinTeamReqDto);
	
	public TeamUserProfile getTeamUserProfile(int userId);
	
	public boolean updateProfileNickname(TeamUserProfile teamUserProfile);
	
	public boolean leaveTeam(TeamJoinUser teamJoinUser);
	
	public boolean updateCardBookName(TeamCardBook teamCardBook);
	
	public boolean insertTeamGroup(TeamGroup teamGroup);
	
	public boolean updateTeamGroupName(TeamGroup teamGroup);
	
	public boolean deleteTeamGroup(int groupId);
	
	public List<TeamDetail> getTeamList(int userId);
	
	public List<CardBooksInTeam> getTeamListWithCardBooks(int userId);
	
	public List<TeamCardBookSummary> getCardBookList(int teamId);
	
	public List<TeamGroupSummary> getTeamGroupList(int cardBookId);
	
	public List<Card> getAllCardListInCardBook(int cardBookId, int page, String card_order_flag);
	
	public List<Card> getCardListInSpecificGroup(int groupId, int page, String card_order_flag);
	
	public TeamCardDetailResDto getTeamCardDetail(int cardId);
	
	public boolean insertTeamCard(CardInsertReqDto cardInsertReqDto);
	
	public boolean updateTeamCardDetail(UpdateCardDetailReqDto updateCardDetailReqDto);
	
	public boolean deleteTeamCard(int cardId);
	
	public boolean insertCardFromTeamCard(int userId, int cardId, boolean memo_include_flag);
	
	public boolean insertCardsFromTeamCard(AddCardsFromTeamCard addCardsFromTeamCard);
	
	public boolean insertAllCardsInTeamGroupToCard(AddAllCardsFromTeamCard addAllCardsFromTeamCard);
	
	public boolean insertAllCardsInTeamCardBookToCard(AddAllCardsFromTeamCard addAllCardsFromTeamCard);
	
	public List<TeamUserProfile> getTeamJoinUsers(int teamId, int userId, int page);

	public List<TeamUserProfile> getCardBookJoinUsers(int cardBookId, int page);
	
	public boolean insertTeamCardMemo(CardMemo cardMemo);
	
	public boolean updateTeamCardMemo(CardMemo cardMemo);
	
	public boolean deleteTeamCardMemo(int cardMemoId);
	
	public boolean updateTeamCardBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto);
	
	public boolean updateTeamCardsBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto);
	
	public boolean updateAllTeamCardsInGroupBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto);

	public boolean updateAllTeamCardsBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto);
	
	public boolean deleteTeamCards(DeleteTeamCardsReqDto deleteTeamCardsReqDto);

	public boolean deleteAllTeamCardsInGroup(DeleteTeamCardsReqDto deleteTeamCardsReqDto);

	public boolean deleteAllTeamCardsInCardBook(DeleteTeamCardsReqDto deleteTeamCardsReqDto);
	
	public List<Card> getTeamCardEmails(GetCardEmailReqDto getCardEmailReqDto);

	public List<Card> getTeamCardEmailsInGroup(GetCardEmailReqDto getCardEmailReqDto);

	public List<Card> getTeamCardEmailsInCardBook(GetCardEmailReqDto getCardEmailReqDto);
	
}
