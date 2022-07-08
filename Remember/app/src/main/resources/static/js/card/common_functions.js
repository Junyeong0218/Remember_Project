// ============================================================================================================================
// 																											util functions
// ============================================================================================================================

function appendModalToContainer(tag) {
	document.querySelector(".container").appendChild(tag);
	document.body.style = "overflow: hidden;";
}

function removeModal(tag) {
	tag.remove();
	document.body.style = "";
}

function appendTagToMainContents(tag) {
	main_contents.appendChild(tag);
}

function replaceTagInMainContents(tag) {
	main_contents.innerHTML = "";
	appendTagToMainContents(tag);
}

function makeCardSummaryCharacterText(name) {
	if(name == null) return "";
	const char = name.charCodeAt(0);
	switch(char) {
		case 48: return "0";
		case 49: return "1";
		case 50: return "2";
		case 51: return "3";
		case 52: return "4";
		case 53: return "5";
		case 54: return "6";
		case 55: return "7";
		case 56: return "8";
		case 57: return "9";
		case 97: case 65: return "A";
		case 98: case 66: return "B";
		case 99: case 67: return "C";
		case 100: case 68: return "D";
		case 101: case 69: return "E";
		case 102: case 70: return "F";
		case 103: case 71: return "G";
		case 104: case 72: return "H";
		case 105: case 73: return "I";
		case 106: case 74: return "J";
		case 107: case 75: return "K";
		case 108: case 76: return "L";
		case 109: case 77: return "M";
		case 110: case 78: return "N";
		case 111: case 79: return "O";
		case 112: case 80: return "P";
		case 113: case 81: return "Q";
		case 114: case 82: return "R";
		case 115: case 83: return "S";
		case 116: case 84: return "T";
		case 117: case 85: return "U";
		case 118: case 86: return "V";
		case 119: case 87: return "W";
		case 120: case 88: return "X";
		case 121: case 88: return "Y";
		case 122: case 88: return "Z";
	}
	if(char == 12593 || (char > 44031 && char < 45208)) return "ㄱ";
	if(char == 12596 || (char > 45207 && char < 45796)) return "ㄴ";
	if(char == 12599 || (char > 45795 && char < 46972)) return "ㄷ";
	if(char == 12601 || (char > 46971 && char < 47560)) return "ㄹ";
	if(char == 12609 || (char > 47559 && char < 48418)) return "ㅁ";
	if(char == 12610 || (char > 48417 && char < 49324)) return "ㅂ";
	if(char == 12613 || (char > 49323 && char < 50500)) return "ㅅ";
	if(char == 12615 || (char > 50499 && char < 51088)) return "ㅇ";
	if(char == 12616 || (char > 51087 && char < 52264)) return "ㅈ";
	if(char == 12618 || (char > 52263 && char < 52852)) return "ㅊ";
	if(char == 12619 || (char > 52851 && char < 53440)) return "ㅋ";
	if(char == 12620 || (char > 53439 && char < 54028)) return "ㅌ";
	if(char == 12621 || (char > 54027 && char < 54616)) return "ㅍ";
	if(char == 12622 || (char > 54615 && char < 55204)) return "ㅎ";
	return "";
}

function makeCardSummaryRegDateText(create_date) {
	const date = new Date(create_date);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${date.getFullYear()}-${month}-${day}`;
}

function makeCardDetailRegDateText(create_date) {
	const date = new Date(create_date);
	const month = date.getMonth() + 1;
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${date.getFullYear()}년 ${month}월 ${day}일`;
}

function makeAddressText(address, sub_address) {
	if(address != null && sub_address != null) {
		return `${address} ${sub_address}`;
	} else if(address != null && sub_address == null) {
		return address;
	} else {
		return null;
	}
}

function makePhoneNumberText(phone) {
	return `${phone.substring(0, 3)}-${phone.substring(3, 7)}-${phone.substring(7, 11)}`;
}

function makeFormDataForInsertCard(inputs, profile_image) {
	const formdata = new FormData();
	for(let i = 0; i < inputs.length; i++) {
		if(inputs[i].value != "") formdata.append(inputs[i].name, inputs[i].value);
	}
	if(profile_image != null) formdata.append("profile_image", profile_image);
	
	return formdata;
}

