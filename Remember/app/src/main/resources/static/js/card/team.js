const team_members_button = document.querySelector(".menus .members");
const team_manage_button = document.querySelector(".menus .team_manage");
const change_team_button = document.querySelector(".menus .change_team");

const card_book_wrapper = document.querySelector(".menus .card_books");
const add_new_card_book_button = document.querySelector(".menus .add_new_card_book");

const groups = document.querySelector(".menus .groups");
const add_new_group_button = document.querySelector(".menus .add_new_group");
const whole_card_button = document.querySelector("#whole_cards");

const group_wrapper = document.querySelector(".menus .groups");

const card_book_members_button = document.querySelector(".card_book_members_button");
const card_book_settings_button = document.querySelector(".card_book_settings_button");
const main_contents = document.querySelector(".main_contents");

let selected_team;
let selected_card_book;
let selected_group;

let principal_profile;

let page = 0;

loadPrincipalProfile();
loadTeam();

team_members_button.onclick = () => {
	// 본인을 제외한 팀 멤버 검색
	page = 0;
	
	const team_member_list = loadTeamMembers();
	if(team_member_list.length == 1 && team_member_list[0].total_count == 0) {
		const no_member_tag = makeNoMembersTag();
		replaceTagInMainContents(no_member_tag);
		no_member_tag.querySelector(".invite_member").onclick = () => {
			// 링크 생성 및 모달 출력
			console.log("링크 생성 및 모달 출력");
		}
	} else {
		console.log(team_member_list);
	}
}

