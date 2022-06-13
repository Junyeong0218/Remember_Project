package com.remember.app.responseDto;


import com.remember.app.entity.now.NowArticleDetail;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class NowArticleDetailRespDto {
	private NowArticleDetail nowArticleDetail;
	
}
