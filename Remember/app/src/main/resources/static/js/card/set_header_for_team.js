const container = document.querySelector('.container');
const header_email = document.querySelector('.header_wrapper .email');
const card_tabs = document.querySelector('.card_tabs');
const team_tab_button = document.querySelector("#team_tab_button");

console.log(principal);

header_email.innerText = principal.email;

card_tabs.onclick = executeMultipleEvents;

team_tab_button.onclick = (event) => {
	event.preventDefault();
	if(isTeamJoined()) {
		location.href = "/card/team";
	} else {
		location.href = "/card/team-empty";
	}
}

function isTeamJoined() {
	let flag = false;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/user/" + principal.id,
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function insertNewCard(data) {
	let card_id;
	$.ajax({
		type:'post',
		url:'/api/v1/card',
		async: false,
		data: data,
		dataType:'json',
		success:function(data){
			card_id = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return card_id;
}

function makeTabMenuTag() {
	const div = document.createElement("div");
	div.className = "tabs_menu";
	div.innerHTML = `
		<ul class="menu_box">
			<li><a href="">입력 중인 명함 (0)</a></li>
			<li><a href="">입력할 수 없는 명함 (0)</a></li>
			<li><a href="">공지사항</a></li>
			<li><a href="">도움말</a></li>
			<li><a href="">1:1 문의</a></li>
			<li><a href="">설정</a></li>
			<li><a href="/logout">로그아웃</a></li>
		</ul>
	`;
	return div;
}

function makeAlertMenuTag() {
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
	return div;
}

function makeAddMenuModal() {
	const div = document.createElement("div");
	div.className = "note_modal add";
	div.innerHTML = `
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
						<span class="list_con">내 컴퓨터에 저장된 이미지 파일을 업로드</span>
					</div>
					<div class="list_box">
						<img src="/static/images/card_modal_file.png" alt="닫기버튼">
						<span class="list_title">다른 서비스에서 명함 가져 오기</span>
						<span class="list_con">CSV,XLS 파일 등을 가져와 일괄 등록</span>
					</div>
					<div class="list_box">
						<img src="/static/images/card_modal_self.png" alt="닫기버튼">
						<span class="list_title">직접 입력</span>
						<span class="list_con">명함 이미지 없이 직접 입력하여 등록</span>
					</div>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeCardData(cardForm) {
	const cardInputs = cardForm.querySelectorAll('.input_con');
	const data = {};
	for(let i = 0; i < cardInputs.length; i++) {
		if(cardInputs[i].value != "" && cardInputs[i].value != null && typeof cardInputs[i].value != "undefined") {
			data[''+cardInputs[i].name] = cardInputs[i].value; 
		}
	}
	console.log(data);
	return data;
}

function makeAddCardFormTag() {
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

function executeMultipleEvents(event) {
	if(event.target.className == 'mypage_button') {
		let account_menu = card_tabs.querySelector(".tabs_menu");
		if(account_menu == null) {
			account_menu = makeTabMenuTag();
			card_tabs.appendChild(account_menu);
		} else {
			account_menu.remove();
		}
	} else if(event.target.className == 'alert_modal_button'){
		let note_modal = document.querySelector(".note_modal");
		if(note_modal == null){
			note_modal = makeAlertMenuTag();
			container.appendChild(note_modal);
			
			note_modal.querySelector('.close_btn').onclick = () => note_modal.remove();
		}
	} else if(event.target.className == 'add_business_card'){
		let note_modal = document.querySelector(".note_modal");
		if(note_modal == null){
			note_modal = makeAddMenuModal();
			container.appendChild(note_modal);
			
			note_modal.querySelector('.add_close_btn').onclick = () => note_modal.remove();
			
			const buttons = note_modal.querySelectorAll('.list_box');
			buttons[2].onclick = () => {
				const add_card_form_tag = makeAddCardFormTag();
				const main_contents = document.querySelector(".main_contents");
				
				main_contents.innerHTML = '';
				main_contents.appendChild(add_card_form_tag);
				
				document.querySelector('.my_business_card').classList.add("hidden");
				note_modal.remove();
				
				const add_profile_image_button = add_card_form_tag.querySelector('.card_profile > button');
				const image_input = add_card_form_tag.querySelector('.profile_img_input');
				const image_tag = add_card_form_tag.querySelector('.proflie_img');
				
				add_profile_image_button.onclick = () => image_input.click();
				image_input.onchange = (event) => {
					changeCardImage(event, image_tag);
				}
				
				add_card_form_tag.querySelector('.cancel').onclick = () => location.reload();
				
				add_card_form_tag.querySelector('.save').onclick = () => {
					const data = makeCardData(add_card_form_tag);
					if(data.name == null) {
						alert("이름은 필수로 입력하셔야합니다.");
					} else {
						const new_card_id = insertNewCard(data);
						if(new_card_id > 0) {
							const new_card_detail = loadCardDetail(new_card_id);
							const card_detail_tag = makeCardDetailTag(new_card_detail);
							add_card_form_tag.remove();
							
							main_contents.innerHTML = '';
							main_contents.appendChild(card_detail_tag);
							
							document.querySelector('.my_business_card').classList.remove("hidden");
							
							const right_buttons = card_detail_tag.querySelectorAll('.send');
			                const down_menu_list_wrapper = card_detail_tag.querySelector('.send_drop_menu');
			                
			                right_buttons[0].onclick = () => {
								makeSendCardModal(new_card_detail.card.name);
							}		
							right_buttons[1].onclick = () => down_menu_list_wrapper.classList.toggle("hidden");	
			
							const down_menu_list = down_menu_list_wrapper.querySelectorAll('.send_drop_menu li');
							down_menu_list[0].onclick = () => {
								makeReportModal();
							}
							down_menu_list[1].onclick = () => {
								// 팀 명함첩으로 복제
							}
							down_menu_list[2].onclick =() => {
								const delete_card_modal = makeDeleteCardModal(1);
								appendModalToContainer(delete_card_modal);
								
								const close_button = delete_card_modal.querySelector('.add_close_btn');
								close_button.onclick = () => removeModal(delete_card_modal);
								
								const delete_button = delete_card_modal.querySelector('.footer_btn button');
								delete_button.onclick = () => {
									if(deleteCard(new_card_detail.card.id)) {
										location.reload();
									} else {
										alert("명함 삭제 실패");
									}
								}
							}
							
							const joined_group_tag = makeJoinedGroupTag(new_card_detail.group_list);
							const info_boxes = card_detail_tag.querySelectorAll('.info_con_box');
							info_boxes[4].appendChild(joined_group_tag);
							
							const set_group_button = joined_group_tag.querySelector('.group_set_img');
							set_group_button.onclick = () => {
								const groups = getAllGroups();
								
								const move_group_modal = moveGroupModal(1, groups);
								appendModalToContainer(move_group_modal);
								
								const default_card_group_id = groups[groups.findIndex(e => e.group_name == "미분류 명함")].id;
								const complete_button = move_group_modal.querySelector('.complete_btn');
								
								complete_button.onclick = () => {
									const selected_group_id_list = new Array();
									const group_tag_list = move_group_modal.querySelectorAll(".group_list > ul > li > input");
									group_tag_list.forEach((e, index) => {
										if(e.checked) selected_group_id_list.push(groups[index].id);
									});
									
									const is_success = updateCardsBelongGroups(new_card_detail.card.id, selected_group_id_list, default_card_group_id);
									if(is_success) {
										location.reload();
									} else {
										alert("그룹 수정 실패");
									}
								}
							}
							
							const memo_wrapper = card_detail_tag.querySelector('.info_memo_value');
							for(let i = 0; i < new_card_detail.memo_list.length; i++) {
								const memo = makeAddMemoTag(new_card_detail.memo_list[i]);
								memo_wrapper.appendChild(memo);
								
								memo.querySelector('.show_edit_memo_modal').onclick = () => {
									const update_memo_modal = makeUpdateCardMemoModal(new_card_detail.memo_list[i]);
									const contents = update_memo_modal.querySelector(".memo_text");
									const submit_button = update_memo_modal.querySelector(".memo_btn.save");
									appendModalToContainer(update_memo_modal);
									
									update_memo_modal.querySelector('.close_btn').onclick = () => {
										removeModal(update_memo_modal);
									}
									
									update_memo_modal.querySelector('.memo_btn.cancel').onclick = () => {
										removeModal(update_memo_modal);
									}
									
									contents.oninput = (event) => {
										if(event.target.value == "") {
											submit_button.disabled = true;
										} else {
											submit_button.disabled = false;
										}
									}
									
									submit_button.onclick = () => {
										if(updateMemo(new_card_detail.memo_list[i].id, contents.value)) {
											location.reload();
										} else {
											alert("메모 수정 실패");
										}
										removeModal(update_memo_modal);
									}
								}
							}
							
							const edit_button = card_detail_tag.querySelector('.edit');
							edit_button.onclick = () => {
								const edit_card_form = makeEditCardFormTag(new_card_detail.card);
								card_detail_tag.remove();
								
								replaceTagInMainContents(edit_card_form);
								
								card_detail_tag.classList.add('hidden');
								
								const edit_cancel = edit_card_form.querySelector('.edit_cancel');
								edit_cancel.onclick = () => location.reload();
								
								let is_img_changed = false;
								const add_profile_image_button = edit_card_form.querySelector('.card_profile > button');
								const profile_image_input = edit_card_form.querySelector('.profile_img_input');
								const image_tag = edit_card_form.querySelector('.proflie_img');
								add_profile_image_button.onclick = () => profile_image_input.click();
								profile_image_input.onchange = (event) => {
									changeCardImage(event, image_tag);
									is_img_changed = true;
								}
								
								const edit_save = edit_card_form.querySelector('.edit_save');
								edit_save.onclick = () => {
									const card_inputs = edit_card_form.querySelectorAll('.input_con');
									if(card_inputs[0].value == "") {
										alert("이름은 필수로 입력해야합니다.");
										return;
									}
															
									const formdata = makeFormdataForUpdateCard(card_inputs);
									if(is_img_changed) formdata.append('profile_img',profile_image_input.files[0]);
									else new_card_detail.profile_img != null ? formdata.append('origin_profile_img', new_card_detail.card.profile_img) : '';
									
									if(updateCard(new_card_detail.card.id, formdata)) {
										location.reload();
									} else {
										alert("명함 수정 실패");
									}
								}
							}
							
							const add_memo_button = card_detail_tag.querySelector('.t_btn.memo');
							add_memo_button.onclick = () => {
								const memo_modal = makeAddMemoModal();
								const memo_input = memo_modal.querySelector(".memo_text");
								const save_memo_button = memo_modal.querySelector(".memo_btn.save");
								save_memo_button.onclick = () => {
									if(memo_input.value == "") {
										alert("내용을 입력해주세요");
									} else if(insertCardMemo(new_card_detail.card.id, memo_input.value)){
										location.reload();
									} else {
										alert("메모 저장 실패");
									}
								}
							}
						} else {
							alert('명함 추가 실패');
						}
					}
				}
			}
		}
	} 
}