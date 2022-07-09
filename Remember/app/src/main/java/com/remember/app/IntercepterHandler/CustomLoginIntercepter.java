package com.remember.app.IntercepterHandler;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class CustomLoginIntercepter implements HandlerInterceptor {

	private String originUri;
	private List<String> authenticatedUris = Arrays.asList("/card");
	private String userRole = "ROLE_USER";
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		originUri = request.getRequestURI();
		System.out.println("intercepted uri : " + request.getRequestURI());
		
		boolean isMatched = false;
		for(String authenticatedUri : authenticatedUris) {
			if(originUri.startsWith(authenticatedUri)) {
				isMatched = true;
				System.out.println("isMatched = true");
				break;
			}
		}
		if(isMatched) {
			if(request.isUserInRole(userRole)) {
				return true;
			} else {
				request.getSession().setAttribute("originUri", originUri);
				response.sendRedirect("/auth/signin");
				return false;
			}
		} else {
			return true;
		}
	}
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		
		boolean isMatched = false;
		for(String authenticatedUri : authenticatedUris) {
			if(originUri.startsWith(authenticatedUri)) {
				isMatched = true;
				break;
			}
		}
		if(isMatched) {
			if(request.isUserInRole(userRole)) {
				String sessionUri = (String) request.getSession().getAttribute("originUri");
				System.out.println(request.getUserPrincipal().getName());
				System.out.println(sessionUri);
//				if(sessionUri != null) request.getSession().setAttribute("completeUri", sessionUri);
//				request.getRequestDispatcher(sessionUri == null ? originUri : sessionUri).forward(request, response);
			} else {
				response.setContentType("text/html; charset=UTF-8");
				response.getWriter().print("<script>alert(\"회원정보가 일치하지 않습니다.\\\\n다시 로그인해주세요.\"); location.href=\"/auth/signin\"</script>");
			}
		} else {
			request.getRequestDispatcher(request.getHttpServletMapping().getPattern());
		}
	}
	
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println("afterCompletion");
	}
}
