package com.remember.app.restController;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.community.article.ArticleLike;
import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.article.Comment;
import com.remember.app.entity.community.article.CommentDetail;
import com.remember.app.entity.community.article.CommentLike;
import com.remember.app.entity.community.article.Tag;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.community.category.JoinedCategory;
import com.remember.app.entity.community.category.SubCategoryDetail;
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddArticleCommentReqDto;
import com.remember.app.requestDto.AddArticleReqDto;
import com.remember.app.requestDto.UpdateArticleCommentReqDto;
import com.remember.app.requestDto.UpdateArticleReqDto;
import com.remember.app.responseDto.ArticleDetailResDto;
import com.remember.app.responseDto.CategoryDetailResDto;
import com.remember.app.service.CommunityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityRestController {

	private final CommunityService communityService;
	
	@GetMapping("/categories")
	public List<SubCategoryDetail> getCategories(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return communityService.getCategoriesWithJoinCount(userId);
	}
	
	@GetMapping("/article/categories")
	public List<JoinedCategory> getJoinedCategories(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return communityService.getJoinedCategories(principalDetails.getId());
	}
	
	@GetMapping("/best/list")
	public List<BestArticleSummary> getBestArticles() {
		return communityService.getBestArticleSummaries();
	}
	
	@GetMapping("{categoryId}/best/list")
	public List<BestArticleSummary> getBestArticlesAboutCategory(@PathVariable int categoryId) {
		return communityService.getBestArticleSummariesAboutCategory(categoryId);
	}
	
	@GetMapping("/recent")
	public List<ArticleSummary> getRecentAllKindArticles(int page) {
		return communityService.getRecentAllKindArticleSummaries(page);
	}
	
	@GetMapping("/count")
	public int getTotalArticleCount(int page) {
		return communityService.getTotalArticleCount(page);
	}
	
	@GetMapping("{categoryId}/recent")
	public List<ArticleSummary> getRecentArticlesAboutCategory(@PathVariable int categoryId, int tagId, int page) {
		return communityService.getRecentArticleSummariesAbountCategory(categoryId, tagId, page);
	}
	
	@GetMapping("{categoryId}/count")
	public int getArticleCountAboutCategory(@PathVariable int categoryId, int tagId, int page) {
		return communityService.getTopicArticleCount(categoryId, tagId, page);
	}
	
	@GetMapping("/detail/{articleId}")
	public ArticleDetailResDto getArticleDetail(@PathVariable int articleId,
																						@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return communityService.getArticleDetail(articleId, userId);
	}
	
	@GetMapping("/{categoryId}/user")
	public boolean isUserJoinCategory(@PathVariable int categoryId,
																		 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		CommunityJoinUser join = CommunityJoinUser.builder()
																							    .sub_category_id(categoryId)
																							    .user_id(principalDetails.getId())
																							    .build();
		return communityService.isUserJoinCategory(join);
	}
	
	@GetMapping("/category/{categoryId}/detail")
	public CategoryDetailResDto getCategoryDetail(@PathVariable int categoryId,
																									@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return communityService.getCategoryDetail(categoryId, userId);
	}
	
	@GetMapping("/category/{categoryId}")
	public String getCategoryName(@PathVariable int categoryId) {
		return communityService.getCategoryName(categoryId);
	}
	
	@PostMapping("/category/{categoryId}")
	public boolean joinCategory(@PathVariable int categoryId,
			 												@AuthenticationPrincipal PrincipalDetails principalDetails) {
		CommunityJoinUser join = CommunityJoinUser.builder()
																							    .sub_category_id(categoryId)
																							    .user_id(principalDetails.getId())
																							    .build();
		return communityService.joinCategory(join);
	}
	
	@DeleteMapping("/category/{categoryId}")
	public boolean leaveCategory(@PathVariable int categoryId,
																@AuthenticationPrincipal PrincipalDetails principalDetails) {
	CommunityJoinUser join = CommunityJoinUser.builder()
																						    .sub_category_id(categoryId)
																						    .user_id(principalDetails.getId())
																						    .build();
	return communityService.leaveCategory(join);
	}
	
	@GetMapping("/{subCategoryId}/tag/list")
	public List<Tag> getTagsAboutMainCategory(@PathVariable int subCategoryId) {
		return communityService.getTagsAboutSubCategory(subCategoryId);
	}
	
	@PostMapping("/article")
	public boolean insertArticle(@AuthenticationPrincipal PrincipalDetails principalDetails,
															AddArticleReqDto addArticleReqDto) {
		addArticleReqDto.setUser_id(principalDetails.getId());
		System.out.println(addArticleReqDto);
		if(addArticleReqDto.getFiles() != null) addArticleReqDto.getFiles().forEach(e -> System.out.println(e.getOriginalFilename()));
		return communityService.insertArticle(addArticleReqDto);
	}
	
	@PutMapping("/article/{articleId}")
	public boolean updateArticle(@PathVariable int articleId,
															  UpdateArticleReqDto updateArticleReqDto,
															  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		updateArticleReqDto.setId(articleId);
		updateArticleReqDto.setUser_id(principalDetails.getId());
		System.out.println(updateArticleReqDto);
		return communityService.updateArticle(updateArticleReqDto);
	}
	
	@DeleteMapping("/article/{articleId}")
	public boolean deleteArticle(@PathVariable int articleId,
															@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return communityService.deleteArticle(articleId, principalDetails.getId());
	}
	
	@PutMapping("/article/{articleId}/view")
	public boolean updateArticleViewCount(@PathVariable int articleId) {
		return communityService.updateArticleViewCount(articleId);
	}
	
	@PostMapping("/article/{articleId}/like")
	public boolean insertArticleLike(@PathVariable int articleId,
																   @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return communityService.insertArticleLike(ArticleLike.builder()
																												  .article_id(articleId)
																												  .user_id(principalDetails.getId())
																												  .build());
	}
	
	@DeleteMapping("/article/{articleId}/like")
	public boolean deleteArticleLike(@PathVariable int articleId,
																	@AuthenticationPrincipal PrincipalDetails principalDetails) {
		return communityService.deleteArticleLike(ArticleLike.builder()
																												  .article_id(articleId)
																											      .user_id(principalDetails.getId())
																											      .build());
	}
	
	@GetMapping("/article/{articleId}/comments/asc")
	public List<CommentDetail> getCommentListASC(@PathVariable int articleId,
																									@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return communityService.getCommentListASC(articleId, userId);
	}
	
	@GetMapping("/article/{articleId}/comments/desc")
	public List<CommentDetail> getCommentListDESC(@PathVariable int articleId,
																									@AuthenticationPrincipal PrincipalDetails principalDetails) {
		int userId = 0;
		if(principalDetails != null) userId = principalDetails.getId();
		return communityService.getCommentListDESC(articleId, userId);
	}
	
	@PostMapping("/article/{articleId}/comment")
	public boolean insertArticleComment(@PathVariable int articleId,
																			 AddArticleCommentReqDto addArticleCommentReqDto,
			   																 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addArticleCommentReqDto.setArticle_id(articleId);
		addArticleCommentReqDto.setUser_id(principalDetails.getId());
		return communityService.insertArticleComment(addArticleCommentReqDto);
	}
	
	@PutMapping("/article/{articleId}/comment")
	public boolean updateArticleComment(@PathVariable int articleId,
																				 UpdateArticleCommentReqDto updateArticleCommentReqDto,
																				 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		updateArticleCommentReqDto.setArticle_id(articleId);
		updateArticleCommentReqDto.setUser_id(principalDetails.getId());
		System.out.println(updateArticleCommentReqDto);
		return communityService.updateArticleComment(updateArticleCommentReqDto.toCommentEntity());
	}
	
	@DeleteMapping("/article/{articleId}/comment/{commentId}")
	public boolean deleteArticleComment(@PathVariable int articleId,
																			  @PathVariable int commentId,
																			  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return communityService.deleteArticleComment(Comment.builder()
																														  .id(commentId)
																														  .article_id(articleId)
																														  .user_id(principalDetails.getId())
																														  .build());
	}
	
	@PostMapping("/comment/{commentId}/like")
	public boolean insertArticleCommentLike(@PathVariable int commentId,
																					 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return communityService.insertArticleCommentLike(CommentLike.builder()
																																 		 .comment_id(commentId)
																																 		 .user_id(principalDetails.getId())
																																 		 .build());
	}
	
	@DeleteMapping("/comment/{commentId}/like")
	public boolean deleteArticleCommentLike(@PathVariable int commentId,
																					  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return communityService.deleteArticleCommentLike(CommentLike.builder()
																																 		 .comment_id(commentId)
																																 		 .user_id(principalDetails.getId())
																																 		 .build());
	}
	
}
