package com.remember.app.responseDto;

import java.util.List;

import com.remember.app.entity.community.article.ArticleDetail;
import com.remember.app.entity.community.article.CommentDetail;

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
public class ArticleDetailResDto {

	private ArticleDetail articleDetail;
	private List<CommentDetail> commentList;
}
