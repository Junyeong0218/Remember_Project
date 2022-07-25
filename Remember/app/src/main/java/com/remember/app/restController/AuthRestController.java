package com.remember.app.restController;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remember.app.entity.user.UserDetail;
import com.remember.app.entity.user.UserOauthDetail;
import com.remember.app.principal.PrincipalDetails;
import com.remember.app.requestDto.EmailSignupReqDto;
import com.remember.app.requestDto.PasswordDto;
import com.remember.app.requestDto.TermsReqDto;
import com.remember.app.requestDto.UserDetailReqDto;
import com.remember.app.responseDto.UserLoginFlagsResDto;
import com.remember.app.service.PhoneCertificateService;
import com.remember.app.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthRestController {
	
	private final UserService userService;
	
	private final PhoneCertificateService phoneCertificateService;
	
	@GetMapping("/principal")
	public UserDetail getPrincipal(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		try {
			return principalDetails.getUser();
		} catch (NullPointerException e) {
			return null;
		}
	}
	
	@GetMapping("/signup/account/list")
	public UserLoginFlagsResDto savePhoneStatus(HttpServletRequest request, TermsReqDto dto) {
		try {
			request.getSession().setAttribute("dto", dto);
			UserLoginFlagsResDto resDto =  userService.getAvailableLogins(dto.getPhone());
			System.out.println(resDto);
			return resDto == null ? new UserLoginFlagsResDto() : resDto;
		} catch (Exception e) {
			System.out.println("catched");
			return new UserLoginFlagsResDto();
		}
	}
	
	@PostMapping("/phone/certificate")
	public boolean sendPhoneMessage(String phone) {
//		return phoneCertificateService.getRandomNumber(phone);
		return phoneCertificateService.sendMessage(phone);
	}
	
	@GetMapping("/phone/certificate")
	public boolean isEqual(String code, String phone) {
		return phoneCertificateService.isEqual(code, phone);
	}

	@PostMapping("/signup/email")
	public boolean signupWithEmail(HttpServletRequest request, EmailSignupReqDto emailSignupReqDto) {
		TermsReqDto termsDto = (TermsReqDto) request.getSession().getAttribute("dto");
		System.out.println(termsDto);
		System.out.println(emailSignupReqDto);
		
		return userService.signupWithEmail(termsDto, emailSignupReqDto);
	}
	
	@GetMapping("/user")
	public UserLoginFlagsResDto getLoginFlagsByPhone(String phone) {
		return userService.getAvailableLogins(phone);
	}
	
	@PostMapping("/detail")
	public boolean insertUserDetail(@AuthenticationPrincipal PrincipalDetails principalDetails,
																	UserDetailReqDto userDetailReqDto) {
		userDetailReqDto.setUser_id(principalDetails.getId());
		if(userService.insertUserDetail(userDetailReqDto)) {
			principalDetails.setUserDetail(userService.getUserDetailById(principalDetails.getId()));
			return true;
		}
		return false;
	}
	
	@DeleteMapping("/user/{userId}")
	public ResponseEntity<?> deleteUser(@PathVariable int userId) {
		boolean result = userService.deleteUser(userId);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PostMapping("/user/{userId}/oauth")
	public boolean insertNewOAuthDetail(@PathVariable int userId,
																			  UserOauthDetail userOauthDetail) {
		userOauthDetail.setUser_id(userId);
		System.out.println(userOauthDetail);
		return true;
	}
	
	@PostMapping("/password")
	public boolean insertNewPassword(PasswordDto passwordDto,
																		  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return userService.insertNewPassword(passwordDto.toUserEntity(principalDetails.getId()));
	}
	
	@PutMapping("/password")
	public boolean updatePassword(@RequestBody PasswordDto passwordDto,
																	@AuthenticationPrincipal PrincipalDetails principalDetails) {
		if(userService.checkOriginPassword(passwordDto.toUserEntityForCheck(principalDetails.getId()))) {
			return userService.updatePassword(passwordDto.toUserEntity(principalDetails.getId()));
		}
		return false;
	}
	
}
