package com.remember.app.restController;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.now.NowArticle;
import com.remember.app.entity.now.NowArticleRelated;
import com.remember.app.entity.now.NowArticleSummary;
import com.remember.app.entity.now.NowCategory;
import com.remember.app.requestDto.UploadNowArticleReqDto;
import com.remember.app.responseDto.NowArticleDetailRespDto;
import com.remember.app.service.NowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/now")
@RequiredArgsConstructor
public class NowRestController {
	
	private final NowService nowService;
	
	
	@GetMapping("/categories")
	public List<NowCategory> getNowCategories() {
		return nowService.getNowCategories();
	}
	
	@GetMapping("/list")
	public List<NowArticleSummary> getNowArticleSummaryList(int page) {
		return nowService.getNowArticleSummaryList(page);
	}
	
	@GetMapping("/{categoryId}/list")
	public List<NowArticleSummary> getNowArticleSummaryListAboutCategory(@PathVariable int categoryId, int page){
		return nowService.getNowArticleSummaryListAboutCategory(categoryId, page);
	}
	
	
	@GetMapping("/count")
	public int getTotalArticleCount(int page) {
		return nowService.getTotalArticleCount(page);
	}
	
	
	@GetMapping("/{categoryId}/count")
	public int getTotalArticleCountAboutCategory(@PathVariable int categoryId, int page) {
		return nowService.getTotalArticleCountAboutCategory(categoryId, page);
	}
	
	@GetMapping("/detail/{articleId}")
	public NowArticleDetailRespDto getArticleDetail(@PathVariable int articleId){
		return nowService.getArticleDetail(articleId);	
	}
	
//	@GetMapping("/list")
//	public List<NowArticle> getNowArticleList() {
//		return nowService.getNowArticleList();
//	}
//	
//	@GetMapping("/count")
//	public int getArticleCount(int page) {
//		return nowService.getNowArticleTotalCount(page);
//	}
//
//	@GetMapping("{categoryId}/list")
//	public List<NowArticle> getNowArticleListInCategory(@PathVariable int categoryId) {
//		return nowService.getNowArticleListWithCategory(categoryId);
//	}
//	
//	@GetMapping("{categoryId}/count") 
//	public int getArticleCountInCategory(@PathVariable int categoryId, int page){
//		return nowService.getNowArticleTotalCountWithCategory(categoryId, page);
//	}
//	
//	@GetMapping("/detail/{article_id}")
//	public NowArticleDetailRespDto articleDetail(@PathVariable int articleId) {
//		return nowService.getNowArticleDetail(articleId);
//	}
//	
//	@GetMapping("/article/related/{article_id}")
//	public List<NowArticleRelated> getRelatedArticle(@PathVariable int articleId) {
//		return nowService.getNowArticleRelated(articleId);
//	}
//
//	@PostMapping("/article")
//	public boolean uploadNowArticle(UploadNowArticleReqDto uploadNowArticleReqDto) {
//		System.out.println(uploadNowArticleReqDto);
//		if(uploadNowArticleReqDto.getFiles() != null) uploadNowArticleReqDto.getFiles().forEach(e -> System.out.println(e.getOriginalFilename()));
//		return nowService.uploadArticle(uploadNowArticleReqDto);
//	}
//
}
