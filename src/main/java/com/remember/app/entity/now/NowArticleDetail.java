package com.remember.app.entity.now;



import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NowArticleDetail {

	private int id;
	private int user_id;
	private String name;
	
	private LocalDateTime create_date;
	private String title;
	private String contents;
	
	private String title_file_name;
	private String contents_image_file_name;
	
}
