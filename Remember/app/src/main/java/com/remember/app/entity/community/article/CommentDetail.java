package com.remember.app.entity.community.article;

import java.time.LocalDateTime;

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
public class CommentDetail {

	private int id;
	private int user_id;
	private String nickname;
	private String department_name;
	private String profile_img;
	private String contents;
	private int related_comment_id;
	private LocalDateTime create_date;
	private int like_count;
}
