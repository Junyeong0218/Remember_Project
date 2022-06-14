const new_article_input = document.querySelector(".new_article_input");

new_article_input.onclick = () => {
	if(principal == null) {
		const modal = makeLoginModal();
		document.querySelector(".container").appendChild(modal);
		document.body.style = "overflow: hidden;";
		modal.querySelector(".to_signup_button").onclick = () => location.href = "/auth/signup";
		modal.querySelector(".close_modal").onclick = () => {
			modal.remove();
			document.body.style = "";
		}
	} else if(! hasProfile()) {
		const modal = makeSubmitProfileModal();
		document.querySelector(".container").appendChild(modal);
		document.body.style = "overflow: hidden;";
		modal.querySelector(".close_modal").onclick = () => {
			modal.remove();
			document.body.style = "";
		}
		modal.querySelectorAll("input").forEach(e => e.onblur = () => activeSubmitButton(modal));
		modal.querySelector(".submit_detail").onclick = () => submitProfile(modal);
	} else if(category_id != 0) {
		const join_flag = getCategoryJoinFlag();
		if(join_flag == false) {
			// categoty_join_modal 띄우기
			const modal = makeJoinCategoryModal();
			document.querySelector(".container").appendChild(modal);
			document.body.style = "overflow: hidden;";
			modal.querySelector(".close_modal").onclick = () => {
				modal.remove();
				document.body.style = "";
			}
			modal.querySelector(".join_category").onclick = joinCategory;
		} else {
			// article_insert_modal 띄우기
			insertArticleModalForSpecificCategory();
		}
	} else {
		// article_insert_modal 띄우기
		insertArticleModalForTotalCategory();
	}
}

function insertArticleModalForSpecificCategory() {
	const modal = makeInsertArticleModal();
	document.querySelector(".container").appendChild(modal);
	document.body.style = "overflow: hidden;";
	modal.querySelector(".close_modal").onclick = () => {
		modal.remove();
		document.body.style = "";
	}
}

function insertArticleModalForTotalCategory() {
	const modal = makeInsertArticleModal();
	document.querySelector(".container").appendChild(modal);
	document.body.style = "overflow: hidden;";
	modal.querySelector(".close_modal").onclick = () => {
		modal.remove();
		document.body.style = "";
	}
	let is_opened_commnunity_selector = false;
	modal.querySelector(".community_selector").onclick = (event) => {
		const select_box = makeCommunitySelectBox();
		event.target.parentElement.appendChild(select_box);
	}
}

function makeCommunitySelectBox() {
	const categories = getJoinedCagories();
	const div = document.createElement("div");
	div.className = "categories";
	let prev_main_id = 0;
	for(let i = 0; i < categories.length; i++) {
		if(prev_main_id != categories[i].main_category_id) {
			const category_title = makeCategoryTitle(categories[i]);
			div.appendChild(category_title);
		}
		const sub_category = makeSubCategory(categories[i]);
		div.appendChild(sub_category);
		prev_main_id = categories[i].main_category_id;
	}
	return div;
}

function makeSubCategory(category) {
	const div = document.createElement("div");
	div.className = "category";
	div.innerHTML = `${category.category_name}`;
	return div;
}

function makeCategoryTitle(category) {
	const class_name = category.main_category_id == 1 ? "insight" : 
										  category.main_category_id == 2 ? "job" : "subject" ;
	const img_src = category.main_category_id == 1 ? "community_aside_insite.svg" : 
								  category.main_category_id == 2 ? "community_aside_job.svg" : "community_aside_subject.svg" ;
	const div = document.createElement("div");
	div.className = "title";
	div.innerHTML = `
		<div class="${class_name}">
			<img src="/static/images/${img_src}">
		</div>
		<span class="text">${category.category_kor_name}</span>
	`;
	return div;
}

