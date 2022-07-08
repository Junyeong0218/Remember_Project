package com.remember.app.requestDto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.remember.app.entity.now.NowArticle;

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
public class AddNowArticleReqDto {
	
	private int user_id;
	private int category_id;
	private String title;
	private String summary;
	private String contents;
	private MultipartFile title_image;
	private List<MultipartFile> contents_images;
	
	public NowArticle toNowArticleEntity() {
		return NowArticle.builder()
						.user_id(user_id)
						.category_id(category_id)
						.title(title)
						.summary(summary)
						.contents(contents)
						.build();
	}
}
