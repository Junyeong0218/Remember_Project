package com.remember.app.restController;

import javax.servlet.http.HttpServletRequest;

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

import com.remember.app.entity.response.CustomResEntity;
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
	
	/**
	 * 로그인 된 유저 데이터를 반환한다.
	 * @param principalDetails 는 유저 데이터
	 * @return 로그인 된 경우 UserDetail, 비로그인의 경우 null을 반환
	 */
	@GetMapping("/principal")
	public ResponseEntity<?> getPrincipal(@AuthenticationPrincipal PrincipalDetails principalDetails) {
		try {
			System.out.println(CustomResEntity.getResponse(principalDetails.getUser()));
			return CustomResEntity.getResponse(principalDetails.getUser());
		} catch (NullPointerException e) {
			return CustomResEntity.getResponse(1);
		}
	}
	
	/**
	 * 약관정보 및 휴대전화 번호를 세션에 저장 및 해당 전화번호로 가입된 계정 검색하여 반환
	 * @param termsReqDto 는 유저로부터 받은 약관정보 및 휴대전화 번호
	 * @return 가입된 계정이 있는 경우 UserLoginFlagsResDto, 없는 경우 null을 반환
	 */
	@GetMapping("/signup/account/list")
	public ResponseEntity<?> savePhoneStatus(HttpServletRequest request, TermsReqDto termsReqDto) {
		try {
			request.getSession().setAttribute("dto", termsReqDto);
			UserLoginFlagsResDto resDto =  userService.getAvailableLogins(termsReqDto.getPhone());
			return CustomResEntity.getResponse(resDto);
			
		} catch (Exception e) {
			return CustomResEntity.getResponse(3);
		}
	}
	
	/**
	 * 휴대전화 인증 문자를 전송하고 전송 성공 여부를 반환
	 * @param phone 는 유저가 입력한 휴대전화 번호
	 * @return 문자 전송 성공 여부 반환 (boolean)
	 */
	@PostMapping("/phone/certificate")
	public ResponseEntity<?> sendPhoneMessage(String phone) {
		return CustomResEntity.getResponse(phoneCertificateService.sendMessage(phone));
	}
	
	/**
	 * 휴대전화 인증 번호 및 휴대전화 번호를 대조하여 인증 성공 여부를 반환
	 * @param code 는 서버에 저장된 휴대전화 인증 번호
	 * @param phone 는 유저가 입력한 휴대전화 번호
	 * @return 휴대전화 인증 성공 여부 반환 (boolean)
	 */
	@GetMapping("/phone/certificate")
	public ResponseEntity<?> isEqual(String code, String phone) {
		return CustomResEntity.getResponse(phoneCertificateService.isEqual(code, phone));
	}

	/**
	 * 이메일을 통한 가입을 진행하고 가입 성공 여부를 반환
	 * @param emailSignupReqDto 유저가 입력한 이메일 및 비밀번호(rawPassword)
	 * @return 이메일 가입 성공 여부를 반환 (boolean)
	 */
	@PostMapping("/signup/email")
	public ResponseEntity<?> signupWithEmail(HttpServletRequest request, EmailSignupReqDto emailSignupReqDto) {
		TermsReqDto termsDto = (TermsReqDto) request.getSession().getAttribute("dto");
		System.out.println(termsDto);
		System.out.println(emailSignupReqDto);
		
		return CustomResEntity.getResponse(userService.signupWithEmail(termsDto, emailSignupReqDto));
	}
	
	/**
	 * 특정 휴대전화 번호로 가입된 계정정보 반환 
	 * @param phone 는 유저가 입력한 휴대전화 번호
	 * @return 가입된 계정이 있는 경우 UserLoginFlagsResDto, 없는 경우 null을 반환
	 */
	@GetMapping("/user")
	public ResponseEntity<?> getLoginFlagsByPhone(String phone) {
		return CustomResEntity.getResponse(userService.getAvailableLogins(phone));
	}
	
	/**
	 * 커뮤니티 활동을 위한 유저 세부 데이터 입력 및 성공 여부 반환
	 * @param principalDetails 는 유저 데이터
	 * @param userDetailReqDto 는 유저가 입력한 세부 데이터
	 * @return 데이터 입력 성공 여부를 반환 (boolean)
	 */
	@PostMapping("/detail")
	public ResponseEntity<?> insertUserDetail(@AuthenticationPrincipal PrincipalDetails principalDetails,
																	UserDetailReqDto userDetailReqDto) {
		userDetailReqDto.setUser_id(principalDetails.getId());
		if(userService.insertUserDetail(userDetailReqDto)) {
			principalDetails.setUserDetail(userService.getUserDetailById(principalDetails.getId()));
			return CustomResEntity.getResponse(true);
		}
		return CustomResEntity.getResponse(3);
	}
	
	/**
	 * 회원 탈퇴 및 성공 여부를 반환
	 * @param userId 는 유저 id
	 * @return 회원 탈퇴 성공 여부 반환 (boolean)
	 */
	@DeleteMapping("/user/{userId}")
	public ResponseEntity<?> deleteUser(@PathVariable int userId) {
		return CustomResEntity.getResponse(userService.deleteUser(userId));
	}
	
	/**
	 * 간편 로그인 연동 처리 및 성공 여부를 반환
	 * @param userId 는 유저 id
	 * @param userOauthDetail 는 provider로 부터 받은 간편 로그인 정보
	 * @return 간편 로그인 연동 성공 여부 반환 (boolean)
	 */
	@PostMapping("/user/{userId}/oauth")
	public ResponseEntity<?> insertNewOAuthDetail(@PathVariable int userId,
																			  UserOauthDetail userOauthDetail) {
		userOauthDetail.setUser_id(userId);
		return CustomResEntity.getResponse(userService.insertNewOAuthDetail(userOauthDetail));
	}
	
	/**
	 * 간편 로그인 연동 삭제 처리 및 성공 여부 반환
	 * @param id 는 간편 로그인 db id
	 * @return 간편 로그인 연동 삭제 성공 여부 반환 (boolean)
	 */
	@DeleteMapping("/user/oauth/{id}")
	public ResponseEntity<?> deleteOAuthDetail(@PathVariable int id) {
		return CustomResEntity.getResponse(userService.deleteOAuthDetail(id));
	}
	
	/**
	 * 간편 로그인으로 가입한 유저의 비밀번호 첫 설정 및 성공 여부 반환
	 * @param passwordDto 는 유저가 입력한 비밀번호 (rawPassword)
	 * @param principalDetails 는 유저 정보
	 * @return 비밀번호 설정 성공 여부 반환 (boolean)
	 */
	@PostMapping("/password")
	public ResponseEntity<?> insertNewPassword(PasswordDto passwordDto,
																		  @AuthenticationPrincipal PrincipalDetails principalDetails) {
		return CustomResEntity.getResponse(userService.insertNewPassword(passwordDto.toUserEntity(principalDetails.getId())));
	}
	
	/**
	 * 기존에 설정된 비밀번호를 새 비밀번호로 변경 및 성공 여부 반환
	 * @param passwordDto 는 유저가 입력한 비밀번호 (rawPassword)
	 * @param principalDetails 는 유저 정보
	 * @return 비밀번호 재설정 성공 여부 반환 (boolean)
	 */
	@PutMapping("/password")
	public ResponseEntity<?> updatePassword(@RequestBody PasswordDto passwordDto,
																	@AuthenticationPrincipal PrincipalDetails principalDetails) {
		if(userService.checkOriginPassword(passwordDto.toUserEntityForCheck(principalDetails.getId()))) {
			return CustomResEntity.getResponse(userService.updatePassword(passwordDto.toUserEntity(principalDetails.getId())));
		}
		return CustomResEntity.getResponse(3);
	}
	
}
