package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.category.SubCategoryDetail;

public interface CommunityService {

	public List<SubCategoryDetail> getCategoriesWithArticleCount();
	
	public List<BestArticleSummary> getBestArticleSummaries();
	
	public List<ArticleSummary> getArticleSummaries();
	
	public int getTotalArticleCount(String categoryName);
}
