package com.remember.app.restController;

import java.util.Arrays;
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
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddAllCardsFromTeamCard;
import com.remember.app.requestDto.AddAllTeamCardsFromCard;
import com.remember.app.requestDto.AddCardsFromTeamCard;
import com.remember.app.requestDto.AddTeamCardsFromCard;
import com.remember.app.requestDto.AddTeamReqDto;
import com.remember.app.requestDto.CardDeleteReqDto;
import com.remember.app.requestDto.CardInsertReqDto;
import com.remember.app.requestDto.DeleteTeamCardsReqDto;
import com.remember.app.requestDto.GetBelongFlagsReqDto;
import com.remember.app.requestDto.GetCardEmailReqDto;
import com.remember.app.requestDto.JoinTeamReqDto;
import com.remember.app.requestDto.UpdateAllCardsBelongGroupsReqDto;
import com.remember.app.requestDto.UpdateCardDetailReqDto;
import com.remember.app.requestDto.UpdateCardsBelongGroupsReqDto;
import com.remember.app.requestDto.UpdateTeamCardBelongTeamGroupReqDto;
import com.remember.app.responseDto.CardBelongTeamGroupsResDto;
import com.remember.app.responseDto.TeamCardDetailResDto;
import com.remember.app.service.CardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/card")
@RequiredArgsConstructor
public class CardRestController {
	
	private final CardService cardService;
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllCard(@AuthenticationPrincipal PrincipalDetails principalDetails){
		List<GroupSummary> groups = cardService.getGroups(principalDetails.getId());
		return new ResponseEntity<>(groups,HttpStatus.OK);
	}
	
	@GetMapping("/{cardId}")
	public ResponseEntity<?> getCardDetail(@PathVariable int cardId) {
		return new ResponseEntity<>(cardService.getCardDetail(cardId), HttpStatus.OK); 
	}
	
	//명함 등록 post
	@PostMapping("")
	public ResponseEntity<?> registerCard(@AuthenticationPrincipal PrincipalDetails principalDetails, 
																				CardInsertReqDto cardInsertReqDto){
		cardInsertReqDto.setUser_id(principalDetails.getId());
		System.out.println(cardInsertReqDto);
		int cardId = cardService.insertNewCard(cardInsertReqDto);
		
		return new ResponseEntity<>(cardId, HttpStatus.OK);
	}
	
