package com.remember.app.entity.community;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommunityRepository {

	public List<SubCategoryDetail> getCategoriesWithArticleCount();
}
