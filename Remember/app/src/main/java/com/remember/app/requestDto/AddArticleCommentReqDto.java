package com.remember.app.requestDto;

import com.remember.app.entity.community.article.Comment;

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
public class AddArticleCommentReqDto {
	
	private int article_id;
	private int user_id;
	private String contents;
	private boolean use_nickname;
	private int related_comment_id;
	
	public Comment toCommentEntity() {
		return Comment.builder()
										.article_id(article_id)
										.user_id(user_id)
										.contents(contents)
										.use_nickname(use_nickname)
										.build();
	}
	
	public Comment toRelatedCommentEntity() {
		return Comment.builder()
										.article_id(article_id)
										.user_id(user_id)
										.contents(contents)
										.use_nickname(use_nickname)
										.related_comment_id(related_comment_id)
										.build();
	}
}
