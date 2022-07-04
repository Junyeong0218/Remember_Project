const whole_cards = document.querySelector("#whole_cards");
const whole_count = document.querySelector('.whole_count');
const main_contents = document.querySelector(".main_contents");
const add_new_group = document.querySelector('.add_new_group');
const add_group_input_wrapper = document.querySelector('.add_group');
const my_card_book = document.querySelector('.my_card_book');

console.log(principal);

let page = 0;
let total_page_check_flag = false;
let card_order_flag = "reg_data";

let group_list;
let card_list;

let selected_group;

let card_detail;

add_new_group.onclick = () => {
	let add_new_group_input_wrapper = document.querySelector("#add_new_group");
	if(add_new_group_input_wrapper != null) return;
	
	add_new_group_input_wrapper = makeAddNewGroupTag();
	my_card_book.insertBefore(add_new_group_input_wrapper, my_card_book.children[2]);
	
	const group_name_input = add_new_group_input_wrapper.querySelector("input");
	const remove_button = add_new_group_input_wrapper.querySelector("button");
	
	group_name_input.focus();
	
	remove_button.onclick = () => add_new_group_input_wrapper.remove();
	group_name_input.onkeypress = (event) => {
		if(event.keyCode == 13) {
			if(group_name_input.value == "") {
				alert("그룹명을 다시 입력해주세요.");
				return;
			}
			group_name_input.onkeypress = null;
			if(ajax.insertNewGroup(group_name_input.value)) {
				location.reload();
			} else {
				alert("그룹 인서트 실패");
			}
		}
	}
}

whole_cards.onclick = () => {
	selected_group = null;
	card_list = ajax.loadCardsInAllGroups(page);
	setCardList();
}

main();

function main() {
	group_list = ajax.loadUserGroups();
	console.log(group_list);
	
	whole_count.innerText = group_list[0].total_count;
	setGroupList();
	
	setTimeout(() => {
		whole_cards.click();
	}, 0);
}

