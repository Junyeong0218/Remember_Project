package com.remember.app.restController;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.community.article.ArticleLike;
import com.remember.app.entity.community.article.Comment;
import com.remember.app.entity.community.article.CommentLike;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.response.CustomResEntity;
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddArticleCommentReqDto;
import com.remember.app.requestDto.AddArticleReqDto;
import com.remember.app.requestDto.UpdateArticleCommentReqDto;
import com.remember.app.requestDto.UpdateArticleReqDto;
import com.remember.app.service.CommunityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityRestController {

	private final CommunityService communityService;
	
	/**
	 * 커뮤니티 카테고리 리스트를 반환한다.
	 * @param principalDetails 는 유저 정보
	 * @return 로그인 된 경우 각 카테고리 가입 여부를 포함한 List<SubCategoryDetail>, 비로그인의 경우 가입 여부를 포함하지 않은 List<SubCategoryDetail>을 반환
	 */
	@GetMapping("/categories")
	public ResponseEntity<?> getCategories(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return CustomResEntity.getResponse(communityService.getCategoriesWithJoinCount(userId));
	}
	
	/**
	 * 게시글 작성을 위한 유저가 가입한 카테고리 리스트를 반환
	 * @param principalDetails 는 유저 정보
	 * @return List<JoinedCategory>
	 */
	@GetMapping("/article/categories")
	public ResponseEntity<?> getJoinedCategories(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return CustomResEntity.getResponse(communityService.getJoinedCategories(principalDetails.getId()));
	}
	
	/**
	 * 커뮤니티 상단 혹은 우측에 표시될 좋아요 갯수 기준 베스트 게시글 개요 리스트 반환
	 * @return List<BestArticleSummary>
	 */
	@GetMapping("/best/list")
	public ResponseEntity<?> getBestArticles() {
		return CustomResEntity.getResponse(communityService.getBestArticleSummaries());
	}
	
	/**
	 * 특정 카테고리 내에서 좋아요 갯수 기준 베스트 게시글 개요 리스트 반환
	 * @param categoryId 는 카테고리 번호
	 * @return List<BestArticleSummary>
	 */
	@GetMapping("/{categoryId}/best/list")
	public ResponseEntity<?> getBestArticlesAboutCategory(@PathVariable int categoryId) {
		return CustomResEntity.getResponse(communityService.getBestArticleSummariesAboutCategory(categoryId));
	}
	
	/**
	 * 모든 카테고리 내에서 최근에 등록된 page 내의 게시글 개요 리스트 반환
	 * @param page 는 페이지 번호 - 1
	 * @return List<ArticleSummary>
	 */
	@GetMapping("/recent")
	public ResponseEntity<?> getRecentAllKindArticles(int page) {
		return CustomResEntity.getResponse(communityService.getRecentAllKindArticleSummaries(page));
	}
	
	/**
	 * 모든 카테고리의 게시글 갯수를 반환
	 * @return 모든 카테고리의 게시글 갯수 (int)
	 */
	@GetMapping("/count")
	public ResponseEntity<?> getTotalArticleCount() {
		return CustomResEntity.getResponse((Object) communityService.getTotalArticleCount());
	}
	
	/**
	 * 특정 카테고리, 특정 태그에 등록된 page 내의 게시글 개요 리스트 반환
	 * @param categoryId 는 카테고리 번호
	 * @param tagId 는 태그 번호
	 * @param page 는 페이지 번호 - 1
	 * @return List<ArticleSummary>
	 */
	@GetMapping("{categoryId}/recent")
	public ResponseEntity<?> getRecentArticlesAboutCategory(@PathVariable int categoryId, int tagId, int page) {
		return CustomResEntity.getResponse(communityService.getRecentArticleSummariesAbountCategory(categoryId, tagId, page));
	}
	
	/**
	 * 특정 카테고리, 특정 태그에 등록된 게시글 갯수 반환
	 * @param categoryId 는 카테고리 번호
	 * @param tagId 는 태그 번호
	 * @return 게시글 갯수 (int)
	 */
	@GetMapping("{categoryId}/count")
	public ResponseEntity<?> getArticleCountAboutCategory(@PathVariable int categoryId, int tagId) {
		return CustomResEntity.getResponse((Object) communityService.getTopicArticleCount(categoryId, tagId));
	}
	
	/**
	 * 로그인 한 경우 좋아요 여부 등의 값을 포함한 게시글 세부 내용을, 비로그인의 경우 앞의 값들을 포함하지 않은 게시글 세부 내용을 반환한다
	 * @param articleId 는 게시글 번호
	 * @param principalDetails 는 유저 정보
	 * @return ArticleDetailResDto
	 */
	@GetMapping("/detail/{articleId}")
	public ResponseEntity<?> getArticleDetail(@PathVariable int articleId,
																						@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return CustomResEntity.getResponse(communityService.getArticleDetail(articleId, userId));
	}
	
	/**
	 * 특정 카테고리에 유저가 가입되어 있는 지 여부를 반환한다.
	 * @param categoryId 는 카테고리 번호
	 * @param principalDetails 는 유저 정보
	 * @return 유저의 카테고리 가입 여부 반환 (boolean)
	 */
	@GetMapping("/{categoryId}/user")
	public ResponseEntity<?> isUserJoinCategory(@PathVariable int categoryId,
																		 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		CommunityJoinUser join = CommunityJoinUser.builder()
																							    .sub_category_id(categoryId)
																							    .user_id(principalDetails.getId())
																							    .build();
		return CustomResEntity.getResponse(communityService.isUserJoinCategory(join));
	}
	
	/**
	 * 로그인 한 경우 특정 카테고리 가입 여부를 포함한 페이지에 표시할 카테고리 세부 정보를 반환한다
	 * @param categoryId 는 카테고리 번호
	 * @param principalDetails 는 유저 정보
	 * @return CategoryDetailResDto
	 */
	@GetMapping("/category/{categoryId}/detail")
	public ResponseEntity<?> getCategoryDetail(@PathVariable int categoryId,
																									@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return CustomResEntity.getResponse(communityService.getCategoryDetail(categoryId, userId));
	}
	
	/**
	 * 카테고리 번호로 카테고리명 조회
	 * @param categoryId 는 카테고리 번호
	 * @return 카테고리명을 반환 (String)
	 */
	@GetMapping("/category/{categoryId}")
	public ResponseEntity<?> getCategoryName(@PathVariable int categoryId) {
		return CustomResEntity.getResponse(communityService.getCategoryName(categoryId));
	}
	
	/**
	 * 카테고리에 가입 및 성공 여부를 반환
	 * @param categoryId 는 카테고리 번호
	 * @param principalDetails 는 유저 정보
	 * @return 카테고리 가입 성공 여부를 반환 (boolean)
	 */
	@PostMapping("/category/{categoryId}")
	public ResponseEntity<?> joinCategory(@PathVariable int categoryId,
			 												@AuthenticationPrincipal PrincipalDetails principalDetails) {
		CommunityJoinUser join = CommunityJoinUser.builder()
																							    .sub_category_id(categoryId)
																							    .user_id(principalDetails.getId())
																							    .build();
		return CustomResEntity.getResponse(communityService.joinCategory(join));
	}
	
	/**
	 * 카테고리 나가기 및 성공 여부를 반환
	 * @param categoryId 는 카테고리 번호
	 * @param principalDetails 는 유저 정보
	 * @return 카테고리 나가기 성공 여부를 반환 (boolean)
	 */
	@DeleteMapping("/category/{categoryId}")
	public ResponseEntity<?> leaveCategory(@PathVariable int categoryId,
																@AuthenticationPrincipal PrincipalDetails principalDetails) {
	CommunityJoinUser join = CommunityJoinUser.builder()
																						    .sub_category_id(categoryId)
																						    .user_id(principalDetails.getId())
																						    .build();
	return CustomResEntity.getResponse(communityService.leaveCategory(join));
	}
	
	/**
	 * 특정 카테고리에 포함된 태그 리스트를 반환한다.
	 * @param subCategoryId 는 카테고리 번호
	 * @return List<Tag>
	 */
	@GetMapping("/{subCategoryId}/tag/list")
	public ResponseEntity<?> getTagsAboutMainCategory(@PathVariable int subCategoryId) {
		return CustomResEntity.getResponse(communityService.getTagsAboutSubCategory(subCategoryId));
	}
	
	/**
	 * 게시글 등록 및 성공 여부를 반환
	 * @param principalDetails 는 유저 정보
	 * @param addArticleReqDto 는 유저로부터 받은 게시글 정보
	 * @return 게시글 등록 성공 여부 반환 (boolean)
	 */
	@PostMapping("/article")
	public ResponseEntity<?> insertArticle(@AuthenticationPrincipal PrincipalDetails principalDetails,
															AddArticleReqDto addArticleReqDto) {
		addArticleReqDto.setUser_id(principalDetails.getId());
		if(addArticleReqDto.getFiles() != null) addArticleReqDto.getFiles().forEach(e -> System.out.println(e.getOriginalFilename()));
		return CustomResEntity.getResponse(communityService.insertArticle(addArticleReqDto));
	}
	
	/**
	 * 게시글 수정 및 성공 여부를 반환
	 * @param articleId 는 게시글 번호
	 * @param updateArticleReqDto 는 유저로부터 받은 게시글 수정본 데이터
	 * @param principalDetails 는 유저 정보
	 * @return 게시글 수정 성공 여부를 반환 (boolean)
	 */
	@PutMapping("/article/{articleId}")
	public ResponseEntity<?> updateArticle(@PathVariable int articleId,
															  UpdateArticleReqDto updateArticleReqDto,
															  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		updateArticleReqDto.setId(articleId);
		updateArticleReqDto.setUser_id(principalDetails.getId());
		return CustomResEntity.getResponse(communityService.updateArticle(updateArticleReqDto));
	}
	
	/**
	 * 게시글 삭제 및 성공 여부를 반환
	 * @param articleId 는 게시글 번호
	 * @param principalDetails 는 유저 정보
	 * @return 게시글 삭제 성공 여부 반환 (boolean)
	 */
	@DeleteMapping("/article/{articleId}")
	public ResponseEntity<?> deleteArticle(@PathVariable int articleId,
															@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return CustomResEntity.getResponse(communityService.deleteArticle(articleId, principalDetails.getId()));
	}
	
	/**
	 * 로그인 한 경우 해당 게시글의 조회수를 + 1 및 성공 여부 반환
	 * @param articleId 는 게시글 번호
	 * @return 조회수 수정 성공 여부 반환 (boolean)
	 */
	@PutMapping("/article/{articleId}/view")
	public ResponseEntity<?> updateArticleViewCount(@PathVariable int articleId) {
		return CustomResEntity.getResponse(communityService.updateArticleViewCount(articleId));
	}
	
	/**
	 * 게시글 좋아요 및 성공 여부를 반환
	 * @param articleId 는 게시글 번호
	 * @param principalDetails 는 유저 정보
	 * @return 게시글 좋아요 성공 여부 반환 (boolean)
	 */
	@PostMapping("/article/{articleId}/like")
	public ResponseEntity<?> insertArticleLike(@PathVariable int articleId,
																   @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return CustomResEntity.getResponse(communityService.insertArticleLike(ArticleLike.builder()
																																											  .article_id(articleId)
																																											  .user_id(principalDetails.getId())
																																											  .build()));
	}
	
	/**
	 * 게시글 좋아요 취소 및 성공 여부를 반환
	 * @param articleId 는 게시글 번호
	 * @param principalDetails 는 유저 정보
	 * @return 게시글 좋아요 취소 및 성공 여부 반환 (boolean)
	 */
	@DeleteMapping("/article/{articleId}/like")
	public ResponseEntity<?> deleteArticleLike(@PathVariable int articleId,
																	@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return CustomResEntity.getResponse(communityService.deleteArticleLike(ArticleLike.builder()
																																											   .article_id(articleId)
																																										       .user_id(principalDetails.getId())
																																										       .build()));
	}
	
	/**
	 * 특정 게시글의 댓글을 오름차순으로 정렬한다. (단, 답글의 경우 내림차순 유지) 
	 * @param articleId 는 게시글 번호
	 * @param principalDetails 는 유저 정보
	 * @return List<CommentDetail>
	 */
	@GetMapping("/article/{articleId}/comments/asc")
	public ResponseEntity<?> getCommentListASC(@PathVariable int articleId,
																									@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return CustomResEntity.getResponse(communityService.getCommentListASC(articleId, userId));
	}
	
	/**
	 * 특정 게시글의 댓글을 내림차순으로 정렬한다. (기본값)
	 * @param articleId 는 게시글 번호
	 * @param principalDetails 는 유저 정보
	 * @return List<CommentDetail>
	 */
	@GetMapping("/article/{articleId}/comments/desc")
	public ResponseEntity<?> getCommentListDESC(@PathVariable int articleId,
																									@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return CustomResEntity.getResponse(communityService.getCommentListDESC(articleId, userId));
	}
	
	/**
	 * 특정 게시글에 댓글 작성 및 성공 여부를 반환
	 * @param articleId 는 게시글 번호
	 * @param addArticleCommentReqDto 는 유저가 입력한 댓글 데이터 및 닉네임 사용 여부
	 * @param principalDetails 는 유저 정보
	 * @return 댓글 작성 성공 여부 반환 (boolean)
	 */
	@PostMapping("/article/{articleId}/comment")
	public ResponseEntity<?> insertArticleComment(@PathVariable int articleId,
																			 AddArticleCommentReqDto addArticleCommentReqDto,
			   																 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addArticleCommentReqDto.setArticle_id(articleId);
		addArticleCommentReqDto.setUser_id(principalDetails.getId());
		return CustomResEntity.getResponse(communityService.insertArticleComment(addArticleCommentReqDto));
	}
	
	/**
	 * 특정 게시글에 있는 본인 댓글 수정 및 성공 여부를 반환
	 * @param articleId 는 게시글 번호
	 * @param updateArticleCommentReqDto 는 유저가 입력한 댓글 수정본 데이터 및 닉네임 사용 여부
	 * @param principalDetails 는 유저 정보
	 * @return 댓글 수정 성공 여부 반환 (boolean)
	 */
	@PutMapping("/article/{articleId}/comment")
	public ResponseEntity<?> updateArticleComment(@PathVariable int articleId,
																				 UpdateArticleCommentReqDto updateArticleCommentReqDto,
																				 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		updateArticleCommentReqDto.setArticle_id(articleId);
		updateArticleCommentReqDto.setUser_id(principalDetails.getId());
		return CustomResEntity.getResponse(communityService.updateArticleComment(updateArticleCommentReqDto.toCommentEntity()));
	}
	
	/**
	 * 특정 게시글에 있는 본인 댓글을 삭제 및 성공 여부를 반환
	 * @param articleId 는 게시글 번호
	 * @param commentId 는 댓글 번호
	 * @param principalDetails 는 유저 정보
	 * @return 댓글 삭제 성공 여부를 반환 (boolean)
	 */
	@DeleteMapping("/article/{articleId}/comment/{commentId}")
	public ResponseEntity<?> deleteArticleComment(@PathVariable int articleId,
																			  @PathVariable int commentId,
																			  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return CustomResEntity.getResponse(communityService.deleteArticleComment(Comment.builder()
																																													   .id(commentId)
																																													   .article_id(articleId)
																																													   .user_id(principalDetails.getId())
																																													   .build()));
	}
	
	/**
	 * 댓글 좋아요 및 성공 여부를 반환
	 * @param commentId 는 댓글 번호
	 * @param principalDetails 는 유저 정보
	 * @return 댓글 좋아요 성공 여부를 반환
	 */
	@PostMapping("/comment/{commentId}/like")
	public ResponseEntity<?> insertArticleCommentLike(@PathVariable int commentId,
																					 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return CustomResEntity.getResponse(communityService.insertArticleCommentLike(CommentLike.builder()
																																														 		      .comment_id(commentId)
																																														 		      .user_id(principalDetails.getId())
																																														 		      .build()));
	}
	
	/**
	 * 댓글 좋아요 취소 및 성공 여부를 반환
	 * @param commentId 는 댓글 번호
	 * @param principalDetails 는 유저 정보
	 * @return 댓글 좋아요 취소 성공 여부를 반환
	 */
	@DeleteMapping("/comment/{commentId}/like")
	public ResponseEntity<?> deleteArticleCommentLike(@PathVariable int commentId,
																					  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return CustomResEntity.getResponse(communityService.deleteArticleCommentLike(CommentLike.builder()
																																															 		   .comment_id(commentId)
																																															 		   .user_id(principalDetails.getId())
																																															 		   .build()));
	}
	
}
