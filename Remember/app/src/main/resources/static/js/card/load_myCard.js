
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

getAllGroups();

addGroupBtn.onclick = toggleAddGroupTag;
 
function getAllGroups(){
	$.ajax({
		type:'get',
		url:'/api/v1/card/group',
		dataType: 'json',
		success:function(group_list){
			console.log(group_list);	
			wholeCount.innerText = group_list[0].total_count;
			whole_cards.onclick = getAllCards;
			let total_count = 0;
			const wrapper = document.querySelector(".my_card_book");
			for(let i = 0; i < group_list.length; i++) {
				total_count+=group_list[i].card_count;
				const group_tag = makeGroupTag(group_list[i]);
				wrapper.appendChild(group_tag);
				group_tag.onclick = () => getGroup(group_list[i].id);
			}
			wholeCount.innerText = total_count;
			whole_cards.click();
		},
		error:function(xhr,status){
			console.log(xhr);
			console.log(status);
		}
	});
}

function getAllCards() {
	$.ajax({
		type:"get",
		url:"/api/v1/card/list",
		dataType:'json',
		success:function(card_list){
			console.log(card_list);
			main_contents.innerHTML = "";
			if(card_list.length ==1 && card_list[0] == null){
				const no_contents_tag = makeNoContentsTag();
				main_contents.appendChild(no_contents_tag);
			}else{
				const groupList = groupListTag();
				main_contents.appendChild(groupList);		
				const all_checkbox = groupList.querySelector(".top_list_btn > input");
				all_checkbox.onclick = (event) => {
					const cards = list_group.querySelectorAll(".card_list_con");
					cards.forEach(item => item.querySelector(".check_btn").checked = event.target.checked);
				}
				cardListInfoTag(card_list);
				const list_group = document.querySelector(".list_group");
				const cards = list_group.querySelectorAll(".card_list_con");
				
				for(let i =0; i < cards.length; i++){
						cards[i].onclick = () => {
						console.log(card_list[i]);
						cards.forEach((item, index) => {
							if(index != i) item.classList.remove("active");
							else 		   item.classList.add("active");
						});
					}
				}
				cards[0].click();
			}
			
		},
		error:function(xhr,status){
			console.log(xhr);
			console.log(status);
		}
	})
}



function getGroup(group_id) {
	$.ajax({
		type: "get",
		url: "/api/v1/card/group/" + group_id,
		dataType: "json",
		success: function (group_detail) {
			console.log(group_detail);
			main_contents.innerHTML = "";
			if(group_detail.card_list == null) {
				const no_contents_tag = makeNoContentsTag();
				main_contents.appendChild(no_contents_tag);
			} else {
				// 그룹에 속한 명함들의 리스트를 태그로 출력
				/*const groupList = groupListTag();
				
				main_contents.appendChild(groupList);*/
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeNoContentsTag() {
	const div = document.createElement("div");
	div.className = "no_contents";
	div.innerHTML = '<span class="text">등록된 명함이 없습니다.</span>';
	return div;
}

function groupListTag(){
	const div = document.createElement('div');
	div.className="card_list_box";
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
			</div>
			<div class="top_right">
				<select class="top_select">
					<option label="등록일순" value="">등록일순</option>
					<option label="이름순" value="">이름순</option>
					<option label="회사명순" value="">회사명순</option>
				</select>
			</div>
		</div>
		<div class="list_group">
			
		</div>
		<div class="list_page">
			<button class="page btn left">«</button>
			<div class="page num"> 1 </div>
			<button class="page btn right">»</button>
		</div>

	`;
	return div;
}

function cardListInfoTag(card_list) {
	const list_group = document.querySelector(".list_group");
	let prev_date;
	for(let i = 0; i < card_list.length; i++) {
		const create_date = makeCardCreateDate(card_list[i].create_date);
		console.log(create_date);
		if(prev_date == create_date) {
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
		${department_text == "" ? '' : '<div class="list_info position">' + department_text + '</div>'}
		${card_list[i].company_name == null || card_list[i].company_name == "" ? '' : '<div class="list_info company">' + card_list[i].company_name + '</div>'}
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
		${department_text == "" ? '' : '<div class="list_info position">' + department_text + '</div>'}
		${card_list[i].company_name == null || card_list[i].company_name == "" ? '' : '<div class="list_info company">' + card_list[i].company_name + '</div>'}
					</div>
				</div>
			`;
			list_group.appendChild(div);
			prev_date = create_date;
		}
	}
}

function makeDepartmentText(department_name, position_name) {
	return department_name != "" && position_name != "" ? position_name + " / " + department_name :
		   position_name != "" ? position_name :
		   department_name != "" ? department_name : "";
}

function makeCardCreateDate(create_date) {
	const date = new Date(create_date);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

/*<div class="card_list_con">
			<div class ="list_mark"></div>
			<div class="list_con_check">
				<input type="checkbox" id="check" class="check_btn">
				<label for="check"></label>
			</div>
			<div class="list_con_info">
				<div class="list_info_name">
					<span>${card_list.name}</span>
				</div>
				<div class="list_info position">dd</div>
				<div class="list_info company">d</div>
			</div>
		</div>*/

function makeGroupTag(group_data) {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "card_group";
	button.innerHTML = `
		<span class="sub_group_arrow"></span>
    	<span class="group_text">${group_data.group_name} (<span class="group_count">${group_data.card_count}</span>)</span>
	`;
     return button;                      
}



function toggleAddGroupTag(){
	const addGroupBox = addGroup.querySelector('.add_group_box');
	if(addGroupBox == null) {
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
		addGroupCloseBtn.onclick = () =>{
			div.remove();
		}
		const addGroupInput = div.querySelector('.add_group_input')
		addGroupInput.onkeypress = function() {
   			if(window.event.keyCode == 13) {
       		  	console.log(addGroupInput.value); 
       		 	inputAddGroup(addGroupInput.value);
			}

		};
	}
}

function inputAddGroup(group_name){
	$.ajax({
		type:'post',
		url:'/api/v1/card/group',
		data:{
			"group_name":group_name
		},
		dataType:'json',
		success:function(group_id){
			console.log(group_id);
			if(group_id > 0){
				console.log(group_name);
				const beforeElement = myCard.children[4];
				const groupTag = makeGroupTag({"group_name":group_name, "card_count":0});
				myCard.insertBefore(groupTag,beforeElement);
				addGroup.querySelector('.add_group_box').remove();
				groupTag.onclick = () => getGroup(group_id);
			}else {
				alert("그룹 생성 실패");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	})
}







