package com.remember.app.entity.now;

import java.util.List;


import org.apache.ibatis.annotations.Mapper;

import com.remember.app.responseDto.NowArticleDetailRespDto;

@Mapper
public interface NowArticleRepository {

	public void uploadNowArticle(NowArticle nowArticle);
	
	public List<NowArticle> getNowArticleList();
	
	public List<NowArticle> getNowArticleListWithCategory(int categoryId);
	
	public NowArticleDetailRespDto getNowArticleDetail(int articleId);
	
	public int getNowArticleTotalCount();
	
	public int getNowArticleTotalCounWithCategory(int categoryId);
	
	public List<NowArticleRelated> getNowArticleRelated(int articleId);
	
	
}
