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
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddGroupReqDto;
import com.remember.app.requestDto.AddTeamReqDto;
import com.remember.app.requestDto.CardDeleteReqDto;
import com.remember.app.requestDto.CardInsertReqDto;
import com.remember.app.requestDto.CardUpdateReqDto;
import com.remember.app.responseDto.GroupRespDto;
import com.remember.app.responseDto.TeamCardDetailResDto;
import com.remember.app.service.CardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/card")
@RequiredArgsConstructor
public class CardRestController {
	
	private final CardService cardService;
	
	//명함 검색 ("") get
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
	
	@GetMapping("/{cardId}")
	public ResponseEntity<?> getCardDetail(@PathVariable int cardId) {
		CardDetail cardDetail = cardService.getCardDetail(cardId);
		System.out.println(cardDetail);
		return new ResponseEntity<>(cardDetail, HttpStatus.OK); 
	}
	
	//명함 등록 post
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
	
	//명함 수정 put
	@PutMapping("/{cardId}")
	public ResponseEntity<?> updateCard(@PathVariable int cardId,
										CardUpdateReqDto cardUpdateReqDto) {
		cardUpdateReqDto.setId(cardId);
		int result = cardService.updateCard(cardUpdateReqDto);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//명함 삭제 delete
	@DeleteMapping("{cardId}")
	public ResponseEntity<?> deleteCard(@PathVariable int cardId){
		int result =cardService.deleteCard(cardId);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//명함 여러개 삭제
	@DeleteMapping("/list")
	public ResponseEntity<?> deleteCards(CardDeleteReqDto cardDeleteReqDto){
		System.out.println(cardDeleteReqDto);
		int result = cardService.deleteCards(cardDeleteReqDto);
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
	/*@GetMapping("/{cardId}")
	public ResponseEntity<?> getIdCard(@PathVariable int cardId){
		System.out.println(cardId);
		Card card = cardService.getUserCard(cardId);
		
		return new ResponseEntity<>(card,HttpStatus.OK);
	}*/
	
	@PutMapping("/belong")
	public ResponseEntity<?> addUserGroup(AddGroupReqDto addGroupReqDto){
		System.out.println(addGroupReqDto);
		int result = cardService.addGroupUser(addGroupReqDto);
		System.out.println(result);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	

	
	// ------------------------------------------------------------------------------
	// team 관련 rest methods
	
	@PostMapping("/team")
	public boolean insertTeam(AddTeamReqDto addTeamReqDto,
														@AuthenticationPrincipal PrincipalDetails principalDetails) {
		addTeamReqDto.setMade_user_id(principalDetails.getId());
		System.out.println(addTeamReqDto);
		return cardService.insertTeam(addTeamReqDto);
	}
	
	@GetMapping("/team/profile")
	public TeamUserProfile getTeamUserProfile(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return cardService.getTeamUserProfile(principalDetails.getId());
	}
	
	@PutMapping("/team/profile/{profileId}")
	public boolean updateProfileNickname(@PathVariable int profileId,
																				TeamUserProfile teamUserProfile) {
		teamUserProfile.setId(profileId);
		return cardService.updateProfileNickname(teamUserProfile);
	}
	
	@GetMapping("/team/list")
	public List<TeamDetail> getTeamList(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return cardService.getTeamList(principalDetails.getId());
	}
	
	@PutMapping("/team/{teamId}")
	public boolean updateTeamName(@PathVariable int teamId,
																	 Team team) {
		team.setId(teamId);
		return cardService.updateTeamName(team);
	}
	
	@PostMapping("/team/book/{cardBookId}")
	public boolean insertTeamGroup(@PathVariable int cardBookId,
																	TeamGroup teamGroup) {
		teamGroup.setCard_book_id(cardBookId);
		return cardService.insertTeamGroup(teamGroup);
	}
	
	@DeleteMapping("/team/{teamId}")
	public boolean deleteTeam(@PathVariable int teamId,
														 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		Team team = Team.builder()
											.id(teamId)
											.made_user_id(principalDetails.getId())
											.build();
		return cardService.deleteTeam(team);
	}
	
	@DeleteMapping("/team/{teamId}/entry")
	public boolean leaveTeam(@PathVariable int teamId,
													   @AuthenticationPrincipal PrincipalDetails principalDetails) {
		TeamJoinUser join = TeamJoinUser.builder()
																		 .team_id(teamId)
																		 .joined_user_id(principalDetails.getId())
																		 .build();
		return cardService.leaveTeam(join);
	}
	
	@GetMapping("/team/{teamId}/book/list")
	public List<TeamCardBookSummary> getCardBookList(@PathVariable int teamId) {
		return cardService.getCardBookList(teamId);
	}
	
	@GetMapping("/team/{teamId}/member/list")
	public List<TeamUserProfile> getTeamJoinUsers(@PathVariable int teamId, int page,
																								 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return cardService.getTeamJoinUsers(teamId, principalDetails.getId(), page);
	}
	
	@PutMapping("/team/book/{cardBookId}")
	public boolean updateCardBookName(@PathVariable int cardBookId,
																				TeamCardBook teamCardBook) {
		teamCardBook.setId(cardBookId);
		return cardService.updateCardBookName(teamCardBook);
	}
	
	@GetMapping("/team/book/{cardBookId}/group/list")
	public List<TeamGroupSummary> getTeamGroupList(@PathVariable int cardBookId) {
		return cardService.getTeamGroupList(cardBookId);
	}
	
	@GetMapping("/team/book/{cardBookId}/member/list")
	public List<TeamUserProfile> getCardBookJoinUsers(@PathVariable int cardBookId, int page) {
		return cardService.getCardBookJoinUsers(cardBookId, page);
	}
	
	@GetMapping("/team/book/{cardBookId}/card/list")
	public List<Card> getAllCardListInCardBook(@PathVariable int cardBookId, int page) {
		return cardService.getAllCardListInCardBook(cardBookId, page);
	}
	
	@GetMapping("/team/group/{groupId}/card/list")
	public List<Card> getCardListInSpecificGroup(@PathVariable int groupId, int page) {
		return cardService.getCardListInSpecificGroup(groupId, page);
	}
	
	@GetMapping("/team/card/{cardId}")
	public TeamCardDetailResDto getTeamCardDetail(@PathVariable int cardId) {
		return cardService.getTeamCardDetail(cardId);
	}
	
	@PostMapping("/team/card/{cardId}/memo")
	public boolean insertTeamCardMemo(@PathVariable int cardId,
																			  CardMemo cardMemo,
																			  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		cardMemo.setCard_id(cardId);
		cardMemo.setUser_id(principalDetails.getId());
		return cardService.insertTeamCardMemo(cardMemo);
	}
	
	@PutMapping("/team/memo/{cardMemoId}")
	public boolean updateTeamCardMemo(@PathVariable int cardMemoId,
																				CardMemo cardMemo) {
		cardMemo.setId(cardMemoId);
		return cardService.updateTeamCardMemo(cardMemo);
	}
	
	@DeleteMapping("/team/memo/{cardMemoId}")
	public boolean deleteTeamCardMemo(@PathVariable int cardMemoId) {
		return cardService.deleteTeamCardMemo(cardMemoId);
	}
	
	@GetMapping("/team/card/{cardId}/belong")
	public List<CardBelongTeamGroup> getGroupBelongFlags(@PathVariable int cardId) {
		return cardService.getGroupBelongFlags(cardId);
	}
	
}
