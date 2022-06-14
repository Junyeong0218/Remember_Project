
//모든명함의 갯수가 0이면 nocontent -> 
/*
페이지 로드 -> (뼈대) -> 비동기 db에서 본인 user_id 로 명함들 select
XX 그룹 ( X개 ) -> 버튼 -> click -> 어떤 명함들이 해당 그룹에 존재하는지 select(groupId)
-> 명함들 목록 표시하고 각각의 card_id로 해당 card detail을 select 하는 이벤트 등록
-> index[0].click();
 */
 
getAllGroups();

const whole_cards = document.querySelector(".card_group");
const wholeCount = document.querySelector('.whole_count');
const main_contents = document.querySelector(".main_contents");
const addGroupBtn = document.querySelector('.add_group_button');
const addGroupBox = document.querySelector('.add_group');
 
function getAllGroups(){
	$.ajax({
		type:'get',
		url:'/api/v1/card/group',
		dataType: 'json',
		success:function(group_list){
			console.log(group_list);	
			wholeCount.innerText = group_list[0].card_count;
			whole_cards.onclick = getAllCards;
			const wrapper = document.querySelector(".my_card_book");
			for(let i = 0; i < group_list.length; i++) {
				const group_tag = makeGroupTag(group_list[i]);
				wrapper.appendChild(group_tag);
				group_tag.onclick = () => getGroup(group_list[i].id);
			}
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

addGroupBtn.onclick = () =>{
	console.log("클릭");
	addGroupBox.innerHTML="";
	addGroupBox.innerHTML +=`
		<input>dfd</input>
	`;
}

