package com.remember.app.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.remember.app.entity.user.User;
import com.remember.app.entity.user.UserDetail;
import com.remember.app.entity.user.UserOauthDetail;
import com.remember.app.entity.user.UserRepository;
import com.remember.app.entity.user.UserTerms;
import com.remember.app.requestDto.EmailSignupReqDto;
import com.remember.app.requestDto.TermsReqDto;
import com.remember.app.requestDto.UserDetailReqDto;
import com.remember.app.responseDto.UserLoginFlagsResDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	
	private final BCryptPasswordEncoder passwordEncoder;
	
	@Override
	public boolean signupWithEmail(TermsReqDto termsDto, EmailSignupReqDto emailSignupReqDto) {
		Integer idObj = userRepository.getIdByPhone(termsDto.getPhone());
		int id = idObj == null ? 0 : idObj.intValue();
		
		User user = emailSignupReqDto.toEntity(passwordEncoder);
		user.setPhone(termsDto.getPhone());
		if(id == 0) {
			if(userRepository.insertUserToMst(user) == 1) {
				UserTerms terms = termsDto.toEntity();
				terms.setUser_id(user.getId());
				if (userRepository.insertUserTerms(terms) == 1) {
					return true;
				}
			}
		} else {
			user.setId(id);
			if(userRepository.updateEmailAndPasswordById(user) == 1) {
				return true;
			}
		}
		return false;
	}
	
	@Override
	public UserLoginFlagsResDto getAvailableLogins(String phone) {
		List<UserDetail> details = userRepository.getAvailableLogins(phone);
		if(details.size() == 0) return null;
		
		UserLoginFlagsResDto dto = new UserLoginFlagsResDto();
		dto.setUser(details.get(0).toUserEntity());
		List<UserOauthDetail> oauth_details = new ArrayList<UserOauthDetail>();
		for(UserDetail detail : details ) {
			oauth_details.add(detail.toOauthDetailEntity());
		}
		dto.setOauthDetails(oauth_details);
		
		return dto;
	}
	
	@Override
	public boolean insertUserDetail(UserDetailReqDto userDetailReqDto) {
		if(userRepository.insertUserDetail(userDetailReqDto.toUserDetailEntity()) == 1) {
			if(userRepository.updateNameAndNickNameInMst(userDetailReqDto.toUserEntity()) == 1) {
				return true;
			}
		}
		return false;
	}
	
	@Override
	public UserDetail getUserDetailById(int id) {
		return userRepository.getUserById(id);
	}
	
	@Override
	public boolean deleteUser(int id) {
		return userRepository.deleteUser(id) ==1;
	}
	
	@Override
	public boolean insertNewOAuthDetail(UserOauthDetail userOauthDetail) {
		return userRepository.insertNewOAuthDetail(userOauthDetail) == 1;
	}
	
	@Override
	public boolean deleteOAuthDetail(int id) {
		return userRepository.deleteOAuthDetail(id) == 1;
	}
	
	@Override
	public boolean insertNewPassword(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.updatePassword(user) == 1;
	}
	
	@Override
	public boolean checkOriginPassword(User user) {
		String dbPassword = userRepository.getOriginPassword(user.getId());
		return passwordEncoder.matches(user.getPassword(), dbPassword);
	}
	
	@Override
	public boolean updatePassword(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.updatePassword(user) == 1;
	}
}
