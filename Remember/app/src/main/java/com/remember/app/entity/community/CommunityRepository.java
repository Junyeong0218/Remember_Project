package com.remember.app.entity.community;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.remember.app.entity.community.article.ArticleDetail;
import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.community.category.JoinedCategory;
import com.remember.app.entity.community.category.SubCategoryDetail;

@Mapper
public interface CommunityRepository {

	public List<SubCategoryDetail> getCategoriesWithArticleCount();
	
	public List<BestArticleSummary> getBestArticleSummaries();

	public List<BestArticleSummary> getBestArticleSummariesAboutCategory(int categoryId);
	
	public List<ArticleSummary> getTotalArticleSummaries();

	public List<ArticleSummary> getTopicArticleSummaries(int categoryId);
	
	public int getTotalArticleCount();
	
	public int getTopicArticleCount(int categoryId);
	
	public List<ArticleDetail> getArticleDetail(int articleId);
	
	public int isUserJoinCategory(CommunityJoinUser communityJoinUser);
	
	public String getCategoryName(int categoryId);
	
	public int joinCategory(CommunityJoinUser communityJoinUser);
	
	public List<JoinedCategory> getJoinedCategories(int id);
}
