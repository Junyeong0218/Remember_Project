const comment_form = document.querySelector(".comment_form");
const comment_contents = comment_form.querySelector(".comment_contents");
const comment_submit_button = comment_form.querySelector(".submit_comment");

if(principal == null) {
	comment_contents.readOnly = true;
	comment_form.onclick = () => {
		const modal = makeLoginModal();
		document.querySelector(".container").appendChild(modal);
		document.body.style = "overflow: hidden;";
		modal.querySelector(".to_signup_button").onclick = () => location.href = "/auth/signup";
		modal.querySelector(".close_modal").onclick = () => {
			modal.remove();
			document.body.style = "";
		}
	}
} else if(! hasProfile()) {
	comment_form.onclick = () => {
		const modal = makeSubmitProfileModal();
		document.querySelector(".container").appendChild(modal);
		document.body.style = "overflow: hidden;";
		modal.querySelector(".close_modal").onclick = () => {
			modal.remove();
			document.body.style = "";
		}
		modal.querySelectorAll("input").forEach(e => e.onblur = () => activeSubmitButton(modal));
		modal.querySelector(".submit_detail").onclick = () => submitProfile(modal);
	}
} else {
	const input_wrapper = comment_form.querySelector(".input_wrapper");
	input_wrapper.children[0].onclick = (event) => {
		if(event.target.checked == true) {
			comment_contents.placeholder = principal.nickname + "(으)로 댓글 달기...";
		} else {
			comment_contents.placeholder = principal.name + "(으)로 댓글 달기...";
		}
	}
	input_wrapper.children[1].onclick = () => input_wrapper.children[0].click();
	input_wrapper.children[0].click();
	comment_contents.oninput = (event) => {
		activeCommentSubmitButton(event, comment_submit_button);
	}
	comment_submit_button.onclick = () => {
		comment_submit_button.disabled = true;
		console.log(comment_contents.value);
		console.log(article_id);
		console.log(input_wrapper.children[0].checked);
		$.ajax({
			type: "post",
			url: "/api/v1/community/article/" + article_id + "/comment",
			data: {"contents":comment_contents.value,
						 "use_nickname":input_wrapper.children[0].checked},
			dataType: "json",
			success: function (data) {
				console.log(data);
				if(data == true) {
					location.reload();
				} else {
					alert("댓글 달기 실패");
				}
			},
			error: function (xhr, status) {
				console.log(xhr);
				console.log(status);
			}
		});
	}
}

function activeCommentSubmitButton(event, submit_button) {
	if(event.target.value != "") {
		submit_button.disabled = false;
	} else {
		submit_button.disabled = true;
	}
}

function makeLoginModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div. innerHTML = `
		<div class="window not_login">
			<div class="title">
				<span class="text">이 기능은 회원만 이용하실 수 있습니다.</span>
				<span class="text">회원으로 가입하시겠습니까?</span>
			</div>
			<span class="login_link">이미 회원이라면?&nbsp;<a href="/auth/signin">로그인 하기</a></span>
			<div class="buttons">
				<button type="button" class="close_modal">닫기</button>
				<button type="button" class="to_signup_button">회원가입</button>
			</div>
		</div>
	`;
	return div;
}

function makeSubmitProfileModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window profile_form">
			<div class="title">먼저 커뮤니티에서 사용할 프로필을 입력하세요</div>
			<form>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">이름</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="name" placeholder="예: 홍길동">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">닉네임</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="nickname" placeholder="한글, 영문 8자리 이하">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">회사</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="company_name" placeholder="예: 네이버">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">직무</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="department_name" placeholder="예: 자산운용">
				</div>
				<span class="text">선택한 직무와 관련없는 커뮤니티에서는 활동이 제한될 수 있습니다.</span>
			</form>
			<div class="buttons">
				<button type="button" class="close_modal">닫기</button>
				<button type="button" class="submit_detail" disabled>완료</button>
			</div>
		</div>
	`;
	return div;
}

function activeSubmitButton(modal) {
	if(checkProfileInputs(modal)) {
		modal.querySelector(".submit_detail").disabled = false;
	} else {
		modal.querySelector(".submit_detail").disabled = true;
	}
}

function submitProfile(modal) {
	console.log({"name":modal.querySelector("input[name='name']").value,
					 "nickname":modal.querySelector("input[name='nickname']").value,
					 "company_name":modal.querySelector("input[name='company_name']").value,
					 "department_name":modal.querySelector("input[name='department_name']").value});
	$.ajax({
		type: "post",
		url: "/api/v1/auth/detail",
		data: {"name":modal.querySelector("input[name='name']").value,
					 "nickname":modal.querySelector("input[name='nickname']").value,
					 "company_name":modal.querySelector("input[name='company_name']").value,
					 "department_name":modal.querySelector("input[name='department_name']").value},
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data == true) {
				location.reload();
			} else {
				alert("프로필 생성에 실패했습니다\n다시 시도해주세요.");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function hasProfile() {
	return principal.name != null &&
				  principal.nickname != null &&
				  principal.company_name != null &&
				  principal.department_name != null;
}