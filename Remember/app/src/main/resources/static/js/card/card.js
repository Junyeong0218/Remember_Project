const whole_cards = document.querySelector(".card_group");
const whole_count = document.querySelector('.whole_count');
const main_contents = document.querySelector(".main_contents");
const add_group_btn = document.querySelector('.add_group_button');
const add_group_input_wrapper = document.querySelector('.add_group');
const my_card = document.querySelector('.my_card_book');

console.log(principal);

let page = 0;
let total_page_check_flag = false;

let group_list;
let card_list;

add_group_btn.onclick = makeAddGroupBoxTag;

whole_cards.onclick = () => {
	card_list = getAllCards();
	setCardList();
}

main();

function main() {
	group_list = getAllGroups();
	console.log(group_list);
	
	whole_count.innerText = group_list[0].total_count;
	setGroupList();
	
	setTimeout(() => {
		whole_cards.click();
	}, 0);
}

function getAllGroups() {
	let groups;
    $.ajax({
        type: 'get',
        url: '/api/v1/card/group',
        async: false,
        dataType: 'json',
        success: function (data) {
			groups = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return groups;
}

function getAllCards() {
	let cards;
    $.ajax({
        type: "get",
        url: "/api/v1/card/list",
        async: false,
        data: {"page" : page},
        dataType: 'json',
        success: function (data) {
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function insertCardMemo(card_id, contents) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/" + card_id + "/memo",
		async: false,
		data: {"contents":contents},
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

function updateCardsBelongGroups(card_id_list, group_id_list, default_card_group_id) {
	let flag = false;
	$.ajax({
		type:'put',
		url:'/api/v1/card/belong',
		async: false,
		data:{
			"card_id_list":card_id_list,
			"group_id_list":group_id_list,
			"default_card_group_id":default_card_group_id
		},
		dataType:'json',
		success:function(data){
			flag = data;
		},
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
	});
	return flag;
}

function updateCard(card_id, formdata) {
	let flag = false;
	$.ajax({
		type:'put',
		url:'/api/v1/card/' + card_id,
		async: false,
		data: formdata,
		encType: "multipart/form-data",
		processData: false,
		contentType: false,
		dataType:'json',
		success: function (data) {
			flag = data > 0;
		},
		error: function (xhr, stauts) {
		console.log(xhr);
		console.log(stauts);
		}
	});
	return flag;	
}

function updateMemo(card_memo_id,contents) {
	let flag = false;
	$.ajax({
		type:'put',
		url:'/api/v1/card/' + card_memo_id + '/memo',
		async: false,
		data:{"contents":contents},
		success: function (data) {
			flag = data;
		},
		error: function (xhr, stauts) {
		console.log(xhr);
		console.log(stauts);
		}
	});
	return flag;
}

function updateGroupName(group_id, group_name) {
	let flag = false;
	$.ajax({
		type:'put',
		url:'/api/v1/card/group/' + group_id,
		async: false,
		dataType:'json',
		data:{"group_name":group_name},
		success:function(data) {
			console.log(data);
			flag = data > 0;
		},
	    error: function (xhr, status) {
	        console.log(xhr);
	        console.log(status);
	    }
	});
	return flag;
}

function deleteGroup(group_id) {
	let flag = false;
	$.ajax({
		type:'delete',
		url:'/api/v1/card/group/' + group_id,
		async: false,
		dataType:'json',
		success:function(data) {
			flag = data > 0;
		},
	    error: function (xhr, status) {
	        console.log(xhr);
	        console.log(status);
	    }
	});
	return flag;
}

function getCardListInSpecificGroup(group_id) {
	let cards;
    $.ajax({
        type: "get",
        url: "/api/v1/card/group/" + group_id,
        async: false,
        dataType: "json",
        success: function (data) {
			cards = data.card_list;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function deleteCard(card_id) {
	let flag;
	$.ajax({
		type:"delete",
		url:"/api/v1/card/" + card_id,
		async: false,
		dataType:"json",
		success:function(data){
			flag = data;
		},
		error: function (xhr, stauts) {
			console.log(xhr);
			console.log(stauts);
		}
	});
	return flag;
}

function deleteCards(card_id_list_object) {
	let flag = false;
	$.ajax({
		type:'delete',
		url:'/api/v1/card/list',
		async: false,
		data: card_id_list_object,
		dataType:'json',
		success:function (data) {
			flag = data > 0;
		},
		error: function (xhr, stauts) {
		console.log(xhr);
		console.log(stauts);
		}
	});
	return flag;
}

function loadCardDetail(card_id) {
	let card_detail;
	$.ajax({
		type: "get",
		url: "/api/v1/card/" + card_id,
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			card_detail = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return card_detail;
}

function insertNewGroup(group_name) {
	let group_id;
    $.ajax({
        type: 'post',
        url: '/api/v1/card/group',
        async: false,
        data: {"group_name": group_name},
        dataType: 'json',
        success: function (id) {
            console.log(id);
            group_id = id;
        },
        error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return group_id;
}

function setGroupList() {
	for (let i = 0; i < group_list.length; i++) {
        const group_tag = makeGroupTag(group_list[i]);
        my_card.appendChild(group_tag);
        
        group_tag.onclick = (event) => {
			if(event.target.className == "group_btn") {
				const group_drop = group_tag.querySelector('.drop_menu');
				const drop_menu_tag_list = group_drop.querySelectorAll('.drop_menu ul li');

				group_drop.classList.toggle('hidden');
				
				drop_menu_tag_list[0].onclick = () => {
					const change_name_tag = changeGroupNameTag(group_list[i]);
					const input =change_name_tag.querySelector('.change_input input');
					group_tag.innerHTML= '';
					group_tag.appendChild(change_name_tag);
					input.onkeypress = () => {
						if(window.event.keyCode == 13) {
							if(updateGroupName(group_list[i].id, input.value)) {
								location.reload();
							} else {
								alert("그룹명 변경 실패");
							}
						}
					}
				}
				drop_menu_tag_list[1].onclick = () => {
					const delete_group_modal = makeDeleteGroupModal(group_list[i]);
					appendModalToContainer(delete_group_modal);
					
					delete_group_modal.querySelector(".add_close_btn").onclick = () => removeModal(delete_group_modal);
					
					const delete_button = delete_group_modal.querySelector(".footer_btn button");
					delete_button.onclick = () => {
						if(deleteGroup(group_list[i].id)) {
							location.reload();
						} else {
							alert("그룹 삭제 실패");
						}
					}
				}
			} else {
				console.log(group_list[i].id);
				card_list = getCardListInSpecificGroup(group_list[i].id);
				console.log(card_list);
				setCardList();
			}
		}
    }
}

function setCardList() {
    total_page_check_flag = false;
    if (card_list == null || card_list.length == 0) {
	    const no_contents_tag = makeNoContentsTag();
		replaceTagInMainContents(no_contents_tag);
	} else {
		const total_card_count = card_list[0].total_count;
        const card_list_tag = makeCardListTag();
        replaceTagInMainContents(card_list_tag);
        appendCardListTag(card_list);
        
      	const pager = card_list_tag.querySelector(".list_page > .pager");
        const all_checkbox = card_list_tag.querySelector(".top_list_btn > input");
        const check_more = card_list_tag.querySelector('.more');
        const right = card_list_tag.querySelectorAll('.top_right');
        const send_more = card_list_tag.querySelectorAll('.send');
        const selcet = card_list_tag.querySelector('.list_select');
        const cards = card_list_tag.querySelectorAll(".card_list_con");
        const checkBoxes = card_list_tag.querySelectorAll(".list_group .check_btn");
        
        makePageTag(total_card_count, pager.children);
        
        let card_count = 0;
                
		all_checkbox.onclick = (event) => {
			console.log(event.target);
			if(event.target.className.includes("not_max")) {
				event.target.checked = false;
				event.target.classList.remove("not_max");
			}
            cards.forEach(item => item.querySelector(".check_btn").checked = event.target.checked);
            
			card_count = countChecked(checkBoxes);
			console.log(card_count);

            if(event.target.checked == true) {
				selcet.classList.remove('hide');
				selcet.innerText = total_page_check_flag ? `전체 페이지의 명함 ${total_card_count}장이 모두 선택되었습니다.` : `이 페이지의 명함 ${card_count}장이 모두 선택되었습니다.`;
				toggleCardListTitleRight(right, true);
				toggleClassColorToCards(cards, true);
			} else {
				selcet.classList.add('hide');
				toggleCardListTitleRight(right, false);
				toggleClassColorToCards(cards, false);
			}
        }
				
		if(total_page_check_flag) all_checkbox.click();
				
		const page_selector_wrapper = card_list_tag.querySelector('.drop_menu');
		check_more.onclick = () => page_selector_wrapper.classList.toggle("hidden");

		const page_selectors = page_selector_wrapper.querySelectorAll('.drop_menu li');
		page_selectors[0].onclick = () => {
			for(let i = 0; i < checkBoxes.length; i++){
				if(checkBoxes[i].checked == false) {
					total_page_check_flag = false;
					all_checkbox.click();
				}
			}
			page_selector_wrapper.classList.add("hidden");
		}

		page_selectors[1].onclick = () => {
			for(let i = 0; i < checkBoxes.length; i++){
				if(checkBoxes[i].checked == false) {
					total_page_check_flag = true;
					all_checkbox.click();
				}
			}
			page_selector_wrapper.classList.add("hidden");
		}
		
		page_selectors[2].onclick = () => {
			for(let i = 0; i < checkBoxes.length; i++){
				if(checkBoxes[i].checked == true) {
					all_checkbox.click();
				}
			}
			page_selector_wrapper.classList.add("hidden");
		}
		
		const card_copy_to_team_button = card_list_tag.querySelector('.t_btn.edit');
		card_copy_to_team_button.onclick = () => makeCardcopyToTeamModal();
		
		const set_group_button = card_list_tag.querySelector('.t_btn.send.group');
		set_group_button.onclick = () => {
			const groups = getAllGroups();
			const move_group_modal = moveGroupModal(card_count, groups);
			appendModalToContainer(move_group_modal);
			
			const default_card_group_id = groups[groups.findIndex(e => e.group_name == "미분류 명함")].id;
			const complete_button = move_group_modal.querySelector('.complete_btn');
			complete_button.onclick = () => {
				const selected_group_id_list = new Array();
				const group_tag_list = move_group.querySelectorAll(".group_list > ul > li > input");
				group_tag_list.forEach((e, index) => {
					if(e.checked) selected_group_id_list.push(groups[index].id);
				});
				
				const checked_card_id_list = new Array();
				checkBoxes.forEach((e, index) => {
					if(e.checked) checked_card_id_list.push(card_list[index].id);
				});
				
				const is_success = updateCardsBelongGroups(checked_card_id_list, selected_group_id_list, default_card_group_id);
				if(is_success) {
					location.reload();
				} else {
					alert("그룹 설정에 실패했습니다.");
				}
			}
		}
		
		const down_menu_tag_wrapper = card_list_tag.querySelector('.drop_menu.group');
		send_more[1].onclick = () => down_menu_tag_wrapper.classList.toggle("hidden");
		
		const down_menu_tag_list = down_menu_tag_wrapper.querySelectorAll('.drop_menu.group li');
		
		down_menu_tag_list[0].onclick = () => makeSendMailModal();
		
		down_menu_tag_list[1].onclick = () => {
			const send_file_modal = makeSendFileModal(principal);
			appendModalToContainer(send_file_modal);
			const file_type_button = send_file_modal.querySelector('.file_btn');
			const file_type_list = send_file_modal.querySelector('.file_list');
			const close_buttons = send_file_modal.querySelectorAll('.file_close');
			
			close_buttons.forEach(e => e.onclick = () => removeModal(send_file_modal));
			
			file_type_button.onclick = () => {
				file_type_list.classList.toggle('hidden');
			}
		}
		
		down_menu_tag_list[2].onclick = () => {
			const delete_cards_modal = makeDeleteCardModal(card_count);
			appendModalToContainer(delete_cards_modal);

			const delete_message = delete_cards_modal.querySelector('.delete_ok_text');
			const delete_count_message = delete_cards_modal.querySelector('.delete_count_text');
			delete_message.classList.add('hidden');
			delete_count_message.classList.remove("hidden");
			
			const close_button = delete_cards_modal.querySelector('.add_close_btn');
			const delete_button = delete_cards_modal.querySelector('.footer_btn button');
			close_button.onclick = () => removeModal(delete_cards_modal);
			delete_button.onclick = () => {
				const obj = {"card_id_list":new Array()};
				cards.forEach((e, index) => {
					if(e.querySelector('.check_btn').checked) obj.card_id_list.push(card_list[index].id);
				});
				
				if(deleteCards(obj)) {
					location.reload();
				} else {
					alert("명함 리스트 삭제 실패");
				}
			}
		}
		
        for (let i = 0; i < cards.length; i++) {
            cards[i].onclick = () => {
				const card_detail = loadCardDetail(card_list[i].id);
				toggleClassActiveCards(cards, i);
				
                //있으면 지우고 
                let card_detail_tag = main_contents.querySelector('.detail_box');
                if (card_detail_tag != null) {
                    card_detail_tag.remove();
                }

                card_detail_tag = makeCardDetailTag(card_detail);
                appendTagToMainContents(card_detail_tag);
                
                const right_buttons = card_detail_tag.querySelectorAll('.send');
                const down_menu_list_wrapper = card_detail_tag.querySelector('.send_drop_menu');
                
                right_buttons[0].onclick = () => {
					makeSendCardModal(card_detail.name);
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
						if(deleteCard(card_list[i].id)) {
							location.reload();
						} else {
							alert("명함 삭제 실패");
						}
					}
				}
				
				const joined_group_tag = makeJoinedGroupTag(card_detail.group_list);
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
						
						const checked_card_id_list = new Array();
						checkBoxes.forEach((e, index) => {
							if(e.checked) checked_card_id_list.push(card_list[index].id);
						});
						
						const is_success = updateCardsBelongGroups(card_detail.card.id, selected_group_id_list, default_card_group_id);
						if(is_success) {
							location.reload();
						} else {
							alert("그룹 수정 실패");
						}
					}
				}
				
				const memo_wrapper = card_detail_tag.querySelector('.info_memo_value');
				for(let i = 0; i < card_detail.memo_list.length; i++) {
					const memo = makeAddMemoTag(card_detail.memo_list[i]);
					memo_wrapper.appendChild(memo);
					
					memo.querySelector('.show_edit_memo_modal').onclick = () => {
						const update_memo_modal = makeUpdateCardMemoModal(card_detail.memo_list[i]);
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
							if(updateMemo(card_detail.memo_list[i].id, contents.value)) {
								location.reload();
							} else {
								alert("메모 수정 실패");
							}
							removeModal(update_memo_modal);
						}
					}
					
				}
				
	            const edit_card_button = card_detail_tag.querySelector(".t_btn.edit");
	           
	            edit_card_button.onclick = () => {
					card_detail_tag.classList.add('hidden');
					card_list_tag.classList.add('hidden');
					
					const edit_card_form = makeEditCardFormTag(card_detail.card);
					appendTagToMainContents(edit_card_form);
					
					const edit_cancel = edit_card_form.querySelector('.edit_cancel');
					edit_cancel.onclick = () => {
						card_list_tag.classList.remove("hidden");
						card_detail_tag.classList.remove("hidden");
						edit_card_form.remove();
					}
					
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
						else card_detail.profile_img != null ? formdata.append('origin_profile_img', card_detail.card.profile_img) : '';
						
						if(updateCard(card_list[i].id, formdata)) {
							whole_cards.click();
							edit_card_form.remove();
			                cards[i].click();
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
						} else if(insertCardMemo(card_list[i].id, memo_input.value)){
							memo_modal.remove();
							cards.forEach(e => {
								if(e.className.includes("active")) {
									e.click();
								}
							});
						} else {
							alert("메모 저장 실패");
						}
					}
				}
			}
		}
	    if (cards.length > 0) cards[0].click();
	    
	    for(let i = 0; i < checkBoxes.length; i++) {
			checkBoxes[i].onclick = (event) => {
				if(event.target.checked) cards[i].classList.add("color");
				else cards[i].classList.remove("color");
				
				card_count = countChecked(checkBoxes);
				
				const unchecked_count = checkBoxes.length - card_count;
				
				if(card_count == 0) {
					all_checkbox.classList.remove("not_max");
					all_checkbox.checked = false;
					toggleCardListTitleRight(right, false);
					selcet.classList.add('hide');	
					
				} else if(card_count == checkBoxes.length) {
					console.log("max");
					all_checkbox.classList.remove("not_max");
					all_checkbox.checked = true;
					selcet.innerText = total_page_check_flag ? `전체 페이지의 명함 ${total_card_count - unchecked_count}장이 모두 선택되었습니다.` : `이 페이지의 명함 ${card_count}장이 모두 선택되었습니다.`;	
				
				} else if(card_count > 0 && card_count < checkBoxes.length) {
					all_checkbox.checked = false;
					all_checkbox.classList.add("not_max");
					toggleCardListTitleRight(right, true);
					selcet.classList.remove('hide');	
					selcet.innerText = total_page_check_flag ? `전체 페이지의 명함 ${total_card_count - unchecked_count}장이 모두 선택되었습니다.` : `명함 ${card_count}장이 선택되었습니다.`;		
				}
			}
		}
    }
    
}

function makeFormdataForUpdateCard(inputs) {
	const formdata = new FormData();
	inputs.forEach(e => {
		if(e.value != "") formdata.append(e.name, e.value);
	});
	return formdata;
}

function replaceTagInMainContents(tag) {
	main_contents.innerHTML = "";
    main_contents.appendChild(tag);
}

function appendTagToMainContents(tag) {
    main_contents.appendChild(tag);
}

function appendModalToContainer(modal) {
	container.appendChild(modal);
}

function removeModal(modal) {
	modal.remove();
}

function makePageTag(total_card_count, pager) {
	let page_number = page - 1;
	const last_page = total_card_count % 10 == 0 ? Math.floor(total_card_count / 10) : Math.floor(total_card_count / 10) + 1;
	for(let i = 0; i < pager.length; i++) {
		if(page_number < 1 || page_number > last_page) {
			pager[i].classList.add("blank");
		} else {
			pager[i].innerText = page_number;
			const page_for_event = page_number;
			pager[i].onclick = () => {
				page = page_for_event - 1;
				card_list = getAllCards();
				setCardList();
			}
		}
		page_number++;
	}
}

function toggleCardListTitleRight(right, checked) {
	if(checked) {
		right[0].classList.add('hide');
		right[1].classList.remove('hide');
	} else {
		right[0].classList.remove('hide');
		right[1].classList.add('hide');
	}
}

function toggleClassColorToCards(cards, add_flag) {
	for(let i =0; i < cards.length; i++){
		if(add_flag) cards[i].classList.add("color");
		else 		 cards[i].classList.remove("color");
	}
}

function countChecked(checkBoxes) {
	let count = 0;
	checkBoxes.forEach(checkBox => {
		if(checkBox.checked) count++;
	});
	return count;
}

function toggleClassActiveCards(cards, current_index) {
	cards.forEach((item, index) => {
	    if (index != current_index) item.classList.remove("active");	
    	else 						item.classList.add("active");
	});
}

function makeEditCardFormTag(originCardData) {
	const div = document.createElement("div");
	div.className= "edit_contents";
	div.innerHTML = `
		<div class="edit_form">
			<div class="edit_top">
				<span class="edit_title">명함 편집</span>
				<span class="buttons">
					<button class="btn edit_cancel">취소</button>
					<button class="btn edit_save">저장</button>
				</span>
			</div>
			<div class="edit_con">
				<div class="edit_img_add">
					<div class="edit_img_upload">+</div>
					<div class="edit_img_text">명함 이미지 추가</div>
				<input type="file" name="file" class="profile_img_input" accept="image/*">
				</div>
			</div>
			<div class="edit_write">
				<div class="card_profile">
					<img class="proflie_img" src="${originCardData.profile_img == null ? '/static/images/default_profile_image.png' : '/image/profile_images/' + originCardData.profile_img}" alt="프로필 기본">
					<input type="file" name="file" class="profile_img_input" accept="image/*">
					<button type="button" class="btn save">프로필 사진 설정</button>
				</div>
				<div class="card_inputs">
					<div class="input_item top">
						<div class="item_box">
							<div>
								<div class="input_title">
									이름
								</div>
								<input type="text" class="input_con" name="name" placeholder="이름 입력" value="${originCardData.name}">
							</div>
							<div>
								<div class="input_title">
									직책
								</div>
								<input type="text" class="input_con" name="position_name" placeholder="직책 입력" 
									value =${originCardData.position_name == null ? '' : originCardData.position_name}>
							</div>
						</div>
						<div class="item_box">
							<div>
								<div class="input_title">
									부서
								</div>
								<input type="text" class="input_con" name="department_name" placeholder="부서명 입력"
									value =${originCardData.department_name == null ? '' : originCardData.department_name}>
							</div>
							<div>
								<div class="input_title">
									회사
								</div>
								<input type="text" class="input_con" name="company_name" placeholder="회사명 입력"
									value =${originCardData.company_name == null ? '' : originCardData.company_name}>
							</div>
						</div>
						
					</div>
					<div class="input_item">
						<div class="item_box">
							<div class="input_title">
								이메일
							</div>
							<input type="text" class="input_con" name="email" placeholder="이메일 주소 입력"
									vlaue =${originCardData.email == null ? '' : originCardData.email}>
							<div class="input_title">
								휴대폰
							</div>
							<input type="text" class="input_con" name="phone" placeholder="휴대폰 번호 입력"
									value =${originCardData.phone == null ? '' : originCardData.phone}>
							<div class="input_title">
								유선전화
							</div>
							<input type="text" class="input_con" name="landline_phone" placeholder="유선전화 번호 입력"
									value =${originCardData.landline_phone == null ? '' : originCardData.landline_phone}>
							<div class="input_title">
								팩스
							</div>
							<input type="text" class="input_con" name="fax" placeholder="팩스 번호 입력"
									value =${originCardData.fax == null ? '' : originCardData.fax}>
						</div>
						<div class="item_box">
							<div class="input_title">
								주소
							</div>
							<input type="text" class="input_con" name="address" placeholder="주소 입력"
									value =${originCardData.address == null ? '' : originCardData.address}>
							<input type="text" class="input_con" name="sub_address" placeholder="상세 주소 입력"
									value =${originCardData.sub_address == null ? '' : originCardData.sub_address}>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeSendCardModal(card_name) {
	const div = document.createElement('div');
	div.className="note_modal";
	div.innerHTML = `
	<div class="note_modal_content mail">
		<div class="note_content send_card">
			<div class="add_header mail">
				<h1>명함 전달</h1>
				<button class="add_close_btn">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="add_body mail">
				<div class="send_box">
					<div class="mail_text">
						<span class="mail_msg">아래의 내용을 복사(Ctrl+C)하여 다른 사람에게 전달해주세요.<span>
					</div>
					<div>
						<textarea class="memo_text send_card" rows="4" readonly="readonly">
							${card_name}의명함 정보입니다.
							
							이름: ${card_name}
							
							리멤버는 대한민국 300만 직장인이 사용하는 직장인 필수앱입니다.
							아래 링크를 눌러 리멤버 앱에 명함을 저장하시면 언제 어디서든 손쉽게 찾아보
							실 수 있습니다.
							https://app.rmbr.in/Rf9Kx27wfrb
						</textarea>
					
					</div>
				</div>
			</div>
			<div class="delete_footer">
				<div class="footer_btn mail">
					<button class="add_close_btn">닫기</button>
				</div>
			</div>
		</div>
	</div>
	`;
	appendModalToContainer(div);
	setTimeout(() => {
		div.querySelector('.memo_text').focus();
		div.querySelector('.memo_text').select();
	}, 150);
	
	const close_buttons = div.querySelectorAll(".add_close_btn")
	close_buttons.forEach(e => e.onclick = () => div.remove());
	
	return div;
}

function moveGroupModal(card_count,group_list) {
	const setGroupModal = document.createElement('div');
	setGroupModal.className= "note_modal";
	setGroupModal.innerHTML = `
	<div class="note_modal_content mail">
		<div class="note_content delete">
			<div class="add_header mail">
				<h1>그룹 설정</h1>
				<button class="add_close_btn">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="add_body mail">
				<div class="send_box">
					<div class="mail_text group">
					<span>선택한 ${card_count}개의 명함을 아래의 그룹에 추가합니다.<span></div>
				<div class="group_list">
					<ul>
						<li class="group_list_add"><button>+ 그룹 추가하기</button></li>
					</ul>
				</div>
				</div>
			</div>
			<div class="delete_footer">
				<div class="footer_btn mail">
					<button class="complete_btn">완료</button>
				</div>
			</div>
		</div>
	</div>
	`;
	const ul = setGroupModal.querySelector('.group_list > ul');
	const group_list_add = setGroupModal.querySelector('.group_list_add');
	for(let i = 0; i < group_list.length; i++) {
		if(group_list[i].group_name == "미분류 명함") continue;
		const li = document.createElement('li');
		li.innerHTML = `
			<input type="checkbox" id="check" >
			${group_list[i].group_name}
		`;
		ul.insertBefore(li, group_list_add);
	}
	
	const setGroupCloseBtn = setGroupModal.querySelector('.add_close_btn');
	setGroupCloseBtn.onclick = () => setGroupModal.remove();

	return setGroupModal;
}

function makeSendMailModal() {
	const div = document.createElement('div');
	div.className = "note_modal";
	div.innerHTML = `
	<div class="note_modal_content mail">
		<div class="note_content delete">
			<div class="add_header mail">
				<h1>단체 메일 보내기</h1>
				<button class="add_close_btn">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="add_body mail">
				<div class="send_box">
					<div class="mail_text">
					<span class="mail_msg">아래의 이메일 주소를 복사(Ctrl + C)하여 이용하시는 이
메일 서비스의 "받는 사람"항목에 붙여넣기(Ctrl+V)하세요.</span></div>
					<input type="text" class="mail_input">
				</div>
			</div>
			<div class="delete_footer">
				<div class="footer_btn mail">
					<button class="add_close_btn">닫기</button>
				</div>
			</div>
		</div>
	</div>
	`;
	appendModalToContainer(div);
	setTimeout(() => {
		div.querySelector('.mail_input').focus();
		div.querySelector('.mail_input').select();
	});
	
	const close_buttons = document.querySelectorAll('.add_close_btn');
	close_buttons.forEach(e => e.onclick = () => div.remove());
	
	return div;
}

function makeSendFileModal(user_data) {
	const sendFileModal = document.createElement('div');
	sendFileModal.className = "note_modal";
	sendFileModal.innerHTML = `
	<div class="note_modal_content ">
			<div class="note_content card">
				<button class="close_btn file_close">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
				<div class="modal_header">
					파일로 내보내기
				</div>
				<div class="modal_body file">
					<div class="mail_address">
						<p>파일을 수신할 이메일 주소</p>
						<input type="text" class="file_mail" placeholder ="이메일 주소 입력" value =${user_data.email}>
					</div>
					<div class="mail_address">
						<p>파일 유형</p>
						<button class="file_btn">
							<span>엑셀 파일 (.xls)</span>
							<img src="/static/images/card_file_list.png" alt="파일 유형">
						</button>
						<div class="file_list hidden">
							<ul>
								<li>엑셀 파일 (.xls)</li>
								<li>아웃룩 주소록용 (.csv)</li>
								<li>휴대폰 연락처용 (.vcf)</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="modal_footer">
					<div>
						<button class="team_card_btn file cancel file_close">취소</button>
						<button class="team_card_btn file confirm">전송</button>				
					</div>
				</div>
			</div>
		</div>
	`;
	return sendFileModal;
}

function makeDeleteCardModal(checked_count) {
	const div = document.createElement('div');
	div.className ="note_modal";
	div.innerHTML = `
	<div class="note_modal_content delete">
		<div class="note_content delete">
			<div class="add_header delete">
				<h1>명함 삭제</h1>
				<button class="add_close_btn">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="add_body delete">
				<div class="delete_text">
					<span class="delete_ok_text">명함을 삭제하시겠습니까?<br>삭제한 후에는 복구가 되지 않습니다.</span>
					<span class="delete_count_text hidden">선택한 ${checked_count}개의 명함을 삭제하시겠습니까?<br>삭제한 후에는 복구가 되지 않습니다.</span>
				</div>
			</div>
			<div class="delete_footer">
				<div class="footer_btn">
					<button>삭제</button>
				</div>
			</div>
		</div>
	</div>
	`;
	return div;
	
}

function makeDeleteGroupModal(group_list) {
	const closeModal = document.createElement('div');
	closeModal.className ="note_modal";
	closeModal.innerHTML = `
	<div class="note_modal_content delete">
		<div class="note_content delete">
			<div class="add_header delete">
				<h1>그룹 삭제</h1>
				<button class="add_close_btn">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="add_body delete">
				<div class="delete_text">
					<span>${group_list.group_name}그룹을 삭제하시겠습니까?<br> 그룹을 삭제해도 명함은 삭제되지 않습니다.</span>
					<span></span>
				</div>
			</div>
			<div class="delete_footer">
				<div class="footer_btn">
					<button>삭제</button>
				</div>
			</div>
		</div>
	</div>
	`;
	return closeModal;
	
}

function makeReportModal() {
	const div = document.createElement('div');
	div.className = "note_modal";
	div.innerHTML =`
	<div class="note_modal_content mail">
		<div class="note_content delete">
			<div class="add_header mail">
				<h1>입력오타 신고</h1>
				<button class="add_close_btn">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="add_body mail">
				<div class="send_box">
					<div class="mail_text report">
						<span>입력된 정보 중 오타가 발견된 항목을 선택해주세요.</span>
						<span>입력 내용을 다시 검토하여 수정해 드립니다.</span>
					</div>
					<div class="group_list report">
					<ul>
						<li>
						<input type="checkbox" id="check"> 이름
						</li>
						<li>
						<input type="checkbox" id="check"> 휴대폰 번호
						</li>
						<li>
						<input type="checkbox" id="check"> 이메일
						</li>
						<li>
						<input type="checkbox" id="check"> 기타 나머지 정보
						</li>
					</ul>
				</div>
				</div>
			</div>
			<div class="delete_footer">
				<div class="footer_btn mail">
					<button class="complete_btn send">전송</button>
				</div>
			</div>
		</div>
	</div>
	`;
	appendModalToContainer(div);
	const close_button = div.querySelector('.add_close_btn');
	close_button.onclick = () => div.remove();
	
	return div;
}

function changeCardImage(event, image_tag) {
	const file_reader = new FileReader();
	file_reader.onloadend = (e) => {
		image_tag.src = e.target.result;
	}
	file_reader.readAsDataURL(event.target.files[0]);
}

function makeNoContentsTag() {
    const div = document.createElement("div");
    div.className = "no_contents";
    div.innerHTML = '<span class="text">등록된 명함이 없습니다.</span>';
    return div;
}

function makeCardListTag() {
    const div = document.createElement('div');
    div.className = "card_list_box";
    div.innerHTML = `
		<div class="card_list_top">
			<div class="btn_left_box">
				<div class="top_btn_left">
					<button class="top_list_btn">
						<input type="checkbox" id="check" class="check_btn">
						<label for="check"></label>
					</button>
					<button class="top_btn more">
						<span></span>
					</button>
				</div>
				<div class="drop_menu hidden">
					<ul>
						<li>현재 페이지 선택</li>
						<li>전체 페이지 선택</li>
						<li>선택 안함</li>
					</ul>
				</div>
			</div>
			<div class="top_right">
				<select class="top_select">
					<option label="등록일순" value="">등록일순</option>
					<option label="이름순" value="">이름순</option>
					<option label="회사명순" value="">회사명순</option>
				</select>
			</div>
			<div class="top_right hide">
				<button class="t_btn edit">팀 명함첩으로 복제</button>
				<div class="t_btn_box">
					<button class="t_btn send group">그룹설정</button>
					<button class="t_btn send">
						<span class="btn_more"></span>
					</button>
				<div class="drop_menu group hidden">
					<ul>
						<li>단체메일</li>
						<li>내보내기</li>
						<li>삭제</li>
					</ul>
				</div>
				</div>
			</div>
		</div>
		<div class="list_select hide">
			이 페이지의 명함 3장이 모두 선택되었습니다.
		</div>

		<div class="list_group">
			
		</div>
		<div class="list_page">
			<button class="page btn left">«</button>
			<div class="pager">
				<div class="page"></div>
				<div class="page"></div>
				<div class="page current"></div>
				<div class="page"></div>
				<div class="page"></div>
			</div>
			<button class="page btn right">»</button>
		</div>

	`;
    return div;
}

function appendCardListTag(card_list) {
    const list_group = document.querySelector(".list_group");
    let prev_date;
    for (let i = 0; i < card_list.length; i++) {
        const create_date = makeCardCreateDate(card_list[i].create_date);
        if (prev_date == create_date) {
            // 날짜 출력 X card만 출력
            const department_text = makeDepartmentText(card_list[i].department_name, card_list[i].position_name);
            const groups = list_group.querySelectorAll(".all_card_list");
            const div = groups[groups.length - 1];
            div.innerHTML += `
				<div class="card_list_con">
					<div class="list_con_check">
						<input type="checkbox" id="check" class="check_btn">
						<label for="check"></label>
					</div>
					<div class="list_con_info">
						<div class="list_info name">
							<span>${card_list[i].name}</span>
						</div>
		${department_text == null ? '' : '<div class="list_info position">' + department_text + '</div>'}
		${card_list[i].company_name == null ? '' : '<div class="list_info company">' + card_list[i].company_name + '</div>'}
					</div>
				</div>
			`;
        } else {
            const department_text = makeDepartmentText(card_list[i].department_name, card_list[i].position_name);
            const div = document.createElement('div');
            div.className = "all_card_list";
            div.innerHTML = `
				<div class="card_list_title">${create_date}</div>
				<div class="card_list_con">
					<div class="list_con_check">
						<input type="checkbox" id="check" class="check_btn">
						<label for="check"></label>
					</div>
					<div class="list_con_info">
						<div class="list_info name">
							<span>${card_list[i].name}</span>
						</div>
		${department_text == null ? '' : '<div class="list_info position">' + department_text + '</div>'}
		${card_list[i].company_name == null ? '' : '<div class="list_info company">' + card_list[i].company_name + '</div>'}
					</div>
				</div>
			`;
            list_group.appendChild(div);
            prev_date = create_date;
        }
    }
}

function makeCardcopyToTeamModal() {
	const div = document.createElement("div");
	div.className = "note_modal";
	div.innerHTML= `
		<div class="note_modal_content ">
			<div class="note_content card">
				<button class="close_btn copy_close">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
				<div class="modal_header">
					팀 명함첩으로 복제
				</div>
				<div class="modal_body">
					<ul class="team_group_con">
						<li>
							<div class="group_name">test</div>
							<div class="group_item">
								<input type="checkbox" id="check" class="check_btn">
								<div class="item_con">
									<div class="item_title">그룹이름</div>
									<div class="item_info">0/100장 등록</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="modal_footer">
					<div class="footer_con">
						<label for="memo_check" class="memo_msg">	
							<input type="checkbox" id="memo_check" class="check_btn">
							<span>메모 정보를 포함</span>
						</label>
						<button class="team_card_btn copy_close">취소</button>
						<button class="team_card_btn ok">확인</button>
					</div>
				</div>
			</div>
		</div>
	`;
	appendModalToContainer(div);
	const close_buttons = div.querySelectorAll('.copy_close');
	close_buttons.forEach(e => e.onclick = () => div.remove());
}

function makeDepartmentText(department_name, position_name) {
    return position_name != null && department_name != null ? position_name + " / " + department_name :
        position_name == null && department_name == null ? null :
            position_name == null ? department_name : position_name;
}

function makeCardCreateDate(create_date) {
    const date = new Date(create_date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

function makeCardDate(create_date) {
    const date = new Date(create_date);
    date.getFullYear();
    const month = date.getMonth() + 1;
    const day = String(date.getDate());
    return `${date.getFullYear()}년 ${month}월 ${day}일 `;
}

function makeCardDetailTag(card_detail) {
    console.log(card_detail);
	
    const position_text = makeDepartmentText(card_detail.card.department_name, card_detail.card.position_name);
    const cardDate = makeCardDate(card_detail.card.create_date);
    console.log(cardDate);
    const div = document.createElement('div');
    div.className = "detail_box";
    div.innerHTML = `
		<div class= "detail_top">
			<div class="top_btn">
				<button class="t_btn edit">편집</button>
				<div class="t_btn_box">
					<button class="t_btn send">전달</button>
					<button class="t_btn send">
						<span class="btn_more"></span>
					</button>
					<div class="send_drop_menu hidden">
						<ul>
							<li>입력오타 신고</li>
							<li>팀 명함첩으로 복제</li>
							<li>명함 삭제</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class = "detail_body">
			<div class="detail_profile">
	            <div class="profile_box">
	                <span class="detail_profile_img">
	                    <img src=${card_detail.card.profile_img == null ? '/static/images/default_profile_image.png' : '/image/profile_images/' + card_detail.card.profile_img} alt="프로필 기본">
	                </span>
	                <div class="profile_info">
	                    <div class="profile_name">${card_detail.card.name}</div>
${position_text == null ? '' : '<div class="profile_position">' + position_text + '</div>'} 
${card_detail.card.company_name == null ? '' : '<div class="profile_company">' + card_detail.card.company_name + '</div>'}
	                </div>
	            </div>
	        </div>
	        <div class="profile_detail">
	            <div class="profile_detail_info">
	                <div class="info_box">
	                    <div class="info_title">이메일</div>
	                    <div class="info_con_box">
	 ${card_detail.card.email == null ? '<div class="info_group_value">이메일 없음</div>' :
            '<div class="info_con  link">' + card_detail.card.email + '</div>'}  
	                    </div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">휴대폰</div>
	                    <div class="info_con_box">
	 ${card_detail.card.phone == null ? '<div class="info_group_value">휴대폰 번호 없음</div>' :
            '<div class="info_con">' + card_detail.card.phone + '</div>'}                       
	                    </div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">유선전화</div>
	                    <div class="info_con_box">
	 ${card_detail.card.landline_phone == null ? '<div class="info_group_value">유선전화 번호 없음</div>' :
            '<div class="info_con">' + card_detail.card.landline_phone + '</div>'}  
	                    </div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">팩스</div>
	                    <div class="info_con_box">
	 ${card_detail.card.fax == null ? '<div class="info_group_value">팩스 번호 없음</div>' :
            '<div class="info_con">' + card_detail.card.fax + '</div>'}  
	                    </div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">그룹</div>
					    <div class = "info_con_box">
					    	
					    </div>
	                </div>
	            </div>
	            <div class="profile_detail_info">
	                <div class="info_box">
	                    <div class="info_title">주소</div>
	                    <div class="info_con_box">    
	 ${card_detail.card.address == null ? '<div class="info_group_value">주소 없음</div>' :
            '<div class="info_con link">' + card_detail.card.address + card_detail.card.sub_address + '</div>'}  
	                	</div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">등록일</div>
	                    <div class="info_con_box">
	                        <div class="info_con">${makeCardDate(card_detail.card.create_date)}</div>
	                    </div>
	                </div>
	        	</div>  
	        </div>
         <div class="profile_memo">
            <div class="info_title">메모</div>
                <div class="info_con_box">
                    ${card_detail.memo_list.length == 0 ? '<span class="no_content">메모 없음</span>' : '<div class="info_memo_value"></div>'}
                </div>
             </div>
        </div>
   	 	</div>
        <div class="add_memo">
            메모를 추가하세요 
            <button class="t_btn memo">+ 메모추가</button>
        </div>
	`;

    return div;
}

function makeJoinedGroupTag(group_list) {
	let group_text = "";
	group_list.forEach(e => {
		if(e.group_name != "미분류 명함") group_text += e.group_name + ", ";
	});
	if(group_text == "") {
		group_text = "미분류";
	} else {
		group_text = group_text.substring(0, group_text.lastIndexOf(","));
	}
	const span = document.createElement('span');
	span.className = "info_group_value"; 
	span.innerHTML =`${group_text}<span class="info_group_set"><img src="/static/images/card_team_edit_group.png" class="group_set_img"></span>`;
	
	return span;
}

function makeAddMemoTag(memo) {
	const div = document.createElement("div");
	div.className = "memo";
	div.innerHTML = `
		<div class="title">
			<span class="text">${memo.create_date.replace('T', ' ')}</span>
			<button type="button" class="show_edit_memo_modal">
				<img src="/static/images/card_team_edit_memo.png">
			</button>
			<button type="button" class="show_remove_memo_modal">
				<img src="/static/images/card_team_remove_memo.png">
			</button>
		</div>
		<div class="memo_contents">${memo.contents}</div>
	`;
	return div;
}

function makeUpdateCardMemoModal(memo) {
	const div = document.createElement('div');
	div.className = "note_modal";
	div.innerHTML =`
		<div class="note_modal_content ">
			<div class="note_content memo">
				<div class="memo_header">
					<button class="close_btn">
						<img src="/static/images/card_modal_close.png" alt="닫기버튼">
					</button>
					<h1>메모 수정</h1>
				</div>
				<div class="memo_body">
					<span>${memo.update_date.replace("T", " ")}에 마지막 수정</span>
					<div class="memo_write">
						<textarea class="memo_text" rows="4" placeholder="내용을 입력해 주세요."max-length="1000" >${memo.contents}</textarea>
				<div class="memo_buttons">
					<div class="memo_btn cancel"><button type="button">취소</button></div>
					<div class="memo_btn save"><button type="button">저장</button></div>
				</div>
					</div>
				</div>
			</div>
		</div>
	`;
	
	return div;
}



function makeAddMemoModal(){
	const div = document.createElement('div');
	div.className = "note_modal";
	div.innerHTML =`
		<div class="note_modal_content ">
			<div class="note_content memo">
				<div class="memo_header">
					<button class="close_btn memo_close">
						<img src="/static/images/card_modal_close.png" alt="닫기버튼">
					</button>
					<h1>메모 추가</h1>
				</div>
				<div class="memo_body">
					<div class="memo_write">
						<textarea class="memo_text" rows="4" placeholder="내용을 입력해 주세요."max-length="1000"></textarea>
				<div class="memo_buttons">
					<div class="memo_btn memo_close"><button type="button">취소</button></div>
					<div class="memo_btn save"><button type="button">저장</button></div>
				</div>
					</div>
				</div>
			</div>
		</div>
	`;
	appendModalToContainer(div);
	setTimeout(() => {
		div.querySelector('.memo_text').focus();
	}, 150);
	
	const close_buttons = div.querySelectorAll('.memo_close');
	close_buttons.forEach(e => e.onclick = () => removeModal(div));
	
	return div;
}

function makeGroupTag(group_data) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card_group";
    button.innerHTML = `
    	<div class="group_box">
			<span class="sub_group_arrow"></span>
    		<span class="group_text">${group_data.group_name} (<span class="group_count">${group_data.card_count}</span>)</span>
    	</div>
    	<div class="group_more">
    		<button class="group_btn"><span class="group_btn_arrow"></span></button>
    		<div class="drop_menu side_group hidden">
					<ul>
						<li class="group">그룹명 변경</li>
						<li class="group">그룹 삭제</li>
					</ul>
				</div>
    	</div>
	`;
    return button;
}

function changeGroupNameTag(group_data) {
	const div = document.createElement('div');
	div.className = "change_input";
	div.innerHTML =`
		<input type="text" name="group_name" value = ${group_data.group_name}>	
	`;
	return div;
}

function makeAddGroupBoxTag() {
    const add_group_box_tag = add_group_input_wrapper.querySelector('.add_group_box');
    if (add_group_box_tag == null) {
        const div = document.createElement("div");
        div.className = "add_group_box";
        div.innerHTML = `
			<input type="text" class="add_group_input" name="group_name" placeholder="그룹명 입력">
			<div class="add_group_close">
				<img class="add_group_close_btn" src="/static/images/card_add_group_close.PNG" alt="닫기버튼">
			</div>
		`;
        add_group_input_wrapper.appendChild(div);
        const add_group_input_close_button = div.querySelector('.add_group_close_btn');
        add_group_input_close_button.onclick = () => {
            div.remove();
        }
        const add_group_input = div.querySelector('.add_group_input')
        add_group_input.onkeypress = function () {
            if (window.event.keyCode == 13) {
                console.log(add_group_input.value);
                const new_group_id = insertNewGroup(add_group_input.value);
                if (new_group_id > 0) {
	                const before_element = my_card.children[4];
	                const new_group_obj = {"id":new_group_id,
                						   "group_name": add_group_input.value,
                						   "card_count": 0 };
	                const group_tag = makeGroupTag(new_group_obj);
	                my_card.insertBefore(group_tag, before_element);
	                add_group_input_wrapper.querySelector('.add_group_box').remove();
	                
	                group_tag.onclick = (event) => {
						if(event.target.className == "group_btn") {
							const group_drop = group_tag.querySelector('.drop_menu');
							const drop_menu_tag_list = group_drop.querySelectorAll('.drop_menu ul li');
			
							group_drop.classList.toggle('hidden');
							
							drop_menu_tag_list[0].onclick = () => {
								const change_name_tag = changeGroupNameTag(new_group_obj);
								const input = change_name_tag.querySelector('.change_input input');
								group_tag.innerHTML= '';
								group_tag.appendChild(change_name_tag);
								input.onkeypress = () => {
									if(window.event.keyCode == 13) {
										if(updateGroupName(new_group_obj.id, input.value)) {
											location.reload();
										} else {
											alert("그룹명 변경 실패");
										}
									}
								}
							}
							drop_menu_tag_list[1].onclick = () => {
								const delete_group_modal = makeDeleteGroupModal(new_group_obj);
								appendModalToContainer(delete_group_modal);
								
								delete_group_modal.querySelector(".add_close_btn").onclick = () => removeModal(delete_group_modal);
								
								const delete_button = delete_group_modal.querySelector(".footer_btn button");
								delete_button.onclick = () => {
									if(deleteGroup(new_group_obj.id)) {
										location.reload();
									} else {
										alert("그룹 삭제 실패");
									}
								}
							}
						} else {
							console.log(new_group_obj.id);
							card_list = getCardListInSpecificGroup(new_group_obj.id);
							console.log(card_list);
							setCardList();
						}
					}
	            } else {
	                alert("그룹 생성 실패");
	            }
            }
        };
    }
}