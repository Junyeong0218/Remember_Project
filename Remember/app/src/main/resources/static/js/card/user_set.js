const main_contents = document.querySelector(".main_contents");
const user_delete = document.querySelector(".contents.delete");
const setting_button = document.querySelector(".setting_list.set");

const email = document.querySelector('.item_description.email');
const phone = document.querySelector('.item_description.phone');

email.innerText = principal.email;
phone.innerText = principal.phone;

setting_button.onclick = () => location.reload();

document.querySelector(".contents.check_oauth").onclick = () => {
	const available_logins = ajax.getAvailableLogins(principal.phone);
	console.log(available_logins);
	available_logins.oauthDetails.pop();
	const check_modal = makeOAuthCheckModal(available_logins.oauthDetails);
	appendModalToContainer(check_modal);
	
	check_modal.querySelector(".close_modal").onclick = () => removeModal(check_modal);
	
	const rows = check_modal.querySelectorAll(".row");
	rows.forEach(row => {
		const provider = row.className.replace("row ", "");
		console.log(provider);
		row.querySelector("button[class*='connect']").onclick = (event) => {
			if(event.target.className.includes("connect")) {
				if(provider == "naver") {
					
				} else {
					// google
					row.querySelector(".g_id_signin").click();
				}
			} else {
				// disconnect
				if(deleteOauthInfo(available_logins.oauthDetails.filter(e => e.provider == provider)[0].id)) {
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

function handleCredentialResponse(data, data2, data3, data4, data5) {
	console.log(data);
	console.log(data2);
	console.log(data3);
	console.log(data4);
	console.log(data5);
}

function googleTokenHandler(data, data2, data3, data4, data5) {
	console.log(data);
	console.log(data2);
	console.log(data3);
	console.log(data4);
	console.log(data5);
}

/*function init() {
	gapi.load('auth2', function() {
		gapi.auth2.init();
		options = new gapi.auth2.SigninOptionsBuilder();
		options.setPrompt('select_account');
        // 추가는 Oauth 승인 권한 추가 후 띄어쓰기 기준으로 추가
		options.setScope('email openid https://www.googleapis.com/auth/user');
        // 인스턴스의 함수 호출 - element에 로그인 기능 추가
        // GgCustomLogin은 li태그안에 있는 ID, 위에 설정한 options와 아래 성공,실패시 실행하는 함수들
		gapi.auth2.getAuthInstance().attachClickHandler('google_oauth_login', options, onSignIn, onSignInFailure);
	});
}

function onSignIn(googleUser) {
	console.log(googleUser);
	const access_token = googleUser.getAuthResponse().access_token;
	$.ajax({
		url: 'https://www.googleapis.com/oauth2/v2/userinfo'
		, data: {personFields:'email', key:'AIzaSyCStHBJD-b3SUZ7UsarRtzMiX9hEpnT0ms', 'access_token': access_token}
		, method:'GET'
	})
	.done(function(e){
        //프로필을 가져온다.
		var profile = googleUser.getBasicProfile();
		console.log(profile);
	})
	.fail(function(e){
		console.log(e);
	});
}
function onSignInFailure(t){		
	console.log(t);
}*/