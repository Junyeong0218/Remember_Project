const team_members_button = document.querySelector(".menus .members");
const team_manage_button = document.querySelector(".menus .team_manage");
const change_team_button = document.querySelector(".menus .change_team");

const upgrade_goods = document.querySelector(".menus .upgrade_goods");

const card_book_wrapper = document.querySelector(".menus .card_books");
const add_new_card_book_button = document.querySelector(".menus .add_new_card_book");

const groups = document.querySelector(".menus .groups");
const add_new_group_button = document.querySelector(".menus .add_new_group");
const whole_card_button = document.querySelector("#whole_cards");

const group_wrapper = document.querySelector(".menus .groups");

const card_book_members_button = document.querySelector(".card_book_members_button");
const card_book_settings_button = document.querySelector(".card_book_settings_button");
const main_contents = document.querySelector(".main_contents");

const service_object = {
	principal_profile: null,
	
	team_list: null,
	card_book_list: null,
	group_list: null,
	card_list: null,

	selected_team: null,
	selected_card_book: null,
	selected_group: null,
	selected_card: null,
	selected_card_detail: null
};

let page = 0;

let page_check_flag = "current";

let card_order_flag = "reg_date";

main();

function main() {
	service_object.principal_profile = ajax.loadPrincipalProfile();
	
	// load team and set team info
	service_object.team_list = ajax.loadTeams();
	service_object.selected_team = pickTeamOrderByCreateDate(service_object.team_list);
	setTeamInfo();
	
	// load card book about selected team and set card book list
	service_object.card_book_list = ajax.loadCardBooks(service_object.selected_team.id);
	setCardBookList();

	// load group list about selected card book and set group list
	card_book_wrapper.querySelectorAll(".card_book")[0].click();
	
	// load card list about selected group and page 0 and set card list
	setTimeout(() => {
		whole_card_button.click();
	}, 0);
}

whole_card_button.onclick = () => {
	service_object.selected_group = null;
	service_object.card_list = ajax.loadTeamCardsInCardBook(service_object.selected_card_book.id, page, card_order_flag);
	console.log(service_object.card_list);
	setCardList();
}

team_members_button.onclick = () => {
	// ????????? ????????? ??? ?????? ??????
	page = 0;
	
	const team_member_list = ajax.loadTeamMembers(service_object.selected_team.id, page);
	if(team_member_list.length == 1 && team_member_list[0].total_count == 0) {
		const no_member_tag = makeNoMembersTag();
		replaceTagInMainContents(no_member_tag);
		no_member_tag.querySelector(".invite_member").onclick = () => {
			// ?????? ?????? ??? ?????? ??????
			console.log("?????? ?????? ??? ?????? ??????");
			console.log(ajax.generateNewInviteCode(service_object.selected_team.id));
		}
	} else {
		console.log(team_member_list);
	}
}

upgrade_goods.onclick = () => {
	const products = ajax.loadProductInfo(service_object.selected_team.id);
	console.log(products);
	const products_tag = makeProductDescriptionTag();
	const product_description = products_tag.querySelector(".product_description");
	for(let i = 0; i < products.team_product_list.length; i++) {
		const product_tag = makeProductColumnTag(products.team_product_list[i]);
		product_description.appendChild(product_tag);
	}
	replaceTagInMainContents(products_tag);
	
	const return_to_basic_button = products_tag.querySelector("#return_to_basic");
	if(return_to_basic_button != null) {
		// ??????????????? ?????? ?????? ?????? ??????
		
	}
	
	const buy_premium_button = products_tag.querySelector("#buy_premium");
	if(buy_premium_button != null) {
		// ?????????????????? ?????? ??? ??????
		buy_premium_button.onclick = () => {
			const payment_form = makeInputPaymentInfoForm(products.team_product_list[1].free_flag);
			replaceTagInMainContents(payment_form);
			
			let number_flag = false;
			let check_flag = false;
			
			const number_list = payment_form.querySelectorAll(".number");
			number_list.forEach(e => {
				e.oninput = () => {
					number_flag = false;
					const number_regex = /\D/;
					const result = number_regex.exec(e.value);
					console.log(result);
					if(result != null) e.value = e.value.replace(result[0], ""); 
					if(e.value.length > 3) {
						const number_four_digits_regex = /([0-9]){4}/g;
						const final_result = number_four_digits_regex.exec(e.value);
						console.log(final_result);
						e.value = final_result[0];
						number_flag = true;
						if(number_flag && check_flag) {
							submit_button.disabled = false;
						} else {
							submit_button.disabled = true;
						}
					}
				}
			});
			
			const number_two_digits_list = payment_form.querySelectorAll(".number_two_digits");
			number_two_digits_list.forEach(e => {
				e.oninput = () => {
					number_flag = false;
					const number_regex = /\D/;
					const result = number_regex.exec(e.value);
					console.log(result);
					if(result != null) e.value = e.value.replace(result[0], ""); 
					if(e.value.length > 1) {
						const number_four_digits_regex = /([0-9]){2}/g;
						const result = number_four_digits_regex.exec(e.value);
						console.log(result);
						e.value = result[0];
						number_flag = true;
						if(number_flag && check_flag) {
							submit_button.disabled = false;
						} else {
							submit_button.disabled = true;
						}
					}
				}
			});
			
			const number_six_digits = payment_form.querySelector(".number_six_digits");
			number_six_digits.oninput = e => {
				number_flag = false;
				const number_regex = /\D/;
				const result = number_regex.exec(e.target.value);
				console.log(result);
				if(result != null) e.target.value = e.target.value.replace(result[0], ""); 
				if(e.target.value.length > 5) {
					const number_four_digits_regex = /([0-9]){6}/g;
					const result = number_four_digits_regex.exec(e.target.value);
					console.log(result);
					e.target.value = result[0];
					number_flag = true;
					if(number_flag && check_flag) {
						submit_button.disabled = false;
					} else {
						submit_button.disabled = true;
					}
				}
			}
			
			const submit_button = payment_form.querySelector(".buttons > button");
			const all_checkboxes = payment_form.querySelectorAll(".terms input");
			payment_form.querySelectorAll(".terms > .column").forEach(e => {
				const checkboxes = e.querySelectorAll("input[id*='terms']");
				const whole_checkbox = e.querySelector("input[id*='whole']");
				
				whole_checkbox.onclick = event => {
					checkboxes.forEach(checkbox => {
						checkbox.checked = event.target.checked;
					});
					
					for(let i = 0; i < all_checkboxes.length; i++) {
						if(all_checkboxes[i].checked) {
							check_flag = true;
							if(number_flag && check_flag) {
								submit_button.disabled = false;
							} else {
								submit_button.disabled = true;
							}
						} else {
							check_flag = false;
							submit_button.disabled = true;
							return;
						}
					}
				}
				
				checkboxes.forEach(checkbox => {
					checkbox.onclick = () => {
						let checked_count = 0;
						checkboxes.forEach(element => {
							if(element.checked) checked_count++;
						});
						if(checked_count == checkboxes.length) whole_checkbox.checked = true;
						for(let i = 0; i < all_checkboxes.length; i++) {
							if(all_checkboxes[i].checked) {
								check_flag = true;
								if(number_flag && check_flag) {
									submit_button.disabled = false;
								} else {
									submit_button.disabled = true;
								}
							} else {
								check_flag = false;
								submit_button.disabled = true;
								return;
							}
						}
					}
				});
			});
			console.log(service_object.selected_team);
			submit_button.onclick = () => {
				if(! (number_flag && check_flag)) return;
				submit_button.disabled = true;
				let card_number = "";
				number_list.forEach(number => card_number += number.value + "-");
				card_number = card_number.substring(0, card_number.length - 1);
				
				const expiration_date = "20" + number_two_digits_list[1].value + "-" + number_two_digits_list[0].value;
				const password = number_two_digits_list[2].value;
				const birthday = number_six_digits.value;
				
				const data = {
					"card_number": card_number,
					"expiration_date": expiration_date,
					"password": password,
					"birthday": birthday,
					"name": payment_form.querySelector("input[name='name']").value,
					"phone": payment_form.querySelector("input[name='phone']").value,
					"email": payment_form.querySelector("input[name='email']").value,
					"free_flag": products.team_product_list[1].free_flag,
					"team_id": service_object.selected_team.id,
					"grade_id": products.team_product_list[1].id,
					"price": service_object.selected_team.total_join_user_count * products.team_product_list[1].price
				}
				const flag = ajax.insertCardInfo(data);
				console.log(flag);
				if(flag) {
					location.href = "/card/team";
				} else {
					alert("?????? ?????? ??? ????????? ??????????????????.");
					submit_button.disabled = false;
				}
			}
		}
	}
	const inquery_enterprise_button = products_tag.querySelector("#inquery_enterprise");
	if(inquery_enterprise_button != null) {
		// ?????????????????? ?????? ?????? ??????
		
	}
}

