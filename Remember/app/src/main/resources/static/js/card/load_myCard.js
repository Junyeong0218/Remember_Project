
//모든명함의 갯수가 0이면 nocontent -> 
/*
페이지 로드 -> (뼈대) -> 비동기 db에서 본인 user_id 로 명함들 select
XX 그룹 ( X개 ) -> 버튼 -> click -> 어떤 명함들이 해당 그룹에 존재하는지 select(groupId)
-> 명함들 목록 표시하고 각각의 card_id로 해당 card detail을 select 하는 이벤트 등록
-> index[0].click();
 */

const whole_cards = document.querySelector(".card_group");
const wholeCount = document.querySelector('.whole_count');
const main_contents = document.querySelector(".main_contents");
const addGroupBtn = document.querySelector('.add_group_button');
const addGroup = document.querySelector('.add_group');
const myCard = document.querySelector('.my_card_book');

let page = 0;
let total_page_check_flag = false;

getAllGroups();

addGroupBtn.onclick = toggleAddGroupTag;

function getAllGroups() {
    $.ajax({
        type: 'get',
        url: '/api/v1/card/group',
        dataType: 'json',
        success: function (group_list) {
            console.log(group_list);
            wholeCount.innerText = group_list[0].total_count;
            whole_cards.onclick = () => {
				getAllCards(page);
			}
            let total_count = 0;
            const wrapper = document.querySelector(".my_card_book");
            for (let i = 0; i < group_list.length; i++) {
                total_count += group_list[i].card_count;
                const group_tag = makeGroupTag(group_list[i]);
                wrapper.appendChild(group_tag);
                group_tag.onclick = (event) => {
					if(event.target.className == "group_btn") {
						console.log('그룹');
						const groupDrop = group_tag.querySelector('.drop_menu');
						groupDrop.classList.toggle('hidden');
						const groupNameChange = groupDrop.querySelectorAll('.drop_menu ul li');
						groupNameChange[0].onclick = () => {
							console.log("변경");
							const groupBox = group_tag.querySelector('.group_box');
							const changeName = changeGroupNameTag();
								group_tag.innerHTML= '';
								group_tag.appendChild(changeName);
						}
					} else {
						getGroup(group_list[i].id);
					}
				}
            }
            wholeCount.innerText = total_count;
            whole_cards.click();
        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    });
}

function getAllCards(page) {
    $.ajax({
        type: "get",
        url: "/api/v1/card/list",
        data: {"page" : page},
        dataType: 'json',
        success: function (card_list) {
            console.log(card_list);
            main_contents.innerHTML = "";
            total_page_check_flag = false;
            if (card_list.length == 0) {
                const no_contents_tag = makeNoContentsTag();
                main_contents.appendChild(no_contents_tag);
            } else {
		
				const total_card_count = card_list[0].total_count;
                const groupList = groupListTag();
                main_contents.appendChild(groupList);
                showCardListInfoTag(card_list);
              	
              	const list_page = groupList.querySelector(".list_page");
              	const pager = groupList.querySelector(".list_page > .pager");
                const all_checkbox = groupList.querySelector(".top_list_btn > input");
                const checkMore = groupList.querySelector('.more');
                const right = groupList.querySelectorAll('.top_right');
                const sendMore = groupList.querySelectorAll('.send');
                const selcet = groupList.querySelector('.list_select');
                const list_group = document.querySelector(".list_group");
                const cards = list_group.querySelectorAll(".card_list_con");
                const checkBoxes = list_group.querySelectorAll(".check_btn");
                
                makePageTag(total_card_count, pager.children);
                
                let count = 0;
                
                all_checkbox.onclick = (event) => {
					if(event.target.className.includes("not_max")) {
						event.target.checked = false;
						event.target.classList.remove("not_max");
					}
                    cards.forEach(item => item.querySelector(".check_btn").checked = event.target.checked);
                    
					count = countChecked(checkBoxes);

                    if(event.target.checked == true) {
						selcet.classList.remove('hide');
						selcet.innerText = total_page_check_flag ? `전체 페이지의 명함 ${total_card_count}장이 모두 선택되었습니다.` : `이 페이지의 명함 ${count}장이 모두 선택되었습니다.`;
						toggleCardListTitleRight(right, true);
						toggleClassColorToCards(cards, true);
					}else {
						selcet.classList.add('hide');
						toggleCardListTitleRight(right, false);
						toggleClassColorToCards(cards, false);
					}
                }
				
				if(total_page_check_flag) all_checkbox.click();
				
				const dropDown = groupList.querySelector('.drop_menu');
				checkMore.onclick = () => {
					console.log("클릭");
					dropDown.classList.toggle("hidden");				
				}	

				const pageSelect = dropDown.querySelectorAll('.drop_menu li');
				pageSelect[0].onclick = () => {
					for(let i = 0; i < checkBoxes.length; i++){
						if(checkBoxes[i].checked == false) {
							total_page_check_flag = false;
							all_checkbox.click();
						}
					}
					dropDown.classList.add("hidden");
				}

				pageSelect[1].onclick = () => {
					for(let i = 0; i < checkBoxes.length; i++){
						if(checkBoxes[i].checked == false) {
							total_page_check_flag = true;
							all_checkbox.click();
						}
					}
					dropDown.classList.add("hidden");
				}
				
				pageSelect[2].onclick = () => {
					console.log("선택안함");
					for(let i = 0; i < checkBoxes.length; i++){
						if(checkBoxes[i].checked == true) {
							all_checkbox.click();
						}
						dropDown.classList.add("hidden");
					}
				}
				
				const teamCardCopy = groupList.querySelector('.t_btn.edit');
				teamCardCopy.onclick = () => {
					console.log('복제');
					copyTeamCrardModal();
				}
				
								
				const dropDownGroup = groupList.querySelector('.drop_menu.group');
				sendMore[1].onclick = () => {
					console.log("클릭");
					dropDownGroup.classList.toggle("hidden");				
				}	
				
				const deleteCheckCard = dropDownGroup.querySelectorAll('.drop_menu.group li');
				deleteCheckCard[2].onclick = () => {
					console.log("삭 제");
						for(let i = 0; i < checkBoxes.length; i++){
							if(checkBoxes[i].checked ==true) {
								const card_lists = card_list
								deleteCard(card_list[i].id)
						}
					}
				}

				
                for (let i = 0; i < cards.length; i++) {
                    cards[i].onclick = () => {
						const card_detail = loadCardDetail(card_list[i].id);
						
						toggleClassActiveCards(cards, i);
						
                        //있으면 지우고 
                        let cardInfoForm = main_contents.querySelector('.detail_box');
                        if (cardInfoForm != null) {
                            cardInfoForm.remove();
                        }
                        cardInfoForm = makeCardInfoForm(card_detail);
                        main_contents.appendChild(cardInfoForm);
                        
                        const rightSend = cardInfoForm.querySelectorAll('.send');
                        const sendDropDown = cardInfoForm.querySelector('.send_drop_menu');
						rightSend[1].onclick = () => {
							sendDropDown.classList.toggle("hidden");	
						}	
						const cardSend = sendDropDown.querySelectorAll('.send_drop_menu li');
							cardSend[2].onclick =() => {
								deleteCard(card_list[i].id)
								
								
							}
                        const editBtn = cardInfoForm.querySelector(".t_btn.edit");
                       
                        editBtn.onclick = () => {
							console.log("편집");
							cardInfoForm.classList.add('hidden');
							groupList.classList.add('hidden');
							const edit = editCardForm(card_detail);
							main_contents.appendChild(edit);
							const edit_cancel = edit.querySelector('.edit_cancel');
							edit_cancel.onclick = () => {
								location.reload();
							}
							
							let is_img_changed = false;
							const addProfileImgBtn = edit.querySelector('.card_profile > button');
							const imgInput = edit.querySelector('.profile_img_input');
							const imgTag = edit.querySelector('.proflie_img');
							addProfileImgBtn.onclick = () => imgInput.click();
							imgInput.onchange = (event) => {
								AddProfileImg(event,imgTag);
								is_img_changed = true;
							}
							
							const edit_save = edit.querySelector('.edit_save');

							edit_save.onclick = () => {
								const cardInputs = edit.querySelectorAll('.input_con');
								if(cardInputs[0].value == "") {
									alert("이름은 필수로 입력해야합니다.");
									return;
								}							
								const formData = new FormData();
								if(is_img_changed) {
									formData.append('profile_img',imgInput.files[0]);								
								} else {
									formData.append('origin_profile_img', card_detail.profile_img);
								}
								formData.append('name',cardInputs[0].value);
								if(cardInputs[1].value != "") formData.append('position_name', cardInputs[1].value);
								if(cardInputs[2].value != "") formData.append('department_name', cardInputs[2].value);
								if(cardInputs[3].value != "") formData.append('company_name', cardInputs[3].value);
								if(cardInputs[4].value != "") formData.append('email', cardInputs[4].value);
								if(cardInputs[5].value != "") formData.append('phone', cardInputs[5].value);
								if(cardInputs[6].value != "") formData.append('landline_phone', cardInputs[6].value);
								if(cardInputs[7].value != "") formData.append('fax', cardInputs[7].value);
								if(cardInputs[8].value != "") formData.append('address', cardInputs[8].value);
								if(cardInputs[9].value != "") formData.append('sub_address', cardInputs[9].value);

								$.ajax({
									type:'put',
									url:'/api/v1/card/'+card_list[i].id,
									data: formData,
									encType: "multipart/form-data",
									processData: false,
									contentType: false,
									dataType:'json',
									success:function(data){
										groupList.classList.remove('hidden');
										edit.remove();
										  if (cards.length > 0) {
						                    cards[0].click();
						                }
										
									},
									error: function (xhr, stauts) {
									console.log(xhr);
									console.log(stauts);
									}
								});								
							}	
						}
						
						const addMemoBtn = cardInfoForm.querySelector('.t_btn.memo');
						addMemoBtn.onclick = () => {
							console.log("메모");
							addMemo();
							
						}
                    }
                }
               
                if (cards.length > 0) {
                    cards[0].click();
                }
                
                for(let i = 0; i < checkBoxes.length; i++){
					checkBoxes[i].onclick = (event) => {
						if(event.target.checked) {	
							cards[i].classList.add("color");
						}else {
							cards[i].classList.remove("color");
						}
						count = countChecked(checkBoxes);
						const unchecked_count = checkBoxes.length - count;
						if(count == 0) {
							all_checkbox.classList.remove("not_max");
							all_checkbox.checked = false;
							toggleCardListTitleRight(right, false);
							selcet.classList.add('hide');	
						} else if(count == checkBoxes.length) {
							console.log("max");
							all_checkbox.classList.remove("not_max");
							all_checkbox.checked = true;
							selcet.innerText = total_page_check_flag ? `전체 페이지의 명함 ${total_card_count - unchecked_count}장이 모두 선택되었습니다.` : `이 페이지의 명함 ${count}장이 모두 선택되었습니다.`;	
						} else if(count > 0 && count < checkBoxes.length) {
							all_checkbox.checked = false;
							all_checkbox.classList.add("not_max");
							toggleCardListTitleRight(right, true);
							selcet.classList.remove('hide');	
							selcet.innerText = total_page_check_flag ? `전체 페이지의 명함 ${total_card_count - unchecked_count}장이 모두 선택되었습니다.` : `명함 ${count}장이 선택되었습니다.`;		
						}
					}
				}
            }
            
        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    });
}

function makePageTag(total_card_count, pager) {
	let page_number = page - 1;
	const last_page = total_card_count % 10 == 0 ? Math.floor(total_card_count / 10) : Math.floor(total_card_count / 10) + 1;
	console.log("current : " + page_number);
	console.log("last : " + last_page);
	for(let i = 0; i < pager.length; i++) {
		if(page_number < 1 || page_number > last_page) {
			pager[i].classList.add("blank");
		} else {
			pager[i].innerText = page_number;
			const page_for_event = page_number;
			pager[i].onclick = () => {
				console.log(page_for_event + " 번 페이지 로드하기");
				page = page_for_event - 1;
				main_contents.innerHTML = "";
				getAllCards(page);
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

function getGroup(group_id) {
    $.ajax({
        type: "get",
        url: "/api/v1/card/group/" + group_id,
        dataType: "json",
        success: function (group_detail) {
            console.log(group_detail);
            main_contents.innerHTML = "";
            if (group_detail.card_list == null) {
                const no_contents_tag = makeNoContentsTag();
                main_contents.appendChild(no_contents_tag);
            } else {
                const groupList = groupListTag();
                main_contents.appendChild(groupList);
                const all_checkbox = groupList.querySelector(".top_list_btn > input");
                all_checkbox.onclick = (event) => {
                    const cards = list_group.querySelectorAll(".card_list_con");
                    cards.forEach(item => item.querySelector(".check_btn").checked = event.target.checked);
                }

                showCardListInfoTag(group_detail.card_list);
                const list_group = document.querySelector(".list_group");
                const cards = list_group.querySelectorAll(".card_list_con");


                for (let i = 0; i < cards.length; i++) {
                    cards[i].onclick = () => {
                        const card_detail = loadCardDetail(group_detail.card_list[i].id);
						
						toggleClassActiveCards(cards, i);
						
                        //있으면 지우고 
                        let cardInfoForm = main_contents.querySelector('.detail_box');
                        if (cardInfoForm != null) {
                            cardInfoForm.remove();
                        }
                        cardInfoForm = makeCardInfoForm(card_detail);
                        main_contents.appendChild(cardInfoForm);
                    }
                }
                if (cards.length > 0) {
                    cards[0].click();
                }
            }

        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    });
}

function toggleClassActiveCards(cards, current_index) {
	cards.forEach((item, index) => {
	    if (index != current_index) item.classList.remove("active");	
    else 							item.classList.add("active");
	});
}

function deleteCard(card_list) {
	const deleteCard =deleteCardTag();
	container.appendChild(deleteCard);	
	const deleteBtn = deleteCard.querySelector('.footer_btn button');
	const deleteCloseBtn = deleteCard.querySelector('.add_close_btn');
	deleteCloseBtn.onclick = () => {
		console.log("삭제닫기");
		deleteCard.remove();
	}
	deleteBtn.onclick = () => {
		console.log("삭제");
		$.ajax({
			type:"delete",
			url:"/api/v1/card/" + card_list,
			dataType:"json",
			success:function(data){
				location.reload();

			},
			error: function (xhr, stauts) {
				console.log(xhr);
				console.log(stauts);
			}
		});
	}
}

function loadCardDetail(card_id) {
	let card_detail;
	$.ajax({
		type: "get",
		url: "/api/v1/card/" + card_id,
		async: false,
		dataType: "json",
		success: function (data) {
			card_detail = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return card_detail;
}

function editCardForm(originCardData) {
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

function deleteCardTag() {
	const closeModal = document.createElement('div');
	closeModal.className ="note_modal";
	closeModal.innerHTML = `
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
					<span>명함을 삭제하시겠습니까?<br>삭제한 후에는 복구가 되지 않습니다.</span>
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

function changeCardImg(event,imgTag) {
	const reader = new FileReader();
	reader.onloadend = (e) => {
		imgTag.src = e.target.result;
	}
	reader.readAsDataURL(event.target.files[0]);
}

function changeProfileImg(){
	const formData = new FormData();
	formData.append('profile_img',imgInput.files[0]);
}

function makeNoContentsTag() {
    const div = document.createElement("div");
    div.className = "no_contents";
    div.innerHTML = '<span class="text">등록된 명함이 없습니다.</span>';
    return div;
}

function groupListTag() {
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
					<button class="t_btn send">그룹설정</button>
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

function showCardListInfoTag(card_list) {
    const list_group = document.querySelector(".list_group");
    let prev_date;
    for (let i = 0; i < card_list.length; i++) {
        const create_date = makeCardCreateDate(card_list[i].create_date);
        console.log(create_date);
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
						<div class="list_info_name">
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
						<div class="list_info_name">
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

function copyTeamCrardModal() {
	const modal = document.createElement("div");
	modal.className = "note_modal";
	modal.innerHTML= `
		<div class="note_modal_content ">
			<div class="note_content card">
				<button class="close_btn copy_close">
					<img src="/static/images/card_modal_close.png" alt="닫기버튼">
				</button>
				<div class="modal_header">
					팀 명함첩으로 복제
				</div>
				<div class="modal_body">
					<ul>
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
	
	container.appendChild(modal);
	const closeBtn = modal.querySelectorAll('.copy_close');
	for(let i = 0; i < closeBtn.length; i++ ){
		closeBtn[i].onclick = () => {
			modal.remove();
		}		
	}
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

function makeCardInfoForm(card_detail) {
    console.log(card_detail);
    const position_text = makeDepartmentText(card_detail.department_name, card_detail.position_name);
    const cardDate = makeCardDate(card_detail.create_date);
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
	                    <img src=${card_detail.profile_img == null ? '/static/images/default_profile_image.png' : '/image/profile_images/' + card_detail.profile_img} alt="프로필 기본">
	                </span>
	                <div class="profile_info">
	                    <div class="profile_name">${card_detail.name}</div>
${position_text == null ? '' : '<div class="profile_position">' + position_text + '</div>'} 
${card_detail.company_name == null ? '' : '<div class="profile_company">' + card_detail.company_name + '</div>'}
	                </div>
	            </div>
	        </div>
	        <div class="profile_detail">
	            <div class="profile_detail_info">
	                <div class="info_box">
	                    <div class="info_title">이메일</div>
	                    <div class="info_con_box">
	 ${card_detail.email == null ? '<div class="info_no_value">이메일 없음</div>' :
            '<div class="info_con  link">' + card_detail.email + '</div>'}  
	                    </div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">휴대폰</div>
	                    <div class="info_con_box">
	 ${card_detail.phone == null ? '<div class="info_no_value">휴대폰 번호 없음</div>' :
            '<div class="info_con">' + card_detail.phone + '</div>'}                       
	                    </div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">유선전화</div>
	                    <div class="info_con_box">
	 ${card_detail.landline_phone == null ? '<div class="info_no_value">유선전화 번호 없음</div>' :
            '<div class="info_con">' + card_detail.landline_phone + '</div>'}  
	                    </div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">팩스</div>
	                    <div class="info_con_box">
	 ${card_detail.fax == null ? '<div class="info_no_value">팩스 번호 없음</div>' :
            '<div class="info_con">' + card_detail.fax + '</div>'}  
	                    </div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">그룹</div>
	                    <div class="info_con_box">
	                        <div class="info_con"></div>
	                        <div class="info_no_value">미지정</div>
	                    </div>
	                </div>
	            </div>
	            <div class="profile_detail_info">
	                <div class="info_box">
	                    <div class="info_title">주소</div>
	                    <div class="info_con_box">    
	 ${card_detail.address == null ? '<div class="info_no_value">주소 없음</div>' :
            '<div class="info_con link">' + card_detail.address + card_detail.sub_address + '</div>'}  
	                	</div>
	                </div>
	                <div class="info_box">
	                    <div class="info_title">등록일</div>
	                    <div class="info_con_box">
	                        <div class="info_con">${makeCardDate(card_detail.create_date)}</div>
	                    </div>
	                </div>
	        	</div>  
	        </div>
   	 	</div>
         <div class="profile_memo">
            <div class="info_title">메모</div>
                <div class="info_con_box">
                    <div class="info_con"></div>
                    <div class="info_no_value">메모없음</div>
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

function addMemo(){
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
					<div class="memo_btn memo_close"><button>취소</button></div>
					<div class="memo_btn save"><button>저장</button></div>
				</div>
					</div>
				</div>
			</div>
		</div>
	`;
	container.appendChild(div);
	setTimeout(() => {
		div.querySelector('.memo_text').focus();
	}, 150);
	
	const closeBtn = div.querySelectorAll('.memo_close');
	for(let i = 0; i < closeBtn.length; i++){
		closeBtn[i].onclick = () => {
			div.remove();
		}
		
	}
	
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
    		<div class="drop_menu group hidden">
					<ul>
						<li>그룹명 변경</li>
						<li>그룹 삭제</li>
					</ul>
				</div>
    	</div>
	`;
    return button;
}

function changeGroupNameTag() {
	const div = document.createElement('div');
	div.className = "change_input";
	div.innerHTML =`
		<input>ㅇㄹㅇ	
	`;
	return div;
}

function toggleAddGroupTag() {
    const addGroupBox = addGroup.querySelector('.add_group_box');
    if (addGroupBox == null) {
        const div = document.createElement("div");
        div.className = "add_group_box";
        div.innerHTML = `
			<input type="text" class="add_group_input" name="group_name" placeholder="그룹명 입력">
			<div class="add_group_close">
				<img class="add_group_close_btn" src="/static/images/card_add_group_close.PNG" alt="닫기버튼">
			</div>
		`;
        addGroup.appendChild(div);
        const addGroupCloseBtn = div.querySelector('.add_group_close_btn');
        addGroupCloseBtn.onclick = () => {
            div.remove();
        }
        const addGroupInput = div.querySelector('.add_group_input')
        addGroupInput.onkeypress = function () {
            if (window.event.keyCode == 13) {
                console.log(addGroupInput.value);
                inputAddGroup(addGroupInput.value);
            }

        };
    }
}

function makeLeftBtnTab () {
	
}

function inputAddGroup(group_name) {
    $.ajax({
        type: 'post',
        url: '/api/v1/card/group',
        data: {
            "group_name": group_name
        },
        dataType: 'json',
        success: function (group_id) {
            console.log(group_id);
            if (group_id > 0) {
                console.log(group_name);
                const beforeElement = myCard.children[4];
                const groupTag = makeGroupTag({ "group_name": group_name, "card_count": 0 });
                myCard.insertBefore(groupTag, beforeElement);
                addGroup.querySelector('.add_group_box').remove();
                groupTag.onclick = (event) => {
					if(event.target.className == "group_btn") {
						console.log('그룹');
						const groupDrop = group_tag.querySelector('.drop_menu');
						groupDrop.classList.toggle('hidden');
						groupNameChange[0].onclick = () => {
							console.log("변경");
							const changeName = changeGroupNameTag();
							for(let i = 0; i< whole_cards.length; i ++) {
								whole_cards[i].innerHTML= '';
								whole_cards[i].appendChild(changeName);
								
							}
							
						}
					} else {
						getGroup(group_list[i].id);
					}
				}
            } else {
                alert("그룹 생성 실패");
            }
        },
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
    })
}







