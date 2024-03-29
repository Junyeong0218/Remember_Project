const main_contents = document.querySelector(".main_contents");
const user_delete = document.querySelector(".contents.delete");
const setting_button = document.querySelector(".setting_list.set");

const email = document.querySelector('.item_description.email');
const phone = document.querySelector('.item_description.phone');

let naver_id_login;

window.onload = () => {
	google.accounts.id.initialize({
		client_id: "269750796517-rinre7c7s0b6al5t7u00oim5eh47edn0.apps.googleusercontent.com",
		callback: googleTokenHandler,
		ux_mode: "popup",
		state_cookie_domain: "localhost"
	});
}

window.getNaverLoginId = (id) => {
	if(id != null) {
		console.log(id);
		
		const data = {
			"oauth_username": "naver_" + id,
			"provider": "naver"
		}
		
		if(ajax.insertNewOauthDetail(data)) {
			location.reload();
			return;
		}
	}
	alert("간편 로그인 연동에 실패했습니다.");
}

email.innerText = principal.email;
phone.innerText = principal.phone;

setting_button.onclick = () => location.reload();

document.querySelector(".contents.check_oauth").onclick = () => {
	const available_logins = ajax.getAvailableLogins(principal.phone);
	console.log(available_logins);
	
	const check_modal = makeOAuthCheckModal(available_logins.oauthDetails);
	appendModalToContainer(check_modal);
	
	check_modal.querySelector(".close_modal").onclick = () => removeModal(check_modal);
	
	const g_id_signin = check_modal.querySelector(".g_id_signin");
	if(g_id_signin != null) {
		const options = {
			"data-ux_mode": "popup",
			"data-client_id":"269750796517-rinre7c7s0b6al5t7u00oim5eh47edn0.apps.googleusercontent.com",
			"data-type": "icon",
			"data-auto_prompt": "false",
			"data-size": "small",
			"data-width": 200,
			"data-callback": "googleTokenHandler"
		}
		google.accounts.id.renderButton(g_id_signin, options);
	}
	
	const naver_login_button = check_modal.querySelector("#naverIdLogin");
	if(naver_login_button != null) {
		naver_id_login = new naver.LoginWithNaverId({
			clientId: "9_dnPO2aAshpkXkjaOfQ",
			callbackUrl: "http://localhost:8080/user/setting/redirect/naver/oauth",
			isPopup: true,
			loginButton: {color: "white", type: 3, height: "38"},
			callbackHandle: false
		});
		naver_id_login.init();
		console.log(naver_id_login);
		
		naver_login_button.onclick = () => {
			naver_login_button.children[0].click();
		}
	}
	
	const rows = check_modal.querySelectorAll(".row");
	rows.forEach(row => {
		const provider = row.className.replace("row ", "");
		console.log(provider);
		
		const disconnect_button = row.querySelector("button[class='disconnect']");
		
		if(disconnect_button != null) {
			disconnect_button.onclick = () => {
				if(ajax.deleteOAuthInfo(available_logins.oauthDetails.filter(e => e.provider == provider)[0].id)) {
					alert("간편 로그인 삭제 성공\n다시 로그인해주세요.");
					location.replace("/logout");
				} else {
					alert("간편 로그인 삭제 실패\n다시 시도해주세요.");
				}
			}
		}
	});
}

