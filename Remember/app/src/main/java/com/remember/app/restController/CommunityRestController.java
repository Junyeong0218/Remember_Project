package com.remember.app.restController;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.category.SubCategoryDetail;
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
	
}
