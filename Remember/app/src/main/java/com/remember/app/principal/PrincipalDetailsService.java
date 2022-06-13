package com.remember.app.principal;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.remember.app.entity.user.UserDetail;
import com.remember.app.entity.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

	private final UserRepository userRepository;
	
	private final BCryptPasswordEncoder passwordEncoder;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		System.out.println("form login 진입");
		System.out.println(username);
		UserDetail userDetail = null;
		
		try {
			Integer.parseInt(username);
			// phone signin
			System.out.println("휴대폰 로그인");
			userDetail = userRepository.getUserByPhone(username);
			userDetail.setPassword(passwordEncoder.encode(username));
			System.out.println(userDetail);
		} catch (NumberFormatException e) {
			// email signin
			userDetail = userRepository.getUserByEmail(username);
		}
		
		if(userDetail == null) {
			throw new UsernameNotFoundException("존재하지 않는 아이디입니다.\\n다시 시도해주세요.");
		}
		return new PrincipalDetails(userDetail);
	}
}
