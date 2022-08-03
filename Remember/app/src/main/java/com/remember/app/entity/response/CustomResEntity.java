package com.remember.app.entity.response;

import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@JsonInclude(JsonInclude.Include.ALWAYS)
public class CustomResEntity<T> {

	private int code;
	private String message;
	private T data;
	
	private CustomResEntity(T data) {
		this.data = data;
		setMessage();
		System.out.println(this);
	}
	
	private CustomResEntity(int code) {
		this.code = code;
		setMessage();
	}
	
	private void setMessage() {
		switch(code) {
			case 1: {
				this.message =  "로그인 상태를 확인해주세요.";
				break;
			}
			case 2: {
				this.message = "권한이 없습니다.";
				break;
			}
			case 3: {
				this.message = "내부 서버 오류";
				break;
			}
			default: this.message =  null;
		}
	}
	
	public static ResponseEntity<?> getResponse(Object data) {
		return ResponseEntity.ok(new CustomResEntity<Object>(data));
	}
	
	public static ResponseEntity<?> getResponse(int code) {
		if(code != 0) return ResponseEntity.badRequest().body(new CustomResEntity<Object>(code));
		else					 return ResponseEntity.ok(null);
	}
	
}
