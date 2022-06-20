package com.remember.app.service;

import java.util.List;

import com.remember.app.entity.community.article.ArticleLike;
import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.article.CommentDetail;
import com.remember.app.entity.community.article.CommentLike;
import com.remember.app.entity.community.article.Tag;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.community.category.JoinedCategory;
import com.remember.app.entity.community.category.SubCategoryDetail;
import com.remember.app.requestDto.AddArticleCommentReqDto;
import com.remember.app.requestDto.AddArticleReqDto;
import com.remember.app.responseDto.ArticleDetailResDto;
import com.remember.app.responseDto.CategoryDetailResDto;

public interface CommunityService {

	public List<SubCategoryDetail> getCategoriesWithJoinCount(int userId);
	
	public List<BestArticleSummary> getBestArticleSummaries();

	public List<BestArticleSummary> getBestArticleSummariesAboutCategory(int categoryId);
	
	public List<ArticleSummary> getRecentAllKindArticleSummaries(int page);

	public List<ArticleSummary> getRecentArticleSummariesAbountCategory(int categoryId, int tagId, int page);
	
	public int getTotalArticleCount(int page);
	
	public int getTopicArticleCount(int categoryId, int tagId, int page);
	
	public ArticleDetailResDto getArticleDetail(int articleId, int userId);
	
	public List<CommentDetail> getCommentListASC(int articleId, int userId);

	public List<CommentDetail> getCommentListDESC(int articleId, int userId);
	
	public boolean isUserJoinCategory(CommunityJoinUser communityJoinUser);
	
	public CategoryDetailResDto getCategoryDetail(int categoryId, int userId);
	
	public String getCategoryName(int categoryId);
	
	public boolean joinCategory(CommunityJoinUser communityJoinUser);
	
	public boolean leaveCategory(CommunityJoinUser communityJoinUser);
	
	public List<JoinedCategory> getJoinedCategories(int id);
	
	public List<Tag> getTagsAboutSubCategory(int subCategoryId);
	
	public boolean insertArticle(AddArticleReqDto addArticleReqDto);
	
	public boolean insertArticleLike(ArticleLike articleLike);

	public boolean deleteArticleLike(ArticleLike articleLike);
	
	public boolean insertArticleComment(AddArticleCommentReqDto addArticleCommentReqDto);
	
	public boolean insertArticleCommentLike(CommentLike commentLike);

	public boolean deleteArticleCommentLike(CommentLike commentLike);
	
	public boolean updateArticleViewCount(int articleId);
}
