package com.remember.app.entity.now;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NowArticleRepository {

	public List<NowCategory> getNowCategories();
	
	public List<NowArticleSummary> getNowArticleSummaryList(int page);
	
	public List<NowArticleSummary> getNowArticleSummaryListAboutCategory(int categoryId, int page);
	
	public int getTotalArticleCount();
	
	public int getTotalArticleCountAboutCategory(int categoryId);
	
	public List<NowArticleDetail> getArticleDetail(int articleId);
	
	public List<NowAnotherArticles> getAnotherArticles(int articleId);
	
	public int insertArticle(NowArticle nowArticle);
	
	public int insertNowArticleTitleImage(NowArticleTitleImage nowArticleTitleImage);
	
	public int insertNowArticleContentsImage(List<NowArticleContentsImage> nowArticleContentsImages);
	
}