team_manage_button.onclick = () => {
	const team_manage_tag = makeTeamManageTag();
	replaceTagInMainContents(team_manage_tag);
	
	const show_product_description = document.querySelector("#show_product_description");
	show_product_description.onclick = () => {
		// 상품 상세 페이지 출력
	}
	
	const show_history = document.querySelector("#show_history");
	show_history.onclick = () => {
		// 팀 명함 수 등 상세 페이지 readOnly
		const team_history = makeShowHistoryTag();
		replaceTagInMainContents(team_history);
	}
	
	const manage_payment = document.querySelector("#manage_payment");
	manage_payment.onclick = () => {
		// 결제 수단 및 내역으로 이동가능 한 페이지
		const manage_payment_tag = makeManagePaymentTag();
		replaceTagInMainContents(manage_payment_tag);
		
		const show_my_payment_process = manage_payment_tag.querySelector("#show_my_payment_process");
		show_my_payment_process.onclick = () => {
			// 결제 수단 태그
			const my_payment_process_tag = makeMyPaymentProcess();
			replaceTagInMainContents(my_payment_process_tag);
		}
		
		const show_my_payment_history = manage_payment_tag.querySelector("#show_my_payment_history");
		show_my_payment_history.onclick = () => {
			// 결제 내역 태그
			const my_payment_history_tag = makeMyPaymentHistory();
			replaceTagInMainContents(my_payment_history_tag);
		}
	}
	
	const change_team_name = document.querySelector("#change_team_name");
	change_team_name.onclick = () => {
		// 조직명 변경 모달 출력
		const change_team_name_modal = makeChangeTeamNameModal();
		appendModalToContainer(change_team_name_modal);
		
		change_team_name_modal.querySelector(".close_modal").onclick = () => {
			removeModal(change_team_name_modal);
		}
		
		change_team_name_modal.querySelector(".cancel_button").onclick = () => {
			removeModal(change_team_name_modal);
		}
		
		change_team_name_modal.querySelector(".submit_button").onclick = () => {
			// update team name
			const team_name_input = change_team_name_modal.querySelector("input[name='title']");
			if(team_name_input.value == "") {
				alert("팀 이름을 정확히 입력해주세요.");
			} else if(team_name_input.value == selected_team.title) {
				alert("현재 조직명과 같은 이름을 사용할 수 없습니다.");
			} else {
				updateTeamName(team_name_input.value);
			}
		}
	}
	
	const change_profile = document.querySelector("#change_profile");
	change_profile.onclick = () => {
		// 프로필 명 변경 모달 출력
		const change_nickname_modal = makeChangeProfileNameModal();
		appendModalToContainer(change_nickname_modal);
		
		change_nickname_modal.querySelector(".close_modal").onclick = () => {
			removeModal(change_nickname_modal);
		}
		
		change_nickname_modal.querySelector(".cancel_button").onclick = () => {
			removeModal(change_nickname_modal);
		}
		
		change_nickname_modal.querySelector(".submit_button").onclick = () => {
			const nickname_input = change_nickname_modal.querySelector("input[name='nickname']");
			if(nickname_input.value == "") {
				alert("닉네임을 정확히 입력해주세요.");
			} else if(nickname_input.value == principal_profile.nickname) {
				alert("현재 닉네임과 같은 이름을 사용할 수 없습니다.");
			} else {
				updateProfileNickname(nickname_input.value);
			}
		}
	}
	
	const invite_member = document.querySelector("#invite_member");
	invite_member.onclick = () => {
		// 구성원 초대 가능한 링크있는 모달 출력
	}
	
	const leave_team = document.querySelector("#leave_team");
	leave_team.onclick = () => {
		// 조직 나가기 설명 페이지 이동
		const leave_team_form = makeLeaveTeamDescriptionTag();
		replaceTagInMainContents(leave_team_form);
		
		const input_wrapper = leave_team_form.querySelector(".input_wrapper");
		const confirm = input_wrapper.querySelector(".confirm");
		const leave_button = leave_team_form.querySelector(".leave_button");
		input_wrapper.onclick = () => {
			confirm.toggleAttribute("checked");
			if(confirm.checked) {
				leave_button.disabled = false;
			} else {
				leave_button.disabled = true;
			}
		}
		leave_button.onclick = () => {
			const leave_confirm_modal = makeConfirmLeaveTeamModal();
			appendModalToContainer(leave_confirm_modal);
			
			leave_confirm_modal.querySelector(".cancel_button").onclick = () => {
				removeModal(leave_confirm_modal);
			}
			
			leave_confirm_modal.querySelector(".submit_button").onclick = () => {
				// 조직 내 ADMIN 검사 후 본인 이외에 ADMIN이 없으면 퇴장 불가
				const leave_flag = leaveTeam();
				if(leave_flag) {
					location.reload();
				} else {
					removeModal(leave_confirm_modal);
					const leave_error_modal = makeErrorToLeaveTeamModal();
					appendModalToContainer(leave_error_modal);
					
					leave_error_modal.querySelector(".confirm_button").onclick = () => {
						removeModal(leave_error_modal);
					}
				}
			}
		}
	}
	
	const delete_team = document.querySelector("#delete_team");
	delete_team.onclick = () => {
		// 조직 삭제 설명 페리지 이동
		const delete_team_form = makeDeleteTeamDescriptionTag();
		replaceTagInMainContents(delete_team_form);
		
		const input_wrapper = delete_team_form.querySelector(".input_wrapper");
		const confirm = input_wrapper.querySelector(".confirm");
		const delete_button = delete_team_form.querySelector(".delete_button");
		input_wrapper.onclick = () => {
			confirm.toggleAttribute("checked");
			if(confirm.checked) {
				delete_button.disabled = false;
			} else {
				delete_button.disabled = true;
			}
		}
		
		delete_button.onclick = () => {
			const delete_confirm_modal = makeConfirmDeleteTeamModal();
			appendModalToContainer(delete_confirm_modal);
			
			delete_confirm_modal.querySelector(".cancel_button").onclick = () => {
				removeModal(delete_confirm_modal);
			}
			
			delete_confirm_modal.querySelector(".submit_button").onclick = () => {
				const delete_flag = deleteTeam();
				if(delete_flag) {
					location.reload();
				} else {
					removeModal(delete_confirm_modal);
					const leave_error_modal = makeErrorToLeaveTeamModal();
					appendModalToContainer(leave_error_modal);
					
					leave_error_modal.querySelector(".confirm_button").onclick = () => {
						removeModal(leave_error_modal);
					}
				}
			}
		}
	}
}