function makeFormDataForUpdateCard(origin_profile_img, inputs, front_card_image, back_card_image, profile_image) {
	const formdata = new FormData();
	for(let i = 0; i < inputs.length; i++) {
		if(inputs[i].value != "") formdata.append(inputs[i].name, inputs[i].value);
	}
	if(front_card_image != null) formdata.append("front_card_image", front_card_image);
	if(back_card_image != null) formdata.append("back_card_image", back_card_image);
	if(profile_image != null) formdata.append("profile_image", profile_image);
	if(origin_profile_img != null) formdata.append("profile_img", origin_profile_img);
	
	return formdata;
}

function makeEmailTextForModal(card_email_list) {
	let email_text = "";
	card_email_list.forEach(e => {
		if(e.email != null) email_text += e.email + ", ";
	});
	if(email_text.includes(",")) {
		email_text = email_text.substring(0, email_text.lastIndexOf(","));
	}
	return email_text;
}

function reloadCardDetail() {
	const cards = document.querySelector(".card_list_wrapper .card_list").children;
	for(let i = 0; i < cards.length; i++) {
		if(cards[i].className.includes("clicked")) {
			cards[i].click();
			break;
		}
	}
}

function makeDepartmentText(department_name, position_name) {
    return position_name != null && department_name != null ? position_name + " / " + department_name :
        position_name == null && department_name == null ? null :
            position_name == null ? department_name : position_name;
}


// ============================================================================================================================
// 																											make tag functions
// ============================================================================================================================

function makeCardGroupTag(group, default_flag) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "group";
	console.log(default_flag);
	button.innerHTML = `
		<span class="sub_group_arrow"></span>
		<span class="group_text">${group.group_name} (<span class="card_count">${group.card_count}</span>)</span>
${default_flag == false ? '<div class="down_menu"><button type="button" class="show_list_button"> <span class="arrow"></span> </button></div>' : ''}
	`;
	return button;
}

function makeGroupDownMenuList() {
	const div = document.createElement("div");
	div.className = "menu_list";
	div.innerHTML = `
		<button type="button" class="change_group_name">그룹명 변경</button>
		<button type="button" class="remove_group">그룹 삭제</button>
	`;
	return div;
}

function makeChangeGroupNameTag(group_name) {
	const div = document.createElement('div');
	div.className = "input_wrapper";
	div.innerHTML =`<input type="text" name="group_name" value = ${group_name}>`;
	
	return div;
}

function makeAddNewGroupTag() {
	const div = document.createElement("div");
	div.className = "input_wrapper";
	div.id = "add_new_group";
	div.innerHTML = `
		<input type="text" name="group_name" placeholder="그룹명 입력">
		<button type="button">
			<img src="/static/images/card_team_add_card_wrapper_closer.png">
		</button>
	`;
	return div;
}

function makeCardListTag(card_order_flag) {
	const div = document.createElement("div");
	div.className = "card_list_wrapper";
	div.innerHTML = `
		<div class="card_list_menu">
			<div class="left_menu">
				<div class="input_wrapper">
					<input type="checkbox" class="card_selector">
				</div>
				<div class="down_menu">
					<span class="arrow"></span>
				</div>
			</div>
			<div class="right_menu">
				<select class="card_ordering" name="order">
					<option value="reg_date" ${card_order_flag == 'reg_date' ? 'selected' : ''}>등록일순</option>
					<option value="name" ${card_order_flag == 'name' ? 'selected' : ''}>이름순</option>
					<option value="company_name" ${card_order_flag == 'company_name' ? 'selected' : ''}>회사명순</option>
				</select>
				<div class="buttons hidden">
					<button type="button" class="copy_to_team">팀 명함첩으로 복제</button>
					<button type="button" class="set_group">그룹설정</button>
					<button type="button" class="down_menu">
						<span class="arrow"></span>
					</button>
				</div>
			</div>
		</div>
		<div class="card_list">
			
		</div>
		<div class="pager_wrapper">
			<button type="button" class="prev_page">«</button>
			<div class="pager">
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
			</div>
			<button type="button" class="next_page">»</button>
		</div>
	`;
	return div;
}

