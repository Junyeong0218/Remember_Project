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

import com.remember.app.entity.community.article.ArticleDetail;
import com.remember.app.entity.community.article.CommentDetail;
import com.remember.app.entity.now.NowArticle;
import com.remember.app.entity.now.NowArticleContentsImage;
import com.remember.app.entity.now.NowArticleDetail;
import com.remember.app.entity.now.NowArticleRelated;
import com.remember.app.entity.now.NowArticleRepository;
import com.remember.app.entity.now.NowArticleSummary;
import com.remember.app.entity.now.NowArticleTitleImage;
import com.remember.app.entity.now.NowCategory;
import com.remember.app.requestDto.UploadNowArticleReqDto;
import com.remember.app.responseDto.ArticleDetailResDto;
import com.remember.app.responseDto.NowArticleDetailRespDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NowServiceImpl implements NowService{
	
	private final NowArticleRepository nowArticleRepository;
	
	
	@Override
	public List<NowCategory> getNowCategories() {
		return nowArticleRepository.getNowCategories();
	}
	
	@Override
	public List<NowArticleSummary> getNowArticleSummaryList(int page) {
		return nowArticleRepository.getNowArticleSummaryList(page * 10);
	}
	
	@Override
	public List<NowArticleSummary> getNowArticleSummaryListAboutCategory(int categoryId, int page) {
		return nowArticleRepository.getNowArticleSummaryListAboutCategory(categoryId, page*10);
	}

	@Override
	public int getTotalArticleCount(int page) {
		return nowArticleRepository.getTotalArticleCount(page);
	}
	
	@Override
	public int getTotalArticleCountAboutCategory(int categoryId, int page) {
		return nowArticleRepository.getTotalArticleCountAboutCategory(categoryId, page);
	}
	
	@Override
	public NowArticleDetailRespDto getArticleDetail(int articleId){
		List<NowArticleDetail> details = nowArticleRepository.getArticleDetail(articleId);
		
		if(details.size() == 0) return new NowArticleDetailRespDto();
		
		List<String> articleContentsImages = new ArrayList<String>();
		
		for(NowArticleDetail detail : details) {
			if(! articleContentsImages.contains(detail.getFile_name())) {
				articleContentsImages.add(detail.getFile_name());
			}
		}
			NowArticleDetailRespDto dto = NowArticleDetailRespDto.builder().nowArticleDetail(details.get(0))
				  .imageList(articleContentsImages)
				  .build();
			System.out.println(dto);
			return dto;
		}
	
	}
	
//	@Override
//	public NowArticleDetailRespDto getNowArticleDetail(int articleId) {
//		return nowArticleRepository.getNowArticleDetail(articleId);
//	}
//
//
//	@Override
//	public int getNowArticleTotalCount(int page) {
//		return nowArticleRepository.getNowArticleTotalCount(page * 10);
//	}
//
//
//	@Override
//	public int getNowArticleTotalCountWithCategory(int categoryId, int page) {
//		return nowArticleRepository.getNowArticleTotalCounWithCategory(categoryId, page * 10);
//	}
//
//
//	@Override
//	public List<NowArticle> getNowArticleList() {
//		return nowArticleRepository.getNowArticleList();
//	}
//
//
//	@Override
//	public List<NowArticle> getNowArticleListWithCategory(int categoryId) {
//		return nowArticleRepository.getNowArticleListWithCategory(categoryId);
//	}
//
//
//	@Override
//	public List<NowArticleRelated> getNowArticleRelated(int articleId) {
//		return nowArticleRepository.getNowArticleRelated(articleId);
//	}
//
//	@Override
//	public boolean uploadArticle(UploadNowArticleReqDto uploadNowArticleReqDto) {
//		List<String> imageNames = downloadArticleImageFiles(uploadNowArticleReqDto.getFiles());
//		if(imageNames != null) {
//			NowArticle nowArticle = uploadNowArticleReqDto.toNowArticleEntity();
//			if(nowArticleRepository.uploadNowArticle(nowArticle) == 1) {
//				if(imageNames.size() == 0) {
//					return false;
//				} else {
//					
//					List<NowArticleTitleImage> articleTitleImages = new ArrayList<NowArticleTitleImage>();
//					for(String imageTitleName : imageNames) {
//						articleTitleImages.add(NowArticleTitleImage.builder()
//																.article_id(nowArticle.getId())
//																.file_name(imageTitleName)
//																.build());
//						
//					List<NowArticleContentsImage> articleContentsImages = new ArrayList<NowArticleContentsImage>();
//					for(String imageContentsName : imageNames) {
//						articleContentsImages.add(NowArticleContentsImage.builder()
//																.article_id(nowArticle.getId())
//																.file_name(imageContentsName)
//																.build());
//						}
//					if(nowArticleRepository.insertNowArticleContentsImage(articleContentsImages) > 0) {
//						return true;
//						}
//					}
//				}
//			}
//		}
//		return false;
//	}
//	
//	private List<String> downloadArticleImageFiles(List<MultipartFile> files) {
//		try {
//			List<String> imageNames = new ArrayList<String>();
//			for(int i = 0; i < files.size(); i++) {
//				Path path = Paths.get(filePath, "article_images");
//				File file = new File(path.toString());
//				
//				if(! file.exists()) {
//					file.mkdirs();
//				}
//				
//				String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + files.get(i).getOriginalFilename();
//				Path imagePath = Paths.get(filePath, "article_images/" + fileName);
//				Files.write(imagePath, files.get(i).getBytes());
//				imageNames.add(fileName);
//			}
//			return imageNames;
//		} catch (Exception e) {
//			return null;
//		}
//	}
//
//
//	@Override
//	public String getCategoryName(int categoryId) {
//		// TODO Auto-generated method stub
//		return null;
//	}
//	

