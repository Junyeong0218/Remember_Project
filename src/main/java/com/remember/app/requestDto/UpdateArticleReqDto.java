package com.remember.app.requestDto;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.remember.app.entity.community.article.Article;
import com.remember.app.entity.community.article.ArticleImage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateArticleReqDto {

	private int id;
	private int user_id;
	private int sub_category_id;
	private int article_tag_id;
	private String title;
	private String contents;
	private boolean use_nickname;
	private List<MultipartFile> files;
	private List<String> delete_file_names;
	
	public List<ArticleImage> toArticleImages() {
		List<ArticleImage> images = new ArrayList<ArticleImage>();
		delete_file_names.forEach(e -> images.add(ArticleImage.builder()
																													 .file_name(e)
																													 .build()));
		return images;
	}
	
	public Article toArticleEntity() {
		return Article.builder()
								   .id(id)
								   .user_id(user_id)
								   .sub_category_id(sub_category_id)
								   .article_tag_id(article_tag_id)
								   .title(title)
								   .contents(contents)
								   .use_nickname(use_nickname)
								   .build();
	}
	
}
