package com.remember.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.remember.app.entity.community.CommunityRepository;
import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.category.SubCategoryDetail;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

	private final CommunityRepository communityRepository;
	
	@Override
	public List<SubCategoryDetail> getCategoriesWithArticleCount() {
		return communityRepository.getCategoriesWithArticleCount();
	}
	
	@Override
	public List<BestArticleSummary> getBestArticleSummaries() {
		return communityRepository.getBestArticleSummaries();
	}
	
	@Override
	public List<ArticleSummary> getArticleSummaries() {
		return communityRepository.getArticleSummaries();
	}
	
	@Override
	public int getTotalArticleCount(String categoryName) {
		if(categoryName.equals("all")) {
			return communityRepository.getTotalArticleCount();
		} else {
			return communityRepository.getTopicArticleCount(categoryName);
		}
	}
}
