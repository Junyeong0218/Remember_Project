 package com.remember.app.restController;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.now.NowAnotherArticles;
import com.remember.app.entity.now.NowArticleSummary;
import com.remember.app.entity.now.NowCategory;
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddNowArticleReqDto;
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
	public int getTotalArticleCount() {
		return nowService.getTotalArticleCount();
	}
	
	@GetMapping("/{categoryId}/count")
	public int getTotalArticleCountAboutCategory(@PathVariable int categoryId) {
		return nowService.getTotalArticleCountAboutCategory(categoryId);
	}
	
	@GetMapping("/detail/{articleId}")
	public NowArticleDetailRespDto getArticleDetail(@PathVariable int articleId){
		System.out.println(articleId);
		NowArticleDetailRespDto dto = nowService.getArticleDetail(articleId);
		System.out.println(dto);
		return dto;
	}
	
	@GetMapping("/{articleId}/another/list")
	public List<NowAnotherArticles> getAnotherArticles(@PathVariable int articleId) {
		return nowService.getAnotherArticles(articleId);
	}
	
	@PostMapping("/article")
	public boolean insertArticle(AddNowArticleReqDto addNowArticleReqDto,
														   @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addNowArticleReqDto.setUser_id(principalDetails.getId());
		System.out.println(addNowArticleReqDto);
		return nowService.insertArticle(addNowArticleReqDto);
	}
	
}
