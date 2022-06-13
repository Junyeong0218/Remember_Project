package com.remember.app.restController;

import java.util.List;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.now.NowArticle;
import com.remember.app.entity.now.NowArticleRelated;
import com.remember.app.responseDto.NowArticleDetailRespDto;
import com.remember.app.service.NowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/now")
@RequiredArgsConstructor
public class NowRestController {
	
	private final NowService nowService;
	
	@GetMapping("/article/list")
	public List<NowArticle> getNowArticleList() {
		return nowService.getNowArticleList();
	}
	
	@GetMapping("/article/count")
	public int getArticleCount() {
		return nowService.getNowArticleTotalCount();
	}

	@GetMapping("{categoryId}/article/list")
	public List<NowArticle> getNowArticleListInCategory(@PathVariable int categoryId) {
		return nowService.getNowArticleListWithCategory(categoryId);
	}
	
	@GetMapping("{categoryId}/article/count") 
	public int getArticleCountInCategory(@PathVariable int categoryId){
		return nowService.getNowArticleTotalCountWithCategory(categoryId);
	}
	
	@GetMapping("/article/detail/{article_id}")
	public NowArticleDetailRespDto articleDetail(@PathVariable int articleId) {
		return nowService.getNowArticleDetail(articleId);
	}
	
	@GetMapping("/article/related/{article_id}")
	public List<NowArticleRelated> getRelatedArticle(@PathVariable int articleId) {
		return nowService.getNowArticleRelated(articleId);
	}
}