team_manage_button.onclick = () => {
	const team_manage_tag = makeTeamManageTag();
	replaceTagInMainContents(team_manage_tag);
	
	const show_product_description = document.querySelector("#show_product_description");
	show_product_description.onclick = () => upgrade_goods.click();
	
	const show_history = document.querySelector("#show_history");
	show_history.onclick = () => {
		// ??? ?????? ??? ??? ?????? ????????? readOnly
		const team_history = makeShowHistoryTag();
		replaceTagInMainContents(team_history);
	}
	
	const manage_payment = document.querySelector("#manage_payment");
	manage_payment.onclick = () => {
		// ?????? ?????? ??? ???????????? ???????????? ??? ?????????
		const manage_payment_tag = makeManagePaymentTag();
		replaceTagInMainContents(manage_payment_tag);
		
		const show_my_payment_process = manage_payment_tag.querySelector("#show_my_payment_process");
		show_my_payment_process.onclick = () => {
			// ?????? ?????? ??????
			const my_payment_process_tag = makeMyPaymentProcess();
			replaceTagInMainContents(my_payment_process_tag);
		}
		
		const show_my_payment_history = manage_payment_tag.querySelector("#show_my_payment_history");
		show_my_payment_history.onclick = () => {
			// ?????? ?????? ??????
			const my_payment_history_tag = makeMyPaymentHistory();
			replaceTagInMainContents(my_payment_history_tag);
		}
	}
	
	const change_team_name = document.querySelector("#change_team_name");
	change_team_name.onclick = () => {
		// ????????? ?????? ?????? ??????
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
				alert("??? ????????? ????????? ??????????????????.");
			} else if(team_name_input.value == service_object.selected_team.title) {
				alert("?????? ???????????? ?????? ????????? ????????? ??? ????????????.");
			} else {
				if(ajax.updateTeamName(service_object.selected_team.id, team_name_input.value)) {
					location.reload();
				} else {
					alert("??? ?????? ????????? ??????????????????");
				}
			}
		}
	}
	
	const change_profile = document.querySelector("#change_profile");
	change_profile.onclick = () => {
		// ????????? ??? ?????? ?????? ??????
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
				alert("???????????? ????????? ??????????????????.");
			} else if(nickname_input.value == service_object.principal_profile.nickname) {
				alert("?????? ???????????? ?????? ????????? ????????? ??? ????????????.");
			} else {
				if(ajax.updateProfileNickname(service_object.principal_profile.id, nickname_input.value)) {
					location.reload();
				} else {
					alert("????????? ????????? ????????? ??????????????????.");
				}
			}
		}
	}
	
	const invite_member = document.querySelector("#invite_member");
	invite_member.onclick = () => {
		// ????????? ?????? ????????? ???????????? ?????? ??????
		const invite_code = ajax.generateNewInviteCode(service_object.selected_team.id);
		const invite_code_modal = makeInviteTeamModal(invite_code);
		appendModalToContainer(invite_code_modal);
		
		const invite_text = invite_code_modal.querySelector("textarea");
		
		invite_code_modal.querySelector(".close_modal").onclick = () => removeModal(invite_code_modal);
		
		setTimeout(()=> {
			invite_text.focus();
			invite_text.select();
		}, 0);
		
		invite_text.onclick = () => invite_text.select();
	}
	
	const leave_team = document.querySelector("#leave_team");
	leave_team.onclick = () => {
		// ?????? ????????? ?????? ????????? ??????
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
				// ?????? ??? ADMIN ?????? ??? ?????? ????????? ADMIN??? ????????? ?????? ??????
				const leave_flag = ajax.leaveTeam(service_object.selected_team.id);
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
		// ?????? ?????? ?????? ????????? ??????
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
				const delete_flag = ajax.deleteTeam(service_object.selected_team.id);
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
	// ??? ????????? ??? ?????? ?????? ??????
	// ???????????? ????????? ??? ?????? ??????
}

add_new_group_button.onclick = () => {
	let add_new_group_input_wrapper = document.querySelector("#add_new_group");
	if(add_new_group_input_wrapper != null) return;
	
	add_new_group_input_wrapper = makeAddNewGroupTag();
	groups.insertBefore(add_new_group_input_wrapper, groups.children[1]);
	
	const group_name_input = add_new_group_input_wrapper.querySelector("input");
	const remove_button = add_new_group_input_wrapper.querySelector("button");
	
	group_name_input.focus();
	
	remove_button.onclick = () => add_new_group_input_wrapper.remove();
	group_name_input.onkeypress = (event) => {
		if(event.keyCode == 13) {
			if(group_name_input.value == "") {
				alert("???????????? ?????? ??????????????????.");
				return;
			}
			group_name_input.onkeypress = null;
			if(ajax.insertTeamGroup(service_object.selected_card_book.id, group_name_input.value)) {
				card_group_wrapper.querySelectorAll(".card_book").forEach((e, index) => {
					if(service_object.card_book_list[index].id == service_object.selected_card_book.id) e.click();
				});
			} else {
				alert("?????? ????????? ??????");
			}
		}
	}
}

card_book_members_button.onclick = () => {
	// ????????? ?????? ?????? ????????? ??????
	page = 0;
	
	const card_book_member_list = ajax.loadCardBookJoinMembers(service_object.selected_card_book.id, page);
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
	// ????????? ?????? ?????? ??????
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
				alert("????????? ????????? ????????? ??????????????????.");
			} else if(card_book_name_input.value == service_object.selected_card_book.card_book_name) {
				alert("?????? ????????? ????????? ?????? ????????? ????????? ??? ????????????.");
			} else {
				if(ajax.updateCardBookName(service_object.selected_card_book.id = card_book_name_input.value)) {
					location.reload();
				} else {
					alert("????????? ?????? ????????? ??????????????????");
				}
			}
		}
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

function setListPager(total_count) {
	let min_page = page -1;
	const max_page = total_count % 10 == 0 ? Math.floor(total_count / 10) : Math.floor(total_count / 10) + 1;
	const pager_tags = document.querySelector(".pager").children;
	console.log(pager_tags);
	for(let i = 0; i < pager_tags.length; i++) {
		if(min_page < 1 || min_page > max_page) pager_tags[i].classList.add("blank");
		else {
            pager_tags[i].innerText = min_page;
            if (min_page == page + 1) pager_tags[i].classList.add("current");
            else {
                const page_for_event = min_page;
                pager_tags[i].onclick = () => {
                    page = page_for_event - 1;
                    console.log(page);
                    service_object.card_list = service_object.selected_group == null ? ajax.loadTeamCardsInCardBook(service_object.selected_card_book.id, page, card_order_flag) : 
																														  						 ajax.loadTeamCardsInSpecificGroup(service_object.selected_group.id, page, card_order_flag);
                    setCardList();
                }
            }
        }
        min_page++;
	}
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
	team_info.querySelector(".team_name").innerText = service_object.selected_team.title;
	
	const grade_text = service_object.selected_team.grade_id == 1 ? "?????????" : service_object.selected_team.grade_id == 2 ? "????????????" : "??????????????????";
	team_info.innerHTML += `<span class="team_grade ${service_object.selected_team.grade}">${grade_text}</span>`;
	
	const max_card_count_text = service_object.selected_team.grade_id == 1 ? "100???" : "???";
	const storage = document.querySelector(".menus .storage");
	storage.innerHTML = `<span class="team_card_count">${service_object.selected_team.total_card_count}</span>&nbsp;/ ${max_card_count_text} ?????? ???`;
}

function setCardBookList() {
	let card_books = card_book_wrapper.querySelectorAll(".card_book");
	card_books.forEach(e => e.remove());
	
	for(let i = 0; i < service_object.card_book_list.length; i++) {
		const card_book_button = makeCardBookTag(service_object.card_book_list[i]);
		card_book_wrapper.insertBefore(card_book_button, add_new_card_book_button);
		card_book_button.onclick = () => {
			card_books = card_book_wrapper.querySelectorAll(".card_book");
			service_object.selected_card_book = service_object.card_book_list[i];
			addClassActiveToGroup(card_books, i);
			service_object.group_list = ajax.loadTeamGroups(service_object.selected_card_book.id);
			setGroupList();
			console.log("set group");
		}
	}
}

function setGroupList() {
	setWholeGroup(service_object.selected_card_book.card_count);
	group_wrapper.querySelectorAll(".group").forEach(e => {
		if(e.id != "whole_cards") e.remove();
	});
	
	for(let i = 0; i < service_object.group_list.length; i++) {
		let group_button;
		if(service_object.group_list[i].group_name == "?????????") {
			group_button = makeCardGroupTag(service_object.group_list[i], true);
		} else {
			group_button = makeCardGroupTag(service_object.group_list[i], false);
		}
		group_wrapper.appendChild(group_button);
		
		const down_menu = group_button.querySelector(".down_menu");
		group_button.onclick = (event) => {
			event.preventDefault();

            if (event.target.className == "show_list_button") {
                let menu_list = down_menu.querySelector(".menu_list");
                if (menu_list != null) {
                    menu_list.remove();
                    return;
                }
                menu_list = makeGroupDownMenuList();
                down_menu.appendChild(menu_list);

                menu_list.querySelector(".change_group_name").onclick = (e) => {
					e.stopPropagation();
	
                    let current_index = -1;
                    const group_tags = groups.querySelectorAll(".group");
                    for (let i = 0; i < group_tags.length; i++) {
                        if (group_tags[i] == group_button) current_index = i + 1;
                    }

                    const change_name_tag = makeChangeGroupNameTag(service_object.group_list[i].group_name);
                    const group_name_input = change_name_tag.querySelector("input[name='group_name']");
                    group_button.classList.add("hidden");
                    groups.insertBefore(change_name_tag, groups.children[current_index]);
					
					setTimeout(() => {
						group_name_input.focus();
					}, 0);

                    group_name_input.onkeypress = () => {
                        if (window.event.keyCode == 13) {
                            if (ajax.updateTeamGroupName(service_object.group_list[i].id, group_name_input.value)) {
                                location.reload();
                            } else {
                                alert("????????? ?????? ??????");
                            }
                        }
                    }
                }

                menu_list.querySelector(".remove_group").onclick = (e) => {
					e.stopPropagation();
					
                    const delete_group_modal = makeDeleteGroupModal(service_object.group_list[i].group_name);
                    appendModalToContainer(delete_group_modal);

                    delete_group_modal.querySelector(".close_modal").onclick = () => removeModal(delete_group_modal);

                    delete_group_modal.querySelector(".delete_group_button").onclick = () => {
                        if (ajax.deleteGroup(service_object.group_list[i].id)) {
                            location.reload();
                        } else {
                            alert("?????? ?????? ??????");
                        }
                    }
                }
			} else {
				page = 0;
				service_object.selected_group = service_object.group_list[i];
				service_object.card_list = ajax.loadTeamCardsInSpecificGroup(service_object.selected_group.id, page, card_order_flag);
				setCardList();
			}
		}
	}
}

