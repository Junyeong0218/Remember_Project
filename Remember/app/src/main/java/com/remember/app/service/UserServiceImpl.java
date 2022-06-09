package com.remember.app.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.remember.app.entity.user.User;
import com.remember.app.entity.user.UserRepository;
import com.remember.app.entity.user.UserTerms;
import com.remember.app.requestDto.EmailSignupReqDto;
import com.remember.app.requestDto.TermsReqDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	
	private final BCryptPasswordEncoder passwordEncoder;
	
	@Override
	public boolean signupWithEmail(TermsReqDto termsDto, EmailSignupReqDto emailSignupReqDto) {
		int id = userRepository.getIdByPhone(termsDto.getPhone());
		
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
}
