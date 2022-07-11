const footer_wrapper = document.querySelector(".footer_wrapper");
const related_service_button = document.querySelector(".related_services");

related_service_button.onclick = () => {
	let modal = document.querySelector(".modal");
	if(modal == null) {
		modal = makeRelatedServicesModal();
		footer_wrapper.appendChild(modal);
	} else {
		modal.remove();
	} 
}

function makeRelatedServicesModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<a href="/card">리멤버 명함관리</a>
		<a href="/career/profile/registration">리멤버 커리어(프로필 등록)</a>
		<a href="/career">리멤버 커리어(기업용 서비스)</a>
		<a href="/community">리멤버 커뮤니티</a>
		<a href="#">리서치 서비스</a>
	`;
	return div;
}