package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.now.NowArticle;
import com.remember.app.entity.now.NowArticleRelated;
import com.remember.app.requestDto.UploadArticleReqDto;
import com.remember.app.responseDto.NowArticleDetailRespDto;

public interface NowService {
	
	public List<NowArticle> getNowArticleList();
	
	public List<NowArticle> getNowArticleListWithCategory(int articleId);
	
	public NowArticleDetailRespDto getNowArticleDetail(int articleId);
	
	public int getNowArticleTotalCount();
	
	public int getNowArticleTotalCountWithCategory(int categoryId);
	
	public List<NowArticleRelated> getNowArticleRelated(int articleId);
	
	public boolean uploadArticle(UploadArticleReqDto uploadArticleReqDto);

}
