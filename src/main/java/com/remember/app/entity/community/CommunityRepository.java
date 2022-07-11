package com.remember.app.entity.community;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.remember.app.entity.community.article.Article;
import com.remember.app.entity.community.article.ArticleDetail;
import com.remember.app.entity.community.article.ArticleImage;
import com.remember.app.entity.community.article.ArticleLike;
import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.article.Comment;
import com.remember.app.entity.community.article.CommentDetail;
import com.remember.app.entity.community.article.CommentLike;
import com.remember.app.entity.community.article.Tag;
import com.remember.app.entity.community.category.CategoryDetail;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.community.category.JoinedCategory;
import com.remember.app.entity.community.category.SubCategoryDetail;

@Mapper
public interface CommunityRepository {

	// 카테고리 참가여부 및 로그인 된 경우 참가로직 추가를 위한 로그인 / 비로그인 개별 검색
	public List<SubCategoryDetail> getCategoriesWithJoinCount();
	
	public List<SubCategoryDetail> getCategoriesWithJoinCountForLoginUser(int userId); 
	
	
	// 좋아요 갯수 기준으로 검색된 베스트 게시글 ( categoryId 가 있는 경우 article_detail 아래에 포함될 최대 3 줄의 추천 게시글 )
	public List<BestArticleSummary> getBestArticleSummaries();

	public List<BestArticleSummary> getBestArticleSummariesAboutCategory(int categoryId);

	
	// 게시글 list paging / tag / category 분류 ( categoryId 가 존재하는 경우에만 tag로 검색 가능함 )
	public List<ArticleSummary> getTotalArticleSummaries(int page);

	public List<ArticleSummary> getTopicArticleSummaries(int categoryId, int page);

	public List<ArticleSummary> getTopicArticleSummariesWithTag(int categoryId, int tagId, int page);
	
	
	// 게시글 paging 처리를 위한 게시글 총 개수 ( categoryId 가 존재하는 경우에만 tag로 검색 가능함 )
	public int getTotalArticleCount(int page);
	
	public int getTopicArticleCount(int categoryId, int page);

	public int getTopicArticleCountWithTag(int categoryId, int tagId, int page);
	
	
	// 게시글 좋아요, 댓글 좋아요, 댓글 내용 수정 삭제를 위한 로그인 / 비로그인 개별 검색
	public List<ArticleDetail> getArticleDetail(int articleId);
	
	public List<ArticleDetail> getArticleDetailForLoginUser(int articleId, int userId);
	
	
	// detail 페이지에서 댓글 리스트 재출력시 정렬별 검색 ( desc 의 경우 메인댓글은 desc 이지만 답글은 asc ) 및 로그인 / 비로그인 개별 검색 
	public List<CommentDetail> getCommentListASC(int articleId);

	public List<CommentDetail> getCommentListDESC(int articleId);

	public List<CommentDetail> getCommentListForUserASC(int articleId, int userId);
	
	public List<CommentDetail> getCommentListForUserDESC(int articleId, int userId);
	
	
	// 카테고리 참가 유도 모달 출력에 사용될 카테고리 참가 여부 
	public int isUserJoinCategory(CommunityJoinUser communityJoinUser);
	
	
	// 카테고리 참가여부 및 로그인 된 경우 참가 및 퇴장 로직 추가를 위한 로그인 / 비로그인 개별 검색
	public List<CategoryDetail> getCategoryDetail(int categoryId);

	public List<CategoryDetail> getCategoryDetailForLoginUser(int categoryId, int userId);
	
	
	// /community/{categoryId} 페이지에서 해당 카테고리에 참가하지 않은 경우 출력될 모달에 사용될 카테고리 이름
	public String getCategoryName(int categoryId);
	
	
	// 카테고리에 참여 및 퇴장
	public int joinCategory(CommunityJoinUser communityJoinUser);
	
	public int leaveCategory(CommunityJoinUser communityJoinUser);
	
	
	// /community 에서 게시글 작성 시 출력할 카테고리 목록
	public List<JoinedCategory> getJoinedCategories(int id);
	
	
	// 게시글 작성 시 출력할 카테고리 별 세부 태그 목록
	public List<Tag> getTagsAboutSubCategory(int subCategoryId);
	
	
	// 게시글 작성 및 이미지 인서트, 수정, 삭제
	public int insertArticle(Article article);
	
	public int insertArticleImages(List<ArticleImage> articleImages);
	
	public int updateArticle(Article article);
	
	public int deleteArticleImages(List<ArticleImage> articleImages);
	
	public int deleteArticle(int articleId, int userId);
	
	
	// 게시글 좋아요 및 좋아요 취소
	public int insertArticleLike(ArticleLike articleLike);

	public int deleteArticleLike(ArticleLike articleLike);
	
	
	// 댓글 답글 작성 및 수정, 삭제
	public int insertArticleComment(Comment comment);
	
	public int insertRelatedArticleComment(Comment comment);
	
	public int updateArticleComment(Comment comment);

	public int deleteArticleComment(Comment comment);
	
	
	// 댓글 답글에 좋아요 및 좋아요 취소
	public int insertArticleCommentLike(CommentLike commentLike);

	public int deleteArticleCommentLike(CommentLike commentLike);
	
	
	// 로그인한 유저가 게시글 detail을 조회하는 경우 게시글의 view_count 를 1 증가 시킴
	public int updateArticleViewCount(int articleId);
}