function setGroupList() {
	for (let i = 0; i < group_list.length; i++) {
        let group_tag;
        if(group_list[i].group_name == "미분류 명함") {
			console.log("미분류");
	        group_tag = makeCardGroupTag(group_list[i], true);
		} else {
	        group_tag = makeCardGroupTag(group_list[i], false);
		}
        my_card_book.appendChild(group_tag);
        
        const down_menu = group_tag.querySelector(".down_menu");
        group_tag.onclick = (event) => {
			event.preventDefault();
			
			if(event.target.className == "show_list_button") {
				let menu_list = down_menu.querySelector(".menu_list");
				if(menu_list != null) {
					menu_list.remove();
					return;
				}
				menu_list = makeGroupDownMenuList();
				down_menu.appendChild(menu_list);

				menu_list.querySelector(".change_group_name").onclick = () => {
					let current_index = -1;
					const group_tags = my_card_book.querySelectorAll(".group");
					for(let i = 0; i < group_tags.length; i++) {
						if(group_tags[i] == group_tag) current_index = i + 3;
					}
					
					const change_name_tag = changeGroupNameTag(group_list[i].group_name);
					const group_name_input = change_name_tag.querySelector("input[name='group_name']");
					group_tag.classList.add("hidden");
					my_card_book.insertBefore(change_name_tag, my_card.children[current_index + 1]);

					group_name_input.onkeypress = () => {
						if(window.event.keyCode == 13) {
							if(ajax.updateGroupName(group_list[i].id, group_name_input.value)) {
								location.reload();
							} else {
								alert("그룹명 변경 실패");
							}
						}
					}
				}
				
				menu_list.querySelector(".remove_group").onclick = () => {
					const delete_group_modal = makeDeleteGroupModal(group_list[i].group_name);
					appendModalToContainer(delete_group_modal);
					
					delete_group_modal.querySelector(".close_modal").onclick = () => removeModal(delete_group_modal);
					
					delete_group_modal.querySelector(".delete_group_button").onclick = () => {
						if(ajax.deleteGroup(group_list[i].id)) {
							location.reload();
						} else {
							alert("그룹 삭제 실패");
						}
					}
				}
			} else {
				selected_group = group_list[i];
				card_list = ajax.loadCardsInSpecificGroup(group_list[i].id, page);
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
        const card_list_wrapper_tag = makeCardListTag(card_order_flag);
        replaceTagInMainContents(card_list_wrapper_tag);
        
        const card_list_tag = card_list_wrapper_tag.querySelector(".card_list");
		let prev_upload_date;
		let prev_first_character;
		for(let i = 0; i < card_list.length; i++) {
			if(card_order_flag == "reg_date") {
				const upload_date = makeCardSummaryRegDateText(card_list[i].create_date);
				if(prev_upload_date != upload_date) {
					const upload_date_tag = makeCardOrderStandardTag(upload_date);
					card_list_tag.appendChild(upload_date_tag);
					prev_upload_date = upload_date;
				}
			} else if(card_order_flag == "name") {
				const first_character = makeCardSummaryCharacterText(card_list[i].name);
				if(prev_first_character != first_character) {
					const upload_date_tag = makeCardOrderStandardTag(first_character); 
					card_list_tag.appendChild(upload_date_tag);
					prev_first_character = first_character;
				}
			} else if(card_order_flag == "company_name") {
				const first_character = makeCardSummaryCharacterText(card_list[i].company);
				if(prev_first_character != first_character) {
					const upload_date_tag = makeCardOrderStandardTag(first_character); 
					card_list_tag.appendChild(upload_date_tag);
					prev_first_character = first_character;
				}
			}
			const card_tag = makeCardSummaryTag(card_list[i]);
			card_list_tag.appendChild(card_tag);
        }
        
      	const pager = card_list_wrapper_tag.querySelector(".pager_wrapper > .pager");
        const all_checkbox = card_list_wrapper_tag.querySelector(".card_list_menu .card_selector");
        const check_more = card_list_wrapper_tag.querySelector('.card_list_menu > .down_menu');
        const right = card_list_wrapper_tag.querySelectorAll('.top_right');
        const send_more = card_list_wrapper_tag.querySelectorAll('.send');
        const selcet = card_list_wrapper_tag.querySelector('.list_select');
        const cards = card_list_wrapper_tag.querySelectorAll(".card");
        const checkboxes = card_list_wrapper_tag.querySelectorAll(".list_group .check_btn");
        
        makePageTag(total_card_count, pager.children);
        
        let card_count = 0;
                
		all_checkbox.onclick = (event) => {
			console.log(event.target);
			if(event.target.className.includes("not_max")) {
				event.target.checked = false;
				event.target.classList.remove("not_max");
			}
            cards.forEach(item => item.querySelector(".check_btn").checked = event.target.checked);
            
			card_count = countChecked(checkboxes);
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
				
		const page_selector_wrapper = card_list_wrapper_tag.querySelector('.drop_menu');
		/*check_more.onclick = () => page_selector_wrapper.classList.toggle("hidden");*/

		/*const page_selectors = page_selector_wrapper.querySelectorAll('.drop_menu li');
		page_selectors[0].onclick = () => {
			for(let i = 0; i < checkboxes.length; i++){
				if(checkboxes[i].checked == false) {
					total_page_check_flag = false;
					all_checkbox.click();
				}
			}
			page_selector_wrapper.classList.add("hidden");
		}

		page_selectors[1].onclick = () => {
			for(let i = 0; i < checkboxes.length; i++){
				if(checkboxes[i].checked == false) {
					total_page_check_flag = true;
					all_checkbox.click();
				}
			}
			page_selector_wrapper.classList.add("hidden");
		}
		
		page_selectors[2].onclick = () => {
			for(let i = 0; i < checkboxes.length; i++){
				if(checkboxes[i].checked == true) {
					all_checkbox.click();
				}
			}
			page_selector_wrapper.classList.add("hidden");
		}*/
		
		/*const card_copy_to_team_button = card_list_wrapper_tag.querySelector('.t_btn.edit');
		card_copy_to_team_button.onclick = () => makeCardcopyToTeamModal();
		
		const set_group_button = card_list_wrapper_tag.querySelector('.t_btn.send.group');
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
				checkboxes.forEach((e, index) => {
					if(e.checked) checked_card_id_list.push(card_list[index].id);
				});
				
				const is_success = ajax.updateCardsBelongGroups(checked_card_id_list, selected_group_id_list, default_card_group_id);
				if(is_success) {
					location.reload();
				} else {
					alert("그룹 설정에 실패했습니다.");
				}
			}
		}*/
		
		/*const down_menu_tag_wrapper = card_list_wrapper_tag.querySelector('.drop_menu.group');
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
				const card_id_list = new Array();
				cards.forEach((e, index) => {
					if(e.querySelector('.check_btn').checked) card_id_list.push(card_list[index].id);
				});
				
				if(ajax.deleteCards(card_id_list)) {
					location.reload();
				} else {
					alert("명함 리스트 삭제 실패");
				}
			}
		}*/
		
        for (let i = 0; i < cards.length; i++) {
            cards[i].onclick = () => {
				card_detail = loadCardDetail(card_list[i].id);
				toggleClassClickedCards(cards, i);
				
                //있으면 지우고 
                let card_detail_tag = main_contents.querySelector('.card_detail');
                if (card_detail_tag != null) {
                    card_detail_tag.remove();
                }

                card_detail_tag = makeCardDetailTag(card_detail);
                appendTagToMainContents(card_detail_tag);
                
                const pass_card_button = card_detail_tag.querySelector('.pass_card');
                const down_menu = card_detail_tag.querySelector('.down_menu');
                
                pass_card_button.onclick = () => {
					const send_card_modal = makeSendCardModal(card_detail.name);
					appendModalToContainer(send_card_modal);
					setTimeout(() => {
						send_card_modal.querySelector('.send_card_area').focus();
						send_card_modal.querySelector('.send_card_area').select();
					}, 150);
					
					const close_buttons = send_card_modal.querySelectorAll(".close_modal");
					close_buttons.forEach(e => e.onclick = () => removeModal(send_card_modal));
					
				}
				
				down_menu.onclick = (event) => {
					// detail menu tag toggle
					let menu_list = down_menu.querySelector(".detail_menu");
					if(menu_list == null) {
						menu_list = makeCardDetailMenuTag();
						down_menu.appendChild(menu_list);
						
						menu_list.querySelector("#report_typo").onclick = () => {
							makeReportModal();
						}
						
						menu_list.querySelector("#save_to_team").onclick = () => {
							// 내 명함첩에 저장 모달
							const save_to_personal_modal = makeSaveToPersonalModal(1);
							appendModalToContainer(save_to_personal_modal);
							/*const memo_include_input = save_to_personal_modal.querySelector("input[name='include_memo']");
							
							save_to_personal_modal.querySelector(".close_modal").onclick = () => removeModal(save_to_personal_modal);
							
							save_to_personal_modal.querySelector(".save_button").onclick = () => {
								if(ajax.insertTeamCardToPersonal(service_object.selected_card_detail.id, memo_include_input.value)) {
									alert("팀 명함첩에 저장 완료");
									removeModal(save_to_personal_modal);
								} else {
									alert("팀 명함첩에 저장 실패");
								}
							}*/
						}
						
						menu_list.querySelector("#delete_card").onclick = () => {
							// 명함 삭제 확인 모달
							const delete_confirm_modal = makeDeleteCardConfirmModal();
							appendModalToContainer(delete_confirm_modal);
							
							delete_confirm_modal.querySelector(".close_modal").onclick = () => removeModal(delete_confirm_modal);
							
							delete_confirm_modal.querySelector(".confirm").onclick = () => {
								if(ajax.deleteCard(service_object.selected_card_detail.id)) {
									location.reload();
								} else {
									alert("명함 삭제에 실패했습니다.");
								}
							}
						}
					} else if(event.target.className == "down_menu") {
						menu_list.remove();
					}
				}
				
				const card_list_wrapper = main_contents.querySelector(".card_list_wrapper");

				const edit_card_button = card_detail_tag.querySelector(".edit_card");
				edit_card_button.onclick = () => {
					const edit_card_form = makeEditCardFormTag(card_detail);
					card_list_wrapper.classList.add("hidden");
					card_detail_tag.classList.add("hidden");
					appendTagToMainContents(edit_card_form);
					
					let front_card_image_file;
					let back_card_image_file;
					const card_image_wrapper = edit_card_form.querySelector(".card_image_wrapper");
					const card_image_input_wrapper = edit_card_form.querySelector(".card_image_wrapper > .input_wrapper");
					const card_image_input = card_image_input_wrapper.querySelector("input");
			
					let clicked_card;
			
					if(card_detail.card_images.length > 0) {
						const front = makeCardImageTag(card_detail.card_images[0].card_image, true, true);
						card_image_wrapper.insertBefore(front, card_image_input_wrapper);
						front.querySelector(".change_image").onclick = () => {
							clicked_card = "front";
							card_image_input.click();
							card_image_input_wrapper.querySelector(".text").innerText = "뒷면 추가";
						}
						if(card_detail.card_images.length > 1) {
							const back = makeCardImageTag(card_detail.card_images[1].card_image, false, true);
							card_image_wrapper.insertBefore(back, card_image_input_wrapper);
							back.querySelector(".change_image").onclick = () => {
								clicked_card = "back";
								card_image_input.click();
							}
							card_image_input_wrapper.classList.add("hidden");
						}
					}
					
					card_image_input_wrapper.onclick = () => {
						card_image_input.click();
					}
					
					card_image_input.onchange = () => {
						const file_reader = new FileReader();
						
						file_reader.onloadend = (event) => {
							if(clicked_card == "front") {
								clicked_card = null;
								card_image_wrapper.querySelector(".front > img").src = event.target.result;
								front_card_image_file = card_image_input.files[0];
							} else if(clicked_card == "back") {
								clicked_card = null;
								card_image_wrapper.querySelector(".back > img").src = event.target.result;
								back_card_image_file = card_image_input.files[0];
							} else if(front_card_image_file == null) {
								const card_image_tag = makeCardImageTag(event.target.result, true, false);
								card_image_wrapper.insertBefore(card_image_tag, card_image_input_wrapper);
								
								card_image_tag.querySelector(".change_image").onclick = () => {
									clicked_card = "front";
									card_image_input.click();
								}
								front_card_image_file = card_image_input.files[0];
								card_image_input_wrapper.querySelector(".text").innerText = "뒷면 추가";
							} else {
								const card_image_tag = makeCardImageTag(event.target.result, false, false);
								card_image_wrapper.insertBefore(card_image_tag, card_image_input_wrapper);
								
								card_image_tag.querySelector(".change_image").onclick = () => {
									clicked_card = "back";
									card_image_input.click();
								}
								back_card_image_file = card_image_input.files[0];
								card_image_input_wrapper.classList.add("hidden");
							}
							console.log(front_card_image_file);
							console.log(back_card_image_file);
						}
						
						file_reader.readAsDataURL(card_image_input.files[0]);
					}
					
					let profile_image_file;
					const profile_image_tag = edit_card_form.querySelector(".profile_image > img");
					const profile_image_input = edit_card_form.querySelector(".profile_image > input");
					
					edit_card_form.querySelector(".set_profile_image").onclick = () => profile_image_input.click();
					
					profile_image_input.onchange = () => {
						const file_reader = new FileReader();
						
						file_reader.onloadend = (event) => {
							profile_image_tag.src = event.target.result;
							profile_image_file = profile_image_input.files[0];
						}
						
						file_reader.readAsDataURL(profile_image_input.files[0]);
					}
					
					edit_card_form.querySelector(".cancel_button").onclick= () => {
						edit_card_form.remove();
						card_list_wrapper.classList.remove("hidden");
						card_detail_tag.classList.remove("hidden");
					}
					
					edit_card_form.querySelector(".submit_button").onclick = () => {
						const card_inputs = edit_card_form.querySelectorAll(".row input");
						if(card_inputs[0].value == "") {
							alert("이름은 필수로 입력해야합니다");
							return;
						}
						const formdata = makeFormDataForUpdateCard(card_inputs, front_card_image_file, back_card_image_file, profile_image_file);
						if(ajax.updateCard(service_object.selected_card_detail.id, formdata)) {
							edit_card_form.remove();
							card_list_wrapper.classList.remove("hidden");
							card_detail_tag.classList.remove("hidden");
							reloadCardDetail();
						} else {
							alert("명함 수정에 실패했습니다.");
						}
					}
				}
				
				const joined_group_tag = makeJoinedGroupTag(card_detail.group_list);
				const left_rows = card_detail_tag.querySelectorAll('.left .row');
				left_rows[4].appendChild(joined_group_tag);
				
				const change_group_button = joined_group_tag.querySelector('.change_group_button');
				change_group_button.onclick = () => {
					const groups = ajax.loadUserGroups();
					
					const move_group_modal = makeChangeGroupModal(1);
					appendModalToContainer(move_group_modal);
					
					move_group_modal.querySelector(".close_modal").onclick = () => removeModal(move_group_modal);
					
					const add_new_group_in_modal = move_group_modal.querySelector(".add_new_group");
					
					for(let i = 0; i < groups.length; i++) {
						if(groups[i].group_name == "미분류") break;
						const group_tag = makeGroupTagForMultipleModal(false, groups[i].group_name);
						move_group_modal.insertBefore(group_tag, add_new_group_in_modal);
						
						group_tag.onclick = () => group_tag.querySelector("input").click();
					}
					
					const default_card_group_id = groups[groups.findIndex(e => e.group_name == "미분류 명함")].id;
					const complete_button = move_group_modal.querySelector('.set_group_button');
					
					complete_button.onclick = () => {
						const selected_group_id_list = new Array();
						const group_tag_list = move_group_modal.querySelectorAll(".group");
						group_tag_list.forEach((e, index) => {
							if(e.checked) selected_group_id_list.push(groups[index].id);
						});
						
						const checked_card_id_list = new Array();
						checkboxes.forEach((e, index) => {
							if(e.checked) checked_card_id_list.push(card_list[index].id);
						});
						
						const is_success = ajax.updateCardsBelongGroups(card_detail.card.id, selected_group_id_list, default_card_group_id);
						if(is_success) {
							location.reload();
						} else {
							alert("그룹 수정 실패");
						}
					}
				}
				
				const memo_wrapper = card_detail_tag.querySelector('.memo_list_wrapper > .memo_list');
				for(let i = 0; i < card_detail.memo_list.length; i++) {
					const memo = makeMemoTag(card_detail.memo_list[i]);
					memo_wrapper.appendChild(memo);
					
					memo.querySelector('.show_edit_memo_modal').onclick = () => {
						const update_memo_modal = makeUpdateCardMemoModal(card_detail.memo_list[i]);
						const contents = update_memo_modal.querySelector("textarea");
						const submit_button = update_memo_modal.querySelector(".submit_button");
						appendModalToContainer(update_memo_modal);
						
						update_memo_modal.querySelector('.close_modal').onclick = () => removeModal(update_memo_modal);
						update_memo_modal.querySelector('.cancel_button').onclick = () => removeModal(update_memo_modal);
						
						contents.oninput = (event) => {
							if(event.target.value == "") {
								submit_button.disabled = true;
							} else {
								submit_button.disabled = false;
							}
						}
						
						submit_button.onclick = () => {
							if(ajax.updateCardMemo(card_detail.memo_list[i].id, contents.value)) {
								location.reload();
							} else {
								alert("메모 수정 실패");
							}
							removeModal(update_memo_modal);
						}
					}
				}
				
				const add_memo_button = card_detail_tag.querySelector('.memo_input');
				add_memo_button.onclick = () => {
					const memo_modal = makeAddCardMemoModal();
					const memo_input = memo_modal.querySelector("textarea");
					const save_memo_button = memo_modal.querySelector(".submit_button");
					appendModalToContainer(memo_modal);
					
					setTimeout(() => {
						memo_input.focus();
					}, 150);
					
					memo_input.oninput= () => {
						if(memo_input.value == "") {
							save_memo_button.disabled = true;
						} else {
							save_memo_button.disabled = false;
						}
					}
					
					save_memo_button.onclick = () => {
						if(ajax.insertCardMemo(card_detail.card.id, memo_input.value)) {
							removeModal(memo_modal);
							cards.forEach(e => {
								if(e.className.includes("clicked")) {
									e.click();
								}
							});
						} else {
							alert("메모 저장 실패");
						}
					}
				}
				// 여기까지 수정함
			}
		}
	    if (cards.length > 0) cards[0].click();
	    
	    for(let i = 0; i < checkboxes.length; i++) {
			checkboxes[i].onclick = (event) => {
				if(event.target.checked) cards[i].classList.add("color");
				else cards[i].classList.remove("color");
				
				card_count = countChecked(checkboxes);
				
				const unchecked_count = checkboxes.length - card_count;
				
				if(card_count == 0) {
					all_checkbox.classList.remove("not_max");
					all_checkbox.checked = false;
					toggleCardListTitleRight(right, false);
					selcet.classList.add('hide');	
					
				} else if(card_count == checkboxes.length) {
					console.log("max");
					all_checkbox.classList.remove("not_max");
					all_checkbox.checked = true;
					selcet.innerText = total_page_check_flag ? `전체 페이지의 명함 ${total_card_count - unchecked_count}장이 모두 선택되었습니다.` : `이 페이지의 명함 ${card_count}장이 모두 선택되었습니다.`;	
				
				} else if(card_count > 0 && card_count < checkboxes.length) {
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
				card_list = selected_group == null ? loadCardsInAllGroups(page) : 
																				   loadCardsInSpecificGroup(selected_group.id, page);
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

function countChecked(checkboxes) {
	let count = 0;
	checkboxes.forEach(checkBox => {
		if(checkBox.checked) count++;
	});
	return count;
}

function toggleClassClickedCards(cards, current_index) {
	cards.forEach((item, index) => {
	    if (index != current_index) item.classList.remove("clicked");	
    	else 						item.classList.add("clicked");
	});
}

function moveGroupModal(card_count, group_list) {
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
	span.className = `description ${group_text == "미분류" ? "blank" : ""}`; 
	span.innerHTML =`${group_text}<button type="button" class="change_group_button"><img src="/static/images/card_team_edit_group.png"></button>`;
	
	return span;
}