
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
		const cardInput = addCardForm.querySelectorAll('.input_con');
		
		main_contents.innerHTML = '';
		main_contents.appendChild(addCardForm);
		const addProfileImgBtn = addCardForm.querySelector('.card_profile > button');
		const imgInput = addCardForm.querySelector('.profile_img_input');
		const imgTag = addCardForm.querySelector('.proflie_img');
		console.log(imgTag);
		addProfileImgBtn.onclick = () => imgInput.click();
		imgInput.onchange = (event) => {
			AddProfileImg(event,imgTag);
		}
		document.querySelector('.my_business_card').classList.add("hidden");
		modal.remove();
		addCardForm.querySelector('.cancel').onclick = () => {
		console.log('취소');
		location.reload();
		}
		addCardForm.querySelector('.save').onclick = () => {
			console.log('저장');
			
			$.ajax({
				type:'post',
				url:'/api/v1/card',
				data:{
					'name': cardInput[0].value,
					'position_name': cardInput[1].value,
					'department_name':cardInput[2].value,
					'company_name':cardInput[3].value,
					'email':cardInput[4].value,
					'phone':cardInput[5].value,
					'landline_phone':cardInput[6].value,
					'fax':cardInput[7].value,
					'address':cardInput[8].value,
					'sub_address':cardInput[9].value,
					},
				dataType:'json',
				success:function(card_id){
					console.log(card_id);
					if(card_id > 0){
						const cardDetail = cardDetailTag(getUserCard(card_id));
						addCardForm.remove();
						main_contents.innerHTML = '';
						main_contents.appendChild(cardDetail);
						document.querySelector('.my_business_card').classList.remove("hidden");
						const editBtn =cardDetail.querySelector('.edit');
						editBtn.onclick = () => {
							const editForm = makeEditTag();
							console.log("클릭");
							cardDetail.remove();
							main_contents.innerHTML='';
							main_contents.appendChild(editForm);
						}
						
						// 미분류명함 card_count select
						
					}else {
						alert('명함 추가 실패')
					}
				},
				error: function (xhr, stauts) {
				console.log(xhr);
				console.log(stauts);
				}
			})
		}
	}

}

function getUserCard(card_id){
	let card_data; 
	$.ajax({
		type:'get',
		url:'/api/v1/card/'+card_id,
		async: false,
		dataType:'json',
		success:function(data){
			console.log(data);
			card_data = data;

		},
		error: function (xhr, stauts) {
				console.log(xhr);
				console.log(stauts);
		}
	});
	return card_data;
}



function makeAddCardForm(){
	const div = document.createElement("div");
	div.className = "card_content";
	div.innerHTML = `
			<div class="card_header">
				<div class="card_title">명함 입력</div>
				<div class="add_card_btn">
					<button class="btn cancel">취소</button>
					<button class="btn save">저장</button>
				</div>
			</div>
			<div class="card_body">
				<div class="card_profile">
					<img class="proflie_img" src="/static/images/card_profile_user.png" alt="프로필 기본">
					<input type="file" name="file" class="profile_img_input" accept="image/*">
					<button type="button" class="btn save">프로필 사진 추가</button>
				</div>
				<div class="card_inputs">
					<div class="input_item top">
						<div class="item_box">
							<div>
								<div class="input_title">
									이름
								</div>
								<input type="text" class="input_con" name="name" placeholder="이름 입력">
							</div>
							<div>
								<div class="input_title">
									직책
								</div>
								<input type="text" class="input_con" name="position_name" placeholder="직책 입력">
							</div>
						</div>
						<div class="item_box">
							<div>
								<div class="input_title">
									부서
								</div>
								<input type="text" class="input_con" name="department_name" placeholder="부서명 입력">
							</div>
							<div>
								<div class="input_title">
									회사
								</div>
								<input type="text" class="input_con" name="company_name" placeholder="회사명 입력">
							</div>
						</div>
						
					</div>
					<div class="input_item">
						<div class="item_box">
							<div class="input_title">
								이메일
							</div>
							<input type="text" class="input_con" name="email" placeholder="이메일 주소 입력">
							<div class="input_title">
								휴대폰
							</div>
							<input type="text" class="input_con" name="phone" placeholder="휴대폰 번호 입력">
							<div class="input_title">
								유선전화
							</div>
							<input type="text" class="input_con" name="landline_phone" placeholder="유선전화 번호 입력">
							<div class="input_title">
								팩스
							</div>
							<input type="text" class="input_con" name="fax" placeholder="팩스 번호 입력">
						</div>
						<div class="item_box">
							<div class="input_title">
								주소
							</div>
							<input type="text" class="input_con" name="address" placeholder="주소 입력">
							<input type="text" class="input_con" name="sub_address" placeholder="상세 주소 입력">
							
						</div>
					</div>
				</div>
			</div>
	`;
	
	return div;	
}

