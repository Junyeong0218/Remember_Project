package com.remember.app.entity.now;

import java.util.List;



import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.PathVariable;

import com.remember.app.responseDto.NowArticleDetailRespDto;

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
	
//	public List<NowArticle> getNowArticleList();
//	
//	public List<NowArticle> getNowArticleListWithCategory(int categoryId);
//	
//	public NowArticleDetailRespDto getNowArticleDetail(int articleId);
//	
//	public int getNowArticleTotalCount(int page);
//	
//	public int getNowArticleTotalCounWithCategory(int categoryId, int page);
//	
//	public List<NowArticleRelated> getNowArticleRelated(int articleId);
//	
//	public int uploadNowArticle(NowArticle nowArticle);
//	
//	
}
