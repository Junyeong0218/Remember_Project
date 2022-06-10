package com.remember.app.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;

@Service
@RequiredArgsConstructor
public class PhoneCertificateService {

	private final Map<String, String> phoneCodeMap;
	
	@Value("${coolsms.apikey}")
	private String apiKey;
	
	@Value("${coolsms.apisecret}")
	private String apiSecret;
	
	@Value("${coolsms.fromnumber}")
	private String fromNumber;
	
	public boolean sendMessage(String toNumber) {
		Message message = new Message(apiKey, apiSecret);
		String randomNumber = generateRandomNumber();
		
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("to", toNumber);
		params.put("from", fromNumber);
		params.put("type", "SMS");
		params.put("text", "[" + randomNumber + "] 리멤버 인증번호를 입력해주세요.");
		params.put("app_version", toNumber);
		
		phoneCodeMap.put(toNumber, randomNumber);
		
		try {
			JSONObject obj = (JSONObject) message.send(params);
			System.out.println("successfully sended!");
			System.out.println(obj.toString());
			return true;
		} catch (CoolsmsException e) {
			System.out.println(e.getMessage());
			return false;
		}
	}
	
	public boolean isEqual(String code, String phone) {
		boolean result = phoneCodeMap.get(phone).equals(code);
		if(result) {
			phoneCodeMap.remove(phone);
			return true;
		} else {
			return false;
		}
	}
	
	private String generateRandomNumber() {
		Random random = new Random();
		StringBuilder sb = new StringBuilder();
		for(int i = 0; i < 4; i++) {
			sb.append(Integer.toString(random.nextInt(9) + 1));
		}
		return sb.toString();
	}
	
}
