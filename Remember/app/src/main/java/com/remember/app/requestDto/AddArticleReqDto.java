package com.remember.app.requestDto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.remember.app.entity.community.article.Article;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class AddArticleReqDto {

	private int user_id;
	private int sub_category_id;
	private int article_tag_id;
	private String title;
	private String contents;
	private List<MultipartFile> files;
	
	public Article toArticleEntity() {
		return Article.builder()
								   .user_id(user_id)
								   .sub_category_id(sub_category_id)
								   .article_tag_id(article_tag_id)
								   .title(title)
								   .contents(contents)
								   .build();
	}
	
}
