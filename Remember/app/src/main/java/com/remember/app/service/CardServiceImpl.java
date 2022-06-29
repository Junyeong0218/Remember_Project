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
import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.AddTeamReqDto;
import com.remember.app.requestDto.CardDeleteReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
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
	public CardDetail getCardDetail(int card_id) {
		return cardRepository.getCardDetail(card_id);
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
	public List<Card> getAllCardListInCardBook(int cardBookId, int page) {
		return cardRepository.getAllCardListInCardBook(cardBookId, page * 10);
	}
	
	@Override
	public List<Card> getCardListInSpecificGroup(int groupId, int page) {
		return cardRepository.getCardListInSpecificGroup(groupId, page * 10);
	}
	
	@Override
	public TeamCardDetailResDto getTeamCardDetail(int cardId) {
		List<TeamCardDetail> details = cardRepository.getTeamCardDetail(cardId);
		System.out.println(details);
		
		TeamCardDetailResDto dto = new TeamCardDetailResDto();
		List<TeamGroup> groupList = new ArrayList<TeamGroup>();
		List<CardMemoDetail> memoList = new ArrayList<CardMemoDetail>();
		
		for(int i = 0; i < details.size(); i++) {
			TeamCardDetail detail = details.get(i);
			if(i == 0) {
				dto.setCard(detail.toCardEntity());
				dto.setReg_user_nickname(detail.getReg_user_nickname());
			}
			TeamGroup group = detail.toTeamGroupEntity();
			if(group != null && ! groupList.contains(group)) groupList.add(group);
			
			CardMemoDetail memo = detail.toMemoDetailEntity();
			if(memo != null && ! memoList.contains(memo)) memoList.add(memo);
		}
		dto.setGroup_list(groupList);
		dto.setMemo_list(memoList);
		
		return dto;
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
	
}
