package com.remember.app.entity.user;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRepository {

	public UserDetail getOAuthUserByOAuthUsername(String oauth_username);

	public UserDetail getOAuthUserByPhone(String phone);
	
	public int getIdByPhone(String phone);
	
	public int updateEmailAndPasswordById(User user);
	
	public int insertUserToMst(User user);
	
	public int insertOAuthUserToMst(User user);
	
	public int insertUserTerms(UserTerms userTerms);
	
	public int insertOAuthUserToOAuthDetail(UserOauthDetail userOauthDetail);
	
}