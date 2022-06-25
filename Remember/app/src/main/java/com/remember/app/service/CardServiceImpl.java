package com.remember.app.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.remember.app.entity.card.AddGroup;
import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.CardDetail;
import com.remember.app.entity.card.CardRepository;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupCard;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.CardInsertReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.responseDto.GroupRespDto;

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
		
		AddGroup addGroup = addGroupReqDto.toAddEntity();
		
		return cardRepository.addUserGroup(addGroup);
	}
	
	@Override
	public List<Card> getCardSummaryList(int user_id, int page) {
		return cardRepository.getCardSummaryList(user_id, page * 10);
	}
}
