const team_members_button = document.querySelector(".menus .members");
const team_manage_button = document.querySelector(".menus .team_manage");
const change_team_button = document.querySelector(".menus .change_team");

const card_book_wrapper = document.querySelector(".menus .card_books");
const add_new_card_book_button = document.querySelector(".menus .add_new_card_book");
const whole_card_button = document.querySelector("#whole_cards");

const group_wrapper = document.querySelector(".menus .groups");

const card_book_members_button = document.querySelector(".card_book_members_button");
const card_book_settings_button = document.querySelector(".card_book_settings_button");
const main_contents = document.querySelector(".main_contents");

let selected_team;
let selected_card_book;
let selected_group;

let page = 0;

loadTeam();

team_members_button.onclick = () => {
	// 본인을 제외한 팀 멤버 검색
	// join_count == 0 -> append no_member tag
	// join_count > 0 -> append member_list tag
	const no_member_tag = makeNoMembersTag();
	replaceTagInMainContents(no_member_tag);
	no_member_tag.querySelector(".invite_member").onclick = () => {
		// 링크 생성 및 모달 출력
		console.log("링크 생성 및 모달 출력");
	}
}

team_manage_button.onclick = () => {
	const team_manage_tag = makeTeamManageTag();
	replaceTagInMainContents(team_manage_tag);
}

change_team_button.onclick = () => {
	// 팀 리스트 및 선택 모달 출력
	// 모달에서 새로운 팀 생성 가능
}

card_book_members_button.onclick = () => {
	// 명함첩 참여 유저 리스트 출력
	const card_book_member_list_tag = makeCardBookJoinUserListTag();
	replaceTagInMainContents(card_book_member_list_tag);
}

card_book_settings_button.onclick = () => {
	// 명함첩 설정 태그 출력
	const card_book_settings_tag = makeCardBookSettingsTag();
	replaceTagInMainContents(card_book_settings_tag);
}

whole_card_button.onclick = loadAllCardList; 

