
const container = document.querySelector('.container');
const header_email = document.querySelector('.header_wrapper .email');
const mypageBtn = document.querySelectorAll('.mypage_button');
const alertBtn = document.querySelector('.alert_modal_button');
const addBtn = document.querySelector('.add_business_card');
const cardTabs = document.querySelector('.card_tabs');


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
	const div = document.createElement("div");
	div.className = "note_modal";
	div.innerHTML = `
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
	`;
	container.appendChild(div);
	
	const modal = document.querySelector('.note_modal');
	const closeBtn = modal.querySelector('.close_btn');
	closeBtn.onclick = () =>{
		modal.remove();
	}
}

function addMenu(){
	const modal = document.createElement("div");
	modal.className = "note_modal add";
	modal.innerHTML = `
		<div class="add_modal_content">
			<div class="add_header">
				<h1>명함등록</h1>
				<button class="add_close_btn">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="add_body">
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
	`;
	container.appendChild(modal);
	
	const addCloseBtn = modal.querySelector('.add_close_btn');
	addCloseBtn.onclick = () =>{
		modal.remove();
	}
	const buttons = modal.querySelectorAll('.list_box');
	buttons[buttons.length-1].onclick = () => {
		const addCardForm = makeAddCardForm();
		const main_contents = document.querySelector(".main_contents");
		main_contents.innerHTML = '';
		main_contents.appendChild(addCardForm);
		document.querySelector('.my_business_card').classList.add("hidden");
		modal.remove();
		
	}
}

function makeAddCardForm(){
	const div = document.createElement("div");
	div.className = "";
	div.innerHTML = `
		<div class="card_content">
			<div class="card_header">
				<div class="card_title">명함 입력</div>
				<div class="add_card_btn">
					<button class="btn cancel">취소</button>
					<button class="btn save">저장</button>
				</div>
			</div>
			<div class="card_body">
				<div class="card_profile">
					<img src="/static/images/card_profile_user.png" alt="프로필 기본">
					<button class="btn save">프로필 사진 추가</button>
				</div>
				<div class="card_inputs">
					<div class="input_item top">
						<div class="item_box">
							<div>
								<div class="input_title">
									이름
								</div>
								<input type="text" class="input_con" name="username" placeholder="이름 입력">
							</div>
							<div>
								<div class="input_title">
									직책
								</div>
								<input type="text" class="input_con" name="username" placeholder="직책 입력">
							</div>
						</div>
						<div class="item_box">
							<div>
								<div class="input_title">
									부서
								</div>
								<input type="text" class="input_con" name="username" placeholder="부서명 입력">
							</div>
							<div>
								<div class="input_title">
									회사
								</div>
								<input type="text" class="input_con" name="username" placeholder="회사명 입력">
							</div>
						</div>
						
					</div>
					<div class="input_item">
						<div class="item_box">
							<div class="input_title">
								이메일
							</div>
							<input type="text" class="input_con" name="username" placeholder="이메일 주소 입력">
							<div class="input_title">
								휴대폰
							</div>
							<input type="text" class="input_con" name="username" placeholder="휴대폰 번호 입력">
							<div class="input_title">
								유선전화
							</div>
							<input type="text" class="input_con" name="username" placeholder="유선전화 번호 입력">
							<div class="input_title">
								팩스
							</div>
							<input type="text" class="input_con" name="username" placeholder="팩스 번호 입력">
						</div>
						<div class="item_box">
							<div class="input_title">
								주소
							</div>
							<input type="text" class="input_con" name="username" placeholder="주소 입력">
							<input type="text" class="input_con" name="username" placeholder="상세 주소 입력">
							
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	
	
	return div;
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