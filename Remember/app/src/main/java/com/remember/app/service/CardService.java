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
import com.remember.app.requestDto.AddAllCardsFromTeamCard;
import com.remember.app.requestDto.AddCardsFromTeamCard;
import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.AddTeamReqDto;
import com.remember.app.requestDto.CardDeleteReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.requestDto.DeleteTeamCardsReqDto;
import com.remember.app.requestDto.GetBelongFlagsReqDto;
import com.remember.app.requestDto.GetCardEmailReqDto;
import com.remember.app.requestDto.UpdateCardBelongTeamGroupReqDto;
import com.remember.app.requestDto.UpdateCardDetailReqDto;
import com.remember.app.requestDto.UpdateCardsBelongTeamGroupReqDto;
import com.remember.app.responseDto.CardBelongTeamGroupsResDto;
import com.remember.app.responseDto.CardDetailResDto;
import com.remember.app.responseDto.GroupRespDto;
import com.remember.app.responseDto.TeamCardDetailResDto;


public interface CardService {
	
	public List<Card> getCards(int user_id);
	
	public int insertNewCard(Card card);
	
	public CardDetailResDto getCardDetail(int card_id);
	
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
	
	public int insertCardMemo(CardMemo cardMemo);
	
	public boolean updateCardMemo(CardMemo cardMemo);
	
	public boolean deleteCardMemo(int cardMemoId);
	
	public List<Card> getMyCardListInSpecificGroup(int groupId, int page, String card_order_flag);
	
	// -------------------------------------------------
	// team 관련 services
	
	public boolean insertTeam(AddTeamReqDto addTeamReqDto);
	
	public boolean deleteTeam(Team team);
	
	public boolean updateTeamName(Team team);
	
	public boolean isTeamJoined(int userId);
	
	public TeamUserProfile getTeamUserProfile(int userId);
	
	public boolean updateProfileNickname(TeamUserProfile teamUserProfile);
	
	public boolean leaveTeam(TeamJoinUser teamJoinUser);
	
	public boolean updateCardBookName(TeamCardBook teamCardBook);
	
	public boolean insertTeamGroup(TeamGroup teamGroup);
	
	public List<TeamDetail> getTeamList(int userId);
	
	public List<TeamCardBookSummary> getCardBookList(int teamId);
	
	public List<TeamGroupSummary> getTeamGroupList(int cardBookId);
	
	public List<Card> getAllCardListInCardBook(int cardBookId, int page, String card_order_flag);
	
	public List<Card> getCardListInSpecificGroup(int groupId, int page, String card_order_flag);
	
	public TeamCardDetailResDto getTeamCardDetail(int cardId);
	
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
	
	public List<CardBelongTeamGroup> getGroupBelongFlags(int cardId);
	
	public List<CardBelongTeamGroupsResDto> getGroupBelongFlagsForMultipleId(GetBelongFlagsReqDto getBelongFlagsReqDto);
	
	public boolean updateCardBelongTeamGroup(UpdateCardBelongTeamGroupReqDto updateCardBelongTeamGroupReqDto);
	
	public boolean updateCardsBelongTeamGroup(UpdateCardsBelongTeamGroupReqDto updateCardsBelongTeamGroupReqDto);
	
	public boolean deleteTeamCards(DeleteTeamCardsReqDto deleteTeamCardsReqDto);

	public boolean deleteAllTeamCardsInGroup(DeleteTeamCardsReqDto deleteTeamCardsReqDto);

	public boolean deleteAllTeamCardsInCardBook(DeleteTeamCardsReqDto deleteTeamCardsReqDto);
	
	public List<Card> getTeamCardEmails(GetCardEmailReqDto getCardEmailReqDto);

	public List<Card> getTeamCardEmailsInGroup(GetCardEmailReqDto getCardEmailReqDto);

	public List<Card> getTeamCardEmailsInCardBook(GetCardEmailReqDto getCardEmailReqDto);
	
}
