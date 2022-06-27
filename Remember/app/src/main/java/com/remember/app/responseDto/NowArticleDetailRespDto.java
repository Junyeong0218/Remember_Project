package com.remember.app.responseDto;


import java.util.List;

import com.remember.app.entity.now.NowArticleDetail;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class NowArticleDetailRespDto {
	private NowArticleDetail nowArticleDetail;
	private List<String> imageList;
	
}
