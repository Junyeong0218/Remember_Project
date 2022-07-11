const send_code_button = document.querySelector(".send_code");
const submit_button = document.querySelector(".submit_button");

const select_box = document.querySelector("select");
const phone_input = document.querySelector(".phone");
const code_input = document.querySelector(".code");

send_code_button.onclick = () => {
	console.log(checkInput(phone_input));
	const phone_regex = /([^0-9])/g;
	const has_only_number = ! phone_regex.test(phone_input.value);
	if(! checkInput(phone_input)) {
		alert("휴대폰 번호를 입력해주세요.");
		return;
	} else if(! has_only_number) {
		alert("- 를 빼고 숫자만 입력해주세요.");
		return;
	}
	$.ajax({
		type: "post",
		url: "/api/v1/auth/phone/certificate",
		data:{"phone":phone_input.value},
		dataType: "json",
		success: function (data) {
			console.log(data);
			select_box.classList.add("hidden")
			send_code_button.classList.remove("active");
			submit_button.classList.add("active");
			phone_input.classList.remove("active");
			code_input.classList.add("active");
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

submit_button.onclick = () => {
	if(! checkInput(code_input)) return;
	$.ajax({
		type: "get",
		url: "/api/v1/auth/phone/certificate",
		data:{"phone":phone_input.value,
					"code":code_input.value},
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data == true) {
				console.log("휴대폰 인증 완료");
				const form = document.createElement("form");
				form.className = "login";
				form.action = "/auth/signin";
				form.method = "post";
				const username = document.createElement("input");
				const password = document.createElement("input");
				username.type = "text";
				password.type = "text";
				username.name = "username";
				password.name = "password";
				username.value = phone_input.value;
				password.value = phone_input.value;
				form.appendChild(username);
				form.appendChild(password);
				
				document.body.appendChild(form);
				
				form.submit();
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}



function getUserData() {
	let user_data;
	$.ajax({
		type: "get",
		url: "/api/v1/auth/user",
		data: {"phone":phone_input.value},
		async: false,
		dataType: "json",
		success: function (data) {
			user_data = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return user_data;
}

function checkInput(input_tag) {
	return input_tag.value != null &&
				  input_tag.value != "" &&
				  typeof input_tag.value != "undefined";
}