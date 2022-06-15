package com.remember.app.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.remember.app.entity.community.CommunityRepository;
import com.remember.app.entity.community.article.ArticleDetail;
import com.remember.app.entity.community.article.ArticleSummary;
import com.remember.app.entity.community.article.BestArticleSummary;
import com.remember.app.entity.community.article.CommentDetail;
import com.remember.app.entity.community.article.Tag;
import com.remember.app.entity.community.category.CommunityJoinUser;
import com.remember.app.entity.community.category.JoinedCategory;
import com.remember.app.entity.community.category.SubCategoryDetail;
import com.remember.app.requestDto.AddArticleReqDto;
import com.remember.app.responseDto.ArticleDetailResDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

	private final CommunityRepository communityRepository;
	
	private final String filePath;
	
	@Override
	public List<SubCategoryDetail> getCategoriesWithArticleCount() {
		return communityRepository.getCategoriesWithArticleCount();
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
	public ArticleDetailResDto getArticleDetail(int articleId) {
		List<ArticleDetail> details = communityRepository.getArticleDetail(articleId);
		
		if(details.size() == 0) return new ArticleDetailResDto(); 
		
		List<CommentDetail> comments = new ArrayList<CommentDetail>();
		
		for(ArticleDetail detail : details) {
			comments.add(CommentDetail.builder().id(detail.getComment_id())
																						 .user_id(detail.getCommented_user_id())
																						 .nickname(detail.getCommented_user_nickname())
																						 .department_name(detail.getCommented_user_department_name())
																						 .profile_img(detail.getCommented_user_profile_img())
																						 .contents(detail.getComment_contents())
																						 .related_comment_id(detail.getRelated_comment_id())
																						 .create_date(detail.getCreate_date())
																						 .like_count(detail.getComment_like_count())
																						 .build());
		}
		ArticleDetailResDto dto = ArticleDetailResDto.builder().articleDetail(details.get(0))
																												  .commentList(comments)
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
	public List<Tag> getTagsAboutMainCategory(int mainCategoryId) {
		return communityRepository.getTagsAboutMainCategory(mainCategoryId);
	}
	
	@Override
	public boolean insertArticle(AddArticleReqDto addArticleReqDto) {
		if(downloadArticleImageFiles(addArticleReqDto.getFiles())) {
			
		}
		return false;
	}
	
	private boolean downloadArticleImageFiles(List<MultipartFile> files) {
		try {
			for(int i = 0; i < files.size(); i++) {
				Path path = Paths.get(filePath, "article_images");
				File file = new File(path.toString());
				
				if(! file.exists()) {
					file.mkdirs();
				}
				
				String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + files.get(i).getOriginalFilename();
				Path imagePath = Paths.get(filePath, "article_images/" + fileName);
				Files.write(imagePath, files.get(i).getBytes());
			}
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
}