function makeCardOrderStandardTag(order_standard) {
	const div = document.createElement("div");
	div.className = "upload_date";
	div.innerHTML = `${order_standard}`;
	return div;
}

function makeCardListMenuTag() {
	const div = document.createElement("div");
	div.className = "menu_list";
	div.innerHTML = `
		<span class="row" id="current_page_selector">현재 페이지 선택</span>
		<span class="row" id="whole_page_selector">전체 페이지 선택</span>
		<span class="row" id="select_cancel">선택 안함</span>
	`;
	return div;
}

function makeSelectMessage(page_check_flag, selected_card_count) {
	if(page_check_flag == "current") {
		return `이 페이지의 명함 ${selected_card_count}장이 모두 선택되었습니다.`;
	} else if(page_check_flag == "not_max") {
		return `명함 ${selected_card_count}장이 선택되었습니다.`;
	} else if(page_check_flag == "whole" || page_check_flag == "whole_after") {
		return `전체 페이지의 명함 ${selected_card_count}장이 모두 선택되었습니다.`;
	}
}

function makeCardSummaryTag(card) {
	const department_text = makeDepartmentText(card.department_name, card.position_name);
	const div = document.createElement("div");
	div.className = "card";
	div.innerHTML = `
		<div class="input_wrapper">
			<input type="checkbox" class="card_check">
		</div>
		<div class="card_info">
			<span class="name">${card.name}</span>
${location.pathname.includes("team") ? card.position_name == null ? '' : '<span class="position_name">' + card.position_name + '</span>' :
department_text == null ? '' : '<span class="position_name">' + department_text + '</span>'}
${card.company_name == null ? '' : '<span class="company_name">' + card.company_name + '</span>'}
		</div>
	`;
	return div;
}

function makeCardDetailTag(card_detail) {
	const reg_date = makeCardDetailRegDateText(card_detail.card.create_date);
	const address_text = makeAddressText(card_detail.card.address, card_detail.card.sub_address);
	const department_text = makeDepartmentText(card_detail.card.department_name, card_detail.card.position_name);
	const div = document.createElement("div");
	div.className = "card_detail";
	div.innerHTML = `
		<div class="detail_header">
${location.pathname.includes("team") ? '<span class="reg_user_name">등록자 : ' + card_detail.reg_user_nickname + '</span>' : '<span></span>'}
			<div class="detail_menu">
				<button type="button" class="edit_card">편집</button>
				<div class="right">
					<button type="button" class="pass_card">전달</button>
					<div class="down_menu">
						<span class="arrow"></span>
					</div>
				</div>
			</div>
		</div>
		<div class="card_info">
			<div class="card_summary">
				<div class="profile_image">
					<img src="${card_detail.card.profile_img == null ? '/static/images/default_profile_image.png' : '/image/profile_images/' + card_detail.card.profile_img}">
				</div>
				<div class="texts">
					<span class="name">${card_detail.card.name}</span>
${department_text == null ? '' : '<span class="department_text">' + department_text + '</span>'}
${card_detail.card.company_name == null ? '' : '<span class="company_name">' + card_detail.card.company_name + '</span>'}
				</div>
${card_detail.card_images.length != 0 ? '<div class="card_image"><img src="/image/card_images/' + card_detail.card_images[0].card_image + '"></div>' : ''}
			</div>
			<div class="card_description">
				<div class="left">
					<div class="row">
						<span class="title">이메일</span>
${card_detail.card.email == null ? '<span class="description blank">이메일 없음</span>' : 
																'<span class="description">' + card_detail.card.email + '</span>'}
						
					</div>
					<div class="row">
						<span class="title">휴대폰</span>
${card_detail.card.phone == null ? '<span class="description blank">휴대폰 번호 없음</span>' : 
																  '<span class="description">' + card_detail.card.phone + '</span>'}
					</div>
					<div class="row">
						<span class="title">유선전화</span>
${card_detail.card.landline_phone == null ? '<span class="description blank">유선전화 번호 없음</span>' : 
																				  '<span class="description">' + card_detail.card.landline_phone + '</span>'}
					</div>
					<div class="row">
						<span class="title">팩스</span>
${card_detail.card.fax == null ? '<span class="description blank">팩스번호 없음</span>' : 
															 '<span class="description">' + card_detail.card.fax + '</span>'}
					</div>
${! location.pathname.includes("team") ? '<div class="row"><span class="title">그룹</span></div>' : ''}
				</div>
				<div class="right">
					<div class="row">
						<span class="title">등록일</span>
						<span class="description">${reg_date}</span>
					</div>
					<div class="row">
						<span class="title">주소</span>
${address_text == null ? '<span class="description blank">주소 없음</span>' : 
											   '<span class="description">' + address_text + '</span>'}
					</div>
				</div>
			</div>
${location.pathname.includes("team") ? '<div class="group_info"><span class="title">그룹</span></div>' : ''}
			<div class="memo_list_wrapper">
				<span class="title">메모</span>
${card_detail.memo_list.length == 0 ? '<span class="text no_content">메모 없음</span>' : '<div class="memo_list"></div>'}
			</div>
		</div>
		<div class="memo_input">
			<span class="text no_content">메모를 추가하세요</span>
			<span class="add_memo_button">+ 메모 추가</span>
		</div>
	`;
	return div;
}

