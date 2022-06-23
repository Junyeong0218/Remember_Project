package com.remember.app.restController;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.card.Card;
import com.remember.app.entity.card.Group;
import com.remember.app.entity.card.GroupSummary;
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.CardInsertReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.responseDto.GroupRespDto;
import com.remember.app.service.CardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/card")
@RequiredArgsConstructor
public class CardRestController {
	
	private final CardService cardService;
	
	//본인 명함 검색 ("") get
	@GetMapping("")
	public ResponseEntity<?> getCard(@AuthenticationPrincipal PrincipalDetails principalDetails){
		
		List<Card> card= cardService.getCards(principalDetails.getId());
		System.out.println(card);
		return new ResponseEntity<>(card,HttpStatus.OK);
	}
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllCard(@AuthenticationPrincipal PrincipalDetails principalDetails){
		List<GroupSummary> groups = cardService.getGroups(principalDetails.getId());
		return new ResponseEntity<>(groups,HttpStatus.OK);
	}
	
	//본인 명함 등록 post
	@PostMapping("")
	public ResponseEntity<?> registerCard(@AuthenticationPrincipal PrincipalDetails principalDetails, CardInsertReqDto cardInsertReqDto){
		cardInsertReqDto.setUser_id(principalDetails.getId());
		System.out.println(cardInsertReqDto);
		Card card = cardInsertReqDto.cardMstToEntity();
		int result = cardService.insertNewCard(card);
		if(result == 1) {
			return new ResponseEntity<>(card.getId(), HttpStatus.OK);
		}else {
			return new ResponseEntity<>(0, HttpStatus.OK);
		}
	}
	
	//본인명함 수정 put
	@PutMapping("")
	public ResponseEntity<?> updateCard(CardUpdateReqDto cardUpdateReqDto){
		int result = cardService.updateCard(cardUpdateReqDto);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//본인명함 삭제 delete
	@DeleteMapping("")
	public ResponseEntity<?> deleteCard(@AuthenticationPrincipal PrincipalDetails principalDetails){
		int result =cardService.deleteCard(principalDetails.getId());
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//그룹추가 (/group) post
	@PostMapping("/group")
	public ResponseEntity<?> addGroup(@AuthenticationPrincipal PrincipalDetails principalDetails, String group_name){
		System.out.println(group_name);
		Group group = Group.builder()
				.user_id(principalDetails.getId())
				.group_name(group_name)
				.build();
		int result = cardService.insertGroup(group);
		if(result == 1) {
			return new ResponseEntity<>(group.getId(),HttpStatus.OK);
		}else {
			return new ResponseEntity<>(0,HttpStatus.OK);
		}
	}
	
	//그룹검색 get
	@GetMapping("/group")
	public ResponseEntity<?> getGroup(@AuthenticationPrincipal PrincipalDetails principalDetails){
		List<GroupSummary> groups = cardService.getGroups(principalDetails.getId());
		return new ResponseEntity<>(groups,HttpStatus.OK);
	}
	
	//
	@GetMapping("/list")
	public ResponseEntity<?> getCardSummaryList(int page, @AuthenticationPrincipal PrincipalDetails principalDetails){
		List<Card> cards= cardService.getCardSummaryList(principalDetails.getId(), page);
		return new ResponseEntity<>(cards,HttpStatus.OK); 
	}
	
	//특정 그룹 검색 (/group/{groupId}) get
	@GetMapping("/group/{groupId}")
	public ResponseEntity<?> getGroupByGroupId(@PathVariable int groupId){
		GroupRespDto dto = cardService.getGroupId(groupId);
		System.out.println(dto);
		return new ResponseEntity<>(dto,HttpStatus.OK);
	}
	
	//그룹 수정
	@PutMapping("/group/{groupId}")
	public ResponseEntity<?> updateGroupCard(@PathVariable int groupId,Group group){
		System.out.println(group);
		group.setId(groupId);
		System.out.println(group);
		int result= cardService.updateGroupCard(group);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	//그룹 삭제
	@DeleteMapping("/group/{groupId}")
	public ResponseEntity<?> deleteGroupCard(@PathVariable int groupId,Group group){
		System.out.println(groupId);
		group.setId(groupId);
		int deleteResult =cardService.deleteGroupCard(group);
		return new ResponseEntity<>( deleteResult, HttpStatus.OK);
	}
		
	//특정ID 타인명함 select
	@GetMapping("/{cardId}")
	public ResponseEntity<?> getIdCard(@PathVariable int cardId){
		System.out.println(cardId);
		Card card = cardService.getUserCard(cardId);
		
		return new ResponseEntity<>(card,HttpStatus.OK);
	}
	
	//특정ID 타인 명함 내 그룹 insert
	@PostMapping("/{cardId}")
	public ResponseEntity<?> addUserGroup(@PathVariable int cardId,AddGroupReqDto addGroupReqDto){
		System.out.println(addGroupReqDto);
		System.out.println(cardId);
		int result =cardService.addGroupUser(addGroupReqDto);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	
	
	
}
