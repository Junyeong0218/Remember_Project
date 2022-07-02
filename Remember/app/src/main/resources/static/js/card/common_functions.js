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

function makeCardTag(card) {
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
	const reg_date = makeRegDateText(card_detail.card.create_date);
	const address_text = makeAddressText(card_detail.card.address, card_detail.card.sub_address);
	const div = document.createElement("div");
	div.className = "card_detail";
	div.innerHTML = `
		<div class="detail_header">
			<span class="reg_user_name">등록자 : ${card_detail.reg_user_nickname}</span>
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