function makeCardDetailMenuTag() {
	const div = document.createElement("div");
	div.className = "detail_menu";
	div.innerHTML = `
		<button type="button" class="row" id="report_typo">입력오타 신고</button>
${location.pathname.includes("team") ? '<button type="button" class="row" id="save_to_personal">내 명함첩에 저장</button>' :
																			   '<button type="button" class="row" id="save_to_team">팀 명함첩에 저장</button>'}
		<button type="button" class="row" id="delete_card">명함 삭제</button>
	`;
	return div;
}

function makeMemoTag(memo) {
	const div = document.createElement("div");
	div.className = "memo";
	div.innerHTML = `
		<div class="title">
			<span class="text">${memo.create_date.replace('T', ' ')}${location.pathname.includes("team") ? ' by ' + memo.nickname : ''}</span>
			<button type="button" class="show_edit_memo_modal">
				<img src="/static/images/card_team_edit_memo.png">
			</button>
			<button type="button" class="show_remove_memo_modal">
				<img src="/static/images/card_team_remove_memo.png">
			</button>
		</div>
		<div class="contents">${memo.contents}</div>
	`;
	return div;
}

function makeEditCardFormTag(card_detail) {
	const div = document.createElement("div");
	div.className = "edit_card_form";
	div.innerHTML = `
		<div class="title">
			<span class="text">명함 편집</span>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">저장</button>
			</div>
		</div>
		<div class="card_image_wrapper">
			<div class="input_wrapper">
				<span class="plus">+</span>
				<span class="text">명함 이미지 추가</span>
				<input type="file" name="file">
			</div>
		</div>
		<div class="card_data">
			<div class="profile_image">
				<img src="${card_detail.card.profile_img == null ? '/static/images/default_profile_image.png' : '/image/profile_images/' + card_detail.card.profile_img}">
				<button type="button" class="set_profile_image">프로필 사진 설정</button>
				<input type="file" name="profile_image" accept="image/*">
			</div>
			<div class="details">
				<div class="top">
					<div class="column">
						<div class="row">
							<span class="title">이름</span>
							<input type="text" name="name" value="${card_detail.card.name}" placeholder="이름 입력">
						</div>
						<div class="row">
							<span class="title">직책</span>
							<input type="text" name="position_name" value="${card_detail.card.position_name == null ? '' : card_detail.card.position_name}" placeholder="직책 입력">
						</div>
					</div>
					<div class="column">
						<div class="row">
							<span class="title">부서</span>
							<input type="text" name="department_name" value="${card_detail.card.department_name == null ? '' : card_detail.card.department_name}" placeholder="부서명 입력">
						</div>
						<div class="row">
							<span class="title">회사</span>
							<input type="text" name="company_name" value="${card_detail.card.company_name == null ? '' : card_detail.card.company_name}" placeholder="회사명 입력">
						</div>
					</div>
				</div>
				<div class="bottom">
					<div class="column">
						<div class="row">
							<span class="title">이메일</span>
							<input type="text" name="email" value="${card_detail.card.email == null ? '' : card_detail.card.email}" placeholder="이메일 주소 입력">
						</div>
						<div class="row">
							<span class="title">휴대폰</span>
							<input type="text" name="phone" value="${card_detail.card.phone == null ? '' : card_detail.card.phone}" placeholder="휴대폰 번호 입력">
						</div>
						<div class="row">
							<span class="title">유선전화</span>
							<input type="text" name="landline_phone" value="${card_detail.card.landline_phone == null ? '' : card_detail.card.landline_phone}" placeholder="유선전화 번호 입력">
						</div>
						<div class="row">
							<span class="title">팩스</span>
							<input type="text" name="fax" value="${card_detail.card.fax == null ? '' : card_detail.card.fax}" placeholder="팩스 번호 입력">
						</div>
					</div>
					<div class="column">
						<div class="row">
							<span class="title">주소</span>
							<input type="text" name="address" value="${card_detail.card.address == null ? '' : card_detail.card.address}" placeholder="주소 입력">
							<input type="text" name="sub_address" value="${card_detail.card.sub_address == null ? '' : card_detail.card.sub_address}" placeholder="상세 주소 입력">
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeCardImageTag(img_src, is_front, is_origin) {
	const div = document.createElement("div");
	div.className = is_front ? "front" : "back";
	div.innerHTML = `
		<img src="${is_origin ? '/image/card_images/' + img_src : img_src}">
		<div class="buttons">
			<button type="button" class="edit_image">
				<img src="/static/images/card_team_edit_card_image_button.png">
				<span>이미지 편집</span>
			</button>
			<button type="button" class="change_image">
				<img src="/static/images/card_team_replace_card_image_button.png">
				<span>이미지 변경</span>
			</button>
		</div>
	`;
	return div;
}

function makeAddCardFormTag() {
	const div = document.createElement("div");
	div.className = "edit_card_form";
	div.innerHTML = `
		<div class="title">
			<span class="text">명함 입력</span>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">저장</button>
			</div>
		</div>
		<div class="card_data">
			<div class="profile_image">
				<img src="/static/images/default_profile_image.png">
				<button type="button" class="set_profile_image">프로필 사진 설정</button>
				<input type="file" name="profile_image" accept="image/*">
			</div>
			<div class="details">
				<div class="top">
					<div class="column">
						<div class="row">
							<span class="title">이름</span>
							<input type="text" name="name" placeholder="이름 입력">
						</div>
						<div class="row">
							<span class="title">직책</span>
							<input type="text" name="position_name" placeholder="직책 입력">
						</div>
					</div>
					<div class="column">
						<div class="row">
							<span class="title">부서</span>
							<input type="text" name="department_name" placeholder="부서명 입력">
						</div>
						<div class="row">
							<span class="title">회사</span>
							<input type="text" name="company_name" placeholder="회사명 입력">
						</div>
					</div>
				</div>
				<div class="bottom">
					<div class="column">
						<div class="row">
							<span class="title">이메일</span>
							<input type="text" name="email" placeholder="이메일 주소 입력">
						</div>
						<div class="row">
							<span class="title">휴대폰</span>
							<input type="text" name="phone" placeholder="휴대폰 번호 입력">
						</div>
						<div class="row">
							<span class="title">유선전화</span>
							<input type="text" name="landline_phone" placeholder="유선전화 번호 입력">
						</div>
						<div class="row">
							<span class="title">팩스</span>
							<input type="text" name="fax" placeholder="팩스 번호 입력">
						</div>
					</div>
					<div class="column">
						<div class="row">
							<span class="title">주소</span>
							<input type="text" name="address" placeholder="주소 입력">
							<input type="text" name="sub_address" placeholder="상세 주소 입력">
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	return div;
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

// ============================================================================================================================
// 																											make modal functions
// ============================================================================================================================

function makeChangeGroupModal(selected_card_count) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_group">
			<div class="title">
				<span>그룹 설정</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="group_wrapper">
				<span>선택한 <span class="card_count">${selected_card_count}</span>개의 명함을 아래의 그룹에 추가합니다.</span>
				<div class="group_list">
					
					<button type="button" class="add_new_group">+ 그룹 추가하기</button>
					<div class="insert_group_form hidden">
						<input type="text" name="group_name" placeholder="그룹명 입력">
						<button type="button" class="confirm">확인</button>
						<button type="button" class="cancel">취소</button>
					</div>
				</div>
			</div>
			<div class="buttons">
				<button type="button" class="set_group_button">완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeGroupTagForModal(group_belong_flag) {
	const div = document.createElement("div");
	div.className = "group";
	div.innerHTML = `
		<input type="checkbox" class="group_selector" name="is_checked" ${group_belong_flag.belong_flag ? 'checked' : ''}>
		<span>${group_belong_flag.group_name}</span>
	`;
	return div;
}

function makeGroupTagForMultipleModal(belong_flag, group_name) {
	const div = document.createElement("div");
	div.className = "group";
	div.innerHTML = `
		<input type="checkbox" class="group_selector" name="is_checked" ${belong_flag ? 'checked' : ''}>
		<span>${group_name}</span>
	`;
	return div;
}

function makeDeleteGroupModal(group_name) {
	const div = document.createElement('div');
	div.className ="modal";
	div.innerHTML = `
	<div class="window delete_group">
		<div class="title">
			<span>그룹 삭제</span>
			<button type="button" class="close_modal">
				<img src="/static/images/card_modal_close.png" alt="닫기버튼">
			</button>
		</div>
		<div class="description">
			<span>${group_name}그룹을 삭제하시겠습니까?</span>
			<span>그룹을 삭제해도 명함은 삭제되지 않습니다.</span>
		</div>
		<div class="buttons">
			<button type="button" class="delete_group_button">삭제</button>
		</div>
	</div>
	`;
	return div;
}

function makeAddCardMemoModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_memo">
			<div class="title">
				<span>메모 추가</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<textarea name="contents" placeholder="내용을 입력하세요" rows="4"></textarea>
				<div class="buttons">
					<button type="button" class="cancel_button">취소</button>
					<button type="button" class="submit_button" disabled>추가</button>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeUpdateCardMemoModal(memo) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_memo">
			<div class="title">
				<span>메모 수정</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<span>${memo.update_date.replace("T", " ")}에 마지막 수정</span>
${location.pathname.includes("team") ? '<span>작성자 : ' + memo.nickname + '</span>' : ''}
				<textarea name="contents" placeholder="내용을 입력하세요" rows="4">${memo.contents}</textarea>
				<div class="buttons">
					<button type="button" class="cancel_button">취소</button>
					<button type="button" class="submit_button" disabled>수정</button>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeSendCardModal(card_name) {
	const div = document.createElement('div');
	div.className="modal";
	div.innerHTML = `
	<div class="window send_card">
		<div class="title">
			<span>명함 전달</span>
			<button type="button" class="close_modal">
				<img src="/static/images/card_modal_close.png" alt="닫기버튼">
			</button>
		</div>
		<div class="description">
			<span>아래의 내용을 복사(Ctrl+C)하여 다른 사람에게 전달해주세요.</span>
			<textarea class="send_card_area" rows="4" readonly>
				${card_name}의명함 정보입니다.
				
				이름: ${card_name}
				
				리멤버는 대한민국 300만 직장인이 사용하는 직장인 필수앱입니다.
				아래 링크를 눌러 리멤버 앱에 명함을 저장하시면 언제 어디서든 손쉽게 찾아보
				실 수 있습니다.
				https://app.rmbr.in/Rf9Kx27wfrb
			</textarea>
		</div>
		<div class="buttons">
			<button class="close_modal">닫기</button>
		</div>
	</div>
	`;
	return div;
}

function makeSendEmailModal(email_text) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window send_email">
			<div class="title">
				<span>단체 메일 보내기</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="email_info">
				<span>아래의 이메일 주소를 복사(Ctrl+C)하여 이용하시는 이메일 서비스의 "받는 사람" 항목에 붙여넣기(Ctrl+V) 하세요.</span>
				<input type="text" name="emails" value="${email_text}" readonly>
			</div>
			<div class="buttons">
				<button type="button" class="close_button">닫기</button>
			</div>
		</div>
	`;
	return div;
}

function makeDeleteCardConfirmModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window confirm_delete_card">
			<div class="title">
				<span>명함 삭제</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="texts">
				<span>명함을 삭제하시겠습니까?</span>
${location.pathname.includes("team") ? '<span>삭제한 명함은 30일 간 휴지통에 보관되며, 그 이후에는</span><span>완전히 삭제됩니다.</span>' :
																				'<span>삭제한 후에는 복구가 되지 않습니다.</span>'}
			</div>
			<div class="buttons">
				<button type="button" class="confirm">삭제</button>
			</div>
		</div>
	`;
	return div;
}