function setCardList() {
	if( (service_object.card_list.length == 1 && service_object.card_list[0].total_count == 0) || service_object.card_list.length == 0) {
		const how_to_use_tag = makeHowToUseTag();
		replaceTagInMainContents(how_to_use_tag);
	} else {
		const card_list_wrapper_tag = makeCardListTag(card_order_flag);
		replaceTagInMainContents(card_list_wrapper_tag);
		setListPager(service_object.card_list[0].total_count);
		
		const card_list_tag = card_list_wrapper_tag.querySelector(".card_list");
		let prev_upload_date;
		let prev_first_character;
		for(let i = 0; i < service_object.card_list.length; i++) {
			if(card_order_flag == "reg_date") {
				const upload_date = makeCardSummaryRegDateText(service_object.card_list[i].create_date);
				if(prev_upload_date != upload_date) {
					const upload_date_tag = makeCardOrderStandardTag(upload_date);
					card_list_tag.appendChild(upload_date_tag);
					prev_upload_date = upload_date;
				}
			} else if(card_order_flag == "name") {
				const first_character = makeCardSummaryCharacterText(service_object.card_list[i].name);
				if(prev_first_character != first_character) {
					const upload_date_tag = makeCardOrderStandardTag(first_character); 
					card_list_tag.appendChild(upload_date_tag);
					prev_first_character = first_character;
				}
			} else if(card_order_flag == "company_name") {
				const first_character = makeCardSummaryCharacterText(service_object.card_list[i].company_name);
				if(prev_first_character != first_character) {
					const upload_date_tag = makeCardOrderStandardTag(first_character); 
					card_list_tag.appendChild(upload_date_tag);
					prev_first_character = first_character;
				}
			}
			const card_tag = makeCardSummaryTag(service_object.card_list[i]);
			card_list_tag.appendChild(card_tag);
			
			card_tag.onclick = () => {
				service_object.selected_card = service_object.card_list[i];
				addClassClickedToCard(i);
				service_object.selected_card_detail = ajax.loadCardDetail(service_object.selected_card.id);
				setCardDetail();
			}
		}
		
		const all_checkbox = card_list_wrapper_tag.querySelector(".card_selector");
		const cards = card_list_wrapper_tag.querySelectorAll(".card_list .card");
		const each_card_checkboxes = card_list_wrapper_tag.querySelectorAll(".card_list .card_check");
		const right_menu = card_list_wrapper_tag.querySelector(".right_menu");
		const card_ordering = card_list_wrapper_tag.querySelector(".card_ordering");
		
		card_ordering.onchange = () => {
			card_order_flag = card_ordering.options[card_ordering.selectedIndex].value;
			page = 0;
			service_object.card_list = service_object.selected_group == null ? ajax.loadTeamCardsInCardBook(service_object.selected_card_book.id, page, card_order_flag) : 
																													  					 ajax.loadTeamCardsInSpecificGroup(service_object.selected_group.id, page, card_order_flag);
			setCardList();
		}
		
		all_checkbox.onclick = (event) => {
			// ?????? ????????? ?????? ?????? ??????
			event.preventDefault();
			let menu_box_tag = card_list_tag.querySelector(".menu_box");
			if(menu_box_tag == null) {
				menu_box_tag = makeMenuBoxTag();
				card_list_tag.insertBefore(menu_box_tag, card_list_tag.children[0]);
				menu_box_tag.querySelector("#set_group").onclick = () => {
					const selected_id_list = new Array();
					const not_selected_id_list = new Array();
					each_card_checkboxes.forEach((e, index) => {
						if(e.checked) selected_id_list.push(service_object.card_list[index].id);
						else					not_selected_id_list.push(service_object.card_list[index].id);
					});
					
					let card_count_for_modal = 0;
		            if (service_object.selected_group == null) {
		                // ??????
		                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
		                    card_count_for_modal = service_object.group_list[0].total_count - not_selected_id_list.length;
		                } else {
		                    card_count_for_modal = selected_id_list.length;
		                }
		            } else {
		                // ??????
		                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
		                    card_count_for_modal = service_object.selected_group.card_count - not_selected_id_list.length;
		                } else {
		                    card_count_for_modal = selected_id_list.length;
		                }
		            }
					
					const change_group_modal = makeChangeGroupModal(card_count_for_modal);
					const group_list_tag = change_group_modal.querySelector(".group_list");
					const insert_group_form = change_group_modal.querySelector(".insert_group_form");
					const add_new_group_in_modal = change_group_modal.querySelector(".add_new_group");
					const new_group_name_input = insert_group_form.querySelector("input");
					appendModalToContainer(change_group_modal);
					for(let i = 0; i < service_object.group_list.length; i++) {
						if(service_object.group_list[i].group_name == "?????????") break;
						
						const group_tag = makeGroupTagForModal(service_object.group_list[i]);
						group_list_tag.insertBefore(group_tag, add_new_group_in_modal);
						
						group_tag.onclick = () => group_tag.querySelector("input").click();
					}
					
					change_group_modal.querySelector(".close_modal").onclick = () => removeModal(change_group_modal);
					
					add_new_group_in_modal.onclick = () => {
						add_new_group_in_modal.classList.add("hidden");
						insert_group_form.classList.remove("hidden");
					}
					
					insert_group_form.querySelector(".confirm").onclick = () => {
						if(new_group_name_input.value == "") {
							alert("???????????? ??????????????????.");
						} else if(new_group_name_input.value == "?????????") {
							alert("?????? ???????????? ????????? ??? ????????????.");
						} else {
							// insert new group
							if(ajax.insertTeamGroup(service_object.selected_card_book.id, new_group_name_input.value)) {
								group_list_tag.querySelectorAll(".group").forEach(e => e.remove());
								service_object.group_list = ajax.loadTeamGroups(service_object.selected_card_book_id);
								for(let i = 0; i < service_object.group_list.length; i++) {
									if(service_object.group_list[i].group_name == "?????????") return;
									
									const group_tag = makeGroupTagForModal(service_object.group_list[i]);
									group_list_tag.insertBefore(group_tag, add_new_group_in_modal);
									
									group_tag.onclick = () => group_tag.querySelector("input").click();
								}
								new_group_name_input.value = "";
								add_new_group_in_modal.classList.remove("hidden");
								insert_group_form.classList.add("hidden");
								card_book_wrapper.querySelectorAll(".card_book").forEach((e, index) => {
									if(service_object.card_book_list[index].id == service_object.selected_card_book.id) {
										e.click();
									}
								});
							} else {
								alert("?????? ????????? ??????");
							}
						}
					}
					
					insert_group_form.querySelector(".cancel").onclick = () => {
						new_group_name_input.value = "";
						add_new_group_in_modal.classList.remove("hidden");
						insert_group_form.classList.add("hidden");
					}
					
					change_group_modal.querySelector(".set_group_button").onclick = () => {
						const selected_group_id_list = new Array();
						change_group_modal.querySelectorAll(".group_list .group_selector").forEach((e, index) => {
							if(e.checked) selected_group_id_list.push(service_object.group_list[index].id);
						});
						
						let default_group_id;
						service_object.group_list.forEach((e, index) => {
							if(e.group_name == "?????????") default_group_id = service_object.group_list[index].id;
						});
						
						let ajax_flag = false;

		                if(service_object.selected_group == null) {
		                    // ??????
		                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
		                        ajax_flag = ajax.updateAllTeamCardsBelongTeamGroups(service_object.selected_card_book.id, not_selected_id_list, selected_group_id_list, default_group_id);
		                    } else {
		                        ajax_flag = ajax.updateTeamCardsBelongTeamGroups(selected_id_list, selected_group_id_list, default_group_id);
		                    }
		                } else {
		                    // ??????
		                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
		                        ajax_flag = ajax.updateAllTeamCardsInGroupBelongTeamGroups(service_object.selected_group.id, not_selected_id_list, selected_group_id_list, default_group_id);
		                    } else {
		                        ajax_flag = ajax.updateTeamCardsBelongTeamGroups(selected_id_list, selected_group_id_list, default_group_id);
		                    }
		                }
		
		                if (ajax_flag) {
		                    location.reload();
		                } else {
		                    alert("?????? ?????? ??????");
		                }
					}
				}
			
				const more_menus = menu_box_tag.querySelector("#more_menus");
				more_menus.onclick = () => {
					let more_menu_list = menu_box_tag.querySelector(".more_menu_list");
					if(more_menu_list == null) {
						more_menu_list = makeMoreMenuListTag();
						menu_box_tag.appendChild(more_menu_list);
						
						more_menu_list.querySelector("#delete_cards").onclick = () => {
							const selected_id_list = new Array();
							const not_selected_id_list = new Array();
							each_card_checkboxes.forEach((e, index) => {
								if(e.checked) selected_id_list.push(service_object.card_list[index].id);
								else					not_selected_id_list.push(service_object.card_list[index].id);
							});
							
							let card_count_for_modal = 0;
				            if (service_object.selected_group == null) {
				                // ??????
				                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                    card_count_for_modal = service_object.group_list[0].total_count - not_selected_id_list.length;
				                } else {
				                    card_count_for_modal = selected_id_list.length;
				                }
				            } else {
				                // ??????
				                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                    card_count_for_modal = service_object.selected_group.card_count - not_selected_id_list.length;
				                } else {
				                    card_count_for_modal = selected_id_list.length;
				                }
				            }
				            
				            const delete_confirm_modal = makeDeleteCardsConfirmModal(card_count_for_modal);
							appendModalToContainer(delete_confirm_modal);
									
							delete_confirm_modal.querySelector(".close_modal").onclick = () => removeModal(delete_confirm_modal);
							
							delete_confirm_modal.querySelector(".confirm").onclick = () => {
								let ajax_flag = false;

				                if(service_object.selected_group == null) {
				                    // ??????
				                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                        ajax_flag = ajax.deleteAllCardsInCardBook(service_object.selected_card_book.id, not_selected_id_list);
				                    } else {
				                        ajax_flag = ajax.deleteCards(selected_id_list);
				                    }
				                } else {
				                    // ??????
				                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                        ajax_flag = ajax.deleteAllCardsInTeamGroup(service_object.selected_group.id, not_selected_id_list);
				                    } else {
				                        ajax_flag = ajax.deleteCards(selected_id_list);
				                    }
				                }
				
				                if (ajax_flag) {
				                    location.reload();
				                } else {
				                    alert("?????? ?????? ??????");
				                }
							}
						}
						
						more_menu_list.querySelector("#save_to_personal").onclick = () => {
							// ?????? ?????? ??? ???????????? ??????
							const selected_id_list = new Array();
							const not_selected_id_list = new Array();
							each_card_checkboxes.forEach((e, index) => {
								if(e.checked) selected_id_list.push(service_object.card_list[index].id);
								else					not_selected_id_list.push(service_object.card_list[index].id);
							});
							
							let card_count_for_modal = 0;
				            if (service_object.selected_group == null) {
				                // ??????
				                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                    card_count_for_modal = service_object.group_list[0].total_count - not_selected_id_list.length;
				                } else {
				                    card_count_for_modal = selected_id_list.length;
				                }
				            } else {
				                // ??????
				                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                    card_count_for_modal = service_object.selected_group.card_count - not_selected_id_list.length;
				                } else {
				                    card_count_for_modal = selected_id_list.length;
				                }
				            }
				            
							const save_to_personal_modal = makeSaveToPersonalModal(card_count_for_modal);
							appendModalToContainer(save_to_personal_modal);
							
							save_to_personal_modal.querySelector(".close_modal").onclick = () => removeModal(save_to_personal_modal);
							
							const memo_include_input = save_to_personal_modal.querySelector("input[nam='include_memo']");
							
							save_to_personal_modal.querySelector(".save_button").onclick = () => {
								let ajax_flag = false;

				                if(service_object.selected_group == null) {
				                    // ??????
				                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                        ajax_flag = ajax.ajax.insertAllTeamCardsInCardBookToPersonal(service_object.selected_card_book.id, not_selected_id_list, memo_include_input.value);
				                    } else {
				                        ajax_flag = ajax.insertTeamCardsToPersonal(selected_id_list, memo_include_input.value);
				                    }
				                } else {
				                    // ??????
				                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                        ajax_flag = ajax.insertAllTeamCardsInGroupToPersonal(service_object.selected_group.id, not_selected_id_list, memo_include_input.value);
				                    } else {
				                        ajax_flag = ajax.insertTeamCardsToPersonal(selected_id_list, memo_include_input.value);
				                    }
				                }
				
				                if (ajax_flag) {
				                    location.reload();
				                } else {
				                    alert("?????? ?????? ??????");
				                }
							}
						}
						
						more_menu_list.querySelector("#get_address_list").onclick = () => {
							// ?????? ?????? ????????? ????????? ??????
							const selected_id_list = new Array();
							const not_selected_id_list = new Array();
							each_card_checkboxes.forEach((e, index) => {
								if(e.checked) selected_id_list.push(service_object.card_list[index].id);
								else					not_selected_id_list.push(service_object.card_list[index].id);
							});
							
				            let email_list;
				            if (service_object.selected_group == null) {
				                // ??????
				                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                    email_list = ajax.loadCardEmailsInCardBook(service_object.selected_card_book.id, not_selected_id_list);
				                } else {
				                    email_list = ajax.loadCardEmails(selected_id_list);
				                }
				            } else {
				                // ??????
				                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
				                    email_list = ajax.loadCardEmailsInGroup(service_object.selected_group.id, not_selected_id_list);
				                } else {
				                    email_list = ajax.loadCardEmails(selected_id_list);
				                }
				            }
				            
							const email_text = makeEmailTextForModal(email_list);
							const email_modal = makeSendEmailModal(email_text);
							appendModalToContainer(email_modal);
							
							const email_input = email_modal.querySelector("input");
							setTimeout(() => {
								email_input.focus();
								email_input.select();
							}, 150);
							
							email_modal.querySelector(".close_modal").onclick = () => removeModal(email_modal);
							email_modal.querySelector(".close_button").onclick = () => removeModal(email_modal);
						}
					} else {
						more_menu_list.remove();
					}
				}
			}
			if(page_check_flag == null) {
				console.log("page_check_flag is null");
				menu_box_tag.classList.add("hidden");
				
				all_checkbox.classList.remove("not_max");
				all_checkbox.classList.remove("checked");
				all_checkbox.checked = false;
				each_card_checkboxes.forEach((e, index) => {
					e.checked = all_checkbox.checked;
					cards[index].classList.remove("selected");
				});
				page_check_flag = "current";
				right_menu.classList.remove("hidden");
				
			} else if(page_check_flag == "current") {
				console.log("page_check_flag is current");
				const select_message = makeSelectMessage(page_check_flag, each_card_checkboxes.length);
				menu_box_tag.querySelector(".select_message").innerText = select_message;
				menu_box_tag.classList.remove("hidden");
				
				all_checkbox.classList.remove("not_max");
				all_checkbox.classList.add("checked");
				all_checkbox.checked = true;
				each_card_checkboxes.forEach((e, index) => {
					e.checked = all_checkbox.checked;
					cards[index].classList.add("selected");
				});
				page_check_flag = null;
				right_menu.classList.add("hidden");
				
			} else if(page_check_flag == "not_max") {
				console.log("page_check_flag is not_max");
				
				let selected_count = 0;
				each_card_checkboxes.forEach((e, index) => {
					if(e.checked) {
						cards[index].classList.add("selected");
						selected_count++;
					} 
					else cards[index].classList.remove("selected");
				});
				
				const select_message = makeSelectMessage(page_check_flag, selected_count);
				menu_box_tag.querySelector(".select_message").innerText = select_message;
				menu_box_tag.classList.remove("hidden");
				
				all_checkbox.classList.add("not_max");
				all_checkbox.classList.remove("checked");
				page_check_flag = null;
				right_menu.classList.add("hidden");
				
			} else if(page_check_flag == "whole") {
				console.log("page_check_flag is whole");
				
				all_checkbox.classList.remove("not_max");
				all_checkbox.classList.add("checked");
				all_checkbox.checked = true;
				each_card_checkboxes.forEach((e, index) => {
					e.checked = all_checkbox.checked
					cards[index].classList.add("selected");
				});
				
				const select_message = makeSelectMessage(page_check_flag, service_object.selected_card_book.card_count);
				menu_box_tag.querySelector(".select_message").innerText = select_message;
				menu_box_tag.classList.remove("hidden");
				right_menu.classList.add("hidden");
				
			} else if(page_check_flag == "whole_after") {
				console.log("whole_after");
				
				all_checkbox.classList.remove("not_max");
				all_checkbox.classList.add("checked");

				let not_selected_count = 0;
				each_card_checkboxes.forEach((e, index) => {
					if(e.checked) {
						cards[index].classList.add("selected");
					} else {
						cards[index].classList.remove("selected");
						not_selected_count++;
					} 
				});
				
				const select_message = makeSelectMessage(page_check_flag, service_object.selected_card_book.card_count - not_selected_count);
				menu_box_tag.querySelector(".select_message").innerText = select_message;
				menu_box_tag.classList.remove("hidden");
				right_menu.classList.add("hidden");
			}
		}
		
		each_card_checkboxes.forEach(e => {
			// ??? ?????? ??????
			e.onclick = (event) => {
				event.stopPropagation();
				
				let checked_count = 0;
				each_card_checkboxes.forEach(e1 => {
					if(e1.checked) checked_count++;
				});
				console.log("checked_count : " + checked_count);
				if(checked_count == 0) {
					page_check_flag = null;
				} else if(page_check_flag == "whole") {
					page_check_flag = "whole_after";
				} else if(page_check_flag == "whole_after") {
					page_check_flag = "whole_after";
				} else if(checked_count < each_card_checkboxes.length) {
					page_check_flag = "not_max";
				} else {
					page_check_flag = "current";
				}
				all_checkbox.click();
			}
		});
		
		const down_menu = card_list_wrapper_tag.querySelector(".down_menu");
		down_menu.onclick = () => {
			let card_list_menu = down_menu.querySelector(".menu_list");
			if(card_list_menu == null) {
				card_list_menu = makeCardListMenuTag();
				down_menu.appendChild(card_list_menu);
				
				card_list_menu.querySelector("#current_page_selector").onclick = () => {
					// ?????? ????????? ??????
					page_check_flag = "current";
					all_checkbox.click();
				}
				
				card_list_menu.querySelector("#whole_page_selector").onclick = () => {
					// ?????? ????????? ??????
					page_check_flag = "whole";
					all_checkbox.click();
				}
				
				card_list_menu.querySelector("#select_cancel").onclick = () => {
					// ???????????? ?????? ??????
					page_check_flag = null;
					all_checkbox.click();
				}
			} else {
				card_list_menu.remove();
			}
		}
		
		if(service_object.card_list.length > 0) {
			card_list_tag.querySelectorAll(".card")[0].click();
		}
	}
}

