package com.remember.app.service;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ImportService {
	
	@Value("${port.apiKey}")
	private String importKey;
	
	@Value("${port.apisecret}")
	private String importSecret;
	
	private URL url;
	private HttpURLConnection connection;
	
	private boolean setUrl(String url) {
		try {
			this.url = new URL(url);
			connection = (HttpURLConnection) this.url.openConnection();
			return true;
		} catch (MalformedURLException e) {
			System.out.println(e.getClass());
			return false;
		} catch (IOException e) {
			System.out.println(e.getClass());
			return false;
		}
	}
	
	public String getToken() throws IOException {
		if(setUrl("https://api.iamport.kr/users/getToken")) {
			connection.setRequestMethod("POST");
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
			DataOutputStream bw = new DataOutputStream(connection.getOutputStream());
			
			StringBuilder sb = new StringBuilder();
			sb.append("imp_key=" + importKey + "&imp_secret=" + importSecret);
			bw.writeBytes(sb.toString());
			bw.flush();
			bw.close();
			
			int responseCode = connection.getResponseCode();
			System.out.println(responseCode);
			if(responseCode == 200) {
				BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				String line = br.readLine();
				line = line.substring(line.indexOf("response") + 10, line.length()).replaceAll("[\\{\\}]", "");
				System.out.println(line);
				String[] claims = line.split(",");
				for(String claim : claims) {
					String key = claim.split(":")[0].replace("\"", "");
					if(key.equals("access_token")) {
						System.out.println(claim.split(":")[1].replace("\"", ""));
						return claim.split(":")[1].replace("\"", "");
					}
				}
				br.close();
				connection.disconnect();
				
				return null;
			}
			
			return null;
		}
		return null;
	}
}
