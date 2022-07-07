package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.now.NowAnotherArticles;
import com.remember.app.entity.now.NowArticle;
import com.remember.app.entity.now.NowArticleSummary;
import com.remember.app.entity.now.NowCategory;
import com.remember.app.requestDto.UpdateArticleReqDto;
import com.remember.app.requestDto.AddNowArticleReqDto;
import com.remember.app.responseDto.NowArticleDetailRespDto;

public interface NowService {
	
	public List<NowCategory> getNowCategories();
	
	public List<NowArticleSummary> getNowArticleSummaryList(int page);
	
	public List<NowArticleSummary> getNowArticleSummaryListAboutCategory(int categoryId, int page);
	
	public int getTotalArticleCount(); 
	
	public int getTotalArticleCountAboutCategory(int categoryId);
	
	public NowArticleDetailRespDto getArticleDetail(int articleId);
	
	public List<NowAnotherArticles> getAnotherArticles(int articleId);
	
	public boolean insertArticle(AddNowArticleReqDto addNowArticleReqDto);
	
	
//	public List<NowArticle> getNowArticleList();
//	
//	public List<NowArticle> getNowArticleListWithCategory(int articleId);
//	
//	public NowArticleDetailRespDto getNowArticleDetail(int articleId);
//	
//	public String getCategoryName(int categoryId);
//	
//	public int getNowArticleTotalCount(int page);
//	
//	public int getNowArticleTotalCountWithCategory(int categoryId, int page);
//	
//	public List<NowArticleRelated> getNowArticleRelated(int articleId);
//	
//	public boolean uploadArticle(UploadNowArticleReqDto uploadNowArticleReqDto);

}
