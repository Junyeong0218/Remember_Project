package com.remember.app.principal;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.remember.app.entity.user.User;
import com.remember.app.entity.user.UserDetail;
import com.remember.app.entity.user.UserOauthDetail;
import com.remember.app.entity.user.UserRepository;
import com.remember.app.entity.user.UserTerms;
import com.remember.app.requestDto.TermsReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

	private final HttpSession httpSession;
	
	private final UserRepository userRepository;
	
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		System.out.println(oAuth2User);
		String provider = userRequest.getClientRegistration().getRegistrationId();
		Map<String, Object> attributes = null;
		
		if(provider.equals("naver")) {
			attributes = (Map<String, Object>) (oAuth2User.getAttributes().get("response"));
		} else if(provider.equals("google")) {
			attributes = oAuth2User.getAttributes();
		}
		String oauth_username = makeOAuthUsername(provider, attributes);
		UserDetail userDetail = userRepository.getOAuthUserByOAuthUsername(oauth_username);
		
		Object termsDto = httpSession.getAttribute("dto");
		httpSession.removeAttribute("dto");
		
		if(termsDto != null) {
			// 회원가입 oauth ( oauth_username 검색 -> 존재하면 exception / 없으면 insert
			if(userDetail == null) {
				TermsReqDto dto = (TermsReqDto) termsDto;
				userDetail = userRepository.getOAuthUserByPhone(dto.getPhone());
				if(userDetail == null) {
					// insert
					User user = User.builder()
													.email((String) attributes.get("email"))
													.phone(dto.getPhone())
													.role("ROLE_USER")
													.build();
					if(userRepository.insertOAuthUserToMst(user) == 1) {
						UserTerms terms = dto.toEntity();
						terms.setUser_id(user.getId());
						int result = userRepository.insertUserTerms(terms);
						UserOauthDetail oauthDetail = UserOauthDetail.builder()
																													 .user_id(user.getId())
																													 .oauth_username(oauth_username)
																												 	 .provider(provider)
																													 .build();
						result += userRepository.insertOAuthUserToOAuthDetail(oauthDetail);
						if(result == 2) {
							userDetail = userRepository.getOAuthUserByOAuthUsername(oauth_username);
							
							return new PrincipalDetails(userDetail, attributes);
						} else {
							throw new OAuth2AuthenticationException(new OAuth2Error("400", provider + " 회원가입 실패", "/auth/signup"));
						}
					} else {
						throw new OAuth2AuthenticationException(new OAuth2Error("400", provider + " 회원가입 실패", "/auth/signup"));
					}
				} else {
					// phone 으로 검색된 유저가 있는 경우 oauth_detail insert
					UserOauthDetail oauthDetail = UserOauthDetail.builder()
																												 .user_id(userDetail.getId())
																												 .oauth_username(oauth_username)
																											 	 .provider(provider)
																												 .build();
					if(userRepository.insertOAuthUserToOAuthDetail(oauthDetail) == 1) {
						userDetail = userRepository.getOAuthUserByOAuthUsername(oauth_username);
						
						return new PrincipalDetails(userDetail, attributes);
					} else {
						throw new OAuth2AuthenticationException(new OAuth2Error("400", provider + " 회원가입 실패", "/auth/signup"));
					}
				}
			} else {
				throw new OAuth2AuthenticationException(new OAuth2Error("400", provider + "로 이미 가입된 회원입니다.\\n로그인 화면으로 이동합니다.", "/auth/signin"));
			}
		} else if(userDetail == null) {
			throw new OAuth2AuthenticationException(new OAuth2Error("400", "간편 로그인 실패", "/auth/signup"));
		} else {
			return new PrincipalDetails(userDetail, attributes);
		}
	}
	
	private String makeOAuthUsername(String provider, Map<String, Object> attributes) {
		if(provider.equals("naver")) {
			return provider + "_" + (String)attributes.get("id");
		}else if(provider.equals("google")) {
			return provider + "_" + (String)attributes.get("sub");
		}else {
			return null;
		}
	}
}









