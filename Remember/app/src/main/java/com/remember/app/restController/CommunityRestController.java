package com.remember.app.restController;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.category.SubCategoryDetail;
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
	
	@GetMapping("/recent/all")
	public List<ArticleSummary> getRecentAllArticles() {
		return communityService.getArticleSummaries();
	}
	
	@GetMapping("/{categoryName}/count")
	public int getTotalArticleCount(@PathVariable String categoryName) {
		return communityService.getTotalArticleCount(categoryName);
	}
}
