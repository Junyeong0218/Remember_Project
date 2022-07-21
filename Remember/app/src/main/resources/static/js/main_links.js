const main_msg = document.querySelector(".main_msg");
const start_button = document.querySelector(".main_msg > button");

const to_profile_registration = document.querySelector("#to_profile_registration"); 
const to_community = document.querySelector("#to_community"); 
const to_now = document.querySelector("#to_now"); 
const to_card = document.querySelector("#to_card");

to_profile_registration.onclick = () => location.href = "/career/profile/registration"; 
to_community.onclick = () => location.href = "/community"; 
to_now.onclick = () => location.href = "/now"; 
to_card.onclick = () => location.href = "/card";

start_button.onclick = () => {
	let modal = main_msg.querySelector(".modal");
	if(modal == null) {
		modal = makeDownloadLinksModal();
		main_msg.appendChild(modal);
	} else {
		modal.remove();
	}
}

function makeDownloadLinksModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="qr_image">
			<img src="/static/images/download_qr.png">
		</div>
		<div class="market_links">
			<a href="https://apps.apple.com/us/app/apple-store/id840553277">
				<img src="/static/images/apple_icon.png">
				<span>App Store 다운로드</span>
			</a>
			<a href="https://play.google.com/store/apps/details?id=kr.co.rememberapp&referrer=utm_source%3DOfficial_homepage%26utm_medium%3Dinstall_btn%26utm_campaign%3DWeb_landing">
				<img src="/static/images/googleplay_icon.png">
				<span>Google Play 다운로드</span>
			</a>
			<a href="#">
				<img src="/static/images/window_icon.png">
				<span>PC(windows) 다운로드</span>
			</a>
		</div>
	`;
	return div;
}