function setCardDetail() {
	let card_detail_tag = document.querySelector(".card_detail");
	if(card_detail_tag != null) {
		card_detail_tag.remove();
	}
	card_detail_tag = makeCardDetailTag(service_object.selected_card_detail);
	appendTagToMainContents(card_detail_tag);
	
	const card_list_wrapper = main_contents.querySelector(".card_list_wrapper");
	
	const card_image = card_detail_tag.querySelector(".card_summary > .card_image");
	if(card_image != null) {
		card_image.onclick = () => {
			const show_card_images_modal = makeShowAllCardImageModal(service_object.selected_card_detail.card_images);
			appendModalToContainer(show_card_images_modal);
			
			show_card_images_modal.querySelector(".close_modal").onclick = () => removeModal(show_card_images_modal);
		}
	}
	
	card_detail_tag.querySelector(".pass_card").onclick = () => {
		// ?????? ?????? ??????
		const pass_card_modal = makeSendCardModal(service_object.selected_card_detail.card.name);
		appendModalToContainer(pass_card_modal);
		
		setTimeout(() => {
			pass_card_modal.querySelector("textarea").focus();
			pass_card_modal.querySelector("textarea").select();
		}, 150);
		
		pass_card_modal.querySelectorAll(".close_modal").forEach(e => e.onclick = () => removeModal(pass_card_modal));
	}
	
	const down_menu = card_detail_tag.querySelector(".down_menu");
	down_menu.onclick = (event) => {
		// detail menu tag toggle
		let menu_list = down_menu.querySelector(".detail_menu");
		if(menu_list == null) {
			menu_list = makeCardDetailMenuTag();
			down_menu.appendChild(menu_list);
			
			menu_list.querySelector("#report_typo").onclick = () => {
				// ???????????? ?????? ??????
				const report_modal = makeReportModal();
				appendModalToContainer(report_modal);
				
				report_modal.querySelector(".close_modal").onclick = () => removeModal(report_modal);
				
				const input_wrappers = report_modal.querySelectorAll(".input_wrapper");
				const inputs = report_modal.querySelectorAll("input");
				const send_button = report_modal.querySelector(".send_button");
				
				input_wrappers.forEach((e, index) => {
					e.onclick = () => {
						inputs[index].click();
						
						let check_count = 0;
						inputs.forEach(e1 => {
							if(e1.checked) check_count++;
						});
						
						if(check_count == 0) send_button.disabled = true;
						else									send_button.disabled = false;
					}
				});
			}
			
			menu_list.querySelector("#save_to_personal").onclick = () => {
				// ??? ???????????? ?????? ??????
				const save_to_personal_modal = makeSaveToPersonalModal(1);
				appendModalToContainer(save_to_personal_modal);
				const memo_include_input = save_to_personal_modal.querySelector("input[name='include_memo']");
				
				save_to_personal_modal.querySelector(".close_modal").onclick = () => removeModal(save_to_personal_modal);
				
				save_to_personal_modal.querySelector(".save_button").onclick = () => {
					if(ajax.insertTeamCardToPersonal(service_object.selected_card_detail.card.id, memo_include_input.value)) {
						alert("??? ???????????? ?????? ??????");
						removeModal(save_to_personal_modal);
					} else {
						alert("??? ???????????? ?????? ??????");
					}
				}
			}
			
			menu_list.querySelector("#delete_card").onclick = () => {
				// ?????? ?????? ?????? ??????
				const delete_confirm_modal = makeDeleteCardConfirmModal();
				appendModalToContainer(delete_confirm_modal);
				
				delete_confirm_modal.querySelector(".close_modal").onclick = () => removeModal(delete_confirm_modal);
				
				delete_confirm_modal.querySelector(".confirm").onclick = () => {
					if(ajax.deleteCard(service_object.selected_card_detail.card.id)) {
						location.reload();
					} else {
						alert("?????? ????????? ??????????????????.");
					}
				}
			}
		} else if(event.target.className == "down_menu") {
			menu_list.remove();
		}
	}
	
	const edit_card_button = card_detail_tag.querySelector(".edit_card");
	edit_card_button.onclick = () => {
		const edit_card_form = makeEditCardFormTag(service_object.selected_card_detail);
		card_list_wrapper.classList.add("hidden");
		card_detail_tag.classList.add("hidden");
		appendTagToMainContents(edit_card_form);
		
		let front_card_image_file;
		let back_card_image_file;
		const card_image_wrapper = edit_card_form.querySelector(".card_image_wrapper");
		const card_image_input_wrapper = edit_card_form.querySelector(".card_image_wrapper > .input_wrapper");
		const card_image_input = card_image_input_wrapper.querySelector("input");

		let clicked_card;

		if(service_object.selected_card_detail.card_images.length > 0) {
			const front = makeCardImageTag(service_object.selected_card_detail.card_images[0].card_image, true, true);
			card_image_wrapper.insertBefore(front, card_image_input_wrapper);
			front.querySelector(".change_image").onclick = () => {
				clicked_card = "front";
				card_image_input.click();
				card_image_input_wrapper.querySelector(".text").innerText = "?????? ??????";
			}
			if(service_object.selected_card_detail.card_images.length > 1) {
				const back = makeCardImageTag(service_object.selected_card_detail.card_images[1].card_image, false, true);
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
					card_image_input_wrapper.querySelector(".text").innerText = "?????? ??????";
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
				alert("????????? ????????? ?????????????????????");
				return;
			}
			const formdata = makeFormDataForUpdateCard(service_object.selected_card_detail.card.profile_img, card_inputs, front_card_image_file, back_card_image_file, profile_image_file);
			console.log(service_object.selected_card_detail);
			if(ajax.updateCard(service_object.selected_card_detail.card.id, formdata)) {
				edit_card_form.remove();
				card_list_wrapper.classList.remove("hidden");
				card_detail_tag.classList.remove("hidden");
				reloadCardDetail();
			} else {
				alert("?????? ????????? ??????????????????.");
			}
		}
	}
	
	const modal_group_wrapper = card_detail_tag.querySelector(".group_info");
	for(let i = 0; i < service_object.selected_card_detail.group_list.length; i++) {
		const group_button = makeGroupNameTagInCardDetail(service_object.selected_card_detail.group_list[i]);
		modal_group_wrapper.appendChild(group_button);
		group_button.onclick = () => {
			// show group select modal
			const change_group_modal = makeChangeGroupModal(1);
			const group_list_tag = change_group_modal.querySelector(".group_list");
			const add_new_group_in_modal = change_group_modal.querySelector(".add_new_group");
			const insert_group_form = change_group_modal.querySelector(".insert_group_form");
			const new_group_name_input = insert_group_form.querySelector("input");
			for(let i = 0; i < service_object.group_list.length; i++) {
				if(service_object.group_list[i].group_name == "?????????") continue;
				const group_tag = makeGroupTagForModal(service_object.group_list[i]);
				group_list_tag.insertBefore(group_tag, add_new_group_in_modal);
				
				group_tag.onclick = () => group_tag.querySelector(".group_selector").click();
			}
			appendModalToContainer(change_group_modal);
			
			change_group_modal.querySelector(".close_modal").onclick = () => removeModal(change_group_modal);
			
			add_new_group_in_modal.onclick = () => {
				add_new_group_in_modal.classList.add("hidden");
				insert_group_form.classList.remove("hidden");
			}
			
			insert_group_form.querySelector(".confirm").onclick = () => {
				if(new_group_name_input.value == "") {
					alert("???????????? ??????????????????.");
				} else if(new_group_name_input.value == "?????????") {
					alert("?????? ???????????? ????????? ??? ????????????.");
				} else {
					// insert new group
					if(insertGroup(new_group_name_input.value)) {
						group_list_tag.querySelectorAll(".group").forEach(e => e.remove());
						service_object.group_list = ajax.loadTeamGroups(service_object.selected_card_book.id);
						for(let i = 0; i < service_object.group_lis.length; i++) {
							if(group_belong_flags[i].group_name == "?????????") continue;
							const group_tag = makeGroupTagForModal(service_object.group_lis[i]);
							group_list_tag.insertBefore(group_tag, add_new_group_in_modal);
							
							group_tag.onclick = () => group_tag.querySelector(".group_selector").click();
						}
						new_group_name_input.value = "";
						add_new_group_in_modal.classList.remove("hidden");
						insert_group_form.classList.add("hidden");
						card_book_wrapper.querySelectorAll(".card_book").forEach((e, index) => {
							if(service_object.card_book_list[index].id == service_object.selected_card_book.id) {
								e.click();
							}
						});
					} else {
						alert("?????? ????????? ??????");
					}
				}
			}
			
			insert_group_form.querySelector(".cancel").onclick = () => {
				new_group_name_input.value = "";
				add_new_group_in_modal.classList.remove("hidden");
				insert_group_form.classList.add("hidden");
			}
			
			change_group_modal.querySelector(".set_group_button").onclick = () => {
				// update card group join user
				const selected_group_id_list = new Array();
				let default_group_id;
				service_object.group_list.forEach((e, index) => {
					if(e.group_name == "?????????") default_group_id = service_object.group_list[index].id;
				});
				
				group_list_tag.querySelectorAll(".group > input").forEach((e, index) => {
					if(e.checked) selected_group_id_list.push(service_object.group_list[index].id);
				});
				
				if(ajax.updateTeamCardBelongTeamGroups(service_object.selected_card_detail.card.id, selected_group_id_list, default_group_id)) {
					reloadCardDetail();
					removeModal(change_group_modal);
				} else {
					alert("?????? ????????? ??????????????????.");
				}
			}
		}
	}
	
	const memo_wrapper = card_detail_tag.querySelector(".memo_list");
	for(let i = 0; i < service_object.selected_card_detail.memo_list.length; i++) {
		const memo = makeMemoTag(service_object.selected_card_detail.memo_list[i]);
		memo_wrapper.appendChild(memo);

		memo.querySelector(".show_edit_memo_modal").onclick = () => {
			const update_memo_modal = makeUpdateCardMemoModal(service_object.selected_card_detail.memo_list[i]);
			const contents = update_memo_modal.querySelector("textarea[name='contents']");
			const submit_button = update_memo_modal.querySelector(".submit_button");
			
			appendModalToContainer(update_memo_modal);
			setTimeout(() => contents.focus(), 150);
			
			update_memo_modal.querySelector(".close_modal").onclick = () => {
				removeModal(update_memo_modal);
			}
			
			update_memo_modal.querySelector(".cancel_button").onclick = () => {
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
				if(ajax.updateCardMemo(service_object.selected_card_detail.memo_list[i].id, contents.value)) {
					reloadCardDetail();
				} else {
					alert("?????? ?????? ??????");
				}
				removeModal(update_memo_modal);
			}
		}

		memo.querySelector(".show_remove_memo_modal").onclick = () => {
			const remove_memo_modal = makeDeleteConfirmCardMemoModal(service_object.selected_card_detail.memo_list[i]);
			appendModalToContainer(remove_memo_modal);
			
			remove_memo_modal.querySelector(".close_modal").onclick = () => {
				removeModal(remove_memo_modal);
			}
			
			remove_memo_modal.querySelector(".remove_button").onclick = () => {
				if(ajax.deleteCardMemo(service_object.selected_card_detail.memo_list[i].id)) {
					reloadCardDetail();
				} else {
					alert("?????? ?????? ??????");
				}
				removeModal(remove_memo_modal);
			}
		}
	}
	
	const memo_input_wrapper = card_detail_tag.querySelector(".memo_input");
	memo_input_wrapper.onclick = () => {
		const memo_input_modal = makeAddCardMemoModal();
		const contents = memo_input_modal.querySelector("textarea[name='contents']");
		const submit_button = memo_input_modal.querySelector(".submit_button");
		
		appendModalToContainer(memo_input_modal);
		setTimeout(() => contents.focus(), 150);
		
		memo_input_modal.querySelector(".close_modal").onclick = () => {
			removeModal(memo_input_modal);
		}
		
		memo_input_modal.querySelector(".cancel_button").onclick = () => {
			removeModal(memo_input_modal);
		}
		
		contents.oninput = (event) => {
			if(event.target.value == "") {
				submit_button.disabled = true;
			} else {
				submit_button.disabled = false;
			}
		}
		
		submit_button.onclick = () => {
			if(ajax.insertCardMemo(service_object.selected_card_detail.card.id, contents.value)) {
				reloadCardDetail();
			} else {
				alert("?????? ????????? ??????");
			}
			removeModal(memo_input_modal);
		}
	}
}

