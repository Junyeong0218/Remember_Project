package com.remember.app.pageController;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {

	@GetMapping("/signin")
	public String signin(HttpServletRequest request, Model model) {
		String uri = request.getHeader("Referer").replace("http://localhost:8080", "");
		System.out.println(uri);
		if(! uri.equals("/") && ! uri.equals("/index")) {
			request.getSession().setAttribute("originUri", uri);
		}
		model.addAttribute("flag", "common");
		return "/auth/signin";
	}
	
	@GetMapping("/signin/email")
	public String signinEmail(Model model) {
		model.addAttribute("flag", "common");
		return "/auth/signin/email";
	}
	
	@GetMapping("/signin/phone")
	public String signinPhone(Model model) {
		model.addAttribute("flag", "common");
		return "/auth/signin/phone";
	}
	
	@GetMapping("/signup")
	public String signup(Model model) {
		model.addAttribute("flag", "common");
		return "/auth/signup";
	}
	
	@GetMapping("/password")
	public String findPassword(Model model) {
		model.addAttribute("flag", "common");
		return "/auth/reset_password";
	}
	
	@GetMapping("/inquiry")
	public String inquiry(Model model) {
		model.addAttribute("flag", "common");
		return "/auth/inquiry";
	}
	
	@GetMapping("/company")
	public String companyAuthFlag(Model model) {
		model.addAttribute("flag", "company");
		return "/auth/company";
	}
	
	@GetMapping("/company/signin")
	public String companySignin(Model model) {
		model.addAttribute("flag", "company");
		return "/auth/signin";
	}
	
	@GetMapping("/company/signin/email")
	public String companySigninEmail(Model model) {
		model.addAttribute("flag", "company");
		return "/auth/signin/email";
	}
	
	@GetMapping("/company/signin/phone")
	public String companySigninPhone(Model model) {
		model.addAttribute("flag", "company");
		return "/auth/signin/phone";
	}
	
	@GetMapping("/company/signup")
	public String companySignup(Model model) {
		model.addAttribute("flag", "company");
		return "/auth/signup";
	}
	
	@GetMapping("/company/password")
	public String companyFindPassword(Model model) {
		model.addAttribute("flag", "company");
		return "/auth/reset_password";
	}
	
	@GetMapping("/company/inquiry")
	public String companyInquiry(Model model) {
		model.addAttribute("flag", "company");
		return "/auth/inquiry";
	}

}

	


	
