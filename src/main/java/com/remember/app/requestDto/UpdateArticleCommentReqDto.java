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
public class UpdateArticleCommentReqDto {

	private int id;
	private int article_id;
	private int user_id;
	private String contents;
	private boolean use_nickname;
	
	public Comment toCommentEntity() {
		return Comment.builder()
										.id(id)
										.article_id(article_id)
										.user_id(user_id)
										.contents(contents)
										.use_nickname(use_nickname)
										.build();
	}
}