function loadTeam() {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/list",
		dataType: "json",
		success: function (team_list) {
			selected_team = pickTeamOrderByCreateDate(team_list);
			loadBookList(selected_team.id);
			setTeamInfo();
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function loadBookList(team_id) {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/" + team_id + "/book/list",
		dataType: "json",
		success: function (card_book_list) {
			console.log(card_book_list);
			let card_books = card_book_wrapper.querySelectorAll(".card_book");
			card_books.forEach(e => e.remove());
			
			for(let i = 0; i < card_book_list.length; i++) {
				const card_book_button = makeCardBookTag(card_book_list[i]);
				card_book_wrapper.insertBefore(card_book_button, add_new_card_book_button);
				card_book_button.onclick = () => {
					card_books = card_book_wrapper.querySelectorAll(".card_book");
					loadGroupList(card_book_list[i].id);
					addClassActiveToGroup(card_books, i);
					selected_card_book = card_book_list[i];
				}
			}
			card_book_wrapper.querySelectorAll(".card_book")[0].click();
			selected_card_book = card_book_list[0];
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function loadGroupList(card_book_id) {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + card_book_id + "/group/list",
		dataType: "json",
		success: function (group_list) {
			console.log(group_list);
			setWholeGroup(group_list[0].total_count);
			for(let i = 0; i < group_list.length; i++) {
				const group_button = makeCardGroupTag(group_list[i]);
				group_wrapper.appendChild(group_button);
				group_button.onclick = () => {
					console.log(group_list[i].group_name + " is pressed");
					page = 0;
					selected_group = group_list[i];
					loadSpecificGroupCardList();
				}
			}
			whole_card_button.click();
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function loadAllCardList() {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + selected_card_book.id + "/card/list",
		data: {"page":page},
		dataType: "json",
		success: function (card_list) {
			console.log(card_list);
			if(card_list.length == 0) {
				const how_to_use_tag = makeHowToUseTag();
				replaceTagInMainContents(how_to_use_tag);
			} else {
				const card_list_wrapper_tag = makeCardListTag();
				replaceTagInMainContents(card_list_wrapper_tag);
				
				const card_list_tag = card_list_wrapper_tag.querySelector(".card_list");
				for(let i = 0; i < card_list.length; i++) {
					const card_tag = makeCardTag(card_list[i]);
					card_list_tag.appendChild(card_tag);
					
					card_tag.onclick = () => {
						loadCardDetail(card_list[i].id);
					}
				}
				
				const cards = card_list_tag.querySelectorAll(".card");
				console.log(cards);
				cards[0].click();
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function loadSpecificGroupCardList() {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/group/" + selected_group.id + "/card/list",
		data: {"page":page},
		dataType: "json",
		success: function (card_list) {
			console.log(card_list);
			if(card_list.length == 0) {
				const how_to_use_tag = makeHowToUseTag();
				replaceTagInMainContents(how_to_use_tag);
			} else {
				
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function loadCardDetail(card_id) {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/card/" + card_id,
		dataType: "json",
		success: function (card) {
			console.log(card);
			const card_detail_tag = makeCardDetailTag(card);
			appendTagToMainContents(card_detail_tag);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function setWholeGroup(whole_count) {
	whole_card_button.querySelector(".whole_count").innerText = whole_count; 
}

function addClassActiveToGroup(card_books, index) {
	for(let i = 0; i < card_books.length; i++) {
		if(i == index) card_books[i].classList.add("active");
		else					card_books[i].classList.remove("active");
	}
}

function setTeamInfo() {
	const team_title = document.querySelector(".menus .team_name");
	team_title.innerText = selected_team.title;
}

function pickTeamOrderByCreateDate(team_list) {
	return team_list.sort((a, b) => new Date(b.create_date) - new Date(a.create_date))[0];
}

function appendTagToMainContents(tag) {
	main_contents.appendChild(tag);
}

function replaceTagInMainContents(tag) {
	main_contents.innerHTML = "";
	appendTagToMainContents(tag);
}

function makeCardGroupTag(group) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "group";
	button.innerHTML = `
		<span class="sub_group_arrow"></span>
		<span class="group_text">${group.group_name} (<span class="card_count">${group.card_count}</span>)</span>
	`;
	return button;
}

function makeCardBookTag(card_book) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "card_book";
	button.innerHTML = `
		<span class="card_book_name">${card_book.card_book_name}</span>
		<div class="card_book_info">
			참여자 <span class="join_count">${card_book.join_count}</span>명 · 명함 <span class="card_count">${card_book.card_count}</span>장
		</div>
	`;
	return button;
}

function makeNoMembersTag() {
	const div = document.createElement("div");
	div.className = "no_member";
	div.innerHTML = `
		<span>함께 사용할 동료들을 구성원으로 초대하세요.</span>
		<span>링크를 전달하여 손쉽게 초대할 수 있습니다.</span>
		<button type="button" class="invite_member">조직 구성원 초대</button>
	`;
	return div;
}

function makeHowToUseTag() {
	const div = document.createElement("div");
	div.className = "how_to_use";
	div.innerHTML = `
		<div class="row">
			<span class="title">1. <b>내 명함첩에 있는 명함</b>을 팀 명함첩에 공유하려면?</span>
			<span class="description">‘내 명함첩’에서 명함을 선택하고, ‘팀 명함첩으로 복제’를 클릭하여 공유할 수 있습니다.</span>
			<img src="/static/images/card_team_how_to_use_1.jpg">
		</div>
		<div class="row">
			<span class="title">2. <b>엑셀이나 이미지</b>로 관리하던 연락처를 팀 명함첩에 등록하려면?</span>
			<span class="description">화면 우측 상단의 + 버튼(명함 추가하기)을 클릭하면, 엑셀 또는 이미지를 등록할 수 있습니다.</span>
			<img src="/static/images/card_team_how_to_use_2.jpg">
		</div>
	`;
	return div;
}

function makeTeamManageTag() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<span class="text">조직 관리</span>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text small">상품</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">이용 중인 상품</span>
					<span class="text">베이직(무료)</span>
				</div>
				<button type="button" id="show_product_description">자세히 보기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">이용 현황</span>
				<button type="button" id="show_history">자세히 보기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">결제 관리</span>
				<button type="button" id="manage_payment">관리하기</button>
			</div>
			<div class="row">
				<span class="text small">이름</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">조직명</span>
					<span class="text">test</span>
				</div>
				<button type="button" id="change_team_name">변경</button>
			</div>
		</section>
		<section>
			<div class="row">
				<div class="title">
					<span class="text small">사용자 이름</span>
					<span class="text">jyp</span>
				</div>
				<button type="button" id="change_profile">변경</button>
			</div>
			<div class="row">
				<span class="text small">구성원</span>
			</div>
			<div class="row">
				<span class="text">조직 구성원 초대</span>
				<button type="button" id="invite_member">초대하기</button>
			</div>
			<div class="row">
				<span class="text small">기타</span>
			</div>
			<div class="row">
				<span class="text">조직에서 나가기</span>
				<button type="button" id="leave_team" class="red">나가기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">조직 삭제</span>
				<button type="button" id="delete_team" class="red">삭제하기</button>
			</div>
		</section>
	`;
	return div;
}

function makeCardBookSettingsTag() {
	const div = document.createElement("div");
	div.className = "card_book_settings";
	div.innerHTML = `
		<section>
			<div class="row">
				<span class="text">명함첩 설정</span>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text small">명함첩 관리</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">명함첩 이름</span>
					<span class="text">ㅁㄴㅇㅎㄻㄴㅇ</span>
				</div>
				<button type="button" id="change_card_book_name">변경</button>
			</div>
			<div class="row">
				<span class="text small">참여자</span>
			</div>
			<div class="row">
				<span class="text">참여자 권한 설정</span>
				<button type="button" id="change_member_authority">변경</button>
			</div>
			<div class="row">
				<span class="text small">명함 관리</span>
			</div>
			<div class="row">
				<span class="text">파일로 내보내기 (엑셀, 아웃룩 등)</span>
				<button type="button" id="export_to_file">내보내기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">삭제된 명함</span>
				<button type="button" id="show_deleted_cards">관리하기</button>
			</div>
			<div class="row">
				<span class="text small">기타</span>
			</div>
			<div class="row">
				<span class="text disabled">명함첩 나가기</span>
				<button type="button" id="leave_card_book" class="red" disabled>나가기</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text disabled">명함첩 삭제</span>
				<button type="button" id="delete_card_book" class="red" disabled>삭제하기</button>
			</div>
		</section>
	`;
	return div;
}

function makeCardBookJoinUserListTag() {
	const div = document.createElement("div");
	div.className = "join_users";
	div.innerHTML = `
		<div class="title">
			<span>참여 중인 구성원</span>
			<button type="button" class="add_team_user">+ 추가하기</button>
		</div>
		<div class="contents">
			<div class="user">
				<div class="profile_image">
					<img src="/static/images/default_profile_image.png">
				</div>
				<div class="description">
					<div class="name_tag">
						<span class="nickname">jyp</span>
						<span class="admin">관리자</span>
					</div>
					<span class="phone_number">010-3594-7111</span>
				</div>
			</div>
		</div>
		<div class="pager_wrapper">
			<button type="button" class="prev_page">«</button>
			<div class="pager">
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page current"></button>
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

function makeCardListTag() {
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
					<option value="reg_date" selected>등록일순</option>
					<option value="name">이름순</option>
					<option value="company_name">회사명순</option>
				</select>
			</div>
		</div>
		<div class="card_list">
			
		</div>
		<div class="pager_wrapper">
			<button type="button" class="prev_page">«</button>
			<div class="pager">
				<button type="button" class="page blank"></button>
				<button type="button" class="page blank"></button>
				<button type="button" class="page current">1</button>
				<button type="button" class="page blank"></button>
				<button type="button" class="page blank"></button>
			</div>
			<button type="button" class="next_page">»</button>
		</div>
	`;
	return div;
}

function makeCardDetailTag() {
	const div = document.createElement("div");
	div.className = "card_detail";
	div.innerHTML = `
		<div class="detail_header">
			<span class="reg_user_name">등록자 : jyp</span>
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
					<img src="/static/images/default_profile_image.png">
				</div>
				<div class="texts">
					<span class="name">ㅁㄴㄹㅇ</span>
					<span class="department_text">ㅁㄴㅇㄻㄴㅇㄹ</span>
					<span class="company_name">ㅁㄴㅇㄻㄴㅇㄹ</span>
				</div>
			</div>
			<div class="card_description">
				<div class="left">
					<div class="row">
						<span class="title">이메일</span>
						<span class="description">asf</span>
					</div>
					<div class="row">
						<span class="title">휴대폰</span>
						<span class="description">asf</span>
					</div>
					<div class="row">
						<span class="title">유선전화</span>
						<span class="description">asf</span>
					</div>
					<div class="row">
						<span class="title">팩스</span>
						<span class="description">asf</span>
					</div>
				</div>
				<div class="right">
					<div class="row">
						<span class="title">등록일</span>
						<span class="description">asf</span>
					</div>
					<div class="row">
						<span class="title">주소</span>
						<span class="description">asf</span>
					</div>
				</div>
			</div>
			<div class="group_info">
				<span class="title">그룹</span>
				<span class="text no_content">미지정</span>
			</div>
			<div class="memos">
				<span class="title">메모</span>
				<span class="text no_content">메모 없음</span>
			</div>
		</div>
		<div class="memo_input">
			<span class="text no_content">메모를 추가하세요</span>
			<span class="add_memo_button">+ 메모 추가</span>
		</div>
	`;
	return div;
}