function getJoinedCagories() {
	let categories;
	$.ajax({
		type: "get",
		url: "/api/v1/community/article/categories",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			categories = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return categories;
}

function joinCategory() {
	$.ajax({
		type: "post",
		url: "/api/v1/community/category/" + category_id,
		dataType: "json",
		success: function (data) {
			if(data == true) {
				location.reload();
			} else {
				alert("카테고리 가입에 실패했습니다.");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function getCategoryName() {
	let category_name;
	$.ajax({
		type: "get",
		url: "/api/v1/community/category/" + category_id,
		async: false,
		dataType: "text",
		success: function (data) {
			console.log(data);
			category_name = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return category_name;
}

function getCategoryJoinFlag() {
	let flag = false;
	$.ajax({
		type: "get",
		url: "/api/v1/community/" + category_id + "/user",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function hasProfile() {
	return principal.name != null &&
				  principal.nickname != null &&
				  principal.company_name != null &&
				  principal.department_name != null;
}

function isEmpty(input) {
	if(input.value == null || input.value == "" || typeof input.value == "undefined") {
		return true;
	}
	return false;
}

function checkProfileInputs(modal) {
	if(isEmpty(modal.querySelector("input[name='name']")) ||
		isEmpty(modal.querySelector("input[name='nickname']")) ||
		isEmpty(modal.querySelector("input[name='company_name']")) ||
		isEmpty(modal.querySelector("input[name='department_name']"))) {
			return false;
		}
	return true;
}

function activeSubmitButton(modal) {
	if(checkProfileInputs(modal)) {
		modal.querySelector(".submit_detail").disabled = false;
	} else {
		modal.querySelector(".submit_detail").disabled = true;
	}
}

function submitProfile(modal) {
	console.log({"name":modal.querySelector("input[name='name']").value,
					 "nickname":modal.querySelector("input[name='nickname']").value,
					 "company_name":modal.querySelector("input[name='company_name']").value,
					 "department_name":modal.querySelector("input[name='department_name']").value});
	$.ajax({
		type: "post",
		url: "/api/v1/auth/detail",
		data: {"name":modal.querySelector("input[name='name']").value,
					 "nickname":modal.querySelector("input[name='nickname']").value,
					 "company_name":modal.querySelector("input[name='company_name']").value,
					 "department_name":modal.querySelector("input[name='department_name']").value},
		dataType: "json",
		success: function (data) {
			console.log(data);
			if(data == true) {
				location.reload();
			} else {
				alert("프로필 생성에 실패했습니다\n다시 시도해주세요.");
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeLoginModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div. innerHTML = `
		<div class="window not_login">
			<div class="title">
				<span class="text">이 기능은 회원만 이용하실 수 있습니다.</span>
				<span class="text">회원으로 가입하시겠습니까?</span>
			</div>
			<span class="login_link">이미 회원이라면?&nbsp;<a href="/auth/signin">로그인 하기</a></span>
			<div class="buttons">
				<button type="button" class="close_modal">닫기</button>
				<button type="button" class="to_signup_button">회원가입</button>
			</div>
		</div>
	`;
	return div;
}

function makeSubmitProfileModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window profile_form">
			<div class="title">먼저 커뮤니티에서 사용할 프로필을 입력하세요</div>
			<form>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">이름</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="name" placeholder="예: 홍길동">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">닉네임</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="nickname" placeholder="한글, 영문 8자리 이하">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">회사</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="company_name" placeholder="예: 네이버">
				</div>
				<div class="input_wrapper">
					<div class="title">
						<span class="text">직무</span>
						<img src="/static/images/career_profile_input_star.png">
					</div>
					<input type="text" name="department_name" placeholder="예: 자산운용">
				</div>
				<span class="text">선택한 직무와 관련없는 커뮤니티에서는 활동이 제한될 수 있습니다.</span>
			</form>
			<div class="buttons">
				<button type="button" class="close_modal">닫기</button>
				<button type="button" class="submit_detail" disabled>완료</button>
			</div>
		</div>
	`;
	return div;
}

function makeJoinCategoryModal() {
	const category_name = getCategoryName();
	console.log(category_name);
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window join_category">
			<span class="text category">${category_name}</span>
			<span class="text big">커뮤니티에 참여하세요!</span>
			<span class="text small">참여 후 좋아요 및 글작성을 할 수 있습니다.</span>
			<div class="buttons">
				<button type="button" class="close_modal">취소</button>
				<button type="button" class="join_category">참여하기</button>
			</div>
		</div>
	`;
	return div;
}

function makeInsertArticleModal() {
	const placeholder_message = getTextAreaPlaceholderMessage();
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window register_article">
			<div class="title">게시글 쓰기</div>
			<div class="writer">취뽀하자(닉네임)</div>
			<hr>
			<form>
				<div class="row ${category_id == 0 ? 'active' : ''}">
					<div class="community_selector" style="color: rgb(174, 174, 174);">커뮤니티를 선택하세요</div>
				</div>
				<div class="row ${category_id != 0 ? 'active' : ''}">
					<div class="tag_selector"></div>
				</div>
				<input type="text" class="article_title" name="title" placeholder="제목을 입력하세요">
				<textarea class="article_contents" name="contents" placeholder="${placeholder_message}"></textarea>
				<div class="row active">
					<button type="button" class="add_image_button">
						<span class="text">사진 첨부</span>
						<img src="/static/images/insert_new_article_add_image_button.svg">
						<input type="file" name="file" accept=".jpg, .png, .jpeg" multiple>
					</button>
				</div>
				<div class="modal_image_wrapper active">
					<div class="image_box">
						<img class="image" src="/static/images/profile.png">
						<span class="hover_blind"></span>
						<button type="button" class="delete_image_button">
							<img src="/static/images/insert_new_article_delete_image_button.svg">
						</button>
					</div>
					<div class="image_box">
						<img class="image" src="/static/images/profile.png">
					</div>
				</div>
				<div class="buttons">
					<div class="checkbox_wrapper">
						<input type="checkbox" class="use_nickname" checked>
						<span class="text">닉네임으로 등록</span>
					</div>
					<div class="button_wrapper">
						<button type="button" class="close_modal">닫기</button>
						<button type="button" class="register_article">등록</button>
					</div>
				</div>
			</form>
		</div>
	`;
	return div;
}

function getTextAreaPlaceholderMessage() {
	return category_id < 9 ? "내용을 입력하세요" : 
				  category_id > 48 ? "내용을 입력하세요\n\n* 커리어, 직장동료 등 회사생활 이야기를 나눠요\n* 에티켓을 준수해, 유익한 공간을 함께 만들어요" : 
				  category_id > 8 ? "내용을 입력하세요\n\n* 같은 일 하는 회원들과 자유롭게 대화해요\n* 커리어 이야기, 업계 새소식, 정보를 공유해요\n* 에티켓을 준수해, 유익한 공간을 함께 만들어요" : "내용을 입력하세요";
}