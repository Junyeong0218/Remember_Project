package com.remember.app.entity.card;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.remember.app.requestDto.UpdateCardBelongGroups;
import com.remember.app.requestDto.CardDeleteReqDto;
import com.remember.app.requestDto.DeleteTeamCardsReqDto;
import com.remember.app.requestDto.GetBelongFlagsReqDto;
import com.remember.app.requestDto.GetCardEmailReqDto;
import com.remember.app.requestDto.UpdateCardBelongTeamGroupReqDto;
import com.remember.app.requestDto.UpdateCardsBelongGroupsReqDto;
import com.remember.app.requestDto.UpdateCardsBelongTeamGroupReqDto;

@Mapper
public interface CardRepository {
	

	public List<CardDetail> getCardDetail(int card_id);
	
	public int insertCard(Card card);
	
	public int updateCard(Card card);
	
	public int deleteCard(int card_id);
	
	public int deleteCards(CardDeleteReqDto cardDeleteReqDto);
	
	public Integer getCardImageId(int cardId, int is_front);
	
	public int insertCardImage(CardImage cardImage);
	
	public int updateCardImage(CardImage cardImage);
	
	public int insertGroup(Group group);	
	
	public List<GroupSummary> getGroup(int user_id);
	
	public int updateGroup(Group group);
	
	public int deleteGroup(Group group);
	
	public Card getUserCard(int cardId);
	
	public int deleteCardBelongGroups(int cardId);
	
	public int insertCardBelongGroups(UpdateCardsBelongGroupsReqDto updateCardsBelongGroupsReqDto);
	
	public int insertCardBelongDefaultGroup(UpdateCardsBelongGroupsReqDto updateCardsBelongGroupsReqDto);
	
	public List<Integer> getAllCardIdList(int userId);
	
	public List<Integer> getAllCardIdListInGroup(int groupId);
	
	public List<Card> getCardSummaryList(int user_id, int page);

	public List<Card> getCardSummaryListOrderNameAsc(int user_id, int page);

	public List<Card> getCardSummaryListOrderCompanyAsc(int user_id, int page);
	
	public List<Card> getCardSummaryListInSpecificGroup(int group_id, int page);

	public List<Card> getCardSummaryListInSpecificGroupOrderNameAsc(int group_id, int page);

	public List<Card> getCardSummaryListInSpecificGroupOrderCompanyAsc(int group_id, int page);

	public int insertCardMemo(CardMemo cardMemo);
	
	public int updateCardMemo(CardMemo cardMemo);
	
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
	
	public int getUserJoinTeamFlag(int userId);
	
	public List<TeamAndCardBooks> getTeamAndCardBooksWithJoinUser(int userId);
	
	public int updateProfileNickname(TeamUserProfile teamUserProfile);
	
	public int insertTeamGroup(TeamGroup teamGroup);
	
	public int getDefaultTeamGroupId(int cardBookId);
	
	public int updateTeamName(Team team);

	public TeamUserProfile getTeamUserProfile(int userId);
	
	public List<TeamDetail> getTeamList(int userId);
	
	public List<TeamCardBookSummary> getCardBookList(int teamId);
	
	public List<TeamGroupSummary> getTeamGroupList(int cardBookId);
	
	public List<Integer> getAllCardIdInTeamGroup(int groupId);

	public List<Integer> getAllCardIdInTeamCardBook(int cardBookId);
	
	public List<Card> getAllCardListInCardBook(int cardBookId, int page);

	public List<Card> getAllCardListInCardBookOrderNameAsc(int cardBookId, int page);

	public List<Card> getAllCardListInCardBookOrderCompanyAsc(int cardBookId, int page);
	
	public List<Card> getCardListInSpecificGroup(int groupId, int page);
	
	public List<Card> getCardListInSpecificGroupOrderNameAsc(int groupId, int page);
	
	public List<Card> getCardListInSpecificGroupOrderCompanyAsc(int groupId, int page);
	
	public List<TeamCardDetail> getTeamCardDetail(int cardId);
	
	public int insertTeamCard(Card card);
	
	public int insertTeamCardBelongDefaultGroup(int cardId, int defaultGroupId);
	
	public int updateTeamCard(Card card);
	
	public int updateTeamCardToDeleted(int cardId);
	
	public int updateTeamCardsToDeleted(DeleteTeamCardsReqDto deleteTeamCardsReqDto);
	
	public int deleteTeamCardAllBelongs(int cardId);
	
	public Integer getTeamCardImageId(int cardId, int is_front);
	
	public int insertTeamCardImage(CardImage cardImage);
	
	public int updateTeamCardImage(CardImage cardImage);

	public List<TeamUserProfile> getTeamJoinUsers(int teamId, int userId, int page);

	public List<TeamUserProfile> getCardBookJoinUsers(int teamCardBookId, int page);
	
	public int insertTeamCardMemo(CardMemo cardMemo);
	
	public int updateTeamCardMemo(CardMemo cardMemo);
	
	public int deleteTeamCardMemo(int cardMemoId);
	
	public List<CardBelongTeamGroup> getGroupBelongFlags(int cardId);
	
	public List<CardBelongTeamGroup> getGroupBelongFlagsForMultipleId(GetBelongFlagsReqDto getBelongFlagsReqDto);
	
	public int insertCardBelongTeamGroup(UpdateCardBelongTeamGroupReqDto updateCardBelongTeamGroupReqDto);

	public int insertCardBelongDefaultTeamGroup(int cardId, int defaultTeamGroupId);

	public int deleteCardBelongTeamGroup(UpdateCardBelongTeamGroupReqDto updateCardBelongTeamGroupReqDto);

	public int deleteCardBelongDefaultTeamGroup(int cardId, int defaultTeamGroupId);
	
	public int deleteCardsBelongTeamGroups(UpdateCardsBelongTeamGroupReqDto updateCardsBelongTeamGroupReqDto);

	public int insertCardsBelongDefaultTeamGroup(UpdateCardsBelongTeamGroupReqDto updateCardsBelongTeamGroupReqDto);
	
	public int insertCardBelongTeamGroups(UpdateCardsBelongTeamGroupReqDto updateCardsBelongTeamGroupReqDto);
	
	public List<Card> getTeamCardEmails(GetCardEmailReqDto getCardEmailReqDto);
	
}
