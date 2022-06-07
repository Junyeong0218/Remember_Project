package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.community.SubCategoryDetail;

public interface CommunityService {

	public List<SubCategoryDetail> getCategoriesWithArticleCount();
}
