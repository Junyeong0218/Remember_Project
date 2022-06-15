package com.remember.app.restController;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.article.Tag;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.community.category.JoinedCategory;
import com.remember.app.entity.community.category.SubCategoryDetail;
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddArticleReqDto;
import com.remember.app.responseDto.ArticleDetailResDto;
import com.remember.app.service.CommunityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/community")
@RequiredArgsConstructor
public class CommunityRestController {

	private final CommunityService communityService;
	
	@GetMapping("/categories")
	public List<SubCategoryDetail> getCategories() {
		return communityService.getCategoriesWithArticleCount();
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
	public ArticleDetailResDto getArticleDetail(@PathVariable int articleId) {
		return communityService.getArticleDetail(articleId);
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
	
	@GetMapping("/{mainCategoryId}/tag/list")
	public List<Tag> getTagsAboutMainCategory(@PathVariable int mainCategoryId) {
		return communityService.getTagsAboutMainCategory(mainCategoryId);
	}
	
	@PostMapping("/article")
	public boolean insertArticle(@AuthenticationPrincipal PrincipalDetails principalDetails,
															AddArticleReqDto addArticleReqDto) {
		System.out.println(addArticleReqDto);
		if(addArticleReqDto.getFiles() != null) addArticleReqDto.getFiles().forEach(e -> System.out.println(e.getOriginalFilename()));
		return false;
	}
	
}