document.querySelector(".contents.password").onclick = () => {
	const password_regex = /^(?=.*)([A-Za-z]*\d*[$@$!%*?&]*){8,10}$/;
	let update_password_modal;
	
	if(principal.password == null) {
	 	update_password_modal = makeInsertPasswordModal();
		appendModalToContainer(update_password_modal);
		
		update_password_modal.querySelector(".close_modal").onclick = () => removeModal(update_password_modal);
		
		const inputs = update_password_modal.querySelectorAll("input");
		const new_password = update_password_modal.querySelector("#password");
		const password_confirm = update_password_modal.querySelector("#password_confirm");
		const submit_button = update_password_modal.querySelector(".submit_button");
		
		inputs.forEach(input => {
			input.oninput = () => {
				const result = password_regex.exec(input.value);
				if(result != null) {
					if(new_password.value == password_confirm.value) {
						submit_button.disabled = false;
						return;
					}
				}
				submit_button.disabled = true;
			}
		});
		
		submit_button.onclick = () => {
			submit_button.disabled = true;
			const data = {"new_password": new_password.value}
			const result = ajax.insertNewPassword(data);
			
			if(result) {
				alert("비밀번호 변경이 완료되었습니다.");
				removeModal(update_password_modal);
			} else {
				alert("비밀번호 설정에 실피했습니다.");
				submit_button.disabled = false;
			}
		}
	} else {
	 	update_password_modal = makeUpdatePasswordModal();
		appendModalToContainer(update_password_modal);
		
		update_password_modal.querySelector(".close_modal").onclick = () => removeModal(update_password_modal);
		
		const inputs = update_password_modal.querySelectorAll("input");
		const origin_password = update_password_modal.querySelector("#origin_password");
		const new_password = update_password_modal.querySelector("#password");
		const password_confirm = update_password_modal.querySelector("#password_confirm");
		const submit_button = update_password_modal.querySelector(".submit_button");
		
		inputs.forEach(input => {
			input.oninput = () => {
				if(input.id == "origin_password") return;
				const result = password_regex.exec(input.value);
				if(result != null) {
					if(new_password.value == password_confirm.value) {
						submit_button.disabled = false;
						return;
					}
				}
				submit_button.disabled = true;
			}
		});
		
		submit_button.onclick = () => {
			submit_button.disabled = true;
			const data = {"origin_password": origin_password.value,
										"new_password": new_password.value}
			const result = ajax.updatePassword(data);
			
			if(result) {
				alert("비밀번호 변경이 완료되었습니다.");
				removeModal(update_password_modal);
			} else {
				alert("이전 비밀번호가 일치하지 않습니다.");
				submit_button.disabled = false;
			}
		}
	}
	
}

user_delete.onclick = () => {
	const user_delete_tag = makeUserDeleteTag();
	replaceTagInMainContents(user_delete_tag);
	
	const delete_user_button = user_delete_tag.querySelector('#delete_user_button');
	user_delete_tag.querySelector('.input_wrapper > input').onclick = (event) => {
		if(event.target.checked) {
			delete_user_button.disabled = false;
		} else {
			delete_user_button.disabled = true;
		}
	}
	
	delete_user_button.onclick = () => {
		const delete_user_modal = makeDeleteUserModal();
		appendModalToContainer(delete_user_modal);
		
		const delete_opinion_selector = delete_user_modal.querySelector(".delete_opinion_selector");
        const opinion_list = delete_user_modal.querySelector('.opinion_list');

        delete_user_modal.querySelector(".close_modal").onclick = () => removeModal(delete_user_modal);
        delete_user_modal.querySelector(".cancel_button").onclick = () => removeModal(delete_user_modal);

        delete_opinion_selector.onclick = () => opinion_list.classList.toggle('hidden');

        file_types = opinion_list.querySelectorAll("span");
        file_types.forEach(e => e.onclick = () => {
            delete_opinion_selector.querySelector("span").innerText = e.innerText;
            opinion_list.classList.add("hidden");
        });
        
        const submit_button =  delete_user_modal.querySelector(".submit_button");
        submit_button.onclick = () => {
			if(ajax.deleteUserData(principal.id)) {
				location.reload();	
			}else {
				alert("탈퇴 실패");
			}
		}
	}
}

async function googleTokenHandler(response) {
	const credential = response.credential;
	console.log(response);
	console.log(credential);
	
	console.log(google.accounts.id);
	
	const base64Payload = response.credential.split(".")[1];
	const payload = JSON.parse(atob(base64Payload));
	const sub = payload.sub;
	
	const data = {
		"oauth_username": "google_" + sub,
		"provider": "google"
	}
		
	if(ajax.insertNewOauthDetail(data)) {
		location.reload();
	} else {
		alert("간편 로그인 연동에 실패했습니다.");
	}
}