change_team_button.onclick = () => {
	// 팀 리스트 및 선택 모달 출력
	// 모달에서 새로운 팀 생성 가능
}

add_new_group_button.onclick = () => {
	let add_new_group_input_wrapper = document.querySelector("#add_new_group");
	if(add_new_group_input_wrapper != null) return;
	
	add_new_group_input_wrapper = makeAddNewGroupTag();
	groups.insertBefore(add_new_group_input_wrapper, groups.children[1]);
	
	const group_name_input = add_new_group_input_wrapper.querySelector("input");
	const remove_button = add_new_group_input_wrapper.querySelector("button");
	
	remove_button.onclick = () => add_new_group_input_wrapper.remove();
	group_name_input.oninput = (event) => {
		console.log(event);
	}
}

card_book_members_button.onclick = () => {
	// 명함첩 참여 유저 리스트 출력
	page = 0;
	
	const card_book_member_list = loadCardBookJoinMembers();
	const card_book_member_list_tag = makeCardBookJoinUserListTag();
	replaceTagInMainContents(card_book_member_list_tag);
	console.log(card_book_member_list);
	const member_list_wrapper = card_book_member_list_tag.querySelector(".contents");
	for(let i = 0; i < card_book_member_list.length; i++) {
		const member_tag = makeCardBookJoinUserTag(card_book_member_list[i]);
		member_list_wrapper.appendChild(member_tag);
		// personal card select
	}
	
	setListPager(card_book_member_list[0].total_count);
}

card_book_settings_button.onclick = () => {
	// 명함첩 설정 태그 출력
	const card_book_settings_tag = makeCardBookSettingsTag();
	replaceTagInMainContents(card_book_settings_tag);
	
	const change_card_book_name = card_book_settings_tag.querySelector("#change_card_book_name");
	change_card_book_name.onclick= () => {
		const change_card_book_name_modal = makeChangeCardBookNameModal();
		appendModalToContainer(change_card_book_name_modal);
		
		change_card_book_name_modal.querySelector(".close_modal").onclick = () => {
			removeModal(change_card_book_name_modal);
		}
		
		change_card_book_name_modal.querySelector(".cancel_button").onclick = () => {
			removeModal(change_card_book_name_modal);
		}
		
		change_card_book_name_modal.querySelector(".submit_button").onclick = () => {
			const card_book_name_input = change_card_book_name_modal.querySelector("input[name='card_book_name']");
			if(card_book_name_input.value == "") {
				alert("명함첩 이름을 정확히 입력해주세요.");
			} else if(card_book_name_input.value == selected_card_book.card_book_name) {
				alert("현재 명함첩 이름과 같은 이름을 사용할 수 없습니다.");
			} else {
				updateCardBookName(card_book_name_input.value);
			}
		}
	}
}

whole_card_button.onclick = loadAllCardList;

