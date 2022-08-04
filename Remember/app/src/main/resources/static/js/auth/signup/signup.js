const terms_form = document.querySelector(".terms");
const phone_certificate_form = document.querySelector(".phone_certificate");
const select_type_form = document.querySelector(".select_type");
const email_form = document.querySelector(".email_form");

const terms_checkboxes = terms_form.querySelectorAll(".checkbox_wrapper");
const terms_next_button = terms_form.querySelector(".submit_button");

const phone_number_input = phone_certificate_form.querySelector(".phone");
const phone_certificate_next_button = phone_certificate_form.querySelector(".submit_button");

const select_type_email_button = select_type_form.querySelector(".email");

const email_input = email_form.querySelector("input[name='username']");
const password_input = email_form.querySelector("input[name='password']");
const signup_email_button = email_form.querySelector(".submit_button");

terms_checkboxes.forEach(e => {
	if(e.classList.contains("all")) {
		e.onclick = () => {
			e.children[0].checked = e.children[0].checked ? false : true; 
			const flag = e.children[0].checked;
			terms_checkboxes.forEach(e1 => {
				if(e1.classList.contains("all")) return;
				e1.children[0].checked = flag;
			});
			activeTermsNextButton();
		}
	} else {
		e.onclick = () => {
			e.children[0].checked = e.children[0].checked ? false : true;
			if(e.children[0].checked == false) {
				terms_checkboxes[0].children[0].checked = false;
			}
			activeTermsNextButton();
		}
	}
});

terms_next_button.onclick = toPhoneCertificateForm;
phone_certificate_next_button.onclick = checkAvailableLogins;

