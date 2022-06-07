package com.remember.app.entity.community;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.category.SubCategoryDetail;

@Mapper
public interface CommunityRepository {

	public List<SubCategoryDetail> getCategoriesWithArticleCount();
	
	public List<BestArticleSummary> getBestArticleSummaries();
	
	public List<ArticleSummary> getArticleSummaries();
	
	public int getTotalArticleCount();
	
	public int getTopicArticleCount(String categoryName);
}
