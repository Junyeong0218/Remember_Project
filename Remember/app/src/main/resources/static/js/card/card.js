const whole_cards = document.querySelector("#whole_cards");
const whole_count = document.querySelector('.whole_count');
const main_contents = document.querySelector(".main_contents");
const add_new_group = document.querySelector('.add_new_group');
const add_group_input_wrapper = document.querySelector('.add_group');
const my_card_book = document.querySelector('.my_card_book');

console.log(principal);

let page = 0;
let total_page_check_flag = false;
let card_order_flag = "reg_date";
let page_check_flag = "current";

let group_list;
let card_list;

let selected_group;

let card_detail;

add_new_group.onclick = () => {
    let add_new_group_input_wrapper = document.querySelector("#add_new_group");
    if (add_new_group_input_wrapper != null) return;

    add_new_group_input_wrapper = makeAddNewGroupTag();
    my_card_book.insertBefore(add_new_group_input_wrapper, my_card_book.children[2]);

    const group_name_input = add_new_group_input_wrapper.querySelector("input");
    const remove_button = add_new_group_input_wrapper.querySelector("button");

    group_name_input.focus();

    remove_button.onclick = () => add_new_group_input_wrapper.remove();
    group_name_input.onkeypress = (event) => {
        if (event.keyCode == 13) {
            if (group_name_input.value == "") {
                alert("그룹명을 다시 입력해주세요.");
                return;
            }
            group_name_input.onkeypress = null;
            if (ajax.insertNewGroup(group_name_input.value)) {
                location.reload();
            } else {
                alert("그룹 인서트 실패");
            }
        }
    }
}

whole_cards.onclick = () => {
    console.log(card_order_flag);
    selected_group = null;
    card_list = ajax.loadCardsInAllGroups(page, card_order_flag);
    setCardList();
}

main();

async function main() {
    group_list = ajax.loadUserGroups();
    console.log(group_list);

    whole_count.innerText = group_list[0].total_count;
    setGroupList();

    myCard();

    setTimeout(() => {
        whole_cards.click();
    }, 0);

    const uri = location.pathname;
    const uris = uri.substring(1, uri.length).split("/");
    let invite_code;
    if (uris.length == 2) {
        invite_code = uris[1];

        console.log("invite_code : " + invite_code);
        // 팀 초대 모달 출력
        // 초대 코드 유효성 판별 ( 팀 정보 select )
        // 이후에 팀 프로필 있는지
        const invited_team = await ajax.loadInvitedTeamInfo(invite_code);
        console.log(invited_team);
		
		if(invited_team == null) {
			alert("유효하지 않은 팀 초대 코드입니다.\n팀 관리자에게 다시 문의해주세요.");
		} else if(invited_team.join_flag) {
			alert("이미 가입된 팀입니다.");
		} else {
	        const invite_team_modal = makeInviteTeamModal(invited_team);
	        appendModalToContainer(invite_team_modal);
	
	        const flow_columns = invite_team_modal.querySelectorAll(".column");
	        const step_descriptions = invite_team_modal.querySelectorAll(".step_description");
	        const nickname_input = step_descriptions[1].querySelector("input");
	        const next_button = invite_team_modal.querySelector(".next");
	        const submit_button = invite_team_modal.querySelector(".submit_button");
	
	        invite_team_modal.querySelector(".close_modal").onclick = () => removeModal(invite_team_modal);
	
	        next_button.onclick = () => {
	            next_button.classList.add("hidden");
	            submit_button.classList.remove("hidden");
	
	            flow_columns[0].className = "column checked";
	            flow_columns[0].querySelector(".circle").innerText = "";
	            flow_columns[1].className = "column selected";
	
	            step_descriptions[0].classList.add("hidden");
	            step_descriptions[1].classList.remove("hidden");
	        }
	
	        nickname_input.oninput = () => {
	            if (nickname_input.value == "") {
	                submit_button.disabled = true;
	            } else {
	                submit_button.disabled = false;
	            }
	        }
	
	        submit_button.onclick = () => {
	            if (ajax.joinInvitedTeam(invited_team.id, nickname_input.value)) {
	                document.querySelector("#team_tab_button").click();
	            } else {
	                alert("팀 참가에 실패했습니다.");
	            }
	        }
		}
    }
}