function loadPrincipalProfile() {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/profile",
		async: false,
		dataType: "json",
		success: function (profile) {
			console.log(profile);
			principal_profile = profile;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function loadTeam() {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/list",
		async: false,
		dataType: "json",
		success: function (team_list) {
			console.log(team_list);
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
		async: false,
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
			group_wrapper.querySelectorAll(".group").forEach(e => {
				if(e.id != "whole_cards") e.remove();
			});
			for(let i = 0; i < group_list.length; i++) {
				const group_button = makeCardGroupTag(group_list[i]);
				group_wrapper.appendChild(group_button);
				group_button.onclick = () => {
					console.log(group_list[i].group_name + " is pressed");
					page = 0;
					selected_group = group_list[i];
					console.log(selected_group);
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
		async: false,
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
				setListPager(card_list[0].total_count);
				
				const card_list_tag = card_list_wrapper_tag.querySelector(".card_list");
				for(let i = 0; i < card_list.length; i++) {
					const card_tag = makeCardTag(card_list[i]);
					card_list_tag.appendChild(card_tag);
					
					card_tag.onclick = () => {
						loadCardDetail(card_list[i].id);
						addClassClickedToCard(i);
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
				const card_list_wrapper_tag = makeCardListTag();
				replaceTagInMainContents(card_list_wrapper_tag);
				setListPager(card_list[0].total_count);
				
				const card_list_tag = card_list_wrapper_tag.querySelector(".card_list");
				for(let i = 0; i < card_list.length; i++) {
					const card_tag = makeCardTag(card_list[i]);
					card_list_tag.appendChild(card_tag);
					
					card_tag.onclick = () => {
						loadCardDetail(card_list[i].id);
						addClassClickedToCard(i);
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

function setListPager(total_count) {
	const max_page = total_count % 10 == 0 ? Math.floor(total_count / 10) : Math.floor(total_count / 10) + 1;
	let min_page = page -1;
	const pager_tags = document.querySelector(".pager").children;
	console.log(pager_tags);
	for(let i = 0; i < pager_tags.length; i++) {
		if(min_page < 1 || min_page > max_page) pager_tags[i].classList.add("blank");
		else {
			pager_tags[i].classList.add("current");
			pager_tags[i].innerText = min_page;
		}
		min_page++;
	}
}

function addClassClickedToCard(index) {
	const cards = document.querySelectorAll(".card_list > .card");
	console.log(cards);
	for(let i = 0; i < cards.length; i++) {
		if(i == index) cards[i].classList.add("clicked");
		else					cards[i].classList.remove("clicked");
	}
}

function loadCardDetail(card_id) {
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/card/" + card_id,
		dataType: "json",
		success: function (card) {
			console.log(card);
			let card_detail_tag = document.querySelector(".card_detail");
			if(card_detail_tag != null) {
				card_detail_tag.remove();
			}
			card_detail_tag = makeCardDetailTag(card);
			appendTagToMainContents(card_detail_tag);
			
			const group_wrapper = card_detail_tag.querySelector(".group_info");
			for(let i = 0; i < card.group_list.length; i++) {
				if(card.group_list[i].group_name == "미분류") continue;
				const group_button = makeGroupNameTagInCardDetail(card.group_list[i]);
				group_wrapper.appendChild(group_button);
				group_button.onclick; 
				// show group select modal
			}
			
			const memo_wrapper = card_detail_tag.querySelector(".memo_list");
			for(let i = 0; i < card.memo_list.length; i++) {
				const memo = makeMemoTag(card.memo_list[i]);
				memo_wrapper.appendChild(memo);
				// 
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function loadTeamMembers() {
	let team_members;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/" + selected_team.id + "/member/list",
		async: false,
		data: {"page":page},
		dataType: "json",
		success: function (data) {
			team_members = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return team_members;
}

function loadCardBookJoinMembers() {
	let card_book_members;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + selected_card_book.id + "/member/list",
		async: false,
		data: {"page":page},
		dataType: "json",
		success: function (data) {
			card_book_members = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return card_book_members;
}

function updateTeamName(title) {
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/" + selected_team.id,
		data: {"title":title},
		dataType: "json",
		success: function (data) {
			if(data == true) {
				location.reload();
			} else {
				alert("조직명 변경 실패");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function updateProfileNickname(nickname) {
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/profile/" + principal_profile.id,
		data: {"nickname":nickname},
		dataType: "json",
		success: function (data) {
			if(data == true) {
				location.reload();
			} else {
				alert("닉네임 변경 실패");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function updateCardBookName(card_book_name) {
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/book/" + selected_card_book.id,
		data: {"card_book_name":card_book_name},
		dataType: "json",
		success: function (data) {
			if(data == true) {
				location.reload();
			} else {
				alert("명함첩 이름 변경 실패");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function leaveTeam() {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/" + selected_team.id + "/entry",
		async: false,
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function deleteTeam() {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/" + selected_team.id,
		async: false,
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
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
	const team_info = document.querySelector(".menus .team_info");
	team_info.querySelector(".team_name").innerText = selected_team.title;
	
	const grade_text = selected_team.grade_id == 1 ? "베이직" : selected_team.grade_id == 2 ? "프리미엄" : "엔터프라이즈";
	team_info.innerHTML += `<span class="team_grade ${selected_team.grade}">${grade_text}</span>`;
	
	const max_card_count_text = selected_team.grade_id == 1 ? "100장" : "∞";
	const storage = document.querySelector(".menus .storage");
	storage.innerHTML = `<span class="team_card_count">${selected_team.total_card_count}</span>&nbsp;/ ${max_card_count_text} 이용 중`;
}

function pickTeamOrderByCreateDate(team_list) {
	return team_list.sort((a, b) => new Date(b.create_date) - new Date(a.create_date))[0];
}

function makeRegDateText(create_date) {
	const date = new Date(create_date);
	const month = date.getMonth() + 1;
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${date.getFullYear()}년 ${month}월 ${day}일`;
}

function makeTeamCreateDateText(create_date) {
	const date = new Date(create_date);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${date.getFullYear()}-${month}-${day}`;
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

function makeGroupNameTagInCardDetail(group) {
	const span = document.createElement("span");
	span.className = "text group";
	span.innerHTML = `${group.group_name}<img src="/static/images/card_team_edit_group" class="show_edit_group_modal">`;
	return span;
}

function makeMemoTag(memo) {
	const div = document.createElement("div");
	div.className = "memo";
	div.innerHTML = `
		<div class="title">
			<span class="text">${memo.create_date.replace('T', ' ')} by ${memo.nickname}</span>
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
	const grade_text = selected_team.grade_id == 1 ? "베이직(무료)" : selected_team.grade_id == 2 ? "프리미엄" : "엔터프라이즈";
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
					<span class="text">${grade_text}</span>
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
					<span class="text">${selected_team.title}</span>
				</div>
				<button type="button" id="change_team_name">변경</button>
			</div>
		</section>
		<section>
			<div class="row">
				<div class="title">
					<span class="text small">사용자 이름</span>
					<span class="text">${principal_profile.nickname}</span>
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
					<span class="text">${selected_card_book.card_book_name}</span>
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

function makeCardBookJoinUserTag(user) {
	const phone_number = makePhoneNumberText(user.phone);
	const div = document.createElement("div");
	div.className = "user";
	div.innerHTML = `
		<div class="profile_image">
			<img src="/static/images/default_profile_image.png">
		</div>
		<div class="description">
			<div class="name_tag">
				<span class="nickname">${user.nickname}</span>
${user.role == "ADMIN" ? '<span class="admin">관리자</span>' : ''}
			</div>
			<span class="phone_number">${phone_number}</span>
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
					<img src="${card_detail.card.profile_img == null ? '/static/images/default_profile_image.png' : '/images/profile_images/' + card_detail.card.profile_img}">
				</div>
				<div class="texts">
					<span class="name">${card_detail.card.name}</span>
${card_detail.card.department_name == null ? '' : '<span class="department_text">' + card_detail.card.department_name + '</span>'}
${card_detail.card.company_name == null ? '' : '<span class="company_name">' + card_detail.card.company_name + '</span>'}
				</div>
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
${card_detail.group_list.length == 1 && card_detail.group_list[0].group_name == "미분류" ? 
				'<span class="text no_content">미지정<img src="/static/images/card_team_edit_group.png" class="show_edit_group_modal"></span>' : ''}
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

function makeDeleteTeamDescriptionTag() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 조직 삭제</span>
					<span class="text">조직 삭제</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column">
				<span class="warning_title">삭제 전 아래 내용을 확인하세요</span>
				<div class="warning_description">조직을 삭제하면 모든 구성원에게 삭제되었다는 알림이 발송되고, 조직 내의 모든 명함첩이 삭제되어 조회할 수 없게 됩니다.
&#10;명함첩에 등록된 명함과 메모 등 모든 정보가 삭제되므로, 필요 시 미리 내 명함첩에 저장하거나 파일로 백업해두시기 바랍니다.
				</div>
				<div class="input_wrapper">
					<input type="checkbox" class="confirm">
					<span class="text">위 내용을 확인하였습니다.</span>
				</div>
				<button type="button" class="delete_button" disabled>삭제하기</button>
			</div>
		</section>
	`;
	return div;
}

function makeLeaveTeamDescriptionTag() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 나가기</span>
					<span class="text">나가기</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column">
				<span class="warning_title">나가기 전 아래 내용을 확인하세요</span>
				<div class="warning_description">조직에서 나가더라도 명함첩에 회원님이 공유한 명함과 기록한 메모 등은 그대로 남게 됩니다.
&#10;조직에 다시 참여하기 위해서는 조직 운영자의 초대가 필요합니다.
				</div>
				<div class="input_wrapper">
					<input type="checkbox" class="confirm">
					<span class="text">위 내용을 확인하였습니다.</span>
				</div>
				<button type="button" class="leave_button" disabled>나가기</button>
			</div>
		</section>
	`;
	return div;
}

function makeShowHistoryTag() {
	const create_date = makeTeamCreateDateText(selected_team.create_date);
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 이용현황</span>
					<span class="text">이용현황</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<div class="row">
					<span class="text">생성일</span>
					<span class="text small">${create_date}</span>
				</div>
				<div class="row">
					<span class="text">구성원</span>
					<span class="text small">${selected_team.total_join_user_count}명</span>
				</div>
				<div class="row">
					<span class="text">명함첩</span>
					<span class="text small">${document.querySelectorAll(".menus .card_book").length}개</span>
				</div>
				<div class="row">
					<span class="text">명함</span>
					<span class="text small">${selected_team.total_card_count}장</span>
				</div>
			</div>
		</section>
	`;
	return div;
}

function makeManagePaymentTag() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 결제 관리</span>
					<span class="text">결제 관리</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<div class="row">
					<span class="text">결제 수단</span>
					<button type="button" id="show_my_payment_process">관리하기</button>
				</div>
				<div class="row">
					<span class="text">결제 내역</span>
					<button type="button" id="show_my_payment_history">확인하기</button>
				</div>
			</div>
		</section>
	`;
	return div;
}

function makeMyPaymentProcess() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 결제 관리 &gt; 결제 수단</span>
					<span class="text">결제 수단</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<span class="no_contents">등록된 결제 수단이 없습니다</span>
			</div>
		</section>
	`;
	return div;
}

function makeMyPaymentHistory() {
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">조직 관리 &gt; 결제 관리 &gt; 결제 내역</span>
					<span class="text">결제 내역</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<span class="no_contents">결제 내역이 없습니다</span>
			</div>
		</section>
	`;
	return div;
}

function makeChangeTeamNameModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_info">
			<div class="title">
				<span>조직명 변경</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="title" value="${selected_team.title}">
				<span>조직의 명칭은 조직 관리에서 변경할 수 있습니다.<span>
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeChangeProfileNameModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_info">
			<div class="title">
				<span>사용자 이름 변경</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="nickname" value="${principal_profile.nickname}">
				<span>조직의 명칭은 조직 관리에서 변경할 수 있습니다.<span>
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeChangeCardBookNameModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_info">
			<div class="title">
				<span>명함첩 이름 변경</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="card_book_name" value="${selected_card_book.card_book_name}">
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeConfirmLeaveTeamModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window leave_team">
			<span class="message">조직에서 나가시겠습니까?</span>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">나가기</button>
			</div>
		</div>
	`;
	return div;
}

function makeErrorToLeaveTeamModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window leave_team">
			<span class="message">탈퇴하기 전에 조직 운영자를 위임해주세요</span>
			<div class="buttons">
				<button type="button" class="confirm_button">확인</button>
			</div>
		</div>
	`;
	return div;
}

function makeConfirmDeleteTeamModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window leave_team">
			<span class="message">팀을 삭제하시겠습니까?</span>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="submit_button">삭제</button>
			</div>
		</div>
	`;
	return div;
}