function makeDeleteCardsConfirmModal(selected_card_count) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window confirm_delete_card">
			<div class="title">
				<span>명함 삭제</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="texts">
				<span>선택한 <span class="selected_card_count">${selected_card_count}</span>개의 명함을 삭제하시겠습니까?</span>
${location.pathname.includes("team") ? '<span>삭제한 명함은 30일 간 휴지통에 보관되며, 그 이후에는</span><span>완전히 삭제됩니다.</span>' : 
																				'<span>삭제한 후에는 복구가 되지 않습니다.</span>'}
			</div>
			<div class="buttons">
				<button type="button" class="confirm">삭제</button>
			</div>
		</div>
	`;
	return div;
}

function makeDeleteConfirmCardMemoModal(memo) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_memo">
			<div class="title">
				<span>메모 삭제</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<h4>메모를 삭제하시겠습니까?</h4>
				<div class="texts">
					<span>${memo.update_date.replace("T", " ")}에 마지막 수정</span>
${location.pathname.includes("team") ? '<span>작성자 : ' + memo.nickname + '</span>' : ''}
				</div>
				<textarea class="disabled" name="contents" placeholder="내용을 입력하세요" rows="4" readonly>${memo.contents}</textarea>
				<div class="buttons">
					<button type="button" class="remove_button">삭제</button>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeShowAllCardImageModal(card_images) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window card_images">
			<div class="title">
				<span>명함 이미지</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="card_image_wrapper">
				<div class="front">
					<img src="/image/card_images/${card_images[0].card_image}">
				</div>
${card_images.length > 1 ? '<div class="back"><img src="/image/card_images/' + card_images[1].card_image + '">"</div>' : ''}
			</div>
		</div>
	`;
	return div;
}