function makeJSONObjForUpdateBelong(add_id_list, remove_id_list) {
	const obj = {add_id_list:new Array(),
							remove_id_list:new Array()};
	for(let i = 0; i < add_id_list.length; i++) {
		obj.add_id_list.push(add_id_list[i]);
	}
	for(let i = 0; i < remove_id_list.length; i++) {
		obj.remove_id_list.push(remove_id_list[i]);
	}
	
	return obj;
}

function pickTeamOrderByCreateDate(team_list) {
	return team_list.sort((a, b) => new Date(b.create_date) - new Date(a.create_date))[0];
}

function makeTeamCreateDateText(create_date) {
	const date = new Date(create_date);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${date.getFullYear()}-${month}-${day}`;
}

function makeGroupNameTagInCardDetail(group) {
	const span = document.createElement("span");
	span.className = group.group_name == "?????????" ? "text no_content" : "text group";
	span.innerHTML = `${group.group_name}<img src="/static/images/card_team_edit_group.png" class="show_edit_group_modal">`;
	return span;
}

/*function makeCardGroupTag(group) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "group";
	button.innerHTML = `
		<span class="sub_group_arrow"></span>
		<span class="group_text">${group.group_name} (<span class="card_count">${group.card_count}</span>)</span>
	`;
	return button;
}*/

function makeCardBookTag(card_book) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "card_book";
	button.innerHTML = `
		<span class="card_book_name">${card_book.card_book_name}</span>
		<div class="card_book_info">
			????????? <span class="join_count">${card_book.join_count}</span>??? ?? ?????? <span class="card_count">${card_book.card_count}</span>???
		</div>
	`;
	return button;
}

function makeNoMembersTag() {
	const div = document.createElement("div");
	div.className = "no_member";
	div.innerHTML = `
		<span>?????? ????????? ???????????? ??????????????? ???????????????.</span>
		<span>????????? ???????????? ????????? ????????? ??? ????????????.</span>
		<button type="button" class="invite_member">?????? ????????? ??????</button>
	`;
	return div;
}

function makeHowToUseTag() {
	const div = document.createElement("div");
	div.className = "how_to_use";
	div.innerHTML = `
		<div class="row">
			<span class="title">1. <b>??? ???????????? ?????? ??????</b>??? ??? ???????????? ????????????????</span>
			<span class="description">?????? ?????????????????? ????????? ????????????, ?????? ??????????????? ???????????? ???????????? ????????? ??? ????????????.</span>
			<img src="/static/images/card_team_how_to_use_1.jpg">
		</div>
		<div class="row">
			<span class="title">2. <b>???????????? ?????????</b>??? ???????????? ???????????? ??? ???????????? ????????????????</span>
			<span class="description">?????? ?????? ????????? + ??????(?????? ????????????)??? ????????????, ?????? ?????? ???????????? ????????? ??? ????????????.</span>
			<img src="/static/images/card_team_how_to_use_2.jpg">
		</div>
	`;
	return div;
}

function makeTeamManageTag() {
	const grade_text = service_object.selected_team.grade_id == 1 ? "?????????(??????)" : service_object.selected_team.grade_id == 2 ? "????????????" : "??????????????????";
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<span class="text">?????? ??????</span>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text small">??????</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">?????? ?????? ??????</span>
					<span class="text">${grade_text}</span>
				</div>
				<button type="button" id="show_product_description">????????? ??????</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">?????? ??????</span>
				<button type="button" id="show_history">????????? ??????</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">?????? ??????</span>
				<button type="button" id="manage_payment">????????????</button>
			</div>
			<div class="row">
				<span class="text small">??????</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">?????????</span>
					<span class="text">${service_object.selected_team.title}</span>
				</div>
				<button type="button" id="change_team_name">??????</button>
			</div>
		</section>
		<section>
			<div class="row">
				<div class="title">
					<span class="text small">????????? ??????</span>
					<span class="text">${service_object.principal_profile.nickname}</span>
				</div>
				<button type="button" id="change_profile">??????</button>
			</div>
			<div class="row">
				<span class="text small">?????????</span>
			</div>
			<div class="row">
				<span class="text">?????? ????????? ??????</span>
				<button type="button" id="invite_member">????????????</button>
			</div>
			<div class="row">
				<span class="text small">??????</span>
			</div>
			<div class="row">
				<span class="text">???????????? ?????????</span>
				<button type="button" id="leave_team" class="red">?????????</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">?????? ??????</span>
				<button type="button" id="delete_team" class="red">????????????</button>
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
				<span class="text">????????? ??????</span>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text small">????????? ??????</span>
			</div>
			<div class="row">
				<div class="title">
					<span class="text small">????????? ??????</span>
					<span class="text">${service_object.selected_card_book.card_book_name}</span>
				</div>
				<button type="button" id="change_card_book_name">??????</button>
			</div>
			<div class="row">
				<span class="text small">?????????</span>
			</div>
			<div class="row">
				<span class="text">????????? ?????? ??????</span>
				<button type="button" id="change_member_authority">??????</button>
			</div>
			<div class="row">
				<span class="text small">?????? ??????</span>
			</div>
			<div class="row">
				<span class="text">????????? ???????????? (??????, ????????? ???)</span>
				<button type="button" id="export_to_file">????????????</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text">????????? ??????</span>
				<button type="button" id="show_deleted_cards">????????????</button>
			</div>
			<div class="row">
				<span class="text small">??????</span>
			</div>
			<div class="row">
				<span class="text disabled">????????? ?????????</span>
				<button type="button" id="leave_card_book" class="red" disabled>?????????</button>
			</div>
		</section>
		<section>
			<div class="row">
				<span class="text disabled">????????? ??????</span>
				<button type="button" id="delete_card_book" class="red" disabled>????????????</button>
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
			<span>?????? ?????? ?????????</span>
			<button type="button" class="add_team_user">+ ????????????</button>
		</div>
		<div class="contents">
			
		</div>
		<div class="pager_wrapper">
			<button type="button" class="prev_page">??</button>
			<div class="pager">
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
				<button type="button" class="page"></button>
			</div>
			<button type="button" class="next_page">??</button>
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
${user.role == "ADMIN" ? '<span class="admin">?????????</span>' : ''}
			</div>
			<span class="phone_number">${phone_number}</span>
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
					<span class="text blue">?????? ?????? &gt; ?????? ??????</span>
					<span class="text">?????? ??????</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column">
				<span class="warning_title">?????? ??? ?????? ????????? ???????????????</span>
				<div class="warning_description">????????? ???????????? ?????? ??????????????? ?????????????????? ????????? ????????????, ?????? ?????? ?????? ???????????? ???????????? ????????? ??? ?????? ?????????.
&#10;???????????? ????????? ????????? ?????? ??? ?????? ????????? ???????????????, ?????? ??? ?????? ??? ???????????? ??????????????? ????????? ?????????????????? ????????????.
				</div>
				<div class="input_wrapper">
					<input type="checkbox" class="confirm">
					<span class="text">??? ????????? ?????????????????????.</span>
				</div>
				<button type="button" class="delete_button" disabled>????????????</button>
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
					<span class="text blue">?????? ?????? &gt; ?????????</span>
					<span class="text">?????????</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column">
				<span class="warning_title">????????? ??? ?????? ????????? ???????????????</span>
				<div class="warning_description">???????????? ??????????????? ???????????? ???????????? ????????? ????????? ????????? ?????? ?????? ????????? ?????? ?????????.
&#10;????????? ?????? ???????????? ???????????? ?????? ???????????? ????????? ???????????????.
				</div>
				<div class="input_wrapper">
					<input type="checkbox" class="confirm">
					<span class="text">??? ????????? ?????????????????????.</span>
				</div>
				<button type="button" class="leave_button" disabled>?????????</button>
			</div>
		</section>
	`;
	return div;
}

