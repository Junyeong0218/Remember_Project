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
import com.remember.app.entity.card.CardBelongTeamGroup;
import com.remember.app.entity.card.CardDetail;
import com.remember.app.entity.card.CardImage;
import com.remember.app.entity.card.CardMemo;
import com.remember.app.entity.card.CardMemoDetail;
import com.remember.app.entity.card.CardRepository;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupCard;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.entity.card.Team;
import com.remember.app.entity.card.TeamCardBook;
import com.remember.app.entity.card.TeamCardBookSummary;
import com.remember.app.entity.card.TeamCardDetail;
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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {
	
	@Value("${file.path}")
	private String filePath;
	
	private final CardRepository cardRepository;
	
	@Override
	public List<Card> getCards(int user_id) {
		return cardRepository.getCards(user_id);
	}
	
	@Override
	public CardDetailResDto getCardDetail(int card_id) {
		List<CardDetail> details = cardRepository.getCardDetail(card_id);
		System.out.println(details);
		CardDetailResDto dto = new CardDetailResDto();
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
			
		}
		dto.setGroup_list(groupList);
		dto.setCard_images(cardImageList);
		dto.setMemo_list(memoList);
		
		return dto;
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
		if(cardUpdateReqDto.getProfile_img() != null) {
			List<MultipartFile> files = new ArrayList<MultipartFile>();
			files.add(cardUpdateReqDto.getProfile_img());
			
			List<String> fileNames = downloadArticleImageFiles(files);
			if(fileNames != null) {
				updateCard.setProfile_img(fileNames.get(0));
				fileNames.clear();
				fileNames.add(cardUpdateReqDto.getOrigin_profile_img());
				deleteArticleImageFiles(fileNames);
			}
		}
		System.out.println(updateCard);
		return cardRepository.updateCard(updateCard);
	}
	
	private boolean deleteArticleImageFiles(List<String> files) {
		try {
			for(String fileName : files) {
				Path path = Paths.get(filePath, "profile_images/" + fileName);
				File file = new File(path.toString());
				
				if(file.exists()) {
					file.delete();
				}
			}
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	private List<String> downloadArticleImageFiles(List<MultipartFile> files) {
		try {
			List<String> imageNames = new ArrayList<String>();
			for(int i = 0; i < files.size(); i++) {
				Path path = Paths.get(filePath, "profile_images");
				File file = new File(path.toString());
				
				if(! file.exists()) {
					file.mkdirs();
				}
				
				String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + files.get(i).getOriginalFilename();
				Path imagePath = Paths.get(filePath, "profile_images/" + fileName);
				Files.write(imagePath, files.get(i).getBytes());
				imageNames.add(fileName);
			}
			return imageNames;
		} catch (Exception e) {
			return null;
		}
	}
	
	private String downloadProfileImageFile(MultipartFile file) {
		try {
			Path path = Paths.get(filePath, "profile_images");
			File fileForPathMake = new File(path.toString());
			
			if(! fileForPathMake.exists()) {
				fileForPathMake.mkdirs();
			}
			
			String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + file.getOriginalFilename();
			Path imagePath = Paths.get(filePath, "profile_images/" + fileName);
			Files.write(imagePath, file.getBytes());
				
			return fileName;
		} catch (Exception e) {
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
	public int deleteCard(int card_id) {
		
		return cardRepository.deleteCard(card_id);
	}
	
	@Override
	public int deleteCards(CardDeleteReqDto cardDeleteReqDto) {
		
		return cardRepository.deleteCards(cardDeleteReqDto);
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
		int result = cardRepository.deleteCardsBelongGroup(addGroupReqDto);
		if(addGroupReqDto.getGroup_id_list() == null) {
			result += cardRepository.addCardsBelongDefaultGroup(addGroupReqDto);
		} else {
			for(int card_id : addGroupReqDto.getCard_id_list()) {
				addGroupReqDto.setCardId(card_id);
				result += cardRepository.addCardBelongGroups(addGroupReqDto);
			}
		}
		return result;
	}
	
	@Override
	public List<Card> getCardSummaryList(int user_id, int page) {
		return cardRepository.getCardSummaryList(user_id, page * 10);
	}
	
	@Override
	public int insertCardMemo(CardMemo cardMemo) {
		return cardRepository.insertCardMemo(cardMemo);
	}
	
	@Override
	public boolean updateCardMemo(CardMemo cardMemo) {
		
		return cardRepository.updateCardMemo(cardMemo) == 1;
	}
	
	@Override
	public boolean deleteCardMemo(int cardMemoId) {
		return cardRepository.deleteCardMemo(cardMemoId) == 1;
	}
	
	@Override
	public List<Card> getMyCardListInSpecificGroup(int groupId, int page, String card_order_flag) {
		if(card_order_flag.equals("reg_date")) {
			return cardRepository.getCardListInSpecificGroup(groupId, page * 10);
		} else if(card_order_flag.equals("name")) {
			return cardRepository.getCardListInSpecificGroupOrderNameAsc(groupId, page * 10);
		} else if(card_order_flag.equals("company_name")) {
			return cardRepository.getCardListInSpecificGroupOrderCompanyAsc(groupId, page * 10);
		}
		return null;
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
	public boolean updateCardBookName(TeamCardBook teamCardBook) {
		return cardRepository.updateTeamCardBookName(teamCardBook) == 1;
	}
	
	@Override
	public List<TeamDetail> getTeamList(int userId) {
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
	public List<CardBelongTeamGroup> getGroupBelongFlags(int cardId) {
		return cardRepository.getGroupBelongFlags(cardId);
	}
	
	@Override
	public List<CardBelongTeamGroupsResDto> getGroupBelongFlagsForMultipleId(GetBelongFlagsReqDto getBelongFlagsReqDto) {
		List<CardBelongTeamGroup> belongList = cardRepository.getGroupBelongFlagsForMultipleId(getBelongFlagsReqDto);
		List<CardBelongTeamGroupsResDto> dtoList = new ArrayList<CardBelongTeamGroupsResDto>();
		
		for(CardBelongTeamGroup belong : belongList) {
			CardBelongTeamGroupsResDto cardId = CardBelongTeamGroupsResDto.builder().card_id(belong.getCard_id()).build();
			if(dtoList.contains(cardId)) {
				dtoList.get(dtoList.indexOf(cardId)).getTeam_group_list().add(belong);
			} else {
				dtoList.add(belong.toMultipleDto());
			}
		}
		return dtoList;
	}
	
	@Override
	public boolean updateCardBelongTeamGroup(UpdateCardBelongTeamGroupReqDto updateCardBelongTeamGroupReqDto) {
		int result = 0;
		if(updateCardBelongTeamGroupReqDto.getRemove_id_list() != null) {
			result += cardRepository.deleteCardBelongTeamGroup(updateCardBelongTeamGroupReqDto);
		}
		if(updateCardBelongTeamGroupReqDto.getAdd_id_list() != null) {
			result += cardRepository.insertCardBelongTeamGroup(updateCardBelongTeamGroupReqDto);
		}
		if(updateCardBelongTeamGroupReqDto.isRemove_all_flag()) {
			result += cardRepository.insertCardBelongDefaultTeamGroup(updateCardBelongTeamGroupReqDto.getCard_id(), updateCardBelongTeamGroupReqDto.getDefault_team_group_id());
		} else {
			result += cardRepository.deleteCardBelongDefaultTeamGroup(updateCardBelongTeamGroupReqDto.getCard_id(), updateCardBelongTeamGroupReqDto.getDefault_team_group_id());
		}
		System.out.println(result);
		return result > 0;
	}
	
	@Override
	public boolean updateCardsBelongTeamGroup(UpdateCardsBelongTeamGroupReqDto updateCardsBelongTeamGroupReqDto) {
		int result = cardRepository.deleteCardsBelongTeamGroups(updateCardsBelongTeamGroupReqDto);
		if(updateCardsBelongTeamGroupReqDto.getAdd_belong_id_list() == null) {
			result += cardRepository.insertCardsBelongDefaultTeamGroup(updateCardsBelongTeamGroupReqDto);
		} else {
			for(int card_id : updateCardsBelongTeamGroupReqDto.getCard_id_list()) {
				updateCardsBelongTeamGroupReqDto.setCardId(card_id);
				result += cardRepository.insertCardBelongTeamGroups(updateCardsBelongTeamGroupReqDto); 
			}
		}
		return result > 1;
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
