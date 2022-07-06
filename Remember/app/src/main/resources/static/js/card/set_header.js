const container = document.querySelector('.container');
const header_email = document.querySelector('.header_wrapper .email');
const card_tabs = document.querySelector('.card_tabs');
const team_tab_button = document.querySelector("#team_tab_button");

console.log(principal);

header_email.innerText = principal.email;

card_tabs.onclick = executeMultipleEvents;

team_tab_button.onclick = (event) => {
	event.preventDefault();
	if(ajax.isTeamJoined()) {
		location.href = "/card/team";
	} else {
		location.href = "/card/team-empty";
	}
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
		const alert_modal = makeAlertModal();
		appendModalToContainer(alert_modal);
		
		alert_modal.querySelector(".close_modal").onclick = () => removeModal(alert_modal);
		
	} else if(event.target.className == 'add_business_card') {
		const add_menu_modal = makeAddMenuModal();
		appendModalToContainer(add_menu_modal);
		
		add_menu_modal.querySelector('.close_modal').onclick = () => removeModal(add_menu_modal);
		
		const buttons = add_menu_modal.querySelectorAll('.method');
		buttons[2].onclick = () => {
			const add_card_form_tag = makeAddCardFormTag();
			replaceTagInMainContents(add_card_form_tag);
			
			document.querySelector('.my_business_card').classList.add("hidden");
			removeModal(add_menu_modal);
			
			const add_profile_image_button = add_card_form_tag.querySelector('.profile_image > button');
			const image_input = add_card_form_tag.querySelector('.profile_image > input');
			const image_tag = add_card_form_tag.querySelector('.profile_image > img');
			
			add_profile_image_button.onclick = () => image_input.click();
			image_input.onchange = (event) => {
				changeCardImage(event, image_tag);
			}
			
			add_card_form_tag.querySelector('.cancel_button').onclick = () => location.reload();
			
			add_card_form_tag.querySelector('.submit_button').onclick = () => {
				const inputs = add_card_form_tag.querySelectorAll(".details input");
				const formdata = makeFormDataForInsertCard(inputs, image_tag.src.startsWith("data") ? image_input.files[0] : null);
				if(add_card_form_tag.querySelector("input[name='name']").value == "") {
					alert("이름은 필수로 입력하셔야합니다.");
				} else {
					if(location.pathname.includes("team")) {
						formdata.append("card_book_id", service_object.selected_card_book.id);
					}
					const new_card_id = ajax.insertNewCard(formdata);
					if(new_card_id > 0) {
						const new_card_detail = ajax.loadCardDetail(new_card_id);
						const card_detail_tag = makeCardDetailTag(new_card_detail);
						
						replaceTagInMainContents(card_detail_tag);
						
						document.querySelector('.my_business_card').classList.remove("hidden");
						
						const edit_card_button = card_detail_tag.querySelector(".edit_card");
						edit_card_button.onclick = () => {
							const edit_card_form = makeEditCardFormTag(new_card_detail);
							card_detail_tag.classList.add("hidden");
							appendTagToMainContents(edit_card_form);
							
							let front_card_image_file;
							let back_card_image_file;
							const card_image_wrapper = edit_card_form.querySelector(".card_image_wrapper");
							const card_image_input_wrapper = edit_card_form.querySelector(".card_image_wrapper > .input_wrapper");
							const card_image_input = card_image_input_wrapper.querySelector("input");
					
							let clicked_card;
					
							if(new_card_detail.card_images.length > 0) {
								const front = makeCardImageTag(card_detail.card_images[0].card_image, true, true);
								card_image_wrapper.insertBefore(front, card_image_input_wrapper);
								front.querySelector(".change_image").onclick = () => {
									clicked_card = "front";
									card_image_input.click();
									card_image_input_wrapper.querySelector(".text").innerText = "뒷면 추가";
								}
								if(new_card_detail.card_images.length > 1) {
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
								card_detail_tag.classList.remove("hidden");
							}
							
							edit_card_form.querySelector(".submit_button").onclick = () => {
								const card_inputs = edit_card_form.querySelectorAll(".row input");
								if(card_inputs[0].value == "") {
									alert("이름은 필수로 입력해야합니다");
									return;
								}
								const formdata = makeFormDataForUpdateCard(card_detail.card.profile_img, card_inputs, front_card_image_file, back_card_image_file, profile_image_file);
								if(ajax.updateCard(new_card_detail.card.id, formdata)) {
									location.reload();
								} else {
									alert("명함 수정에 실패했습니다.");
								}
							}
						}
						
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
									const report_modal = makeReportModal();
									appendModalToContainer(report_modal);
									
									const report_items = report_modal.querySelectorAll(".input_wrapper");
									const send_button = report_modal.querySelector(".send_button");
									
									report_modal.querySelector(".close_modal").onclick = () => removeModal(report_modal);
									
									report_items.forEach(e => {
										e.onclick = () => {
											const checkbox = e.querySelector("input");
											checkbox.click();
											if(checkbox.checked) send_button.disabled = false;
											else {
												let check_count = 0;
												report_items.forEach(e1 => {
													if(e1.querySelector("input").checked) check_count++;
												});
												if(check_count == 0) send_button.disabled = true;
											}
										}
									});
								}
								
								menu_list.querySelector("#save_to_team").onclick = () => {
									// 내 명함첩에 저장 모달
									const team_list = ajax.loadJoinedTeamList();
									const save_to_team_modal = makeCardCopyToTeamModal();
									for(let i = 0; i < team_list.length; i++) {
										const team_tag = makeTeamWithCardBooksTag(team_list[i]);
										
										save_to_team_modal.querySelector(".card_book_list").appendChild(team_tag);
									}
									appendModalToContainer(save_to_team_modal);
									console.log(team_list);
									
									const card_book_list = new Array();
									team_list.forEach(e => {
										e.card_books.forEach(e1 => card_book_list.push(e1));
									});
									
									console.log(card_book_list);
									
									const memo_include_input = save_to_team_modal.querySelector("input[name='include_memo']");
									const memo_include_span = memo_include_input.nextElementSibling;
									const card_books = save_to_team_modal.querySelectorAll(".card_book");
									const card_book_checkboxes = save_to_team_modal.querySelectorAll(".card_book_selector");
									const submit_button = save_to_team_modal.querySelector(".submit_button");
									
									card_books.forEach((e, index) => {
										e.onclick = () => {
											card_book_checkboxes[index].click();
											if(card_book_checkboxes[index].checked) {
												e.classList.add("checked");
												submit_button.disabled = false;
											} else {
												e.classList.remove("checked");
												let check_count = 0;
												card_book_checkboxes.forEach(e => {
													if(e.checked) check_count++;
												});
												if(check_count == 0) submit_button.disabled = true;
											}
										}
									});
									
									memo_include_span.onclick = () => memo_include_input.click();
									save_to_team_modal.querySelector(".close_modal").onclick = () => removeModal(save_to_team_modal);
									save_to_team_modal.querySelector(".cancel_button").onclick = () => removeModal(save_to_team_modal);
									
									submit_button.onclick = () => {
										submit_button.disabled = true;
										
										const checked_card_book_id_list = new Array();
										
										card_book_checkboxes.forEach((e, index) => {
											if(e.checked) checked_card_book_id_list.push(card_book_list[index].id);
										});
		
										console.log(checked_card_book_id_list);
										
										if(ajax.insertCardToTeam(card_detail.card.id, checked_card_book_id_list, memo_include_input.checked)) {
											alert("팀 명함첩에 저장 완료");
											removeModal(save_to_team_modal);
										} else {
											alert("팀 명함첩에 저장 실패");
											submit_button.disabled = false;
										}
									}
								}
								
								menu_list.querySelector("#delete_card").onclick = () => {
									// 명함 삭제 확인 모달
									const delete_confirm_modal = makeDeleteCardConfirmModal();
									appendModalToContainer(delete_confirm_modal);
									
									delete_confirm_modal.querySelector(".close_modal").onclick = () => removeModal(delete_confirm_modal);
									
									delete_confirm_modal.querySelector(".confirm").onclick = () => {
										if(ajax.deleteCard(card_detail.card.id)) {
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
					} else {
						alert('명함 추가 실패');
					}
				}
			}
		}
	} 
}