function makeShowHistoryTag() {
	const create_date = makeTeamCreateDateText(service_object.selected_team.create_date);
	const div = document.createElement("div");
	div.className = "manage_team";
	div.innerHTML = `
		<section>
			<div class="row">
				<div class="title">
					<span class="text blue">?????? ?????? &gt; ????????????</span>
					<span class="text">????????????</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<div class="row">
					<span class="text">?????????</span>
					<span class="text small">${create_date}</span>
				</div>
				<div class="row">
					<span class="text">?????????</span>
					<span class="text small">${service_object.selected_team.total_join_user_count}???</span>
				</div>
				<div class="row">
					<span class="text">?????????</span>
					<span class="text small">${document.querySelectorAll(".menus .card_book").length}???</span>
				</div>
				<div class="row">
					<span class="text">??????</span>
					<span class="text small">${service_object.selected_team.total_card_count}???</span>
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
					<span class="text blue">?????? ?????? &gt; ?????? ??????</span>
					<span class="text">?????? ??????</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<div class="row">
					<span class="text">?????? ??????</span>
					<button type="button" id="show_my_payment_process">????????????</button>
				</div>
				<div class="row">
					<span class="text">?????? ??????</span>
					<button type="button" id="show_my_payment_history">????????????</button>
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
					<span class="text blue">?????? ?????? &gt; ?????? ?????? &gt; ?????? ??????</span>
					<span class="text">?????? ??????</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<span class="no_contents">????????? ?????? ????????? ????????????</span>
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
					<span class="text blue">?????? ?????? &gt; ?????? ?????? &gt; ?????? ??????</span>
					<span class="text">?????? ??????</span>
				</div>
			</div>
		</section>
		<section>
			<div class="column payment">
				<span class="no_contents">?????? ????????? ????????????</span>
			</div>
		</section>
	`;
	return div;
}

