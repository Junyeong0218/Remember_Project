
const container = document.querySelector('.container');
const header_email = document.querySelector('.header_wrapper .email');
const mypageBtn = document.querySelectorAll('.mypage_button');
const alertBtn = document.querySelector('.alert_modal_button');
const addBtn = document.querySelector('.add_business_card');
let cardTabs = document.querySelector('.card_tabs');


console.log(principal);

header_email.innerText = principal.email;

cardTabs.onclick = addEvent;

function tabMenu(){
	cardTabs.innerHTML+= `
		<div class="tabs_menu">
                	<ul class="menu_box">
                		<li><a href="">입력 중인 명함 (0)</a></li>
                		<li><a href="">입력할 수 없는 명함 (0)</a></li>
                		<li><a href="">공지사항</a></li>
                		<li><a href="">도움말</a></li>
                		<li><a href="">1:1 문의</a></li>
                		<li><a href="">설정</a></li>
                		<li><a href="">로그아웃</a></li>
                	</ul>
                </div>
	`;
}
//cotainer -> 100% / 100vh / fixed top 0 / body overflow hidden

function alertMenu(){
	container.innerHTML +=`
		<div class="note_modal">
			<div class="note_modal_content ">
				<div class="note_content box">
					<button class="close_btn">
						<img src="/static/images/card_modal_close.png" alt="닫기버튼">
					</button>
					<div class="modal_header">
						알림
					</div>
					<div class="modal_body">
						<div class="note_list">
							<div class="note_empty">알림이 없습니다.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	
	const modal = document.querySelector('.note_modal');
	const closeBtn = modal.querySelector('.close_btn');
	closeBtn.onclick = () =>{
		container.removeChild(modal);
		cardTabs = document.querySelector('.card_tabs');
		cardTabs.onclick = addEvent;
		
	}
}

function addMenu(){
	container.innerHTML += `
		<div class="note_modal add">
			<div class="add_modal_content">
				<div class="add_header">
					<h1>명함등록</h1>
					<button class="add_close_btn">
						<img src="/static/images/card_modal_close.png" alt="닫기버튼">
					</button>
				</div>
				<div class="add_body">
					<div>
						<div class="add_list">
							<div class="list_box">
								<img src="/static/images/card_modal_img.png" alt="닫기버튼">
								<span class="list_title">명함 이미지 파일</span>
								<span class="list_con">내 컴퓨터에 저장된 
								이미지 파일을 업로드</span>
							</div>
							<div class="list_box">
								<img src="/static/images/card_modal_file.png" alt="닫기버튼">
								<span class="list_title">다른 서비스에서 명함 가져 오기</span>
								<span class="list_con">CSV,XLS 파일 등을 가져와 
								일괄 등록</span>
							</div>
							<div class="list_box">
								<img src="/static/images/card_modal_self.png" alt="닫기버튼">
								<span class="list_title">직접 입력</span>
								<span class="list_con">명함 이미지 없이 
								직접 입력하여 등록</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	
	const modal = document.querySelector('.note_modal');
	const addCloseBtn = modal.querySelector('.add_close_btn');
	addCloseBtn.onclick = () =>{
		modal.remove();
		cardTabs = document.querySelector('.card_tabs');
		cardTabs.onclick = addEvent;
	}
}

function addEvent(event) {
	if(event.target.className == 'mypage_button') {
		const account_menu = cardTabs.querySelector(".tabs_menu");
		if(account_menu == null) {
			tabMenu();
		} else {
			account_menu.remove();
		}
	} else if(event.target.className == 'alert_modal_button'){
		const note_modal = document.querySelector(".note_modal");
		console.log(note_modal);
		if(note_modal == null){
			alertMenu();
		}
	} else if(event.target.className == 'add_business_card'){
		const note_modal = document.querySelector(".note_modal");
		if(note_modal == null){
			addMenu();
		}
	}
}