function loadSpecificGroupCardList() {
    let cards;
    $.ajax({
        type: "get",
        url: "/api/v1/card/group/" + card_list.id + "/card/list",
        async: false,
        data: {
            "page": page,
            "card_order_flag": card_order_flag
        },
        dataType: "json",
        success: function (data) {
            console.log(data);
            cards = data;
        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    });
    return cards;
}

function myCard() {
    const register_my_card_button = document.querySelector('.register_business_card');
    const add_card_form = makeAddCardFormTag();
    register_my_card_button.onclick = () => {

        replaceTagInMainContents(add_card_form);
    }
}

function setGroupList() {
    my_card_book.querySelectorAll(".group").forEach(e => {
        if (e.id != "whole_cards") e.remove();
    });
    for (let i = 0; i < group_list.length; i++) {
        let group_tag;
        if (group_list[i].group_name == "미분류 명함") {
            group_tag = makeCardGroupTag(group_list[i], true);
        } else {
            group_tag = makeCardGroupTag(group_list[i], false);
        }
        my_card_book.appendChild(group_tag);

        const down_menu = group_tag.querySelector(".down_menu");
        group_tag.onclick = (event) => {
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
                    const group_tags = my_card_book.querySelectorAll(".group");
                    for (let i = 0; i < group_tags.length; i++) {
                        if (group_tags[i] == group_tag) current_index = i + 3;
                    }

                    const change_name_tag = makeChangeGroupNameTag(group_list[i].group_name);
                    const group_name_input = change_name_tag.querySelector("input[name='group_name']");
                    group_tag.classList.add("hidden");
                    my_card_book.insertBefore(change_name_tag, my_card_book.children[current_index]);

                    group_name_input.onkeypress = () => {
                        if (window.event.keyCode == 13) {
                            if (ajax.updateGroupName(group_list[i].id, group_name_input.value)) {
                                location.reload();
                            } else {
                                alert("그룹명 변경 실패");
                            }
                        }
                    }
                }

                menu_list.querySelector(".remove_group").onclick = (e) => {
					e.stopPropagation();
					
                    const delete_group_modal = makeDeleteGroupModal(group_list[i].group_name);
                    appendModalToContainer(delete_group_modal);

                    delete_group_modal.querySelector(".close_modal").onclick = () => removeModal(delete_group_modal);

                    delete_group_modal.querySelector(".delete_group_button").onclick = () => {
                        if (ajax.deleteGroup(group_list[i].id)) {
                            location.reload();
                        } else {
                            alert("그룹 삭제 실패");
                        }
                    }
                }
            } else {
                page_check_flag = "current";
                page = 0;
                selected_group = group_list[i];
                card_list = ajax.loadCardsInSpecificGroup(group_list[i].id, page, card_order_flag);
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
        console.log(card_list);
        const total_card_count = selected_group == null ? group_list[0].total_count : selected_group.card_count;
        const card_list_wrapper_tag = makeCardListTag(card_order_flag);
        replaceTagInMainContents(card_list_wrapper_tag);

        const card_list_tag = card_list_wrapper_tag.querySelector(".card_list");
        let prev_upload_date;
        let prev_first_character;
        for (let i = 0; i < card_list.length; i++) {
            if (card_order_flag == "reg_date") {
                const upload_date = makeCardSummaryRegDateText(card_list[i].create_date);
                if (prev_upload_date != upload_date) {
                    const upload_date_tag = makeCardOrderStandardTag(upload_date);
                    card_list_tag.appendChild(upload_date_tag);
                    prev_upload_date = upload_date;
                }
            } else if (card_order_flag == "name") {
                const first_character = makeCardSummaryCharacterText(card_list[i].name);
                if (prev_first_character != first_character) {
                    const upload_date_tag = makeCardOrderStandardTag(first_character);
                    card_list_tag.appendChild(upload_date_tag);
                    prev_first_character = first_character;
                }
            } else if (card_order_flag == "company_name") {
                const first_character = makeCardSummaryCharacterText(card_list[i].company_name);
                if (prev_first_character != first_character) {
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
        const left_down_menu = card_list_wrapper_tag.querySelector('.card_list_menu .left_menu .down_menu');
        const right_down_menu = card_list_wrapper_tag.querySelector('.card_list_menu .right_menu .down_menu');
        const right_buttons_wrapper = card_list_wrapper_tag.querySelector('.card_list_menu .right_menu > .buttons');
        const card_ordering_tag = card_list_wrapper_tag.querySelector(".card_ordering");
        const cards = card_list_wrapper_tag.querySelectorAll(".card");
        const checkboxes = card_list_wrapper_tag.querySelectorAll(".card_list .card_check");


        makePageTag(total_card_count, pager.children);

        card_ordering_tag.onchange = () => {
            card_order_flag = card_ordering_tag.options[card_ordering_tag.selectedIndex].value;
            page = 0;
            card_list = selected_group == null ? ajax.loadCardsInAllGroups(page, card_order_flag) :
                ajax.loadCardsInSpecificGroup(selected_group.id, page, card_order_flag);
            setCardList();
        }

        right_buttons_wrapper.children[0].onclick = () => {
            const team_list = ajax.loadJoinedTeamList();
            const save_to_team_modal = makeCardCopyToTeamModal();
            for (let i = 0; i < team_list.length; i++) {
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
                    if (card_book_checkboxes[index].checked) {
                        e.classList.add("checked");
                        submit_button.disabled = false;
                    } else {
                        e.classList.remove("checked");
                        let check_count = 0;
                        card_book_checkboxes.forEach(e => {
                            if (e.checked) check_count++;
                        });
                        if (check_count == 0) submit_button.disabled = true;
                    }
                }
            });

            memo_include_span.onclick = () => memo_include_input.click();
            save_to_team_modal.querySelector(".close_modal").onclick = () => removeModal(save_to_team_modal);
            save_to_team_modal.querySelector(".cancel_button").onclick = () => removeModal(save_to_team_modal);

            submit_button.onclick = () => {
                submit_button.disabled = true;

                const selected_card_id_list = new Array();
                const not_selected_card_id_list = new Array();
                const checked_card_book_id_list = new Array();

                card_book_checkboxes.forEach((e, index) => {
                    if (e.checked) checked_card_book_id_list.push(card_book_list[index].id);
                })

                checkboxes.forEach((e, index) => {
                    if (e.checked) selected_card_id_list.push(card_list[index].id);
                    else not_selected_card_id_list.push(card_list[index].id);
                });

                console.log(selected_card_id_list);
                console.log(not_selected_card_id_list);
                console.log(checked_card_book_id_list);

                let ajax_flag = false;

                if (selected_group == null) {
                    // 전체
                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
                        // 전체 not_selected_id_list, checked_card_book_id_list, memo_include_flag 전달
                        ajax_flag = ajax.insertAllCardsToTeam(not_selected_card_id_list, checked_card_book_id_list, memo_include_input.checked);
                    } else {
                        // 일부 selected_card_id_list, checked_card_book_id_list, memo_include_flag 전달
                        ajax_flag = ajax.insertCardsToTeam(selected_card_id_list, checked_card_book_id_list, memo_include_input.checked);
                    }
                } else if (selected_group != null) {
                    // 그룹
                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
                        // 전체 not_selected_id_list, checked_card_book_id_list, memo_include_flag 전달
                        ajax_flag = ajax.insertAllCardsInGroupToTeam(selected_group.id, not_selected_card_id_list, checked_card_book_id_list, memo_include_input.checked);
                    } else {
                        // 일부 selected_card_id_list, checked_card_book_id_list, memo_include_flag 전달
                        ajax_flag = ajax.insertCardsToTeam(selected_card_id_list, checked_card_book_id_list, memo_include_input.checked);
                    }
                }

                if (ajax_flag) {
                    alert("팀 명함첩에 저장 완료");
                    removeModal(save_to_team_modal);
                } else {
                    alert("팀 명함첩에 저장 실패");
                    submit_button.disabled = false;
                }
            }
        }

        right_buttons_wrapper.children[1].onclick = () => {
            const selected_id_list = new Array();
            const not_selected_id_list = new Array();
            checkboxes.forEach((e, index) => {
                if (e.checked) selected_id_list.push(card_list[index].id);
                else not_selected_id_list.push(card_list[index].id);
            });
            let card_count_for_modal = 0;
            if (selected_group == null) {
                // 전체
                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
                    card_count_for_modal = group_list[0].total_count - not_selected_id_list.length;
                } else {
                    card_count_for_modal = selected_id_list.length;
                }
            } else {
                // 그룹
                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
                    card_count_for_modal = selected_group.card_count - not_selected_id_list.length;
                } else {
                    card_count_for_modal = selected_id_list.length;
                }
            }
            const move_group_modal = makeChangeGroupModal(card_count_for_modal);
            appendModalToContainer(move_group_modal);

            move_group_modal.querySelector(".close_modal").onclick = () => removeModal(move_group_modal);

            const group_list_in_modal = move_group_modal.querySelector(".group_list");
            const add_new_group_in_modal = move_group_modal.querySelector(".add_new_group");
            const insert_group_form = move_group_modal.querySelector(".insert_group_form");
            const new_group_name_input = insert_group_form.querySelector("input");

            for (let i = 0; i < group_list.length; i++) {
                if (group_list[i].group_name == "미분류 명함") continue;
                const group_tag = makeGroupTagForMultipleModal(false, group_list[i].group_name);
                group_list_in_modal.insertBefore(group_tag, add_new_group_in_modal);

                group_tag.onclick = () => group_tag.querySelector("input").click();
            }

            add_new_group_in_modal.onclick = () => {
                insert_group_form.classList.remove("hidden");
                add_new_group_in_modal.classList.add("hidden");
            }

            insert_group_form.querySelector(".cancel").onclick = () => {
                insert_group_form.classList.add("hidden");
                add_new_group_in_modal.classList.remove("hidden");
            }

            insert_group_form.querySelector(".confirm").onclick = () => {
                if (new_group_name_input.value == "") {
                    alert("그룹명을 확인해주세요.");
                } else if (new_group_name_input.value == "미분류 명함") {
                    alert("해당 그룹명은 사용할 수 없습니다.");
                } else {
                    // insert new group
                    if (ajax.insertNewGroup(new_group_name_input.value)) {
                        group_list_in_modal.querySelectorAll(".group").forEach(e => e.remove());
                        group_list = ajax.loadUserGroups();
                        setGroupList();
                        for (let i = 0; i < group_list.length; i++) {
                            if (group_list[i].group_name == "미분류 명함") continue;
                            const group_tag = makeGroupTagForModal(group_list[i]);
                            group_list_in_modal.insertBefore(group_tag, add_new_group_in_modal);

                            group_tag.onclick = () => group_tag.querySelector(".group_selector").click();
                        }
                        new_group_name_input.value = "";
                        add_new_group_in_modal.classList.remove("hidden");
                        insert_group_form.classList.add("hidden");
                    } else {
                        alert("그룹 인서트 실패");
                    }
                }
            }

            const default_card_group_id = group_list[group_list.findIndex(e => e.group_name == "미분류 명함")].id;
            const complete_button = move_group_modal.querySelector('.set_group_button');

            complete_button.onclick = () => {
                const selected_group_id_list = new Array();
                const group_check_list = move_group_modal.querySelectorAll(".group > input");
                group_check_list.forEach((e, index) => {
                    if (e.checked) selected_group_id_list.push(group_list[index].id);
                });

                let ajax_flag = false;

                if (selected_group == null) {
                    // 전체
                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
                        ajax_flag = ajax.updateAllCardsBelongGroups(not_selected_id_list, selected_group_id_list, default_card_group_id);
                    } else {
                        ajax_flag = ajax.updateCardsBelongGroups(selected_id_list, selected_group_id_list, default_card_group_id);
                    }
                } else {
                    // 그룹
                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
                        ajax_flag = ajax.updateAllCardsInGroupBelongGroups(selected_group.id, not_selected_id_list, selected_group_id_list, default_card_group_id);
                    } else {
                        ajax_flag = ajax.updateCardsBelongGroups(selected_id_list, selected_group_id_list, default_card_group_id);
                    }
                }

                if (ajax_flag) {
                    location.reload();
                } else {
                    alert("그룹 수정 실패");
                }
            }
        }


        right_down_menu.onclick = () => {
            let menu_list = right_down_menu.querySelector(".menu_list");
            if (menu_list == null) {
                menu_list = makeMoreMenuListTag();
                right_down_menu.appendChild(menu_list);

                menu_list.querySelector("#get_address_list").onclick = () => {
                    const send_email_modal = makeSendEmailModal("asdf");
                    appendModalToContainer(send_email_modal);

                    send_email_modal.querySelector(".close_modal").onclick = () => removeModal(send_email_modal);
                    send_email_modal.querySelector(".close_button").onclick = () => removeModal(send_email_modal);
                }

                menu_list.querySelector("#extract_to_file").onclick = () => {
                    const send_file_modal = makeSendFileModal(principal);
                    appendModalToContainer(send_file_modal);
                    const file_selector = send_file_modal.querySelector(".file_selector");
                    const file_type_list = send_file_modal.querySelector('.file_list');

                    send_file_modal.querySelector(".close_modal").onclick = () => removeModal(send_file_modal);
                    send_file_modal.querySelector(".cancel_button").onclick = () => removeModal(send_file_modal);

                    file_selector.onclick = () => file_type_list.classList.toggle('hidden');

                    file_types = file_type_list.querySelectorAll("span");
                    file_types.forEach(e => e.onclick = () => {
                        file_selector.querySelector("span").innerText = e.innerText;
                        file_type_list.classList.add("hidden");
                    });
                }

                menu_list.querySelector("#delete_cards").onclick = () => {
					const selected_id_list = new Array();
		            const not_selected_id_list = new Array();
		            checkboxes.forEach((e, index) => {
		                if (e.checked) selected_id_list.push(card_list[index].id);
		                else not_selected_id_list.push(card_list[index].id);
		            });
					
					let card_count_for_modal = 0;
		            if (selected_group == null) {
		                // 전체
		                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
		                    card_count_for_modal = group_list[0].total_count - not_selected_id_list.length;
		                } else {
		                    card_count_for_modal = selected_id_list.length;
		                }
		            } else {
		                // 그룹
		                if (page_check_flag == "whole" || page_check_flag == "whole_after") {
		                    card_count_for_modal = selected_group.card_count - not_selected_id_list.length;
		                } else {
		                    card_count_for_modal = selected_id_list.length;
		                }
		            }
					
                    const delete_cards_modal = makeDeleteCardsConfirmModal(card_count_for_modal);
                    appendModalToContainer(delete_cards_modal);

                    delete_cards_modal.querySelector(".close_modal").onclick = () => removeModal(delete_cards_modal);

                    delete_cards_modal.querySelector(".confirm").onclick = () => {
                        let ajax_flag = false;

		                if (selected_group == null) {
		                    // 전체
		                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
		                        ajax_flag = ajax.deleteAllCards(not_selected_id_list);
		                    } else {
		                        ajax_flag = ajax.deleteCards(selected_id_list);
		                    }
		                } else {
		                    // 그룹
		                    if (page_check_flag == "whole" || page_check_flag == "whole_after") {
		                        ajax_flag = ajax.deleteAllCardsInGroup(selected_group.id, not_selected_id_list);
		                    } else {
		                        ajax_flag = ajax.deleteCards(selected_id_list);
		                    }
		                }
		
		                if (ajax_flag) {
		                    location.reload();
		                } else {
		                    alert("그룹 수정 실패");
		                }
                    }
                };
            } else {
                menu_list.remove();
            }
        }

        let select_message_tag = card_list_wrapper_tag.querySelector(".select_message");

        all_checkbox.onclick = (event) => {
            event.preventDefault();
            if (select_message_tag == null) {
                select_message_tag = document.createElement("div");
                select_message_tag.classList.add("select_message");

                card_list_wrapper_tag.querySelector(".card_list").insertBefore(select_message_tag, card_list_tag.children[0]);
            }
            if (page_check_flag == null) {
                console.log("page_check_flag is null");
                select_message_tag.classList.add("hidden");

                all_checkbox.classList.remove("not_max");
                all_checkbox.classList.remove("checked");
                all_checkbox.checked = false;
                checkboxes.forEach((e, index) => {
                    e.checked = all_checkbox.checked;
                    cards[index].classList.remove("selected");
                });
                page_check_flag = "current";
                toggleCardListTitleRight(card_ordering_tag, right_buttons_wrapper, false);

            } else if (page_check_flag == "current") {
                console.log("page_check_flag is current");
                const select_message = makeSelectMessage(page_check_flag, checkboxes.length);
                select_message_tag.innerText = select_message;
                select_message_tag.classList.remove("hidden");

                all_checkbox.classList.remove("not_max");
                all_checkbox.classList.add("checked");
                all_checkbox.checked = true;
                checkboxes.forEach((e, index) => {
                    e.checked = all_checkbox.checked;
                    cards[index].classList.add("selected");
                });
                page_check_flag = null;
                toggleCardListTitleRight(card_ordering_tag, right_buttons_wrapper, true);

            } else if (page_check_flag == "not_max") {
                console.log("page_check_flag is not_max");

                let selected_count = 0;
                checkboxes.forEach((e, index) => {
                    if (e.checked) {
                        cards[index].classList.add("selected");
                        selected_count++;
                    }
                    else cards[index].classList.remove("selected");
                });

                const select_message = makeSelectMessage(page_check_flag, selected_count);
                select_message_tag.innerText = select_message;
                select_message_tag.classList.remove("hidden");

                all_checkbox.classList.add("not_max");
                all_checkbox.classList.remove("checked");
                page_check_flag = null;
                toggleCardListTitleRight(card_ordering_tag, right_buttons_wrapper, true);

            } else if (page_check_flag == "whole") {
                console.log("page_check_flag is whole");

                all_checkbox.classList.remove("not_max");
                all_checkbox.classList.add("checked");
                all_checkbox.checked = true;
                checkboxes.forEach((e, index) => {
                    e.checked = all_checkbox.checked
                    cards[index].classList.add("selected");
                });

                const select_message = makeSelectMessage(page_check_flag, selected_group == null ? group_list[0].total_count : selected_group.card_count);
                select_message_tag.innerText = select_message;
                select_message_tag.classList.remove("hidden");
                toggleCardListTitleRight(card_ordering_tag, right_buttons_wrapper, true);

            } else if (page_check_flag == "whole_after") {
                console.log("whole_after");

                all_checkbox.classList.remove("not_max");
                all_checkbox.classList.add("checked");

                let not_selected_count = 0;
                checkboxes.forEach((e, index) => {
                    if (e.checked) {
                        cards[index].classList.add("selected");
                    } else {
                        cards[index].classList.remove("selected");
                        not_selected_count++;
                    }
                });

                const select_message = makeSelectMessage(page_check_flag, selected_group == null ? group_list[0].total_count - not_selected_count : selected_group.card_count - not_selected_count);
                select_message_tag.innerText = select_message;
                toggleCardListTitleRight(card_ordering_tag, right_buttons_wrapper, true);
            }
        }

        left_down_menu.onclick = () => {
            let card_list_menu = left_down_menu.querySelector(".menu_list");
            if (card_list_menu == null) {
                card_list_menu = makeCardListMenuTag();
                left_down_menu.appendChild(card_list_menu);

                card_list_menu.querySelector("#current_page_selector").onclick = () => {
                    // 현재 페이지 선택
                    page_check_flag = "current";
                    all_checkbox.click();
                }

                card_list_menu.querySelector("#whole_page_selector").onclick = () => {
                    // 모든 페이지 선택
                    page_check_flag = "whole";
                    all_checkbox.click();
                }

                card_list_menu.querySelector("#select_cancel").onclick = () => {
                    // 체크박스 모두 해제
                    page_check_flag = null;
                    all_checkbox.click();
                }
            } else {
                card_list_menu.remove();
            }
        }

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
                    const send_card_modal = makeSendCardModal(card_detail.card.name);
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
                    if (menu_list == null) {
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
                                    if (checkbox.checked) send_button.disabled = false;
                                    else {
                                        let check_count = 0;
                                        report_items.forEach(e1 => {
                                            if (e1.querySelector("input").checked) check_count++;
                                        });
                                        if (check_count == 0) send_button.disabled = true;
                                    }
                                }
                            });
                        }

                        menu_list.querySelector("#save_to_team").onclick = () => {
                            // 팀 명함첩에 저장 모달
                            const team_list = ajax.loadJoinedTeamList();
                            const save_to_team_modal = makeCardCopyToTeamModal();
                            for (let i = 0; i < team_list.length; i++) {
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
                                    if (card_book_checkboxes[index].checked) {
                                        e.classList.add("checked");
                                        submit_button.disabled = false;
                                    } else {
                                        e.classList.remove("checked");
                                        let check_count = 0;
                                        card_book_checkboxes.forEach(e => {
                                            if (e.checked) check_count++;
                                        });
                                        if (check_count == 0) submit_button.disabled = true;
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
                                    if (e.checked) checked_card_book_id_list.push(card_book_list[index].id);
                                });

                                console.log(checked_card_book_id_list);

                                if (ajax.insertCardToTeam(card_detail.card.id, checked_card_book_id_list, memo_include_input.checked)) {
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
                                if (ajax.deleteCard(card_detail.card.id)) {
                                    location.reload();
                                } else {
                                    alert("명함 삭제에 실패했습니다.");
                                }
                            }
                        }
                    } else if (event.target.className == "down_menu") {
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

                    if (card_detail.card_images.length > 0) {
                        const front = makeCardImageTag(card_detail.card_images[0].card_image, true, true);
                        card_image_wrapper.insertBefore(front, card_image_input_wrapper);
                        front.querySelector(".change_image").onclick = () => {
                            clicked_card = "front";
                            card_image_input.click();
                            card_image_input_wrapper.querySelector(".text").innerText = "뒷면 추가";
                        }
                        if (card_detail.card_images.length > 1) {
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
                            if (clicked_card == "front") {
                                clicked_card = null;
                                card_image_wrapper.querySelector(".front > img").src = event.target.result;
                                front_card_image_file = card_image_input.files[0];
                            } else if (clicked_card == "back") {
                                clicked_card = null;
                                card_image_wrapper.querySelector(".back > img").src = event.target.result;
                                back_card_image_file = card_image_input.files[0];
                            } else if (front_card_image_file == null) {
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

                    edit_card_form.querySelector(".cancel_button").onclick = () => {
                        edit_card_form.remove();
                        card_list_wrapper.classList.remove("hidden");
                        card_detail_tag.classList.remove("hidden");
                    }

                    edit_card_form.querySelector(".submit_button").onclick = () => {
                        const card_inputs = edit_card_form.querySelectorAll(".row input");
                        if (card_inputs[0].value == "") {
                            alert("이름은 필수로 입력해야합니다");
                            return;
                        }
                        const formdata = makeFormDataForUpdateCard(card_detail.card.profile_img, card_inputs, front_card_image_file, back_card_image_file, profile_image_file);
                        if (ajax.updateCard(card_detail.card.id, formdata)) {
                            edit_card_form.remove();
                            card_list_wrapper.classList.remove("hidden");
                            card_detail_tag.classList.remove("hidden");
                            reloadCardDetail();
                        } else {
                            alert("명함 수정에 실패했습니다.");
                        }
                    }
                }

                const card_image_tag = card_detail_tag.querySelector(".card_image");
                if (card_image_tag != null) {
                    card_image_tag.onclick = () => {
                        const card_image_modal = makeShowAllCardImageModal(card_detail.card_images);
                        appendModalToContainer(card_image_modal);

                        card_image_modal.querySelector(".close_modal").onclick = () => removeModal(card_image_modal);
                    }
                }

                const joined_group_tag = makeJoinedGroupTag(card_detail.group_list);
                const left_rows = card_detail_tag.querySelectorAll('.left .row');
                left_rows[4].appendChild(joined_group_tag);

                const change_group_button = joined_group_tag.querySelector('.change_group_button');
                change_group_button.onclick = () => {
                    const move_group_modal = makeChangeGroupModal(1);
                    appendModalToContainer(move_group_modal);

                    move_group_modal.querySelector(".close_modal").onclick = () => removeModal(move_group_modal);

                    const group_list_in_modal = move_group_modal.querySelector(".group_list");
                    const add_new_group_in_modal = move_group_modal.querySelector(".add_new_group");
                    const insert_group_form = move_group_modal.querySelector(".insert_group_form");
                    const new_group_name_input = insert_group_form.querySelector("input");

                    for (let i = 0; i < group_list.length; i++) {
                        if (group_list[i].group_name == "미분류 명함") continue;
                        const group_tag = makeGroupTagForMultipleModal(false, group_list[i].group_name);
                        group_list_in_modal.insertBefore(group_tag, add_new_group_in_modal);

                        group_tag.onclick = () => group_tag.querySelector("input").click();
                    }

                    add_new_group_in_modal.onclick = () => {
                        insert_group_form.classList.remove("hidden");
                        add_new_group_in_modal.classList.add("hidden");
                    }

                    insert_group_form.querySelector(".cancel").onclick = () => {
                        insert_group_form.classList.add("hidden");
                        add_new_group_in_modal.classList.remove("hidden");
                    }

                    insert_group_form.querySelector(".confirm").onclick = () => {
                        if (new_group_name_input.value == "") {
                            alert("그룹명을 확인해주세요.");
                        } else if (new_group_name_input.value == "미분류 명함") {
                            alert("해당 그룹명은 사용할 수 없습니다.");
                        } else {
                            // insert new group
                            if (ajax.insertNewGroup(new_group_name_input.value)) {
                                group_list_in_modal.querySelectorAll(".group").forEach(e => e.remove());
                                group_list = ajax.loadUserGroups();
                                setGroupList();
                                for (let i = 0; i < group_list.length; i++) {
                                    if (group_list[i].group_name == "미분류 명함") continue;
                                    const group_tag = makeGroupTagForModal(group_list[i]);
                                    group_list_in_modal.insertBefore(group_tag, add_new_group_in_modal);

                                    group_tag.onclick = () => group_tag.querySelector(".group_selector").click();
                                }
                                new_group_name_input.value = "";
                                add_new_group_in_modal.classList.remove("hidden");
                                insert_group_form.classList.add("hidden");
                            } else {
                                alert("그룹 인서트 실패");
                            }
                        }
                    }

                    const default_card_group_id = group_list[group_list.findIndex(e => e.group_name == "미분류 명함")].id;
                    const complete_button = move_group_modal.querySelector('.set_group_button');

                    complete_button.onclick = () => {
                        const selected_group_id_list = new Array();
                        const group_check_list = move_group_modal.querySelectorAll(".group > input");
                        group_check_list.forEach((e, index) => {
                            if (e.checked) selected_group_id_list.push(group_list[index].id);
                        });

                        const checked_card_id_list = new Array();
                        checkboxes.forEach((e, index) => {
                            if (e.checked) checked_card_id_list.push(card_list[index].id);
                        });

                        if (ajax.updateCardBelongGroups(card_detail.card.id, selected_group_id_list, default_card_group_id)) {
                            location.reload();
                        } else {
                            alert("그룹 수정 실패");
                        }
                    }
                }

                const memo_wrapper = card_detail_tag.querySelector('.memo_list_wrapper > .memo_list');
                for (let i = 0; i < card_detail.memo_list.length; i++) {
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
                            if (event.target.value == "") {
                                submit_button.disabled = true;
                            } else {
                                submit_button.disabled = false;
                            }
                        }

                        submit_button.onclick = () => {
                            if (ajax.updateCardMemo(card_detail.memo_list[i].id, contents.value)) {
                                location.reload();
                            } else {
                                alert("메모 수정 실패");
                            }
                            removeModal(update_memo_modal);
                        }
                    }

                    memo.querySelector(".show_remove_memo_modal").onclick = () => {
                        const remove_memo_modal = makeDeleteConfirmCardMemoModal(card_detail.memo_list[i]);
                        appendModalToContainer(remove_memo_modal);

                        remove_memo_modal.querySelector(".close_modal").onclick = () => {
                            removeModal(remove_memo_modal);
                        }

                        remove_memo_modal.querySelector(".remove_button").onclick = () => {
                            if (ajax.deleteCardMemo(card_detail.memo_list[i].id)) {
                                reloadCardDetail();
                            } else {
                                alert("메모 삭제 실패");
                            }
                            removeModal(remove_memo_modal);
                        }
                    }
                }

                const add_memo_button = card_detail_tag.querySelector('.memo_input');
                add_memo_button.onclick = () => {
                    const memo_modal = makeAddCardMemoModal();
                    const memo_input = memo_modal.querySelector("textarea");
                    const save_memo_button = memo_modal.querySelector(".submit_button");
                    appendModalToContainer(memo_modal);

					memo_modal.querySelector(".close_modal").onclick = () => removeModal(memo_modal);
					memo_modal.querySelector(".cancel_button").onclick = () => removeModal(memo_modal);
					
                    setTimeout(() => {
                        memo_input.focus();
                    }, 150);

                    memo_input.oninput = () => {
                        if (memo_input.value == "") {
                            save_memo_button.disabled = true;
                        } else {
                            save_memo_button.disabled = false;
                        }
                    }

                    save_memo_button.onclick = () => {
                        if (ajax.insertCardMemo(card_detail.card.id, memo_input.value)) {
                            removeModal(memo_modal);
                            cards.forEach(e => {
                                if (e.className.includes("clicked")) {
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

        checkboxes.forEach((e, index) => {
            // 각 명함 체크
            e.onclick = (event) => {
				event.stopPropagation();
				
                let checked_count = 0;
                checkboxes.forEach(e1 => {
                    if (e1.checked) checked_count++;
                });
                console.log("checked_count : " + checked_count);
                if (checked_count == 0) {
                    page_check_flag = null;
                } else if (page_check_flag == "whole") {
                    page_check_flag = "whole_after";
                } else if (page_check_flag == "whole_after") {
                    page_check_flag = "whole_after";
                } else if (checked_count < checkboxes.length) {
                    page_check_flag = "not_max";
                } else {
                    page_check_flag = "current";
                }
                all_checkbox.click();
            }
        });
    }
}

function makePageTag(total_card_count, pager) {
    let page_number = page - 1;
    const last_page = total_card_count % 10 == 0 ? Math.floor(total_card_count / 10) : Math.floor(total_card_count / 10) + 1;
    for (let i = 0; i < pager.length; i++) {
        if (page_number < 1 || page_number > last_page) pager[i].classList.add("blank");
        else {
            pager[i].innerText = page_number;
            if (page_number == page + 1) pager[i].classList.add("current");
            else {
                const page_for_event = page_number;
                pager[i].onclick = () => {
                    page = page_for_event - 1;
                    card_list = selected_group == null ? ajax.loadCardsInAllGroups(page, card_order_flag) :
                    																	ajax.loadCardsInSpecificGroup(selected_group.id, page, card_order_flag);
                    setCardList();
                }
            }
        }
        page_number++;
    }
}

function toggleCardListTitleRight(card_ordering_tag, right_buttons_wrapper, checked) {
    if (checked) {
        card_ordering_tag.classList.add('hidden');
        right_buttons_wrapper.classList.remove('hidden');
    } else {
        card_ordering_tag.classList.remove('hidden');
        right_buttons_wrapper.classList.add('hidden');
    }
}

function toggleClassColorToCards(cards, add_flag) {
    for (let i = 0; i < cards.length; i++) {
        if (add_flag) cards[i].classList.add("color");
        else cards[i].classList.remove("color");
    }
}

function countChecked(checkboxes) {
    let count = 0;
    checkboxes.forEach(checkBox => {
        if (checkBox.checked) count++;
    });
    return count;
}

function toggleClassClickedCards(cards, current_index) {
    cards.forEach((item, index) => {
        if (index != current_index) item.classList.remove("clicked");
        else item.classList.add("clicked");
    });
}

function makeMoreMenuListTag() {
    const div = document.createElement("div");
    div.className = "menu_list";
    div.innerHTML = `
		<button type="button" class="row" id="get_address_list">단체메일</button>
		<button type="button" class="row" id="extract_to_file">내보내기</button>
		<button type="button" class="row" id="delete_cards">삭제</button>
	`;
    return div;
}

function moveGroupModal(card_count, group_list) {
    const setGroupModal = document.createElement('div');
    setGroupModal.className = "note_modal";
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
						<li class="group_list_add">
						<button class=add_group_btn>+ 그룹 추가하기</button>
							<div class="insert_group_form hidden">
							<input type="text" name="group_name" placeholder="그룹명 입력" value="">
							<button type="button" class="confirm">확인</button>
							<button type="button" class="cancel">취소</button>
							</div>
						</li>
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

function makeSendFileModal(user_data) {
    const div = document.createElement('div');
    div.className = "modal";
    div.innerHTML = `
		<div class="window send_file">
			<div class="title">
				<span>파일로 내보내기</span>
				<button class="close_modal">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="description">
				<div class="row">
					<span>파일을 수신할 이메일 주소</span>
					<input type="text" name="file_mail" placeholder ="이메일 주소 입력" value =${user_data.email}>
				</div>
				<div class="row">
					<span>파일 유형</span>
					<button type="button" class="file_selector">
						<span>엑셀 파일 (.xls)</span>
						<img src="/static/images/card_file_list.png">
					</button>
					<div class="file_list hidden">
						<span>엑셀 파일 (.xls)</span>
						<span>아웃룩 주소록용 (.csv)</span>
						<span>휴대폰 연락처용 (.vcf)</span>
					</div>
				</div>
			</div>
			<div class="buttons">
				<button class="cancel_button">취소</button>
				<button class="submit_button">전송</button>				
			</div>
		</div>
	`;
    return div;
}

function makeDeleteCardModal(checked_count) {
    const div = document.createElement('div');
    div.className = "note_modal";
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

function changeCardImage(event, image_tag) {
    const file_reader = new FileReader();
    file_reader.onloadend = (e) => {
        image_tag.src = e.target.result;
    }
    file_reader.readAsDataURL(event.target.files[0]);
}

function makeNoContentsTag() {
	const inner_text = group_list[0].total_count == 0 ? "등록된 명함이 없습니다." : "그룹에 명함이 없습니다.";
    const div = document.createElement("div");
    div.className = "no_contents";
    div.innerHTML = `<span class="text">${inner_text}</span>`;
    return div;
}

function makeCardCopyToTeamModal() {
    const div = document.createElement("div");
    div.className = "modal";
    div.innerHTML = `
		<div class="window save_to_team">
			<div class="title">
				<span>팀 명함첩으로 복제</span>
				<button class="close_modal">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
			</div>
			<div class="card_book_list">
				
			</div>
			<div class="buttons">
				<input type="checkbox" name="include_memo" class="memo_include_flag">
				<span>메모 정보를 포함</span>
				<button class="cancel_button">취소</button>
				<button class="submit_button" disabled>확인</button>
			</div>
		</div>
	`;
    return div;
}

function makeTeamWithCardBooksTag(team_data) {
    const div = document.createElement("div");
    div.className = "team";
    div.innerHTML = `<div class="title">${team_data.team_detail.title}</div>`;
    for (let i = 0; i < team_data.card_books.length; i++) {
        div.innerHTML += `
			<div class="card_book">
				<input type="checkbox" class="card_book_selector">
				<div class="summary">
					<span class="card_book_name">${team_data.card_books[i].card_book_name}</span>
					<span class="card_count_info"><span class="current">${team_data.card_books[i].card_count}</span>/<span class="limit">${team_data.team_detail.grade_id == 1 ? team_data.team_detail.max_card_count : '∞'}</span>장 등록</span>
				</div>
			</div>	
		`;
    }
    return div;
}

function makeInviteTeamModal(team) {
    const div = document.createElement("div");
    div.className = "modal";
    div.innerHTML = `
		<div class="window invite_team">
			<div class="title">
				<span>팀 명함첩</span>
				<button type="button" class="close_modal">
					<img src="/static/images/card_modal_close.png">
				</button>
			</div>
			<div class="description">
				<div class="flow">
					<div class="column selected">
						<span class="circle">1</span>
						<span class="flow_name">조직 정보</span>
						<hr>
					</div>
					<div class="column">
						<span class="circle">2</span>
						<span class="flow_name">사용자 이름 설정</span>
					</div>
				</div>
				<div class="step_description">
					<span class="text">아래 조직의 팀 명함첩에 참여하시겠습니까?</span>
					<div class="team_info">
						<span class="team_name">${team.title}</span>
						<span class="owner_nickname">${team.owner_nickname}님의 초대</span>
					</div>
				</div>
				<div class="step_description hidden">
					<span class="text accent">회원님의 이름을 입력하세요</span>
					<input type="text" name="nickname" placeholder="회원님의 이름을 입력하세요">
					<span class="text small">조직 구성원에게 보여지는 이름입니다.</span>
				</div>
				<div class="buttons">
					<button type="button" class="next">다음</button>
					<button type="button" class="submit_button hidden" disabled>완료</button>
				</div>
			</div>
		</div>
	`;
    return div;
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
        if (e.group_name != "미분류 명함") group_text += e.group_name + ", ";
    });
    if (group_text == "") {
        group_text = "미분류";
    } else {
        group_text = group_text.substring(0, group_text.lastIndexOf(","));
    }
    const span = document.createElement('span');
    span.className = `description ${group_text == "미분류" ? "blank" : ""}`;
    span.innerHTML = `${group_text}<button type="button" class="change_group_button"><img src="/static/images/card_team_edit_group.png"></button>`;

    return span;
}