function makeReportModal() {
	const div = document.createElement('div');
	div.className = "modal";
	div.innerHTML =`
	<div class="window report_card">
		<div class="title">
			<span>입력오타 신고</span>
			<button class="close_modal">
				<img src="/static/images/card_modal_close.png" alt="닫기버튼">
			</button>
		</div>
		<div class="description">
			<div class="texts">
				<span>입력된 정보 중 오타가 발견된 항목을 선택해주세요.</span>
				<span>입력 내용을 다시 검토하여 수정해 드립니다.</span>
			</div>
			<div class="item_list">
				<div class="input_wrapper">
					<input type="checkbox">
					<span>이름</span>
				</div>
				<div class="input_wrapper">
					<input type="checkbox">
					<span>휴대폰 번호</span>
				</div>
				<div class="input_wrapper">
					<input type="checkbox">
					<span>이메일</span>
				</div>
				<div class="input_wrapper">
					<input type="checkbox">
					<span>기타 나머지 정보</span>
				</div>
			</div>
		</div>
		<div class="buttons">
			<button class="send_button" disabled>전송</button>
		</div>
	</div>
	`;
	return div;
}

function makeAddMenuModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window add_menu">
			<div class="title">
				<span>명함등록</span>
				<button class="close_modal">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="add_methods">
				<div class="method">
					<img src="/static/images/card_modal_img.png">
					<span class="title">명함 이미지 파일</span>
					<span class="text">내 컴퓨터에 저장된\n이미지 파일을 업로드</span>
				</div>
				<div class="method">
					<img src="/static/images/card_modal_file.png">
					<span class="title">다른 서비스에서 명함 가져 오기</span>
					<span class="text">CSV,XLS 파일 등을 가져와\n일괄 등록</span>
				</div>
				<div class="method">
					<img src="/static/images/card_modal_self.png">
					<span class="title">직접 입력</span>
					<span class="text">명함 이미지 없이\n직접 입력하여 등록</span>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeAlertModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window alert">
			<div class="title">
				<span>알림</span>
				<button class="close_modal">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="alert_list">
				<div class="no_alerts">알림이 없습니다.</div>
			</div>
		</div>
	`;
	return div;
}