function AddProfileImg(event, imgTag){
	const reader = new FileReader();
	console.log(imgTag);
	reader.onloadend = (e) => {
		imgTag.src = e.target.result;
	}
	reader.readAsDataURL(event.target.files[0]);
}

function cardDetailTag(card_data){
	const position_text = card_data.position_name != "" && card_data.department_name != "" ? card_data.position_name + " / " + card_data.department_name :
						  card_data.position_name == "" ? card_data.department_name : card_data.position_name;
	const div = document.createElement('div');
	div.className ='detail_box';
	div.innerHTML = `
		<div class= "detail_top">
			<div class="top_btn">
				<button class="t_btn edit">편집</button>
				<div class="t_btn_box">
				<button class="t_btn send">전달</button>
				<button class="t_btn send">
					<span class="btn_more"></span>
				</button>
				</div>
			</div>
		</div>
		<div class = "detail_body">
			<div class="detail_profile">
            <div class="profile_box">
                <span class="detail_profile_img">
                    <img src="/static/images/card_profile_user.png" alt="프로필 기본">
                </span>
                <div class="profile_info">
                    <div class="profile_name">${card_data.name}</div>
                    <div class="profile_position">${position_text}</div>
                    <div class="profile_company">${card_data.company_name}</div>
                </div>
            </div>
        </div>
        <div class="profile_detail">
            <div class="profile_detail_info">
                <div class="info_box">
                    <div class="info_title">이메일</div>
                    <div class="info_con_box">
 ${card_data.email == '' ? '<div class="info_no_value">이메일 없음</div>' : 
						   '<div class="info_con  link">' + card_data.email + '</div>'}  
                    </div>
                </div>
                <div class="info_box">
                    <div class="info_title">휴대폰</div>
                    <div class="info_con_box">
 ${card_data.phone == '' ? '<div class="info_no_value">휴대폰 번호 없음</div>' : 
						   '<div class="info_con">' + card_data.phone + '</div>'}                       
                    </div>
                </div>
                <div class="info_box">
                    <div class="info_title">유선전화</div>
                    <div class="info_con_box">
 ${card_data.landline_phone == '' ? '<div class="info_no_value">유선전화 번호 없음</div>' : 
						   '<div class="info_con">' + card_data.landline_phone + '</div>'}  
                    </div>
                </div>
                <div class="info_box">
                    <div class="info_title">팩스</div>
                    <div class="info_con_box">
 ${card_data.fax == '' ? '<div class="info_no_value">팩스 번호 없음</div>' : 
						   '<div class="info_con">' + card_data.fax + '</div>'}  
                    </div>
                </div>
                <div class="info_box">
                    <div class="info_title">그룹</div>
                    <div class="info_con_box">
                        <div class="info_con"></div>
                        <div class="info_no_value">미지정</div>
                    </div>
                </div>
            </div>
            <div class="profile_detail_info">
                <div class="info_box">
                    <div class="info_title">주소</div>
                    <div class="info_con_box">    
 ${card_data.address == '' ? '<div class="info_no_value">주소 없음</div>' : 
						   '<div class="info_con link">' + card_data.address +  card_data.sub_address +'</div>'}  
                	</div>
                </div>
                <div class="info_box">
                    <div class="info_title">등록일</div>
                    <div class="info_con_box">
                        <div class="info_con">${makeCardDate(card_data.create_date)}</div>
                    </div>
                </div>
        	</div>  
        </div>
    </div>
         <div class="profile_memo">
            <div class="info_title">메모</div>
                <div class="info_con_box">
                    <div class="info_con"></div>
                    <div class="info_no_value">메모없음</div>
                </div>
             </div>
        </div>
        <div class="add_memo">
            메모를 추가하세요 
            <button class="t_btn">+ 메모추가</button>
        </div>
	`;

	return div;
}

function makeEditTag(){
	const div = document.createElement('div');
	div.className="edit_con";
	div.innerHTML=`
	<div>sdfsdf</div>
	`;
	
	return div;
}



function makeCardDate(create_date){
	const date = new Date();
	date.getFullYear();
	const month = date.getMonth() + 1 ;
	const day = String(date.getDate());
	return `${date.getFullYear()}년 ${month}월 ${day}일 `;
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