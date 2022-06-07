package com.remember.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.remember.app.entity.community.CommunityRepository;
import com.remember.app.entity.community.SubCategoryDetail;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

	private final CommunityRepository communityRepository;
	
	@Override
	public List<SubCategoryDetail> getCategoriesWithArticleCount() {
		return communityRepository.getCategoriesWithArticleCount();
	}
}