	//명함 수정 put
	@PutMapping("/{cardId}")
	public ResponseEntity<?> updateCard(@PathVariable int cardId,
																			UpdateCardDetailReqDto updateCardDetailReqDto) {
		updateCardDetailReqDto.setId(cardId);
		boolean result = cardService.updateCard(updateCardDetailReqDto);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//명함 삭제 delete
	@DeleteMapping("{cardId}")
	public ResponseEntity<?> deleteCard(@PathVariable int cardId){
		boolean result = cardService.deleteCard(cardId);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	//명함 여러개 삭제
	@DeleteMapping("/list")
	public ResponseEntity<?> deleteCards(CardDeleteReqDto cardDeleteReqDto){
		System.out.println(cardDeleteReqDto);
		boolean result = cardService.deleteCards(cardDeleteReqDto);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@DeleteMapping("/group/{groupId}/list")
	public ResponseEntity<?> deleteAllCardsInGroup(@PathVariable int groupId ,
																									CardDeleteReqDto cardDeleteReqDto) {
		cardDeleteReqDto.setGroup_id(groupId);
		boolean result = cardService.deleteAllCardsInGroup(cardDeleteReqDto);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@DeleteMapping("/all/list")
	public ResponseEntity<?> deleteAllCards(CardDeleteReqDto cardDeleteReqDto,
																				   @AuthenticationPrincipal PrincipalDetails principalDetails) {
		cardDeleteReqDto.setUser_id(principalDetails.getId());
		boolean result = cardService.deleteAllCards(cardDeleteReqDto);
		return new ResponseEntity<>(result, HttpStatus.OK);
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
	
	@GetMapping("/list")
	public ResponseEntity<?> getCardSummaryList(int page, String card_order_flag,
																								@AuthenticationPrincipal PrincipalDetails principalDetails){
		List<Card> cards = cardService.getCardSummaryList(principalDetails.getId(), page, card_order_flag);
		return new ResponseEntity<>(cards,HttpStatus.OK); 
	}
	
	@GetMapping("/list/group/{groupId}")
	public ResponseEntity<?> getCardSummaryListInSpecificGroup(@PathVariable int groupId,
																																int page,
																																String card_order_flag) {
		List<Card> cards = cardService.getCardSummaryListInSpecificGroup(groupId, page, card_order_flag);
		System.out.println(cards);
		return new ResponseEntity<>(cards,HttpStatus.OK);
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
	
	@PutMapping("/{cardId}/belong")
	public ResponseEntity<?> updateCardBelongGroups(@PathVariable int cardId,
																										  UpdateCardsBelongGroupsReqDto updateCardsBelongGroups){
		updateCardsBelongGroups.setCardId(cardId);
		boolean result = cardService.updateCardBelongGroups(updateCardsBelongGroups);
		System.out.println(result);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PutMapping("/list/belong")
	public ResponseEntity<?> updateCardsBelongGroups(UpdateCardsBelongGroupsReqDto updateCardsBelongGroups){
		boolean result = cardService.updateCardsBelongGroups(updateCardsBelongGroups);
		System.out.println(result);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PutMapping("/group/{groupId}/belong")
	public ResponseEntity<?> updateAllCardsInGroupBelongGroups(@PathVariable int groupId, 
																																UpdateAllCardsBelongGroupsReqDto updateAllCardsBelongGroupsReqDto) {
		updateAllCardsBelongGroupsReqDto.setGroupId(groupId);
		boolean result = cardService.updateAllCardsInGroupBelongGroups(updateAllCardsBelongGroupsReqDto);
		System.out.println(result);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PutMapping("/all/list/belong")
	public ResponseEntity<?> updateAllCardsBelongGroups(UpdateAllCardsBelongGroupsReqDto updateAllCardsBelongGroupsReqDto,
																												@AuthenticationPrincipal PrincipalDetails principalDetails){
		updateAllCardsBelongGroupsReqDto.setUserId(principalDetails.getId());
		boolean result = cardService.updateAllCardsBelongGroups(updateAllCardsBelongGroupsReqDto);
		System.out.println(result);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//메모 입력
	@PostMapping("/{cardId}/memo")
	public ResponseEntity<?> insertMemo(@PathVariable int cardId, CardMemo cardMemo,@AuthenticationPrincipal PrincipalDetails principalDetails ) {
		cardMemo.setCard_id(cardId);
		cardMemo.setUser_id(principalDetails.getId());
		System.out.println(cardMemo);
		boolean result = cardService.insertCardMemo(cardMemo) > 0;
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//메모 수정
	@PutMapping("/memo/{cardMemoId}")
	public ResponseEntity<?> updateMemo(@PathVariable int cardMemoId, CardMemo cardMemo) {
		cardMemo.setId(cardMemoId);
		boolean result = cardService.updateCardMemo(cardMemo);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}

	//메모 삭제
	@DeleteMapping("/memo/{cardMemoId}")
	public ResponseEntity<?> delteMemo(@PathVariable int cardMemoId) {
		boolean result = cardService.deleteCardMemo(cardMemoId);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PostMapping("/{cardId}/to-team")
	public boolean insertTeamCardFromCard(@PathVariable int cardId,
																					  AddTeamCardsFromCard addTeamCardsFromCard,
																					 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addTeamCardsFromCard.setCard_id_list(Arrays.asList(cardId));
		addTeamCardsFromCard.setUserId(principalDetails.getId());
		return cardService.insertTeamCardsFromCard(addTeamCardsFromCard);
	}
	
	@PostMapping("/list/to-team")
	public boolean insertTeamCardsFromCard(AddTeamCardsFromCard addTeamCardsFromCard,
																					   @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addTeamCardsFromCard.setUserId(principalDetails.getId());
		return cardService.insertTeamCardsFromCard(addTeamCardsFromCard);
	}
	
	@PostMapping("/group/{groupId}/list/to-team")
	public boolean insertAllCardsInTeamGroupToCard(@PathVariable int groupId,
																									  AddAllTeamCardsFromCard addAllTeamCardsFromCard,
																									  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addAllTeamCardsFromCard.setGroupId(groupId);
		addAllTeamCardsFromCard.setUserId(principalDetails.getId());
		return cardService.insertAllTeamCardsFromCardInGroup(addAllTeamCardsFromCard);
	}
	
	@PostMapping("/all/cards/to-team")
	public boolean insertAllCardsInTeamCardBookToCard(AddAllTeamCardsFromCard addAllTeamCardsFromCard,
																									  		  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addAllTeamCardsFromCard.setUserId(principalDetails.getId());
		return cardService.insertAllTeamCardsFromCard(addAllTeamCardsFromCard);
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
	
	@PostMapping("/team/{teamId}/invite-code")
	public String generateInviteCode(@PathVariable int teamId) {
		return cardService.generateInviteCode(teamId);
	}
	
	@GetMapping("/team/invite-code/{inviteCode}")
	public TeamDetail getInvitedTeamInfo(@PathVariable String inviteCode) {
		return cardService.getInvitedTeamInfo(inviteCode);
	}
	
	@PostMapping("/team/user")
	public boolean joinInvitedTeam(JoinTeamReqDto joinTeamReqDto,
																 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		joinTeamReqDto.setUser_id(principalDetails.getId());
		return cardService.joinInvitedTeam(joinTeamReqDto);
	}
	
	@GetMapping("/team/user/{userId}")
	public boolean isTeamJoined(@PathVariable int userId) {
		return cardService.isTeamJoined(userId);
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
	
	@GetMapping("/team/detail/list")
	public List<CardBooksInTeam> getTeamListWithCardBooks(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return cardService.getTeamListWithCardBooks(principalDetails.getId());
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
	public List<Card> getAllCardListInCardBook(@PathVariable int cardBookId, int page, String card_order_flag) {
		return cardService.getAllCardListInCardBook(cardBookId, page, card_order_flag);
	}
	
	@GetMapping("/team/group/{groupId}/card/list")
	public List<Card> getCardListInSpecificGroup(@PathVariable int groupId, int page, String card_order_flag) {
		return cardService.getCardListInSpecificGroup(groupId, page, card_order_flag);
	}
	
	@PutMapping("/team/group/{groupId}")
	public boolean updateGroupName(@PathVariable int groupId,
																		String group_name) {
		return cardService.updateTeamGroupName(TeamGroup.builder()
																													 .id(groupId)
																													 .group_name(group_name)
																													 .build());
	}
	
	@DeleteMapping("/team/group/{groupId}")
	public boolean deleteTeamGroup(@PathVariable int groupId) {
		return cardService.deleteTeamGroup(groupId);
	}
	
	@PostMapping("/team/card")
	public boolean insertTeamCard(CardInsertReqDto cardInsertReqDto,
																@AuthenticationPrincipal PrincipalDetails principalDetails) {
		cardInsertReqDto.setUser_id(principalDetails.getId());
		return cardService.insertTeamCard(cardInsertReqDto);
	}
	
	@GetMapping("/team/card/{cardId}")
	public TeamCardDetailResDto getTeamCardDetail(@PathVariable int cardId) {
		return cardService.getTeamCardDetail(cardId);
	}
	
	@PutMapping("/team/card/{cardId}")
	public boolean updateTeamCardDetail(@PathVariable int cardId,
																				UpdateCardDetailReqDto updateCardDetailReqDto) {
		updateCardDetailReqDto.setId(cardId);
		System.out.println(updateCardDetailReqDto);
		return cardService.updateTeamCardDetail(updateCardDetailReqDto);
	}
	
	@DeleteMapping("/team/card/{cardId}")
	public boolean deleteTeamCard(@PathVariable int cardId) {
		return cardService.deleteTeamCard(cardId);
	}
	
	@PostMapping("/team/card/{cardId}/to-personal")
	public boolean insertCardFromTeamCard(@PathVariable int cardId,
																					boolean memo_include_flag,
																					@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return cardService.insertCardFromTeamCard(principalDetails.getId(), cardId, memo_include_flag);
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
	
	@PutMapping("/team/card/{cardId}/belong")
	public boolean updateTeamCardBelongTeamGroups(@PathVariable int cardId,
																							UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto) {
		updateTeamCardBelongTeamGroupReqDto.setCard_id(cardId);
		System.out.println("each");
		System.out.println(updateTeamCardBelongTeamGroupReqDto);
		return cardService.updateTeamCardBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
	}
	
	@GetMapping("/team/cards/belong")
	public List<CardBelongTeamGroupsResDto> getGroupBelongFlagsForMultipleId(GetBelongFlagsReqDto getBelongFlagsReqDto) {
		System.out.println(getBelongFlagsReqDto);
		return cardService.getGroupBelongFlagsForMultipleId(getBelongFlagsReqDto);
	}
	
	@PutMapping("/team/cards/belong")
	public boolean updateTeamCardsBelongTeamGroups(UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto) {
		System.out.println("cards");
		System.out.println(updateTeamCardBelongTeamGroupReqDto);
		return cardService.updateTeamCardsBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
	}
	
	@PutMapping("/team/group/{groupId}/cards/belong")
	public boolean updateAllTeamCardsInGroupBelongTeamGroups(@PathVariable int groupId,
																																UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto) {
		updateTeamCardBelongTeamGroupReqDto.setGroup_id(groupId);
		System.out.println("all group");
		System.out.println(updateTeamCardBelongTeamGroupReqDto);
		return cardService.updateAllTeamCardsInGroupBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
	}
	
	@PutMapping("/team/book/{cardBookId}/cards/belong")
	public boolean updateAllTeamCardsBelongTeamGroups(@PathVariable int cardBookId,
																												UpdateTeamCardBelongTeamGroupReqDto updateTeamCardBelongTeamGroupReqDto) {
		updateTeamCardBelongTeamGroupReqDto.setCard_book_id(cardBookId);
		System.out.println("all book");
		System.out.println(updateTeamCardBelongTeamGroupReqDto);
		return cardService.updateAllTeamCardsBelongTeamGroups(updateTeamCardBelongTeamGroupReqDto);
	}
	
	@DeleteMapping("/team/cards")
	public boolean deleteTeamCards(DeleteTeamCardsReqDto deleteTeamCardsReqDto) {
		return cardService.deleteTeamCards(deleteTeamCardsReqDto);
	}
	
	@DeleteMapping("/team/group/{groupId}/cards")
	public boolean deleteAllTeamCardsInGroup(@PathVariable int groupId,
																						 DeleteTeamCardsReqDto deleteTeamCardsReqDto) {
		return cardService.deleteAllTeamCardsInGroup(deleteTeamCardsReqDto);
	}
	
	@DeleteMapping("/team/book/{cardBookId}/cards")
	public boolean deleteAllTeamCardsInCardBook(@PathVariable int cardBookId,
																								 DeleteTeamCardsReqDto deleteTeamCardsReqDto) {
		return cardService.deleteAllTeamCardsInCardBook(deleteTeamCardsReqDto);
	}
	
	@PostMapping("/team/cards/to-personal")
	public boolean insertCardsFromTeamCard(AddCardsFromTeamCard addCardsFromTeamCard,
																					   @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addCardsFromTeamCard.setUserId(principalDetails.getId());
		return cardService.insertCardsFromTeamCard(addCardsFromTeamCard);
	}
	
	@PostMapping("/team/group/{groupId}/cards/to-personal")
	public boolean insertAllCardsInTeamGroupToCard(@PathVariable int groupId,
																									  AddAllCardsFromTeamCard addAllCardsFromTeamCard,
																									  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addAllCardsFromTeamCard.setGroupId(groupId);
		addAllCardsFromTeamCard.setUserId(principalDetails.getId());
		return cardService.insertAllCardsInTeamGroupToCard(addAllCardsFromTeamCard);
	}
	
	@PostMapping("/team/book/{cardBookId}/cards/to-personal")
	public boolean insertAllCardsInTeamCardBookToCard(@PathVariable int cardBookId,
																											  AddAllCardsFromTeamCard addAllCardsFromTeamCard,
																									  		  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addAllCardsFromTeamCard.setCardBookId(cardBookId);
		addAllCardsFromTeamCard.setUserId(principalDetails.getId());
		return cardService.insertAllCardsInTeamCardBookToCard(addAllCardsFromTeamCard);
	}
	
	@GetMapping("/team/cards/email")
	public List<Card> getTeamCardEmails(GetCardEmailReqDto getCardEmailReqDto) {
		return cardService.getTeamCardEmails(getCardEmailReqDto);
	}
	
	@GetMapping("/team/group/{groupId}/cards/email")
	public List<Card> getTeamCardEmailsInGroup(@PathVariable int groupId,
																					GetCardEmailReqDto getCardEmailReqDto) {
		getCardEmailReqDto.setGroupId(groupId);
		return cardService.getTeamCardEmailsInGroup(getCardEmailReqDto);
	}
	
	@GetMapping("/team/book/{cardBookId}/cards/email")
	public List<Card> getTeamCardEmailsInCardBook(@PathVariable int cardBookId,
																							GetCardEmailReqDto getCardEmailReqDto) {
		getCardEmailReqDto.setCardBookId(cardBookId);
		return cardService.getTeamCardEmailsInCardBook(getCardEmailReqDto);
	}
	
}
