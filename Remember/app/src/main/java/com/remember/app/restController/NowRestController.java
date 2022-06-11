package com.remember.app.restController;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/now")
public class NowRestController {
	
	@GetMapping("/article/list")
//	public List<NowArticle> getNowArticleList() {
		
	}
	
	@GetMapping("/article/count")
	public int getArticleCount() {
		
	}

	@GetMapping("{categoryId}/article/list")
//	public List<NowArticle> getNowArticleListInCategory() {
		
	}
	
	@GetMapping("{categoryId}/article/count") 
	public int getArticleCountInCategory(){
		
	}
	
	@GetMapping("/article/detail/{articleId}")
//	public NowArticleResDto articleDetail() {
		
	}
	
	@getMapping("/article/related/{articleId}")
//	public List<NowArticle> getRelatedArticle(@PathVariable int articleId) {
		
	}
}
