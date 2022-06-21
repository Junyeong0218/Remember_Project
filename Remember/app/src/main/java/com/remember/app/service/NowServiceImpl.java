package com.remember.app.service;

import java.util.ArrayList;
import java.util.List;


import org.springframework.stereotype.Service;

import com.remember.app.entity.community.article.Article;
import com.remember.app.entity.community.article.ArticleImage;
import com.remember.app.entity.now.NowArticle;
import com.remember.app.entity.now.NowArticleRelated;
import com.remember.app.entity.now.NowArticleRepository;
import com.remember.app.requestDto.AddArticleReqDto;
import com.remember.app.requestDto.UploadArticleReqDto;
import com.remember.app.responseDto.NowArticleDetailRespDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NowServiceImpl implements NowService{
	
	private NowArticleRepository nowArticleRepository;
	


	@Override
	public NowArticleDetailRespDto getNowArticleDetail(int articleId) {
		return nowArticleRepository.getNowArticleDetail(articleId);
	}


	@Override
	public int getNowArticleTotalCount() {
		return nowArticleRepository.getNowArticleTotalCount();
	}


	@Override
	public int getNowArticleTotalCountWithCategory(int categoryId) {
		return nowArticleRepository.getNowArticleTotalCounWithCategory(categoryId);
	}


	@Override
	public List<NowArticle> getNowArticleList() {
		return nowArticleRepository.getNowArticleList();
	}


	@Override
	public List<NowArticle> getNowArticleListWithCategory(int categoryId) {
		return nowArticleRepository.getNowArticleListWithCategory(categoryId);
	}


	@Override
	public List<NowArticleRelated> getNowArticleRelated(int articleId) {
		return nowArticleRepository.getNowArticleRelated(articleId);
	}

	@Override
	public boolean uploadArticle(UploadArticleReqDto uploadArticleReqDto) {
		return false;
		
	}
}
