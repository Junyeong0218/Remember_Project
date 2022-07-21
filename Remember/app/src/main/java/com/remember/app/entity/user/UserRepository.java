package com.remember.app.entity.user;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRepository {

	public UserDetail getOAuthUserByOAuthUsername(String oauth_username);

	public UserDetail getOAuthUserByPhone(String phone);
	
	public UserDetail getUserByEmail(String email);
	
	public UserDetail getUserByPhone(String phone);
	
	public UserDetail getUserById(int id);
	
	public List<UserDetail> getAvailableLogins(String phone);
	
	public Integer getIdByPhone(String phone);
	
	public int updateEmailAndPasswordById(User user);
	
	public int insertUserToMst(User user);
	
	public int insertOAuthUserToMst(User user);
	
	public int insertUserTerms(UserTerms userTerms);
	
	public int insertOAuthUserToOAuthDetail(UserOauthDetail userOauthDetail);
	
	public int insertUserDetail(UserDetail userDetail);
	
	public int updateNameAndNickNameInMst(User user);
	
	public int deleteUser(int id);
}