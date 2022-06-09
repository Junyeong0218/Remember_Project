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
phone_certificate_next_button.onclick = () => {
	console.log({"age_flag":terms_checkboxes[1].children[0].checked,
					 "term_flag":terms_checkboxes[2].children[0].checked,
					 "privacy_flag":terms_checkboxes[3].children[0].checked,
					 "privacy_limit_flag":terms_checkboxes[4].children[0].checked,
					 "alert_flag":terms_checkboxes[5].children[0].checked,
					 "phone":phone_number_input.value});
	$.ajax({
		type: "post",
		url: "/api/v1/auth/signup/phone",
		data: {"age_flag":terms_checkboxes[1].children[0].checked,
					 "term_flag":terms_checkboxes[2].children[0].checked,
					 "privacy_flag":terms_checkboxes[3].children[0].checked,
					 "privacy_limit_flag":terms_checkboxes[4].children[0].checked,
					 "alert_flag":terms_checkboxes[5].children[0].checked,
					 "phone":phone_number_input.value},
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data == true) {
				toSelectTypeForm();
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

select_type_email_button.onclick = toEmailForm;
signup_email_button.onclick = () => {
	signup_email_button.disabled = true;
	$.ajax({
		type: "post",
		url: "/api/v1/auth/signup/email",
		data: {"email":email_input.value,
					 "password":password_input.value},
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data == true) {
				email_form.submit();
			} else {
				alert("가입 실패");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
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