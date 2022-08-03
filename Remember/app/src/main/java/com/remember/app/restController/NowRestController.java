 package com.remember.app.restController;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.response.CustomResEntity;
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.AddNowArticleReqDto;
import com.remember.app.service.NowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/now")
@RequiredArgsConstructor
public class NowRestController {
	
	private final NowService nowService;
	
	/**
	 * 리멤버 나우 상단 카테고리 리스트를 반환한다.
	 * @return List<NowCategory>
	 */
	@GetMapping("/categories")
	public ResponseEntity<?> getNowCategories() {
		return CustomResEntity.getResponse(nowService.getNowCategories());
	}
	
	/**
	 * 등록된 모든 카테고리의 게시글 중 page에 해당하는 게시글 개요 리스트를 반환한다.
	 * @param page 는 페이지 번호 - 1
	 * @return List<NowArticleSummary>
	 */
	@GetMapping("/list")
	public ResponseEntity<?> getNowArticleSummaryList(int page) {
		return CustomResEntity.getResponse(nowService.getNowArticleSummaryList(page));
	}
	
	/**
	 * 특정 카테고리의 page에 해당하는 게시글 개요 리스트를 반환한다.
	 * @param categoryId 는 카테고리 번호
	 * @param page 는 페지이 번호 - 1
	 * @return List<NowArticleSummary>
	 */
	@GetMapping("/{categoryId}/list")
	public ResponseEntity<?> getNowArticleSummaryListAboutCategory(@PathVariable int categoryId, int page){
		return CustomResEntity.getResponse(nowService.getNowArticleSummaryListAboutCategory(categoryId, page));
	}
	
	/**
	 * 등록된 모든 카테고리의 게시글의 갯수를 반환한다.
	 * @return articleCount (int)
	 */
	@GetMapping("/count")
	public ResponseEntity<?> getTotalArticleCount() {
		return CustomResEntity.getResponse((Object) nowService.getTotalArticleCount());
	}
	
	/**
	 * 특정 카테고리에 등록된 모든 게시글의 갯수를 반환한다.
	 * @param categoryId 는 카테고리 번호
	 * @return articleCount (int)
	 */
	@GetMapping("/{categoryId}/count")
	public ResponseEntity<?> getTotalArticleCountAboutCategory(@PathVariable int categoryId) {
		return CustomResEntity.getResponse((Object) nowService.getTotalArticleCountAboutCategory(categoryId));
	}
	
	/**
	 * 특정 게시글의 세부 내용을 반환한다.
	 * @param articleId 는 게시글 번호
	 * @return NowArticleDetailResDto
	 */
	@GetMapping("/detail/{articleId}")
	public ResponseEntity<?> getArticleDetail(@PathVariable int articleId){
		return CustomResEntity.getResponse(nowService.getArticleDetail(articleId));
	}
	
	/**
	 * 특정 게시글의 등록시간을 기준으로 직전에 등록된 3개의 게시글 리스트를 반환한다.
	 * @param articleId 는 게시글 번호
	 * @return List<NowArticleSummary>
	 */
	@GetMapping("/{articleId}/another/list")
	public ResponseEntity<?> getAnotherArticles(@PathVariable int articleId) {
		return CustomResEntity.getResponse(nowService.getAnotherArticles(articleId));
	}
	
	/**
	 * ROLE_CONNECTORS 권한이 있는 유저에 한하여 사용할 수 있는 리멤버 나우 게시글 등록
	 * @param addNowArticleReqDto 는 커넥터스에게 받은 게시글 데이터
	 * @param principalDetails 는 유저 데이터
	 * @return 등록 성공 실패 여부를 boolean 타입으로 반환
	 */
	@PostMapping("/article")
	public ResponseEntity<?> insertArticle(AddNowArticleReqDto addNowArticleReqDto,
														   @AuthenticationPrincipal PrincipalDetails principalDetails) {
		addNowArticleReqDto.setUser_id(principalDetails.getId());
		return CustomResEntity.getResponse(nowService.insertArticle(addNowArticleReqDto));
	}
	
}
