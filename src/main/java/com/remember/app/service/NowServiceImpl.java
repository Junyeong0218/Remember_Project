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

import com.remember.app.entity.now.NowAnotherArticles;
import com.remember.app.entity.now.NowArticle;
import com.remember.app.entity.now.NowArticleContentsImage;
import com.remember.app.entity.now.NowArticleDetail;
import com.remember.app.entity.now.NowArticleRepository;
import com.remember.app.entity.now.NowArticleSummary;
import com.remember.app.entity.now.NowArticleTitleImage;
import com.remember.app.entity.now.NowCategory;
import com.remember.app.requestDto.AddNowArticleReqDto;
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
			articleContentsImages.add(detail.getContents_image_file_name());
		}
		NowArticleDetailRespDto dto = NowArticleDetailRespDto.builder()
																													   .nowArticleDetail(details.get(0))
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
		String titleImageFileName = downloadImageFile(addNowArticleReqDto.getTitle_image());
		List<String> contentsImagesFileNames = null;
		if(addNowArticleReqDto.getContents_images() != null) {
			contentsImagesFileNames = downloadImageFiles(addNowArticleReqDto.getContents_images());
		}
		
		NowArticle nowArticle = addNowArticleReqDto.toNowArticleEntity();
		int result = nowArticleRepository.insertArticle(nowArticle);
		if(result == 1) {
			result += nowArticleRepository.insertNowArticleTitleImage(NowArticleTitleImage.builder()
																																										   .article_id(nowArticle.getId())
																																										   .file_name(titleImageFileName)
																																										   .build());
			if(contentsImagesFileNames != null) {
				List<NowArticleContentsImage> contentsImages = new ArrayList<NowArticleContentsImage>();
				for(String fileName : contentsImagesFileNames) {
					contentsImages.add(NowArticleContentsImage.builder()
																												  .article_id(nowArticle.getId())
																												  .file_name(fileName)
																												  .build());
				}
				result += nowArticleRepository.insertNowArticleContentsImage(contentsImages);
			}
		}
		if(result > 1) return true;
		
		return false;
	}
	
	private String downloadImageFile(MultipartFile file) {
		try {
			Path path = Paths.get(filePath, "now_article_images");
			File fileForPathMake = new File(path.toString());
			
			if(! fileForPathMake.exists()) {
				fileForPathMake.mkdirs();
			}
			
			String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + file.getOriginalFilename();
			Path imagePath = Paths.get(filePath, "now_article_images/" + fileName);
			Files.write(imagePath, file.getBytes());
				
			return fileName;
		} catch (Exception e) {
			return null;
		}
	}
	
	private List<String> downloadImageFiles(List<MultipartFile> files) {
		try {
			List<String> imageNames = new ArrayList<String>();
			for(int i = 0; i < files.size(); i++) {
				Path path = Paths.get(filePath, "now_article_images");
				File file = new File(path.toString());
				
				if(! file.exists()) {
					file.mkdirs();
				}
				
				String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + files.get(i).getOriginalFilename();
				Path imagePath = Paths.get(filePath, "now_article_images/" + fileName);
				Files.write(imagePath, files.get(i).getBytes());
				imageNames.add(fileName);
			}
			return imageNames;
		} catch (Exception e) {
			return null;
		}
	}
	
}