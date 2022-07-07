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

import com.remember.app.entity.community.article.Article;
import com.remember.app.entity.community.article.ArticleDetail;
import com.remember.app.entity.community.article.ArticleImage;
import com.remember.app.entity.community.article.CommentDetail;
import com.remember.app.entity.now.NowAnotherArticles;
import com.remember.app.entity.now.NowArticle;
import com.remember.app.entity.now.NowArticleContentsImage;
import com.remember.app.entity.now.NowArticleDetail;
import com.remember.app.entity.now.NowArticleRepository;
import com.remember.app.entity.now.NowArticleSummary;
import com.remember.app.entity.now.NowArticleTitleImage;
import com.remember.app.entity.now.NowCategory;
import com.remember.app.requestDto.AddNowArticleReqDto;
import com.remember.app.responseDto.ArticleDetailResDto;
import com.remember.app.responseDto.NowArticleDetailRespDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NowServiceImpl implements NowService{
	
	private final NowArticleRepository nowArticleRepository;
	private final String filePath;
	
	
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
	public int getTotalArticleCount() {
		return nowArticleRepository.getTotalArticleCount();
	}
	
	@Override
	public int getTotalArticleCountAboutCategory(int categoryId) {
		return nowArticleRepository.getTotalArticleCountAboutCategory(categoryId);
	}
	
	@Override
	public NowArticleDetailRespDto getArticleDetail(int articleId){
		List<NowArticleDetail> details = nowArticleRepository.getArticleDetail(articleId);
		
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
	
	@Override
	public List<NowAnotherArticles> getAnotherArticles(int articleId) {
		return nowArticleRepository.getAnotherArticles(articleId);
	}
	
	@Override
	public boolean insertArticle(AddNowArticleReqDto addNowArticleReqDto) {
		MultipartFile titleImage = addNowArticleReqDto.getTitle_image();
		List<MultipartFile> contentsImages = addNowArticleReqDto.getContents_images();
		
		NowArticle nowArticle = addNowArticleReqDto.toNowArticleEntity();
		if(nowArticleRepository.insertArticle(nowArticle) == 1) {
			
			return true;
		} 
			return false;
	}
	
//	private String uploadTitleImage(MultipartFile image) {
//		try {
//			String imageName;
//			Path path = Paths.get(filePath, "article_images");
//			File file = new File(path.toString());
//			
//			if(! file.exists()) {
//			file.mkdirs();
//			}
//			
//			String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + image.getOriginalFilename();
//			Path imagePath = Paths.get(filePath, "article_images/" + fileName);
//			Files.write(imagePath, image.getBytes());
//			
//			
//			
//		}catch (Exception e) {
//			return null;
//		}
//	}
	
	
}
//	private String uploadTitleImage(MultipartFile image) {
//        try{
//        	String titleImage;
//			Path path = Paths.get(filePath, "article_images");
//			File file = new File(path.toString());
//			
//			if(! file.exists()) {
//				file.mkdirs();
//			}
//			String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + image.getOriginalFilename();
//			Path imagePath = Paths.get(filePath, "article_images/" + fileName);
//			Files.write(imagePath, image.getBytes());
//			
//			return null;
//            
//            
//        }catch (Exception e){
//            return null;
//        }
//    }
//	
	

	
		
	
//	@Override
//	public boolean insertArticle(AddNowArticleReqDto addNowArticleReqDto) {
//		List<String> contentsImageNames = downloadContentsImageFiles(addNowArticleReqDto.getContents_images());
//		if(contentsImageNames != null) {
//			NowArticle nowArticle = addNowArticleReqDto.toNowArticleEntity();
//			if(nowArticleRepository.insertArticle(nowArticle)==1) {
//				if(contentsImageNames.size() == 0) {
//					return true;
//				} else {
//					List<NowArticleContentsImage> articleContentsImages = new ArrayList<NowArticleContentsImage>();
//					for(String contentsImageName : contentsImageNames) {
//						articleContentsImages.add(NowArticleContentsImage.builder()
//																													.article_id(nowArticle.getId())
//																													.file_name(contentsImageName)
//																													.build());
//						
//					}
//					if(nowArticleRepository.insertNowArticleContentsImage(articleContentsImages) > 0) {
//						return true;
//					}
//				}
//			}
//		}
//		return false;
//	}
	
	
//	private List<String> downloadContentsImageFiles(List<MultipartFile> contents_images) {
//		try {
//			List<String> imageNames = new ArrayList<String>();
//			for(int i = 0; i < contents_images.size(); i++) {
//				Path path = Paths.get(filePath, "article_images");
//				File file = new File(path.toString());
//				
//				if(! file.exists()) {
//					file.mkdirs();
//				}
//				
//				String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + contents_images.get(i).getOriginalFilename();
//				Path imagePath = Paths.get(filePath, "article_images/" + fileName);
//				Files.write(imagePath, contents_images.get(i).getBytes());
//				imageNames.add(fileName);
//			}
//			return imageNames;
//		} catch (Exception e) {
//			return null;
//		}
//}
	
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

