const links = document.querySelector(".links");
const relate_service_modal = document.querySelector(".relate_service_modal");

let service_list_modal;

relate_service_modal.onmouseenter = () => {
	service_list_modal = location.pathname.includes("/card") ? makeShowRelateServiceListModalForCard() : 
																										makeShowRelateServiceListModalForCommunity();
	links.appendChild(service_list_modal);
	
	service_list_modal.onmouseleave = () => service_list_modal.remove();
}

relate_service_modal.onmouseleave = (event) => {
	if(event.toElement.className == "footer_modal_wrapper") return;
	
	service_list_modal.remove();
}

function makeShowRelateServiceListModalForCard() {
	const div = document.createElement("div");
	div.className = "footer_modal_wrapper";
	div.innerHTML = `
		<div class="footer_modal">
			<a href="/career/profile/registration">리멤버 커리어(프로필 등록)</a>
			<a href="/career">리멤버 커리어(기업용 서비스)</a>
			<a href="/community">리멤버 커뮤니티</a>
			<a href="/now">리멤버 나우</a>
			<a href="#">리멤버 서베이</a>
		</div>
	`;
	return div;
}

function makeShowRelateServiceListModalForCommunity() {
	const div = document.createElement("div");
	div.className = "footer_modal_wrapper";
	div.innerHTML = `
		<div class="footer_modal">
			<a href="/card">명함 관리</a>
			<a href="/career/profile/registration">리멤버 커리어(프로필 등록)</a>
			<a href="/career">리멤버 커리어(기업용 서비스)</a>
			<a href="/now">리멤버 나우</a>
			<a href="#">리서치 서비스</a>
		</div>
	`;
	return div;
}