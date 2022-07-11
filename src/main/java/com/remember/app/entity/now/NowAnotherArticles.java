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
public class NowAnotherArticles {
	private int id;
	private String title;
	private String file_name;
	private LocalDateTime create_date;
}
