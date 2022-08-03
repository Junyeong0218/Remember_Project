package com.remember.app.service;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.util.StringTokenizer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.remember.app.entity.card.CardRepository;
import com.remember.app.entity.card.PaymentMethod;
import com.remember.app.entity.card.ProductPayment;
import com.remember.app.entity.card.Team;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImportService {
	
	private final CardRepository cardRepository;
	
	@Value("${port.apiKey}")
	private String importKey;
	
	@Value("${port.apisecret}")
	private String importSecret;
	
	private HttpURLConnection getConnection(String urlString) {
		try {
			URL url = new URL(urlString);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			return connection;
		} catch (MalformedURLException e) {
			System.out.println(e.getClass());
			return null;
		} catch (IOException e) {
			System.out.println(e.getClass());
			return null;
		}
	}
	
	public String getToken() throws IOException {
		HttpURLConnection connection = getConnection("https://api.iamport.kr/users/getToken"); 
		if(connection != null) {
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
			}
			return null;
		}
		return null;
	}
	
	public PaymentMethod checkCardInfo(String token, PaymentMethod paymentMethod) throws IOException {
		HttpURLConnection connection = getConnection("https://api.iamport.kr/subscribe/customers/" + paymentMethod.getId());
		if(connection != null) {
			connection.setRequestMethod("POST");
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
			connection.setRequestProperty("Authorization", token);
			DataOutputStream bw = new DataOutputStream(connection.getOutputStream());
			
			StringBuilder sb = new StringBuilder();
			sb.append("pg=nice");
			sb.append("&card_number=" + paymentMethod.getCard_number());
			sb.append("&expiry=" + paymentMethod.getExpiration_date());
			sb.append("&birth=" + paymentMethod.getBirthday());
			sb.append("&pwd_2digit=" + paymentMethod.getPassword());
			sb.append("&customer_name=" + paymentMethod.getName());
			sb.append("&customer_tel=" + paymentMethod.getPhone());
			sb.append("&customer_email=" + paymentMethod.getEmail());
			bw.writeBytes(sb.toString());
			bw.flush();
			bw.close();
			
			int responseCode = connection.getResponseCode();
			System.out.println(responseCode);
			if(responseCode == 200) {
				BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				String line = br.readLine();
				System.out.println(line);
				line = line.replaceAll("[\\{\\}]", "");
				System.out.println(line);
				String[] claims = line.split(",");
				for(String claim : claims) {
					String key = claim.split(":")[0].replace("\"", "");
					if(key.equals("code")) {
						System.out.println(claim.split(":")[1].replace("\"", ""));
						if(! claim.split(":")[1].replace("\"", "").equals("0")) return null;
					}
					if(key.equals("card_name")) {
						String card_name = parseUTF8ToString(claim.split(":")[1].replace("\"", ""));
						System.out.println(card_name);
						paymentMethod.setCard_name(card_name);
						return paymentMethod;
					}
				}
				br.close();
				connection.disconnect();
			}
		}
		return null;
	}
	
	private String parseUTF8ToString(String UTFString) {
		StringBuilder sb = new StringBuilder();
		StringTokenizer st = new StringTokenizer(UTFString, "\\u");
		while(st.hasMoreTokens()) {
			String spilted = st.nextToken(); 
			if(spilted.length() == 4) {
				int codePoint = Integer.parseInt(spilted, 16);
				if(Character.isBmpCodePoint(codePoint)) {
					sb.appendCodePoint(codePoint);
				} else if(Character.isValidCodePoint(codePoint)) {
					sb.append(Character.highSurrogate(codePoint));
					sb.append(Character.lowSurrogate(codePoint));
				}
			} else {
				String four_digits = spilted.substring(0, 4);
				int codePoint = Integer.parseInt(four_digits, 16);
				if(Character.isBmpCodePoint(codePoint)) {
					sb.appendCodePoint(codePoint);
				} else if(Character.isValidCodePoint(codePoint)) {
					sb.append(Character.highSurrogate(codePoint));
					sb.append(Character.lowSurrogate(codePoint));
				}
				sb.append(spilted.substring(4, spilted.length()));
			}
		}
		return sb.toString();
	}
	
	private String getMerchantId() {
		StringBuilder merchantId = new StringBuilder();
		String latestId = cardRepository.getTodaysLatestPaymentId();
		if(latestId == null) {
			LocalDate today = LocalDate.now();
			String year = Integer.toString(today.getYear() % 100);
			String month = today.getMonthValue() < 10 ? "0" + Integer.toString(today.getMonthValue()) : Integer.toString(today.getMonthValue());
			String day = today.getDayOfMonth() < 10 ? "0" + Integer.toString(today.getDayOfMonth()) : Integer.toString(today.getDayOfMonth());
			
			merchantId.append("merchant_" + year + month + day + "_000001");
		} else {
			merchantId.append(latestId.substring(0, latestId.lastIndexOf("_") + 1));
			
			int number = Integer.parseInt(latestId.substring(latestId.lastIndexOf("_") + 1, latestId.length()));
			number++;
			String numberString = Integer.toString(number);
			int max = 6 - numberString.length();
			for(int i = 0; i < max; i++) merchantId.append("0");
			merchantId.append(numberString);
		}
		System.out.println(merchantId.toString());
		return merchantId.toString();
	}
	
	public boolean useProductToFree(ProductPayment productPayment) {
		productPayment.setId(getMerchantId());
		
		if(cardRepository.insertNewPayment(productPayment) == 1) {
			cardRepository.updateTeamGrade(Team.builder()
																							.id(productPayment.getTeam_id())
																							.grade_id(productPayment.getGrade_id())
																							.build());
			return true;
		}
		return false;
	}
	
	public boolean sendPayment(String token, ProductPayment productPayment, PaymentMethod paymentMethod) throws IOException {
		productPayment.setId(getMerchantId());
		HttpURLConnection connection = getConnection("https://api.iamport.kr/subscribe/payments/onetime"); 
		if(connection != null) {
			connection.setRequestMethod("POST");
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
			connection.setRequestProperty("Authorization", token);
			DataOutputStream bw = new DataOutputStream(connection.getOutputStream());
			
			StringBuilder sb = new StringBuilder();
			sb.append("merchant_uid=" + productPayment.getId());
			sb.append("&amount=" + productPayment.getPrice());
			sb.append("&card_number=" + paymentMethod.getCard_number());
			sb.append("&expiry=" + paymentMethod.getExpiration_date());
			sb.append("&birth=" + paymentMethod.getBirthday());
			sb.append("&pwd_2digit=" + paymentMethod.getPassword());
			sb.append("&customer_id=" + paymentMethod.getId());
			sb.append("&pg=nice");
			sb.append("&name=Rememer 정기 결제 test");
			sb.append("&buyer_name=" + paymentMethod.getName());
			sb.append("&buyer_email=" + paymentMethod.getEmail());
			sb.append("&buyer_tel=" + paymentMethod.getPhone());
			bw.writeBytes(sb.toString());
			bw.flush();
			bw.close();
			
			int responseCode = connection.getResponseCode();
			System.out.println(responseCode);
			if(responseCode == 200) {
				BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				String line = br.readLine();
				System.out.println(line);
				line = line.replaceAll("[\\{\\}]", "");
				System.out.println(line);
				String[] claims = line.split(",");
				for(String claim : claims) {
					String key = claim.split(":")[0].replace("\"", "");
					if(key.equals("code")) {
						System.out.println(claim.split(":")[1].replace("\"", ""));
						if(! claim.split(":")[1].replace("\"", "").equals("0")) return false;
					}
					if(key.equals("status")) {
						if(claim.split(":")[1].replace("\"", "").equals("failed")) {
							return false;
						}
					}
				}
				br.close();
				connection.disconnect();
				if(cardRepository.insertNewPayment(productPayment) == 1) {
					cardRepository.updateTeamGrade(Team.builder()
																									.id(productPayment.getTeam_id())
																									.grade_id(productPayment.getGrade_id())
																									.build());
					return true;
				}
			}
		}
		return false;
	}
}
