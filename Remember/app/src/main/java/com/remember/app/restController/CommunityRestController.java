package com.remember.app.restController;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.community.article.ArticleLike;
import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.article.CommentLike;
import com.remember.app.entity.community.article.Tag;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.community.category.JoinedCategory;
import com.remember.app.entity.community.category.SubCategoryDetail;
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddArticleCommentReqDto;
import com.remember.app.requestDto.AddArticleReqDto;
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
	public List<ArticleSummary> getRecentAllKindArticles() {
		return communityService.getRecentAllKindArticleSummaries();
	}
	
	@GetMapping("/count")
	public int getTotalArticleCount() {
		return communityService.getTotalArticleCount();
	}
	
	@GetMapping("{categoryId}/recent")
	public List<ArticleSummary> getRecentArticlesAboutCategory(@PathVariable int categoryId) {
		return communityService.getRecentArticleSummariesAbountCategory(categoryId);
	}
	
	@GetMapping("{categoryId}/count")
	public int getArticleCountAboutCategory(@PathVariable int categoryId) {
		return communityService.getTopicArticleCount(categoryId);
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
	
	@PostMapping("/article/{articleId}/comment")
	public boolean insertArticleComment(@PathVariable int articleId,
																			 AddArticleCommentReqDto addArticleCommentReqDto,
			   																 @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addArticleCommentReqDto.setArticle_id(articleId);
		addArticleCommentReqDto.setUser_id(principalDetails.getId());
		return communityService.insertArticleComment(addArticleCommentReqDto);
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