function makeMoreMenuListTag() {
	const div = document.createElement("div");
	div.className = "more_menu_list";
	div.innerHTML = `
		<button type="button" class="row" id="get_address_list">????????????</button>
		<button type="button" class="row" id="save_to_personal">??? ???????????? ??????</button>
		<button type="button" class="row" id="delete_cards">??????</button>
	`;
	return div;
}

function makeMenuBoxTag() {
	const div = document.createElement("div");
	div.className = "menu_box hidden";
	div.innerHTML = `
		<div class="select_menu_list">
			<button type="button" class="menu" id="extract_to_file">????????? ????????????</button>
			<button type="button" class="menu" id="set_group">????????????</button>
			<button type="button" class="menu" id="more_menus">
				<img src="/static/images/card_team_selected_menu_more_menu_button.png">
				<span>??? ??????</span>
			</button>
		</div>
		<div class="select_message"></div>
	`;
	return div;
}

function makeProductDescriptionTag() {
	const div = document.createElement("div");
	div.className = "product_wrapper";
	div.innerHTML = `
		<div class="product_description">
			<div class="column">
				<div class="title">
					<span class="product_name">?????? ??????</span>
				</div>
				<div class="flags">
					<div class="row">?????? ????????? ??? ????????? ???</div>
					<div class="row">?????? ????????? ?????? ???</div>
					<div class="row">?????? ?????? ??? ???????????????</div>
					<div class="row">?????? ?????? ??????</div>
					<div class="row">?????? ?????? ????????????</div>
					<div class="row">????????? ?????? ?????? ??????<sub>(?????????????????? ??????)</sub></div>
					<div class="row">????????? ????????? ??????</div>
					<div class="row">????????? ???????????? ??????</div>
					<div class="row">?????? ?????? ??????</div>
					<div class="row">Open API ??????</div>
				</div>
			</div>
		</div>
		<div class="foot_notes">
			<span class="note">1) ?????? ????????? ?????? ????????? ???????????????(VAT)??? ???????????? ?????? ???????????????.</span>
			<span class="note">2) ??? ????????? ??????????????? ????????? ???????????? ??? ????????? ???????????? ????????? ??????/??????????????? ?????? ???????????? ?????????.</span>
			<span class="note">3) ????????????????????? ??? ????????? ????????? ?????? ???????????? ????????? ???????????? ???????????????. ????????? ??????????????? ?????? ????????? ????????? ????????????????????????.</span>
		</div>
		<div class="questions">
			<div class="title">?????? ?????? ??????</div>
			<div class="question_wrapper">
				<div class="column">
					<div class="question">
						<span class="title">??????????????? ????????? ????????? ??????????</span>
						<span class="description">???????????? ????????? ????????? ???????????? ?????? ????????? ???????????????. ?????? ?????? ??? ???????????? ??? ????????? ????????? ????????? ??? ????????????.</span>
					</div>
					<div class="question">
						<span class="title">??????????????? ??????????????? ?????? ??????????????? ????????? ??? ??????????</span>
						<span class="description">????????? ?????? ?????? (????????? 1???, ?????? 100??? ??????)??? ?????? ??????, ?????????????????? ??????????????? ???????????? ????????? ??? ????????????.</span>
					</div>
					<div class="question">
						<span class="title">?????? ????????? ????????? ??????????</span>
						<span class="description">??? ???????????? ?????? ?????? ????????? ???????????? ???, ?????? ?????? ?????? ?????? ????????? ????????? ???????????? ???????????? ??????????????? ??????????????? ????????? ????????? ????????????.</span>
					</div>
					<div class="question">
						<span class="title">??? ???????????? ?????? ????????? ????????? ????????? ????????????????</span>
						<span class="description">help@rememberapp.co.kr??? ???????????? ?????????????????? 02-556-4202??? ???????????????, ???????????? ???????????????????????????. (??????????????????: ?????? ?????? 9???~?????? 6???, ???????????? ?????? 1???~2???)</span>
					</div>
				</div>
				<div class="column">
					<div class="question">
						<span class="title">?????? ?????? ?????? ????????? ?????? ????????? ????????? ??????????</span>
						<span class="description">??? ???????????? ??????????????? ?????? ????????? ????????? ????????????. ?????? ?????? ???????????? ?????? ????????? ???????????? ????????? ?????? ????????????, ?????? ?????? ???????????? ????????? ?????? ?????? ???????????? ????????? ???????????????.</span>
					</div>
					<div class="question">
						<span class="title">?????? ???????????? ????????? ???????????? ???????????? ????????? ????????? ????????????????</span>
						<span class="description">??? ???????????? ??? ??????????????? ?????? ????????? ?????? ?????? ????????? ???????????? ?????? ???????????????. ????????? ???????????????, ?????? ???????????? ?????? ?????? ?????? ???????????? ?????? ????????? ???????????? ?????? ???????????????.</span>
					</div>
					<div class="question">
						<span class="title">?????? ???????????? ???????????? ????????? ??? ????????? ??? ???????????? ????????????????</span>
						<span class="description">???????????? ?????? ?????? ????????? ????????? ?????? ?????? ????????? ?????? ???????????? ????????????. ????????? ??? ????????? ?????????????????? ?????? ?????? ????????? ?????? ???????????? ?????? ????????? ????????? ??? ?????? ?????? ??? ?????? ????????? ????????? ???????????? ???????????? ????????? ??????????????? ?????? ??? ??????????????? ?????? ???????????? ????????? ??????????????? ????????????.</span>
					</div>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeProductColumnTag(product) {
	const price_info_text = product.grade == "basic" ? '??????' : 
												 product.grade == "premium" ? '<span class="premium">?????? <span class="big">???4,900</span>/???</span><span class="vat">(VAT ??????)</span>' : 
												 product.grade == "enterprise" ? '<span class="enterprise">?????? ??????</span>' : '';
	const price_description_text = product.grade == "basic" ? '??? ???????????? ????????????\n????????? 100???\n????????? ??? ????????? ??????' : 
																product.grade == "premium" ? '?????? ?????? ??? ????????????\n<span class="premium">DB ?????? & ?????? ?????? ??????</span>???\n????????? ??? ?????? ??????' : 
																product.grade == "enterprise" ? '?????? ???????????? ??????\n????????? <span class="enterprise">Open API ??????</span>???\n???????????? ??????' : '';
	const div = document.createElement("div");
	div.className = "column " + product.grade;
	div.innerHTML = `
		<div class="title">
			<span class="product_name">${product.name}</span>
			<span class="price_info"></span>
			<span class="price_description"></span>
		</div>
		<div class="flags">
			<div class="row">${product.grade == "basic" ? "1???" : "?????????"}</div>
			<div class="row">${product.grade == "basic" ? "100???" : "?????????"}</div>
			<div class="row"><span class="${product.memo_alert_flag ? 'checked' : 'unchecked'}"></span></div>
			<div class="row"><span class="${product.card_map_flag ? 'checked' : 'unchecked'}"></span></div>
			<div class="row"><span class="${product.extract_to_excel_flag ? 'checked' : 'unchecked'}"></span></div>
			<div class="row"><span class="${product.show_sended_info_flag ? 'checked' : 'unchecked'}"></span></div>
			<div class="row"><span class="${product.save_phone_flag ? 'checked' : 'unchecked'}"></span></div>
			<div class="row"><span class="${product.user_permission_flag ? 'checked' : 'unchecked'}"></span></div>
			<div class="row"><span class="${product.restore_card_flag ? 'checked' : 'unchecked'}"></span></div>
			<div class="row"><span class="${product.open_api_flag ? 'checked' : 'unchecked'}"></span></div>
		</div>
		<div class="buy_product_button">
${product._using ? '<span class="current">?????? ???????????? ???????????????.</span>' : 
	 product.grade == 'basic' ? '<button type="button" id="return_to_basic">????????? ????????????</button>' : 
	 product.grade == 'premium' ? product.free_flag ? '<button type="button" id="buy_premium">1?????? ???????????? ??????</button>' :
	 																								 '<button type="button" id="buy_premium">???????????? ????????????</button>' :
	 product.grade == 'enterprise' ? '<button type="button" id="inquery_enterprise">?????? ????????????</button><span class="minimum">?????? ?????? ?????? ?????? : 100???</span>' : ''}
		</div>
	`;
	div.querySelector(".price_info").innerHTML = price_info_text;
	div.querySelector(".price_description").innerHTML = price_description_text;
	return div;
}

function makeInputPaymentInfoForm(free_flag) {
	const div = document.createElement("div");
	div.className = "payment_wrapper";
	div.innerHTML = `
		<div class="payment_info">
			<div class="title">?????? ?????? ??????</div>
			<div class="description">
				<div class="column">
					<div class="input_wrapper">
						<div class="title">?????? ??????</div>
						<div class="inputs">
							<input type="radio" checked name="personal">
							<button type="button">??????</button>
						</div>
					</div>
					<div class="input_wrapper">
						<div class="title">?????? ??????</div>
						<div class="inputs">
							<input type="password" class="number">-<input type="password" class="number">-<input type="password" class="number">-<input type="text" class="number">
						</div>
					</div>
					<div class="input_wrapper">
						<div class="input_wrapper">
							<div class="title">????????????</div>
							<div class="inputs">
								<input type="text" class="number_two_digits" placeholder="MM">???<input type="text" class="number_two_digits" placeholder="YY">???
							</div>
						</div>
						<div class="input_wrapper">
							<div class="title">???????????? ?????????</div>
							<div class="inputs">
								<input type="password" class="number_two_digits">**
							</div>
						</div>
					</div>
					<div class="input_wrapper">
						<div class="title">???????????? 6??????</div>
						<div class="inputs">
							<input type="text" class="number_six_digits" placeholder="YYMMDD">
						</div>
					</div>
				</div>
				<div class="column">
					<div class="input_wrapper">
						<div class="title">??????</div>
						<div class="inputs">
							<input type="text" name="name" value="${service_object.principal_profile.nickname}">
						</div>
					</div>
					<div class="input_wrapper">
						<div class="title">?????????</div>
						<div class="inputs">
							<input type="text" name="phone" value="${principal.phone}">
						</div>
					</div>
					<div class="input_wrapper">
						<div class="title">????????? (?????? ??????)</div>
						<div class="inputs">
							<input type="text" name="email" value="${principal.email}">
						</div>
					</div>
					<div class="terms">
						<div class="column">
							<div class="title">
								???????????? ????????? ??????
								<span class="summary">: ???????????????????????? ???????????? ???????????????.</span>
							</div>
							<div class="checkboxes">
								<div class="checkbox_wrapper">
									<input type="checkbox" id="service_whole_check">
									<span class="bold">?????? ??????</span>
								</div>
								<div class="checkbox_wrapper">
									<input type="checkbox" id="trade_terms">
									<span>???????????? ?????? ?????? ?????? ??????</span>
									<span class="show_description">????????????</span>
								</div>
								<div class="checkbox_wrapper">
									<input type="checkbox" id="private_terms">
									<span>??????????????? ?????? ??? ??????</span>
									<span class="show_description">????????????</span>
								</div>
								<div class="checkbox_wrapper">
									<input type="checkbox" id="third_party_terms">
									<span>??????????????? ???3??? ??????</span>
									<span class="show_description">????????????</span>
								</div>
								<div class="checkbox_wrapper">
									<input type="checkbox" id="regular_payment_terms">
									<span>???????????? (????????????) ??????</span>
									<span class="show_description">????????????</span>
								</div>
							</div>
						</div>
						<div class="column">
							<div class="title">??? ????????? ?????? ??????</div>
							<div class="checkboxes">
								<div class="checkbox_wrapper">
									<input type="checkbox" id="team_whole_check">
									<span class="bold">?????? ??????</span>
								</div>
								<div class="checkbox_wrapper">
									<input type="checkbox" id="team_private_terms">
									<span>??????????????? ?????? ??? ??????</span>
									<span class="show_description">????????????</span>
								</div>
								<div class="checkbox_wrapper">
									<input type="checkbox" id="team_third_party_terms">
									<span>??????????????? ???3??? ??????</span>
									<span class="show_description">????????????</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="buttons">
	${free_flag ? '<span>1??? ?????????????????? ?????????????????????????</span><button type="button" id="free_month" disabled>1??? ??????????????? ??????</button>' : '<button type="button" id="to_premium" disabled>???????????? ?????? ??????</button>'}
			</div>
		</div>
		<div class="questions">
			<div class="title">?????? ?????? ??????</div>
			<div class="question_wrapper">
				<div class="column">
					<div class="question">
						<span class="title">???????????? ????????? ?????? ????????? ????????????????</span>
						<span class="description">???????????? ?????? ??? ??? ???????????? ????????? ????????? ???????????? ????????? ???????????? ????????????.</span>
					</div>
					<div class="question">
						<span class="title">????????? ?????? ??????/??????????????? ????????? ??? ??????????</span>
						<span class="description">??? ?????? ???????????? ????????? ?????? ??????/??????????????? ???????????? ???????????? ??? ????????????.</span>
					</div>
					<div class="question">
						<span class="title">??? ???????????? ?????? ????????? ????????? ????????? ????????????????</span>
						<span class="description">help@rememberapp.co.kr??? ???????????? ?????????????????? 02-556-4202??? ???????????????, ???????????? ???????????????????????????. (??????????????????: ?????? ?????? 9???~?????? 6???, ???????????? ?????? 1???~2???)</span>
					</div>
				</div>
				<div class="column">
					<div class="question">
						<span class="title">???????????? ?????? ?????? ????????? ??? ??????????</span>
						<span class="description">???????????? ?????? ????????? ??? ?????? ???????????? ????????? ????????? (??????) ???????????? ?????????????????? ??? ?????? ??????, ??? ????????? ??? ??? ????????????.</span>
					</div>
					<div class="question">
						<span class="title">??????/???????????? ????????? ???????????????. ?????? ???????????? ????????? ??? ??????????</span>
						<span class="description">????????? ???????????? (help@rememberapp.co.kr)??? ??????????????? ?????? ????????? ???????????? ??? ????????? ???????????????.</span>
					</div>
				</div>
			</div>
		</div>
	`;
	return div;
}

function makeChangeTeamNameModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window change_info">
			<div class="title">
				<span>????????? ??????</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="title" value="${service_object.selected_team.title}">
				<span>????????? ????????? ?????? ???????????? ????????? ??? ????????????.<span>
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">??????</button>
				<button type="button" class="submit_button">??????</button>
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
				<span>????????? ?????? ??????</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="nickname" value="${service_object.principal_profile.nickname}">
				<span>????????? ????????? ?????? ???????????? ????????? ??? ????????????.<span>
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">??????</button>
				<button type="button" class="submit_button">??????</button>
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
				<span>????????? ?????? ??????</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="input_wrapper">
				<input type="text" name="card_book_name" value="${service_object.selected_card_book.card_book_name}">
			</div>
			<div class="buttons">
				<button type="button" class="cancel_button">??????</button>
				<button type="button" class="submit_button">??????</button>
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
			<span class="message">???????????? ??????????????????????</span>
			<div class="buttons">
				<button type="button" class="cancel_button">??????</button>
				<button type="button" class="submit_button">?????????</button>
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
			<span class="message">???????????? ?????? ?????? ???????????? ??????????????????</span>
			<div class="buttons">
				<button type="button" class="confirm_button">??????</button>
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
			<span class="message">?????? ?????????????????????????</span>
			<div class="buttons">
				<button type="button" class="cancel_button">??????</button>
				<button type="button" class="submit_button">??????</button>
			</div>
		</div>
	`;
	return div;
}

