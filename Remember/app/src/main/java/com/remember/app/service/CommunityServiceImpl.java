package com.remember.app.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.remember.app.entity.community.CommunityRepository;
import com.remember.app.entity.community.article.Article;
import com.remember.app.entity.community.article.ArticleDetail;
import com.remember.app.entity.community.article.ArticleImage;
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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

	private final CommunityRepository communityRepository;
	
	private final String filePath;
	
	@Override
	public List<SubCategoryDetail> getCategoriesWithJoinCount(int userId) {
		if(userId == 0) {
			return communityRepository.getCategoriesWithJoinCount();
		} else {
			return communityRepository.getCategoriesWithJoinCountForLoginUser(userId);
		}
	}
	
	@Override
	public List<JoinedCategory> getJoinedCategories(int id) {
		return communityRepository.getJoinedCategories(id);
	}
	
	@Override
	public List<BestArticleSummary> getBestArticleSummaries() {
		return communityRepository.getBestArticleSummaries();
	}
	
	@Override
	public List<BestArticleSummary> getBestArticleSummariesAboutCategory(int categoryId) {
		return null;
	}
	
	@Override
	public List<ArticleSummary> getRecentAllKindArticleSummaries() {
		return communityRepository.getTotalArticleSummaries();
	}
	
	@Override
	public List<ArticleSummary> getRecentArticleSummariesAbountCategory(int categoryId) {
		return communityRepository.getTopicArticleSummaries(categoryId);
	}
	
	@Override
	public int getTotalArticleCount() {
		return communityRepository.getTotalArticleCount();
	}
	
	@Override
	public int getTopicArticleCount(int categoryId) {
		return communityRepository.getTopicArticleCount(categoryId);
	}
	
	@Override
	public ArticleDetailResDto getArticleDetail(int articleId, int userId) {
		List<ArticleDetail> details = null;
		if(userId == 0) {
			details = communityRepository.getArticleDetail(articleId);
		} else {
			details = communityRepository.getArticleDetailForLoginUser(articleId, userId);
		}
		
		if(details.size() == 0) return new ArticleDetailResDto(); 
		
		List<CommentDetail> comments = new ArrayList<CommentDetail>();
		List<String> articleImages = new ArrayList<String>();
		
		for(ArticleDetail detail : details) {
			if(! comments.contains(CommentDetail.builder().id(detail.getComment_id()).build())) {
				comments.add(CommentDetail.builder().id(detail.getComment_id())
																							 .user_id(detail.getCommented_user_id())
																							 .nickname(detail.getCommented_user_nickname())
																							 .department_name(detail.getCommented_user_department_name())
																							 .profile_img(detail.getCommented_user_profile_img())
																							 .contents(detail.getComment_contents())
																							 .related_comment_id(detail.getRelated_comment_id())
																							 .create_date(detail.getComment_create_date())
																							 .like_count(detail.getComment_like_count())
																							 .like_flag(detail.isComment_like_flag())
																							 .build());
				
			}
			if(! articleImages.contains(detail.getFile_name())) {
				articleImages.add(detail.getFile_name());
			}
		}
		
		List<CommentDetail> orderedCommentList = new ArrayList<CommentDetail>();
		int index = 0;
		while(comments.size() != 0) {
			
			CommentDetail comment = comments.get(index);
			if(comment.getRelated_comment_id() == 0) {
				orderedCommentList.add(comment);
				index++;
				for(int i = index; i < comments.size(); i++) {
					if(comments.get(i).getRelated_comment_id() == comment.getId()) {
						orderedCommentList.add(comments.get(i));
					}
				}
				comments.removeAll(orderedCommentList);
				index = 0;
			}
		}
		System.out.println(orderedCommentList);
		ArticleDetailResDto dto = ArticleDetailResDto.builder().articleDetail(details.get(0))
																												  .imageList(articleImages)
																												  .commentList(orderedCommentList)
																												  .build();
																
		return dto;
	}
	
	@Override
	public boolean isUserJoinCategory(CommunityJoinUser communityJoinUser) {
		return communityRepository.isUserJoinCategory(communityJoinUser) == 1;
	}
	
	@Override
	public String getCategoryName(int categoryId) {
		return communityRepository.getCategoryName(categoryId);
	}
	
	@Override
	public boolean joinCategory(CommunityJoinUser communityJoinUser) {
		return communityRepository.joinCategory(communityJoinUser) == 1;
	}
	
	@Override
	public List<Tag> getTagsAboutSubCategory(int subCategoryId) {
		return communityRepository.getTagsAboutSubCategory(subCategoryId);
	}
	
	@Override
	public boolean insertArticle(AddArticleReqDto addArticleReqDto) {
		List<String> imageNames = downloadArticleImageFiles(addArticleReqDto.getFiles());
		if(imageNames != null) {
			Article article = addArticleReqDto.toArticleEntity();
			if(communityRepository.insertArticle(article) == 1) {
				if(imageNames.size() == 0) {
					return true;
				} else {
					List<ArticleImage> articleImages = new ArrayList<ArticleImage>();
					for(String imageName : imageNames) {
						articleImages.add(ArticleImage.builder()
																					   .article_id(article.getId())
																					   .file_name(imageName)
																					   .build());
					}
					if(communityRepository.insertArticleImages(articleImages) > 0) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	private List<String> downloadArticleImageFiles(List<MultipartFile> files) {
		try {
			List<String> imageNames = new ArrayList<String>();
			for(int i = 0; i < files.size(); i++) {
				Path path = Paths.get(filePath, "article_images");
				File file = new File(path.toString());
				
				if(! file.exists()) {
					file.mkdirs();
				}
				
				String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + files.get(i).getOriginalFilename();
				Path imagePath = Paths.get(filePath, "article_images/" + fileName);
				Files.write(imagePath, files.get(i).getBytes());
				imageNames.add(fileName);
			}
			return imageNames;
		} catch (Exception e) {
			return null;
		}
	}
	
	@Override
	public boolean insertArticleLike(ArticleLike articleLike) {
		return communityRepository.insertArticleLike(articleLike) == 1;
	}
	
	@Override
	public boolean deleteArticleLike(ArticleLike articleLike) {
		return communityRepository.deleteArticleLike(articleLike) == 1;
	}
	
	@Override
	public boolean insertArticleComment(AddArticleCommentReqDto addArticleCommentReqDto) {
		if(addArticleCommentReqDto.getRelated_comment_id() == 0) {
			return communityRepository.insertArticleComment(addArticleCommentReqDto.toCommentEntity()) == 1;
		} else {
			return communityRepository.insertRelatedArticleComment(addArticleCommentReqDto.toRelatedCommentEntity()) == 1;
		}
	}
	
	@Override
	public boolean insertArticleCommentLike(CommentLike commentLike) {
		return communityRepository.insertArticleCommentLike(commentLike) == 1;
	}
	
	@Override
	public boolean deleteArticleCommentLike(CommentLike commentLike) {
		return communityRepository.deleteArticleCommentLike(commentLike) == 1;
	}
	
}
