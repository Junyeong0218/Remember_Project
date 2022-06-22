const start_free_button = document.querySelector(".start_free_button");

start_free_button.onclick = () => {
	let current_index = 0;
	const modal = makeNewTeamModal();
	document.querySelector(".container").appendChild(modal);
	document.body.style = "overflow: hidden;";
	modal.querySelector(".close_modal").onclick = () => {
		document.body.style = "";
		modal.remove();
	}
	const columns = modal.querySelectorAll(".column");
	const input_wrappers = modal.querySelectorAll(".input_wrapper");
	const check_terms = modal.querySelector(".check_terms");
	const terms_checkbox = check_terms.querySelector("input");
	const prev_button = modal.querySelector(".prev_button");
	const next_button = modal.querySelector(".next_button");
	check_terms.onclick = () => {
		terms_checkbox.click();
	}
	terms_checkbox.onchange = () => {
		checkCompanyNameAndInputCheck(modal);
	}
	input_wrappers[0].querySelector("input").oninput = () => {
		checkCompanyNameAndInputCheck(modal);
	}
	input_wrappers[1].querySelector("input").oninput = () => {
		checkInput(modal, 1);
	}
	input_wrappers[2].querySelector("input").oninput = () => {
		checkInput(modal, 2);
	}
	
	next_button.onclick = () => {
		if(current_index < 2) {
			columns[current_index].className = "column checked";
			columns[current_index].querySelector(".circle").innerText = "";
			columns[current_index + 1].className = "column selected";
			check_terms.classList.add("hidden");
			input_wrappers[current_index].classList.add("hidden");
			input_wrappers[current_index + 1].classList.remove("hidden");
			current_index++;
			next_button.disabled = true;
			prev_button.classList.remove("hidden");
		} else {
			console.log("2번 인덱스 next 누름!");
			// team insert
			// if success -> /card/team
			$.ajax({
				type: "post",
				url: "/api/v1/card/team",
				data: {"title": input_wrappers[0].querySelector("input").value,
							 "nickname": input_wrappers[1].querySelector("input").value,
							 "card_book_name": input_wrappers[2].querySelector("input").value},
				dataType: "json",
				success: function (data) {
					if(data == true) {
						alert("팀 생성 성공");
					} else {
						alert("팀 생성 실패");
					}
				},
				error: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
		}
	}
	
	prev_button.onclick = () => {
		columns[current_index].className = "column";
		columns[current_index - 1].querySelector(".circle").innerText = current_index;
		columns[current_index - 1].className = "column selected";
		input_wrappers[current_index].classList.add("hidden");
		input_wrappers[current_index - 1].classList.remove("hidden");
		next_button.disabled = false;
		
		current_index--;
		if(current_index == 0) {
			check_terms.classList.remove("hidden");
			prev_button.classList.add("hidden");
		}
	}
}

function checkCompanyNameAndInputCheck(modal) {
	const checkbox = modal.querySelector(".check_terms > input");
	const company_name_input = modal.querySelector(".input_wrapper > input");
	if(checkbox.checked && company_name_input.value != "") {
		modal.querySelector(".next_button").disabled = false;
	} else {
		modal.querySelector(".next_button").disabled = true;
	}
}

function checkInput(modal, index) {
	const nickname_input = modal.querySelectorAll(".input_wrapper")[index].querySelector("input");
	if(nickname_input.value != "") {
		modal.querySelector(".next_button").disabled = false;
	} else {
		modal.querySelector(".next_button").disabled = true;
	}
}









function makeNewTeamModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window make_team">
			<div class="title">
				<span>조직 만들기</span>
				<button type="button" class="close_modal">
					<img src="/static/images/card_modal_close.png">
				</button>
			</div>
			<div class="flow">
				<div class="column selected">
					<span class="circle">1</span>
					<span class="flow_name">조직명</span>
					<hr>
				</div>
				<div class="column">
					<span class="circle">2</span>
					<span class="flow_name">사용자 이름</span>
					<hr>
				</div>
				<div class="column">
					<span class="circle">3</span>
					<span class="flow_name">명함첩 이름</span>
				</div>
			</div>
			<div class="input_wrapper">
				<input type="text" name="team_name" class="team_name_input" placeholder="회사명 또는 조직명을 입력하세요">
				<span>조직의 명칭은 조직 관리에서 변경할 수 있습니다.<span>
			</div>
			<div class="input_wrapper hidden">
				<input type="text" name="team_user_nickname" class="team_name_input" placeholder="회원님의 이름을 입력하세요">
				<span>조직 구성원에게 보여지는 이름입니다.<span>
			</div>
			<div class="input_wrapper hidden">
				<input type="text" name="team_group_name" class="team_name_input" placeholder="명함첩 이름을 입력하세요">
				<span>이 명함첩은 조직 구성원 모두가 자동으로 참여됩니다.<span>
			</div>
			<div class="check_terms">
				<input type="checkbox" class="terms_checkbox" name="confirmed">
				<span><button type="button">팀명함첩 운영정책</button>에 동의합니다.</span>
			</div>
			<div class="buttons">
				<button type="button" class="prev_button hidden">이전</button>
				<button type="button" class="next_button" disabled>다음</button>
			</div>
		</div>
	`;
	return div;
}