function makeGroupTagForModal(group_belong_flag) {
	const div = document.createElement("div");
	div.className = "group";
	div.innerHTML = `
		<input type="checkbox" class="group_selector" name="is_checked">
		<span>${group_belong_flag.group_name}</span>
	`;
	return div;
}

function makeSaveToPersonalModal(selected_card_count) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window save_to_personal">
			<div class="title">
				<span>?????? ??????</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="save_info">
				<span><span class="selected_card_count">${selected_card_count}</span>?????? ????????? ????????? ??? ???????????? ???????????????.</span>
				<div class="input_wrapper">
					<input type="checkbox" name="include_memo">
					<span>?????? ????????? ??????</span>
				</div>
			</div>
			<div class="buttons">
				<button type="button" class="save_button">??????</button>
			</div>
		</div>
	`;
	return div;
}

function makeInviteTeamModal(invite_code) {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window show_invite_url">
			<div class="title">
				<span>?????? ????????? ??????</span>
				<button type="button" class="close_modal">
					<img src="/static/images/signup_modal_closer.png">
				</button>
			</div>
			<div class="description">
				<span>?????? ????????? ????????? ??????(Ctrl+C)?????? ?????? ???????????? ???????????????.</span>
				<textarea readonly>remember_test ??? ??????????????? ???????????????.
					??? ?????????????????? ???????????? ?????? ????????? ????????? ??? ????????????.
					?????? ????????? ???????????? ????????? ??? ????????????.
					https://localhost:8080/card/${invite_code}
				</textarea>
			</div>
		</div>
	`;
	return div;
}