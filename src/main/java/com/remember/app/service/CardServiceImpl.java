package com.remember.app.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.CardBooksInTeam;
import com.remember.app.entity.card.CardDetail;
import com.remember.app.entity.card.CardImage;
import com.remember.app.entity.card.CardMemo;
import com.remember.app.entity.card.CardMemoDetail;
import com.remember.app.entity.card.CardRepository;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.entity.card.Team;
import com.remember.app.entity.card.TeamAndCardBooks;
import com.remember.app.entity.card.TeamCardBook;
import com.remember.app.entity.card.TeamCardBookSummary;
import com.remember.app.entity.card.TeamCardDetail;
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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {
	
//	@Value("${file.path}")
//	private String filePath;
	private String filePath = "";
	
	private final CardRepository cardRepository;
	
	@Override
	public CardDetailResDto getCardDetail(int card_id) {
		List<CardDetail> details = cardRepository.getCardDetail(card_id);
		System.out.println(details);
		CardDetailResDto dto = new CardDetailResDto();
		List<CardImage> imageList = new ArrayList<CardImage>();
		List<Group> groupList = new ArrayList<Group>();
		List<CardImage> cardImageList = new ArrayList<CardImage>();
		List<CardMemoDetail> memoList = new ArrayList<CardMemoDetail>();
		
		for(int i = 0; i < details.size(); i++) {
			CardDetail detail = details.get(i);
			if(i == 0) {
				dto.setCard(detail.toCardEntity());
			}
			Group group = detail.toGroupEntity();
			if(group != null && ! groupList.contains(group)) groupList.add(group);
			
			CardImage cardImage = detail.toCardImageEntity();
			if(cardImage != null && ! cardImageList.contains(cardImage)) cardImageList.add(cardImage);
			
			CardMemoDetail memo = detail.toMemoDetailEntity();
			if(memo != null && ! memoList.contains(memo)) memoList.add(memo);
			
			CardImage image = detail.toCardImageEntity();
			if(image != null && ! imageList.contains(image)) imageList.add(image);
		}
		dto.setCard_images(imageList);
		dto.setGroup_list(groupList);
		dto.setCard_images(cardImageList);
		dto.setMemo_list(memoList);
		
		return dto;
	}
	
	@Override
	public int insertNewCard(CardInsertReqDto cardInsertReqDto) {
		System.out.println(cardInsertReqDto);
		Card card = cardInsertReqDto.ToCardEntity();
		if(cardInsertReqDto.getProfile_image() != null) {
			String profile_img = downloadProfileImageFile(cardInsertReqDto.getProfile_image());
			card.setProfile_img(profile_img);
		}
		if(cardRepository.insertCard(card) == 1) {
			return card.getId();
		} else {
			return 0;
		}
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
	public boolean updateCard(UpdateCardDetailReqDto updateCardDetailReqDto) {
		Card card = updateCardDetailReqDto.toCardEntity();
		System.out.println(updateCardDetailReqDto);
		if(updateCardDetailReqDto.getProfile_image() != null) {
			String profile_img = downloadProfileImageFile(updateCardDetailReqDto.getProfile_image());
			card.setProfile_img(profile_img);
		}
		
		int result = cardRepository.updateCard(card);
		
		String frontCardImageName;
		String backCardImageName;
		if(updateCardDetailReqDto.getFront_card_image() != null) {
			frontCardImageName = downloadCardImageFile(updateCardDetailReqDto.getFront_card_image());
			CardImage cardImage = CardImage.builder()
																				   .card_id(card.getId())
																				   .card_image(frontCardImageName)
																				   .is_front(true)
																				   .build();
			Integer idWrapper = cardRepository.getCardImageId(card.getId(), 1);
			if(idWrapper == null) {
				result += cardRepository.insertCardImage(cardImage);
			} else {
				cardImage.setId(idWrapper.intValue());
				result += cardRepository.updateCardImage(cardImage);
			}
		}
		if(updateCardDetailReqDto.getBack_card_image() != null) {
			backCardImageName = downloadCardImageFile(updateCardDetailReqDto.getBack_card_image());
			CardImage cardImage = CardImage.builder()
																				   .card_id(card.getId())
																				   .card_image(backCardImageName)
																				   .is_front(false)
																				   .build();
			Integer idWrapper = cardRepository.getCardImageId(card.getId(), 0);
			if(idWrapper == null) {
				result += cardRepository.insertCardImage(cardImage);
			} else {
				cardImage.setId(idWrapper.intValue());
				result += cardRepository.updateCardImage(cardImage);
			}
		}
		System.out.println(result);
		return result > 0;
	}
	
	private String downloadProfileImageFile(MultipartFile file) {
		try {
			System.out.println(filePath);
			Path path = Paths.get(filePath, "profile_images");
			File fileForPathMake = new File(path.toString());
			
			System.out.println(path.toString());
			if(! fileForPathMake.exists()) {
				fileForPathMake.mkdirs();
			}
			
			String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + file.getOriginalFilename();
			Path imagePath = Paths.get(filePath, "profile_images/" + fileName);
			Files.write(imagePath, file.getBytes());
				
			return fileName;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	private String downloadCardImageFile(MultipartFile file) {
		try {
			Path path = Paths.get(filePath, "card_images");
			File fileForPathMake = new File(path.toString());
			
			if(! fileForPathMake.exists()) {
				fileForPathMake.mkdirs();
			}
			
			String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + file.getOriginalFilename();
			Path imagePath = Paths.get(filePath, "card_images/" + fileName);
			Files.write(imagePath, file.getBytes());
				
			return fileName;
		} catch (Exception e) {
			return null;
		}
	}
	
	@Override
	public boolean deleteCard(int cardId) {
		return cardRepository.deleteCard(cardId) == 1;
	}
	
	@Override
	public boolean deleteCards(CardDeleteReqDto cardDeleteReqDto) {
		return cardRepository.deleteCards(cardDeleteReqDto) > 0;
	}
	
	@Override
	public boolean deleteAllCardsInGroup(CardDeleteReqDto cardDeleteReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdListInGroup(cardDeleteReqDto.getGroup_id());
		if(cardDeleteReqDto.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(cardDeleteReqDto.getNot_selected_card_id_list());
		}
		
		cardDeleteReqDto.setCard_id_list(cardIdList);
		
		return cardRepository.deleteCards(cardDeleteReqDto) > 0;
	}
	
	@Override
	public boolean deleteAllCards(CardDeleteReqDto cardDeleteReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdList(cardDeleteReqDto.getUser_id());
		if(cardDeleteReqDto.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(cardDeleteReqDto.getNot_selected_card_id_list());
		}
		
		cardDeleteReqDto.setCard_id_list(cardIdList);
		
		return cardRepository.deleteCards(cardDeleteReqDto) > 0;
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
	public boolean updateCardBelongGroups(UpdateCardsBelongGroupsReqDto updateCardsBelongGroupsReqDto) {
		int result = 0;
		result += cardRepository.deleteCardBelongGroups(updateCardsBelongGroupsReqDto.getCardId());
		if(result > 0) {
			if(updateCardsBelongGroupsReqDto.getGroup_id_list() == null) {
				result += cardRepository.insertCardBelongDefaultGroup(updateCardsBelongGroupsReqDto.getCardId(), 
																																updateCardsBelongGroupsReqDto.getDefault_card_group_id());
			} else {
				result += cardRepository.insertCardBelongGroups(updateCardsBelongGroupsReqDto);
			}
		}
		return result > 1;
	}
	
	@Override
	public boolean updateCardsBelongGroups(UpdateCardsBelongGroupsReqDto updateCardsBelongGroupsReqDto) {
		boolean result = false;
		for(int i = 0; i < updateCardsBelongGroupsReqDto.getCard_id_list().size(); i++) {
			updateCardsBelongGroupsReqDto.setCardId(updateCardsBelongGroupsReqDto.getCard_id_list().get(i));
			
			result = updateCardBelongGroups(updateCardsBelongGroupsReqDto);
		}
		return result;
	}
	
	@Override
	public boolean updateAllCardsInGroupBelongGroups(UpdateAllCardsBelongGroupsReqDto updateAllCardsBelongGroupsReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdListInGroup(updateAllCardsBelongGroupsReqDto.getGroupId());
		if(updateAllCardsBelongGroupsReqDto.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(updateAllCardsBelongGroupsReqDto.getNot_selected_card_id_list());
		}
		
		int result = 0;
		for(int i = 0; i < cardIdList.size(); i++) {
			result += cardRepository.deleteCardBelongGroups(cardIdList.get(i));
			
			updateAllCardsBelongGroupsReqDto.setCardId(cardIdList.get(i));
			
			if(updateAllCardsBelongGroupsReqDto.getGroup_id_list() == null) {
				result += cardRepository.insertCardBelongDefaultGroup(updateAllCardsBelongGroupsReqDto.getCardId(), 
																																updateAllCardsBelongGroupsReqDto.getDefault_card_group_id());
			} else {
				result += cardRepository.insertCardBelongGroupsForMultiple(updateAllCardsBelongGroupsReqDto);
			}
		}
		return result > 1;
	}
	
	@Override
	public boolean updateAllCardsBelongGroups(UpdateAllCardsBelongGroupsReqDto updateAllCardsBelongGroupsReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdList(updateAllCardsBelongGroupsReqDto.getUserId());
		if(updateAllCardsBelongGroupsReqDto.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(updateAllCardsBelongGroupsReqDto.getNot_selected_card_id_list());
		}
		
		int result = 0;
		for(int i = 0; i < cardIdList.size(); i++) {
			result += cardRepository.deleteCardBelongGroups(cardIdList.get(i));
			
			updateAllCardsBelongGroupsReqDto.setCardId(cardIdList.get(i));
			
			if(updateAllCardsBelongGroupsReqDto.getGroup_id_list() == null) {
				result += cardRepository.insertCardBelongDefaultGroup(updateAllCardsBelongGroupsReqDto.getCardId(), 
																																updateAllCardsBelongGroupsReqDto.getDefault_card_group_id());
			} else {
				result += cardRepository.insertCardBelongGroupsForMultiple(updateAllCardsBelongGroupsReqDto);
			}
		}
		return result > 1;
	}
	
	@Override
	public List<Card> getCardSummaryList(int user_id, int page, String card_order_flag) {
		if(card_order_flag.equals("reg_date")) {
			return cardRepository.getCardSummaryList(user_id, page * 10);
		} else if(card_order_flag.equals("name")) {
			return cardRepository.getCardSummaryListOrderNameAsc(user_id, page * 10);
		} else if(card_order_flag.equals("company_name")) {
			return cardRepository.getCardSummaryListOrderCompanyAsc(user_id, page * 10);
		}
		return null;
	}
	
	@Override
	public List<Card> getCardSummaryListInSpecificGroup(int group_id, int page, String card_order_flag) {
		if(card_order_flag.equals("reg_date")) {
			return cardRepository.getCardSummaryListInSpecificGroup(group_id, page);
		} else if(card_order_flag.equals("name")) {
			return cardRepository.getCardSummaryListInSpecificGroupOrderNameAsc(group_id, page * 10);
		} else if(card_order_flag.equals("company_name")) {
			return cardRepository.getCardSummaryListInSpecificGroupOrderCompanyAsc(group_id, page * 10);
		}
		return null;
	}
	
	@Override
	public int insertCardMemo(CardMemo cardMemo) {
		return cardRepository.insertCardMemo(cardMemo);
	}
	
	@Override
	public boolean updateCardMemo(CardMemo cardMemo) {
		return cardRepository.updateCardMemo(cardMemo) == 1;
	}

    public boolean deleteCardMemo(int cardMemoId) {
		return cardRepository.deleteCardMemo(cardMemoId) == 1;
	}
	
	@Override
	public boolean insertTeamCardFromCard(int userId, int cardId, int defaultGroupId, boolean memo_include_flag) {
		CardDetailResDto cardData = getCardDetail(cardId);
		Card card = cardData.getCard();
		card.setUser_id(userId);
		int result = cardRepository.insertTeamCard(card);
		result += cardRepository.insertTeamCardBelongDefaultGroup(card.getId(), defaultGroupId);
		
		for(CardImage cardImage : cardData.getCard_images()) {
			cardImage.setCard_id(card.getId());
			result += cardRepository.insertTeamCardImage(cardImage);
		}
		
		if(memo_include_flag) {
			for(CardMemoDetail memo : cardData.getMemo_list()) {
				memo.setCard_id(card.getId());
				memo.setUser_id(userId);
				result += cardRepository.insertTeamCardMemo(memo.toCardMemoEntity());
			}
		}
		
		System.out.println(result);
		return result > 1;
	}
	
	@Override
	public boolean insertTeamCardsFromCard(AddTeamCardsFromCard addTeamCardsFromCard) {
		boolean result = false;
		for(int i = 0; i < addTeamCardsFromCard.getCard_book_id_list().size(); i++) {
			int cardBookId = addTeamCardsFromCard.getCard_book_id_list().get(i);
			int defaultGroupId = cardRepository.getDefaultTeamGroupId(cardBookId);
			
			for(int j = 0; j < addTeamCardsFromCard.getCard_id_list().size(); j++) {
				int cardId = addTeamCardsFromCard.getCard_id_list().get(j);
				
				result = insertTeamCardFromCard(addTeamCardsFromCard.getUserId(), cardId, defaultGroupId, addTeamCardsFromCard.isMemo_include_flag());
			}
		}
		return result;
	}
	
	@Override
	public boolean insertAllTeamCardsFromCardInGroup(AddAllTeamCardsFromCard addAllTeamCardsFromCard) {
		List<Integer> cardIdList = cardRepository.getAllCardIdListInGroup(addAllTeamCardsFromCard.getGroupId());
		if(addAllTeamCardsFromCard.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(addAllTeamCardsFromCard.getNot_selected_card_id_list());
		}
		boolean result = false;
		for(int i = 0; i < addAllTeamCardsFromCard.getCard_book_id_list().size(); i++) {
			int cardBookId = addAllTeamCardsFromCard.getCard_book_id_list().get(i);
			int defaultGroupId = cardRepository.getDefaultTeamGroupId(cardBookId);
			
			for(int j = 0; j < cardIdList.size(); j++) {
				int cardId = cardIdList.get(j);
				
				result = insertTeamCardFromCard(addAllTeamCardsFromCard.getUserId(), cardId, defaultGroupId, addAllTeamCardsFromCard.isMemo_include_flag());
			}
		}
		return result;
	}
	
	@Override
	public boolean insertAllTeamCardsFromCard(AddAllTeamCardsFromCard addAllTeamCardsFromCard) {
		List<Integer> cardIdList = cardRepository.getAllCardIdList(addAllTeamCardsFromCard.getUserId());
		if(addAllTeamCardsFromCard.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(addAllTeamCardsFromCard.getNot_selected_card_id_list());
		}
		boolean result = false;
		for(int i = 0; i < addAllTeamCardsFromCard.getCard_book_id_list().size(); i++) {
			int cardBookId = addAllTeamCardsFromCard.getCard_book_id_list().get(i);
			int defaultGroupId = cardRepository.getDefaultTeamGroupId(cardBookId);
			
			for(int j = 0; j < cardIdList.size(); j++) {
				int cardId = cardIdList.get(j);
				
				result = insertTeamCardFromCard(addAllTeamCardsFromCard.getUserId(), cardId, defaultGroupId, addAllTeamCardsFromCard.isMemo_include_flag());
			}
		}
		return result;
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
	public boolean deleteTeam(Team team) {
		return cardRepository.updateTeamToDelete(team) == 1;
	}
	
	@Override
	public boolean updateTeamName(Team team) {
		return cardRepository.updateTeamName(team) == 1;
	}
	
	@Override
	public TeamDetail getInvitedTeamInfo(TeamDetail teamDetail) {
		return cardRepository.getInvitedTeam(teamDetail);
	}
	
	@Override
	public String generateInviteCode(int teamId) {
		String inviteCode = generateUUIDTenDigits();
		System.out.println(inviteCode);
		while(cardRepository.checkDuplicateInviteCode(inviteCode) == 1) {
			inviteCode = generateUUIDTenDigits();
		}
		if(cardRepository.registerInviteCodeToTeam(Team.builder()
																										   .id(teamId)
																										   .invite_code(inviteCode)
																										   .build()) == 1) {
			return inviteCode;
		}
		return null;
	}
	
	private String generateUUIDTenDigits() {
		return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 10).toUpperCase();
	}
	
	@Override
	public boolean joinInvitedTeam(JoinTeamReqDto joinTeamReqDto) {
		int result = cardRepository.joinTeam(joinTeamReqDto.toJoinEntity());
		result += cardRepository.insertTeamUserProfile(joinTeamReqDto.toProfileEntity());
		
		List<Integer> cardBookIdList = cardRepository.getCardBookIdList(joinTeamReqDto.getTeam_id());
		joinTeamReqDto.setCard_book_id(cardBookIdList.get(0));
		
		result += cardRepository.insertTeamCardBookJoinUser(joinTeamReqDto.toCardBookJoinEntity());
	
		return result > 2;
	}
	
	@Override
	public TeamUserProfile getTeamUserProfile(int userId) {
		return cardRepository.getTeamUserProfile(userId);
	}
	
	@Override
	public boolean isTeamJoined(int userId) {
		return cardRepository.getUserJoinTeamFlag(userId) > 0;
	}
	
	@Override
	public boolean updateProfileNickname(TeamUserProfile teamUserProfile) {
		return cardRepository.updateProfileNickname(teamUserProfile) == 1;
	}
	
	@Override
	public boolean leaveTeam(TeamJoinUser teamJoinUser) {
		if(cardRepository.getAdmincCountInTeam(teamJoinUser) > 0) {
			return cardRepository.leaveTeam(teamJoinUser) == 1;
		}
		return false;
	}
	
	@Override
	public boolean insertTeamGroup(TeamGroup teamGroup) {
		return cardRepository.insertTeamGroup(teamGroup) == 1;
	}
	
	@Override
	public boolean updateTeamGroupName(TeamGroup teamGroup) {
		return cardRepository.updateTeamGroup(teamGroup) == 1;
	}
	
	@Override
	public boolean deleteTeamGroup(int groupId) {
		return cardRepository.deleteTeamGroup(groupId) == 1;
	}
	
	@Override
	public boolean updateCardBookName(TeamCardBook teamCardBook) {
		return cardRepository.updateTeamCardBookName(teamCardBook) == 1;
	}
	
	@Override
	public List<TeamDetail> getTeamList(int userId) {
		return cardRepository.getTeamList(userId);
	}
	
	@Override
	public List<CardBooksInTeam> getTeamListWithCardBooks(int userId) {
		List<TeamAndCardBooks> rawList = cardRepository.getTeamAndCardBooksWithJoinUser(userId);
		List<CardBooksInTeam> teamDetailList = new ArrayList<CardBooksInTeam>();
		
		for(TeamAndCardBooks raw : rawList) {
			if(teamDetailList.contains(raw.toTeamEntity())) {
				teamDetailList.get(teamDetailList.indexOf(raw.toTeamEntity())).getCard_books().add(raw.toCardBookSummaryEntity());
			} else {
				List<TeamCardBookSummary> cardBookList = new ArrayList<TeamCardBookSummary>();
				cardBookList.add(raw.toCardBookSummaryEntity());
				CardBooksInTeam teamDetail = CardBooksInTeam.builder()
																												 .team_detail(raw.toTeamEntity())
																												 .card_books(cardBookList)
																												 .build();
				teamDetailList.add(teamDetail);
			}
		}
		return teamDetailList;
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
	public List<Card> getAllCardListInCardBook(int cardBookId, int page, String card_order_flag) {
		if(card_order_flag.equals("reg_date")) {
			return cardRepository.getAllCardListInCardBook(cardBookId, page * 10);
		} else if(card_order_flag.equals("name")) {
			return cardRepository.getAllCardListInCardBookOrderNameAsc(cardBookId, page * 10);
		} else if(card_order_flag.equals("company_name")) {
			return cardRepository.getAllCardListInCardBookOrderCompanyAsc(cardBookId, page * 10);
		}
		return null;
	}
	
	@Override
	public List<Card> getCardListInSpecificGroup(int groupId, int page, String card_order_flag) {
		if(card_order_flag.equals("reg_date")) {
			return cardRepository.getCardListInSpecificGroup(groupId, page * 10);
		} else if(card_order_flag.equals("name")) {
			return cardRepository.getCardListInSpecificGroupOrderNameAsc(groupId, page * 10);
		} else if(card_order_flag.equals("company_name")) {
			return cardRepository.getCardListInSpecificGroupOrderCompanyAsc(groupId, page * 10);
		}
		return null;
	}
	
	@Override
	public TeamCardDetailResDto getTeamCardDetail(int cardId) {
		List<TeamCardDetail> details = cardRepository.getTeamCardDetail(cardId);
		System.out.println(details);
		
		TeamCardDetailResDto dto = new TeamCardDetailResDto();
		List<CardImage> cardImageList = new ArrayList<CardImage>();
		List<TeamGroup> groupList = new ArrayList<TeamGroup>();
		List<CardMemoDetail> memoList = new ArrayList<CardMemoDetail>();
		
		for(int i = 0; i < details.size(); i++) {
			TeamCardDetail detail = details.get(i);
			if(i == 0) {
				dto.setCard(detail.toCardEntity());
				dto.setReg_user_nickname(detail.getReg_user_nickname());
			}
			CardImage cardImage = detail.toCardImageEntity();
			if(cardImage != null && ! cardImageList.contains(cardImage)) cardImageList.add(cardImage);
			
			TeamGroup group = detail.toTeamGroupEntity();
			if(group != null && ! groupList.contains(group)) groupList.add(group);
			
			CardMemoDetail memo = detail.toMemoDetailEntity();
			if(memo != null && ! memoList.contains(memo)) memoList.add(memo);
		}
		dto.setCard_images(cardImageList);
		dto.setGroup_list(groupList);
		dto.setMemo_list(memoList);
		
		return dto;
	}
	
	@Override
	public boolean updateTeamCardDetail(UpdateCardDetailReqDto updateCardDetailReqDto) {
		Card card = updateCardDetailReqDto.toCardEntity();
		System.out.println(updateCardDetailReqDto);
		if(updateCardDetailReqDto.getProfile_image() != null) {
			String profile_img = downloadProfileImageFile(updateCardDetailReqDto.getProfile_image());
			card.setProfile_img(profile_img);
		}
		
		int result = cardRepository.updateTeamCard(card);
		
		String frontCardImageName;
		String backCardImageName;
		if(updateCardDetailReqDto.getFront_card_image() != null) {
			frontCardImageName = downloadCardImageFile(updateCardDetailReqDto.getFront_card_image());
			CardImage cardImage = CardImage.builder()
																				   .card_id(card.getId())
																				   .card_image(frontCardImageName)
																				   .is_front(true)
																				   .build();
			Integer idWrapper = cardRepository.getTeamCardImageId(card.getId(), 1);
			if(idWrapper == null) {
				result += cardRepository.insertTeamCardImage(cardImage);
			} else {
				cardImage.setId(idWrapper.intValue());
				result += cardRepository.updateTeamCardImage(cardImage);
			}
		}
		if(updateCardDetailReqDto.getBack_card_image() != null) {
			backCardImageName = downloadCardImageFile(updateCardDetailReqDto.getBack_card_image());
			CardImage cardImage = CardImage.builder()
																				   .card_id(card.getId())
																				   .card_image(backCardImageName)
																				   .is_front(false)
																				   .build();
			Integer idWrapper = cardRepository.getTeamCardImageId(card.getId(), 0);
			if(idWrapper == null) {
				result += cardRepository.insertTeamCardImage(cardImage);
			} else {
				cardImage.setId(idWrapper.intValue());
				result += cardRepository.updateTeamCardImage(cardImage);
			}
		}
		System.out.println(result);
		return result > 0;
	}
	
	@Override
	public boolean insertTeamCard(CardInsertReqDto cardInsertReqDto) {
		int defaultGroupId = cardRepository.getDefaultTeamGroupId(cardInsertReqDto.getCard_book_id());
		Card card = cardInsertReqDto.ToCardEntity();
		if(cardInsertReqDto.getProfile_image() != null) {
			String profile_img = downloadProfileImageFile(cardInsertReqDto.getProfile_image());
			card.setProfile_img(profile_img);
		}
		
		if(cardRepository.insertTeamCard(card) == 1) {
			if(cardRepository.insertTeamCardBelongDefaultGroup(card.getId(), defaultGroupId) == 1) {
				return true;
			}
		}
		return false;
	}
	
	@Override
	public boolean deleteTeamCard(int cardId) {
		int result = cardRepository.deleteTeamCardAllBelongs(cardId);
		result += cardRepository.updateTeamCardToDeleted(cardId);
		return result > 1;
	}
	
	@Override
	public boolean insertCardFromTeamCard(int userId, int cardId, boolean memo_include_flag) {
		TeamCardDetailResDto cardData = getTeamCardDetail(cardId);
		Card card = cardData.getCard();
		card.setUser_id(userId);
		int result = cardRepository.insertCard(card);
		
		for(CardImage cardImage : cardData.getCard_images()) {
			cardImage.setCard_id(card.getId());
			result += cardRepository.insertCardImage(cardImage);
		}
		
		if(memo_include_flag) {
			for(CardMemoDetail memo : cardData.getMemo_list()) {
				memo.setCard_id(card.getId());
				memo.setUser_id(userId);
				result += cardRepository.insertCardMemo(memo.toCardMemoEntity());
			}
		}
		
		System.out.println(result);
		return result > 0;
	}
	
	@Override
	public boolean insertCardsFromTeamCard(AddCardsFromTeamCard addCardsFromTeamCard) {
		boolean result = false;
		for(int cardId : addCardsFromTeamCard.getCard_id_list()) {
			result = insertCardFromTeamCard(addCardsFromTeamCard.getUserId(), cardId, addCardsFromTeamCard.isMemo_include_flag());
		}
		return result;
	}
	
	@Override
	public boolean insertAllCardsInTeamGroupToCard(AddAllCardsFromTeamCard addAllCardsFromTeamCard) {
		List<Integer> cardIdList = cardRepository.getAllCardIdInTeamGroup(addAllCardsFromTeamCard.getGroupId());
		if(addAllCardsFromTeamCard.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(addAllCardsFromTeamCard.getNot_selected_card_id_list());
		}
		boolean result = false;
		for(int cardId : cardIdList) {
			result = insertCardFromTeamCard(addAllCardsFromTeamCard.getUserId(), cardId, addAllCardsFromTeamCard.isMemo_include_flag());
		}
		return result;
	}
	
	@Override
	public boolean insertAllCardsInTeamCardBookToCard(AddAllCardsFromTeamCard addAllCardsFromTeamCard) {
		List<Integer> cardIdList = cardRepository.getAllCardIdInTeamCardBook(addAllCardsFromTeamCard.getCardBookId());
		if(addAllCardsFromTeamCard.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(addAllCardsFromTeamCard.getNot_selected_card_id_list());
		}
		boolean result = false;
		for(int cardId : cardIdList) {
			result = insertCardFromTeamCard(addAllCardsFromTeamCard.getUserId(), cardId, addAllCardsFromTeamCard.isMemo_include_flag());
		}
		return result;
	}
	
	@Override
	public List<TeamUserProfile> getTeamJoinUsers(int teamId, int userId, int page) {
		return cardRepository.getTeamJoinUsers(teamId, userId, page * 10);
	}
	
	@Override
	public List<TeamUserProfile> getCardBookJoinUsers(int cardBookId, int page) {
		return cardRepository.getCardBookJoinUsers(cardBookId, page * 10);
	}
	
	@Override
	public boolean insertTeamCardMemo(CardMemo cardMemo) {
		return cardRepository.insertTeamCardMemo(cardMemo) == 1;
	}
	
	@Override
	public boolean updateTeamCardMemo(CardMemo cardMemo) {
		return cardRepository.updateTeamCardMemo(cardMemo) == 1;
	}
	
	@Override
	public boolean deleteTeamCardMemo(int cardMemoId) {
		return cardRepository.deleteTeamCardMemo(cardMemoId) == 1;
	}
	
	@Override
	public boolean updateTeamCardBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto) {
		int result = cardRepository.deleteTeamCardBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
		
		if(result > 0) {
			if(updateTeamCardBelongTeamGroupReqDto.getGroup_id_list() == null) {
				result += cardRepository.insertTeamCardBelongDefaultTeamGroup(updateTeamCardBelongTeamGroupReqDto);
			} else {
				result += cardRepository.insertTeamCardBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
			}
		}
		return result > 1;
	}
	
	@Override
	public boolean updateTeamCardsBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto) {
		int result = cardRepository.deleteTeamCardsBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
		
		if(result > 0) {
			for(int cardId : updateTeamCardBelongTeamGroupReqDto.getCard_id_list()) {
				updateTeamCardBelongTeamGroupReqDto.setCard_id(cardId);
				if(updateTeamCardBelongTeamGroupReqDto.getGroup_id_list() == null) {
					result += cardRepository.insertTeamCardBelongDefaultTeamGroup(updateTeamCardBelongTeamGroupReqDto);
				} else {
					result += cardRepository.insertTeamCardBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
				}
			}
		}
		return result > 1;
	}
	
	@Override
	public boolean updateAllTeamCardsInGroupBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdInTeamGroup(updateTeamCardBelongTeamGroupReqDto.getGroup_id());
		if(updateTeamCardBelongTeamGroupReqDto.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(updateTeamCardBelongTeamGroupReqDto.getNot_selected_card_id_list());
		}
		
		updateTeamCardBelongTeamGroupReqDto.setCard_id_list(cardIdList);
		System.out.println(updateTeamCardBelongTeamGroupReqDto);
		return updateTeamCardsBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
	}
	
	@Override
	public boolean updateAllTeamCardsBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdInTeamCardBook(updateTeamCardBelongTeamGroupReqDto.getCard_book_id());
		if(updateTeamCardBelongTeamGroupReqDto.getNot_selected_card_id_list() != null) {
			cardIdList.removeAll(updateTeamCardBelongTeamGroupReqDto.getNot_selected_card_id_list());
		}
		System.out.println(cardIdList);
		updateTeamCardBelongTeamGroupReqDto.setCard_id_list(cardIdList);
		System.out.println(updateTeamCardBelongTeamGroupReqDto);
		return updateTeamCardsBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
	}
	
	@Override
	public boolean deleteTeamCards(DeleteTeamCardsReqDto deleteTeamCardsReqDto) {
		return cardRepository.updateTeamCardsToDeleted(deleteTeamCardsReqDto) > 0;
	}
	
	@Override
	public boolean deleteAllTeamCardsInGroup(DeleteTeamCardsReqDto deleteTeamCardsReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdInTeamGroup(deleteTeamCardsReqDto.getGroupId());
		if(deleteTeamCardsReqDto.getCard_id_list() != null) {
			cardIdList.removeAll(deleteTeamCardsReqDto.getCard_id_list());
		}
		deleteTeamCardsReqDto.setCard_id_list(cardIdList);
		return cardRepository.updateTeamCardsToDeleted(deleteTeamCardsReqDto) > 0;
	}
	
	public boolean deleteAllTeamCardsInCardBook(DeleteTeamCardsReqDto deleteTeamCardsReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdInTeamCardBook(deleteTeamCardsReqDto.getCardBookId());
		if(deleteTeamCardsReqDto.getCard_id_list() != null) {
			cardIdList.removeAll(deleteTeamCardsReqDto.getCard_id_list());
		}
		deleteTeamCardsReqDto.setCard_id_list(cardIdList);
		return cardRepository.updateTeamCardsToDeleted(deleteTeamCardsReqDto) > 0;
	}
	
	@Override
	public List<Card> getTeamCardEmails(GetCardEmailReqDto getCardEmailReqDto) {
		System.out.println(getCardEmailReqDto);
		return cardRepository.getTeamCardEmails(getCardEmailReqDto);
	}
	
	@Override
	public List<Card> getTeamCardEmailsInGroup(GetCardEmailReqDto getCardEmailReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdInTeamGroup(getCardEmailReqDto.getGroupId());
		if(getCardEmailReqDto.getNot_selected_id_list() != null) {
			cardIdList.removeAll(getCardEmailReqDto.getNot_selected_id_list());
		}
		getCardEmailReqDto.setCard_id_list(cardIdList);
		System.out.println(getCardEmailReqDto);
		return cardRepository.getTeamCardEmails(getCardEmailReqDto);
	}
	
	@Override
	public List<Card> getTeamCardEmailsInCardBook(GetCardEmailReqDto getCardEmailReqDto) {
		List<Integer> cardIdList = cardRepository.getAllCardIdInTeamCardBook(getCardEmailReqDto.getCardBookId());
		if(getCardEmailReqDto.getNot_selected_id_list() != null) {
			cardIdList.removeAll(getCardEmailReqDto.getNot_selected_id_list());
		}
		getCardEmailReqDto.setCard_id_list(cardIdList);
		System.out.println(getCardEmailReqDto);
		return cardRepository.getTeamCardEmails(getCardEmailReqDto);
	}
	
}
