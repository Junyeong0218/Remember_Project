const header_right = document.querySelector(".header_wrapper > .right");
let alert_open_flag = false;

console.log(principal);
if(principal == null) {
	header_right.innerHTML = `
		<a href="/auth/signin" class="signin">로그인</a>
        <a href="/auth/signup" class="signup">회원가입</a>
	`;
} else {
	header_right.innerHTML = `
		<div class="modal_wrapper">
			<button type="button" class="hover_my_menu_button">
				<img src="/static/images/community_header_my.svg">
			</button>
		</div>
		<div class="modal_wrapper">
			<button type="button" class="toggle_alert_modal_button">
				<img src="/static/images/community_header_alert.svg">
			</button>
		</div>
	`;
	
	const hover_my_menu_wrapper = header_right.querySelector(".modal_wrapper");
	const toggle_alert_modal_wrapper = header_right.querySelectorAll(".modal_wrapper")[1];
	
	toggle_alert_modal_wrapper.onclick = (event) => {
		if(event.target.className != "toggle_alert_modal_button") return;
		if(alert_open_flag) {
			alert_open_flag = false;
			toggle_alert_modal_wrapper.querySelector(".alert_modal").remove();
		} else {
			alert_open_flag = true;
			const modal = makeAlertModal();
			toggle_alert_modal_wrapper.appendChild(modal);
		}
	}
	
	hover_my_menu_wrapper.onmouseenter = (event) => {
		if(hover_my_menu_wrapper.querySelector(".my_menu") != null) return;
		const modal = makeMyMenuModal();
		hover_my_menu_wrapper.appendChild(modal);
		setTimeout(() => {
			modal.classList.add("active");
		}, 30);
		hover_my_menu_wrapper.querySelector(".my_menu").onmouseleave = (event) => {
			hover_my_menu_wrapper.querySelector(".my_menu").remove();
		}
	}
	
	hover_my_menu_wrapper.onmouseleave = (event) => {
		console.log(event);
		if(hover_my_menu_wrapper.querySelector(".my_menu") == null) return;
		if(event.toElement.className != "my_menu") {
			hover_my_menu_wrapper.querySelector(".my_menu").remove();
		}
	}
	if(category_id != 0 || article_id != 0) {
		const new_article_input = document.querySelector(".new_article_input");
		if(category_id == 0) {
			new_article_input.placeholder = principal.nickname + "님, 지금 회사에서 어떤 고민이 있으신가요?";
		} else if(category_id < 9) {
			new_article_input.placeholder = "회원님의 인사이트를 나눠주세요!";
		} else if(category_id > 48) {
			new_article_input.placeholder = principal.nickname + "님, 지금 하고 계신 생각을 회원님들과 나눠주세요!";
		} else {
			new_article_input.placeholder = principal.nickname + "님, 일 관련 고민이나 업계 이슈에 대한 생각을 들려주세요!";
		}
	}
}

function makeAlertModal() {
	const div = document.createElement("div");
	div.className = "alert_modal";
	div.innerHTML = `
		<div class="no_alerts">
			<img src="/static/images/community_modal_no_alerts.svg">
			<span class="text">알림이 없습니다.</span>
		</div>
	`;
	return div;
}

function makeMyMenuModal() {
	const div = document.createElement("div");
	div.className = "my_menu";
	div.innerHTML = `
		<a href="#" class="link">내 프로필</a>
		<a href="#" class="link">내 활동내역</a>
		<a href="#" class="link">내가 쓴 글 내역 공개</a>
		<a href="#" class="link">좋아요 순위</a>
		<a href="/logout" class="link">로그아웃</a>
	`;
	return div;
}