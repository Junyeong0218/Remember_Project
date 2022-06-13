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
			toggle_alert_modal_wrapper.innerHTML += `
				<div class="alert_modal" style="transition: 500ms;">
					<div class="no_alerts">
						<img src="/static/images/community_modal_no_alerts.svg">
						<span class="text">알림이 없습니다.</span>
					</div>
				</div>
			`;
		}
	}
	
	hover_my_menu_wrapper.onmouseenter = (event) => {
		if(hover_my_menu_wrapper.querySelector(".my_menu") != null) return;
		hover_my_menu_wrapper.innerHTML += `
			<div class="my_menu">
				<a href="#" class="link">내 프로필</a>
				<a href="#" class="link">내 활동내역</a>
				<a href="#" class="link">내가 쓴 글 내역 공개</a>
				<a href="#" class="link">좋아요 순위</a>
				<a href="/logout" class="link">로그아웃</a>
			</div>
		`;
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
}