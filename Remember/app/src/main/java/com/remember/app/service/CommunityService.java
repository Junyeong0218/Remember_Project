package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.article.Tag;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.community.category.JoinedCategory;
import com.remember.app.entity.community.category.SubCategoryDetail;
import com.remember.app.requestDto.AddArticleReqDto;
import com.remember.app.responseDto.ArticleDetailResDto;

public interface CommunityService {

	public List<SubCategoryDetail> getCategoriesWithArticleCount();
	
	public List<BestArticleSummary> getBestArticleSummaries();

	public List<BestArticleSummary> getBestArticleSummariesAboutCategory(int categoryId);
	
	public List<ArticleSummary> getRecentAllKindArticleSummaries();

	public List<ArticleSummary> getRecentArticleSummariesAbountCategory(int categoryId);
	
	public int getTotalArticleCount();
	
	public int getTopicArticleCount(int categoryId);
	
	public ArticleDetailResDto getArticleDetail(int articleId);
	
	public boolean isUserJoinCategory(CommunityJoinUser communityJoinUser);
	
	public String getCategoryName(int categoryId);
	
	public boolean joinCategory(CommunityJoinUser communityJoinUser);
	
	public List<JoinedCategory> getJoinedCategories(int id);
	
	public List<Tag> getTagsAboutMainCategory(int mainCategoryId);
	
	public boolean insertArticle(AddArticleReqDto addArticleReqDto);
}
