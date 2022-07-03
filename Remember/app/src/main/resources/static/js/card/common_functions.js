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

function makeFormDataForUpdateCard(inputs, front_card_image, back_card_image, profile_image) {
	const formdata = new FormData();
	for(let i = 0; i < inputs.length; i++) {
		if(inputs[i].value != "") formdata.append(inputs[i].name, inputs[i].value);
	}
	if(front_card_image != null) formdata.append("front_card_image", front_card_image);
	if(back_card_image != null) formdata.append("back_card_image", back_card_image);
	if(profile_image != null) formdata.append("profile_image", profile_image);
	if(selected_card_detail.card.profile_img != null) formdata.append("profile_img", selected_card_detail.card.profile_img);
	
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

// ============================================================================================================================
// 																											make tag functions
// ============================================================================================================================

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

function makeCardSummaryTag(card) {
	const div = document.createElement("div");
	div.className = "card";
	div.innerHTML = `
		<div class="input_wrapper">
			<input type="checkbox" class="card_check">
		</div>
		<div class="card_info">
			<span class="name">${card.name}</span>
${card.position_name == null ? '' : '<span class="position_name">' + card.position_name + '</span>'}
${card.company_name == null ? '' : '<span class="company_name">' + card.company_name + '</span>'}
		</div>
	`;
	return div;
}

function makeCardDetailTag(card_detail) {
	const reg_date = makeCardDetailRegDateText(card_detail.card.create_date);
	const address_text = makeAddressText(card_detail.card.address, card_detail.card.sub_address);
	const div = document.createElement("div");
	div.className = "card_detail";
	div.innerHTML = `
		<div class="detail_header">
			<span class="reg_user_name">등록자 : ${card_detail.card.reg_user_nickname}</span>
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
${card_detail.card.department_name == null ? '' : '<span class="department_text">' + card_detail.card.department_name + '</span>'}
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
			<div class="group_info">
				<span class="title">그룹</span>
			</div>
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
		<button type="button" class="row" id="save_to_personal">내 명함첩에 저장</button>
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

// ============================================================================================================================
// 																											make modal functions
// ============================================================================================================================

function makeSendEmailModal(email_text) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window send_email">
			<div class="title">
				<span>명함 삭제</span>
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
				<span>삭제한 명함은 30일 간 휴지통에 보관되며, 그 이후에는</span>
				<span>완전히 삭제됩니다.</span>
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
				<span>삭제한 명함은 30일 간 휴지통에 보관되며, 그 이후에는</span>
				<span>완전히 삭제됩니다.</span>
			</div>
			<div class="buttons">
				<button type="button" class="confirm">삭제</button>
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