select_type_email_button.onclick = toEmailForm;
signup_email_button.onclick = () => {
	signup_email_button.disabled = true;
	$.ajax({
		type: "post",
		url: "/api/v1/auth/signup/email",
		data: {"email":email_input.value,
					 "password":password_input.value},
		dataType: "json",
		success: function (response) {
			if(response.code == 0) {
				if(response.data == true) {
					email_form.submit();
				} else {
					alert("가입 실패");
				}
			} else {
				alert(response.message);
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function checkAvailableLogins() {
	const phone_regex = /([^0-9])/g;
	const has_only_number = ! phone_regex.test(phone_number_input.value);
	if(phone_number_input == "") {
		alert("휴대폰 번호를 입력해주세요.");
		return;
	} else if(! has_only_number) {
		alert("- 를 빼고 숫자만 입력해주세요.");
		return;
	}
	$.ajax({
		type: "get",
		url: "/api/v1/auth/signup/account/list",
		data: {"age_flag":terms_checkboxes[1].children[0].checked,
					 "term_flag":terms_checkboxes[2].children[0].checked,
					 "privacy_flag":terms_checkboxes[3].children[0].checked,
					 "privacy_limit_flag":terms_checkboxes[4].children[0].checked,
					 "alert_flag":terms_checkboxes[5].children[0].checked,
					 "phone":phone_number_input.value},
		dataType: "json",
		success: function (response) {
			console.log(response);
			if(response.code == 0) {
				if(response.data == null) {
					// 가입된 계정 없는 경우
					showPhoneCertificateModal(phone_number_input.value);
				} else {
					// 가입된 계정이 있는 경우 modal창 출력
					if(response.data.user != null && response.data.oauthDetails.length == 2) {
						alert("더 이상 가입할 수 없습니다.\n로그인 페이지로 이동합니다.");
						location.replace("/auth/signin");
					} else {
						showAlreadyHaveAccountModal(phone_number_input.value);
					}
				}
			} else {
				alert(response.message);
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function showAlreadyHaveAccountModal(phone_number) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window">
            <span class="text black">이미 가입된 번호입니다.</span>
            <span class="text gray">+82 ${phone_number}로 가입된 계정이 이미 존재합니다.</span>
			<span class="text gray">새로운 계정으로 가입을 계속 진행하시겠습니까?</span>
            <div class="buttons">
                <button type="button" class="cancel">취소</button>
                <button type="button" class="apply">확인</button>
            </div>
        </div>
	`;
	document.querySelector(".container").appendChild(div);
	div.querySelector(".cancel").onclick = () => div.remove();
	div.querySelector(".apply").onclick = () => {
		div.remove();
		showPhoneCertificateModal(phone_number);
	}
}

function showPhoneCertificateModal(phone_number) {
	$.ajax({
		type: "post",
		url: "/api/v1/auth/phone/certificate",
		data: {"phone":phone_number},
		dataType: "json",
		success: function (response) {
			if(response.code == 0) {
				if(response.data == true) {
					const div = makePhoneCertificateModal();
					document.querySelector(".container").appendChild(div);
					const left_time_tag = div.querySelector(".left_time");
					const wrong_message = div.querySelector(".wrong_message");
					div.querySelector("input").onblur = (event) => {
						if(event.target.value == "") {
							wrong_message.innerText = "인증번호를 입력하세요.";
							event.target.classList.add("wrong");
						} else {
							wrong_message.innerText = "";
							event.target.classList.remove("wrong");
							if(event.target.value.length == 4) {
								div.querySelector(".apply").disabled = false;
							} else {
								div.querySelector(".apply").disabled = true;
							}
						}
					}
					let time = Date.now() + 1000 * 60 * 3;
					let left_time = new Date(Math.abs(time - Date.now()));
					let timer = setInterval(() => {
						left_time = new Date(Math.abs(time - Date.now()));
						left_time_tag.innerText = `${String(left_time.getMinutes()).padStart(2, "0")}:${String(left_time.getSeconds()).padStart(2, "0")}`;
						if(left_time > 1000 * 60 * 3) timer = null;
					}, 1000);
					div.querySelector(".close_button").onclick = () => div.remove();
					div.querySelector(".cancel").onclick = () => div.remove();
					div.querySelector(".resend_button").onclick = () => {
						div.remove();
						showPhoneCertificateModal(phone_number);
					}
					div.querySelector(".apply").onclick = () => {
						const result = sendAuthenticateCode(div.querySelector("input").value, phone_number);
						console.log("code isEqual : " + result);
						if(result == true) {
							div.remove();
							toSelectTypeForm();
						} else {
							alert("인증 실패");
						}
					}
				}
			} else {
				alert(response.message);
			}
		},
		error: function (xhr, stauts) {
			console.log(xhr);
			console.log(stauts);
		}
	});
}

function sendAuthenticateCode(code, phone_number) {
	let flag;
	$.ajax({
		type: "get",
		url: "/api/v1/auth/phone/certificate",
		data: {"code":code,
					 "phone":phone_number},
		async: false,
		dataType: "json",
		success: function (response) {
			if(response.code == 0) {
				flag = response.data;
			} else {
				alert(response.message);
			}
		},
		error: function (xhr, stauts) {
			console.log(xhr);
			console.log(stauts);
		}
	});
	return flag;
}

function resendPhoneCertificationCode(phone_number) {
	let flag;
	$.ajax({
		type: "post",
		url: "/api/v1/auth/phone/certificate",
		data: {"phone":phone_number},
		async: false,
		dataType: "json",
		success: function (response) {
			if(response.code == 0) {
				flag = response.data;
			} else {
				alert(response.message);
			}
		},
		error: function (xhr, stauts) {
			console.log(xhr);
			console.log(stauts);
		}
	});
	return flag;
}

function makePhoneCertificateModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window certificate">
			<div class="code_input_wrapper">
				<span class="text">SMS로 수신한 인증번호를 입력하세요</span>
				<button type="button" class="close_button">
					<img src="/static/images/signup_modal_closer.png">
				</button>
				<input type="text" class="code_input" name="code" placeholder="인증번호 4자리 입력">
				<span class="time_wrapper">
					<span class="left_time"></span>&nbsp;남음
				</span>
				<span class="wrong_message"></span>
			</div>
			<div class="buttons">
				<button type="button" class="resend_button">인증번호 재전송</button>
				<div class="button_wrapper">
					<button type="button" class="cancel">취소</button>
					<button type="button" class="apply" disabled>확인</button>
				</div>
			</div>
        </div>
	`;
	return div;
}

function checkFlags() {
	return terms_checkboxes[1].children[0].checked &&
				  terms_checkboxes[2].children[0].checked &&
				  terms_checkboxes[3].children[0].checked;
}

function activeTermsNextButton() {
	if(checkFlags()) {
		terms_next_button.disabled = false;
	} else {
		terms_next_button.disabled = true;
	}
}

function toPhoneCertificateForm() {
	terms_form.classList.remove("active");
	phone_certificate_form.classList.add("active");
}

function toSelectTypeForm() {
	phone_certificate_form.classList.remove("active");
	select_type_form.classList.add("active");
}

function toEmailForm() {
	select_type_form.classList.remove("active");
	email_form.classList.add("active");
}