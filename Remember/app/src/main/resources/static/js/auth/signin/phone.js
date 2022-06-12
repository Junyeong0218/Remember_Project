const send_code_button = document.querySelector(".send_code");
const submit_button = document.querySelector(".submit_button");

const select_box = document.querySelector("select");
const phone_input = document.querySelector(".phone");
const code_input = document.querySelector(".code");

send_code_button.onclick = () => {
	console.log(checkInput(phone_input));
	if(! checkInput(phone_input)) return;
	$.ajax({
		type: "post",
		url: "/api/v1/auth/signin/phone/certificate",
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
		url: "/api/v1/auth/signin/phone/certificate",
		data:{"phone":phone_input.value,
					"code":code_input.value},
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data == true) {
				const user_data = getUserData();
				console.log(user_data);
				/*if(user_data.user)*/
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
			console.log(data);
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