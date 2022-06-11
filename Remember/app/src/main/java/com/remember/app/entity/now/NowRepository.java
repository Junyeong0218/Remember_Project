package com.remember.app.entity.now;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NowRepository {
	public int insertNow(Now now);
	public int updateNow(Now now);
	public List<Now> getListAll();
	public Now selectNowdDetail(int id); 
}
