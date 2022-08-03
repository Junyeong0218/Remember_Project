const new_article_input = document.querySelector(".new_article_input");
let files = new Array();

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
			modal.querySelector(".close_modal").onclick = (event) => {
				event.preventDefault();
				modal.remove();
				document.body.style = "";
			}
			modal.querySelector(".join_category_button").onclick = joinCategory;
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
	
	const writer_name_tag = modal.querySelector(".writer");
	const use_nickname_checkbox = modal.querySelector(".use_nickname");
	const use_nickname_text = use_nickname_checkbox.nextElementSibling;
	use_nickname_checkbox.onclick = (event) => {
		if(event.target.checked) {
			writer_name_tag.innerText = `${principal.nickname}(닉네임)`;
		} else {
			writer_name_tag.innerText = `${principal.name}(실명)`;
		}
	}
	use_nickname_text.onclick = () => use_nickname_checkbox.click();
	use_nickname_checkbox.click();

	const tag_selector = modal.querySelector(".tag_selector");
	let is_opened_tag_selector = false;
	let tags = getTagsAbountSubCategory(category_id);
	let selected_tag_index = -1;
	tag_selector.innerText = tags[0].tag_name;
	
	tag_selector.onclick = (event) => {
		if(! is_opened_tag_selector) {
			const select_box = makeTagSelectBox(tags);
			event.target.parentElement.appendChild(select_box);
			const children = select_box.children;
			for(let i = 0; i < children.length; i++) {
				children[i].onclick = () => {
					selected_tag_index = i;
					tag_selector.innerText = children[i].innerText;
					tag_selector.classList.remove("clicked");
					select_box.remove();
					is_opened_tag_selector = false;
				}
			}
			tag_selector.classList.add("clicked");
			is_opened_tag_selector = true;
		} else {
			tag_selector.classList.remove("clicked");
			modal.querySelector(".tags").remove();
			is_opened_tag_selector = false;
		}
	}
	
	const add_image_button = modal.querySelector(".add_image_button"); 
	const file_input = modal.querySelector("input[name='file']");
	const modal_image_wrapper = modal.querySelector(".modal_image_wrapper");
	add_image_button.onclick = () => file_input.click();
	file_input.onchange = (event) => {
		loadUploadFiles(event, modal_image_wrapper);
	}
	
	const title_input_tag = modal.querySelector("input[name='title']");
	const contents_area_tag = modal.querySelector("textarea[name='contents']");
	const insert_article_button = modal.querySelector(".register_article_button");
	insert_article_button.onclick = () => {
		if(selected_category_index == -1 ||
			selected_tag_index == -1 ||
			title_input_tag.value == "" ||
			contents_area_tag.value == "") {
			alert("게시글 내용을 정확히 입력해주세요.");	
		} else {
			const form_data = new FormData();
			form_data.append("sub_category_id", category_id);
			form_data.append("article_tag_id", tags[selected_tag_index].id);
			form_data.append("title", title_input_tag.value);
			form_data.append("contents", contents_area_tag.value);
			form_data.append("use_nickname", use_nickname_checkbox.checked);
			for(let i = 0; i < files.length; i++) {
				form_data.append("files", files[i]);
			}
			$.ajax({
				type: "post",
				url: "/api/v1/community/article",
				data: form_data,
				encType: "multipart/form-data",
				processData: false,
				contentType: false,
				dataType: "json",
				success: function (response) {
					if(response.code == 0) {
						if(response.data == false) {
							location.href =  "/now/detail/" + response.data[i].id
						} else {
							console.log(data);
						}
					} else {
						alert(response.message);
					}
				},
				error: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
		}
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
	
	const writer_name_tag = modal.querySelector(".writer");
	const use_nickname_checkbox = modal.querySelector(".use_nickname");
	const use_nickname_text = use_nickname_checkbox.nextElementSibling;
	use_nickname_checkbox.onclick = (event) => {
		if(event.target.checked) {
			writer_name_tag.innerText = `${principal.nickname}(닉네임)`;
		} else {
			writer_name_tag.innerText = `${principal.name}(실명)`;
		}
	}
	use_nickname_text.onclick = () => use_nickname_checkbox.click();
	use_nickname_checkbox.click();
	
	const community_selector = modal.querySelector(".community_selector");
	let is_opened_commnunity_selector = false;
	let categories;
	let selected_category_index = -1;
	
	const tag_selector = modal.querySelector(".tag_selector");
	let is_opened_tag_selector = false;
	let tags;
	let selected_tag_index = -1;
	community_selector.onclick = (event) => {
		if(categories == null) {
			categories = getJoinedCagories();
		}
		if(! is_opened_commnunity_selector) {
			const select_box = makeCommunitySelectBox(categories);
			event.target.parentElement.appendChild(select_box);
			const children = select_box.children;
			for(let i = 0; i < children.length; i++) {
				if(children[i].className == "category") {
					children[i].onclick = () => {
						selected_category_index = categories.findIndex(e => e.category_name == children[i].innerText);
						event.target.innerText = children[i].innerText;
						modal.querySelector(".categories").remove();
						community_selector.classList.remove("clicked");
						community_selector.style = "";
						is_opened_commnunity_selector = false;
						tags = getTagsAbountSubCategory(categories[selected_category_index].sub_category_id);
						selected_tag_index = 0;						
						tag_selector.innerText = tags[selected_tag_index].tag_name;
						tag_selector.parentElement.classList.add("active");
					}
				}
			}
			community_selector.classList.add("clicked");
			is_opened_commnunity_selector = true;
		} else {
			modal.querySelector(".categories").remove();
			community_selector.classList.remove("clicked");
			is_opened_commnunity_selector = false;
			selected_category_index = 0;
		}
	}
	
	tag_selector.onclick = (event) => {
		if(! is_opened_tag_selector) {
			const select_box = makeTagSelectBox(tags);
			event.target.parentElement.appendChild(select_box);
			const children = select_box.children;
			for(let i = 0; i < children.length; i++) {
				children[i].onclick = () => {
					selected_tag_index = i;
					tag_selector.innerText = children[i].innerText;
					tag_selector.classList.remove("clicked");
					select_box.remove();
					is_opened_tag_selector = false;
				}
			}
			tag_selector.classList.add("clicked");
			is_opened_tag_selector = true;
		} else {
			tag_selector.classList.remove("clicked");
			modal.querySelector(".tags").remove();
			is_opened_tag_selector = false;
		}
	}
	
	const add_image_button = modal.querySelector(".add_image_button"); 
	const file_input = modal.querySelector("input[name='file']");
	const modal_image_wrapper = modal.querySelector(".modal_image_wrapper");
	add_image_button.onclick = () => file_input.click();
	file_input.onchange = (event) => {
		loadUploadFiles(event, modal_image_wrapper);
	}
	
	const title_input_tag = modal.querySelector("input[name='title']");
	const contents_area_tag = modal.querySelector("textarea[name='contents']");
	const insert_article_button = modal.querySelector(".register_article_button");
	insert_article_button.onclick = () => {
		if(selected_category_index == -1 ||
			selected_tag_index == -1 ||
			title_input_tag.value == "" ||
			contents_area_tag.value == "") {
			alert("게시글 내용을 정확히 입력해주세요.");	
		} else {
			const form_data = new FormData();
			form_data.append("sub_category_id", categories[selected_category_index].sub_category_id);
			form_data.append("article_tag_id", tags[selected_tag_index].id);
			form_data.append("title", title_input_tag.value);
			form_data.append("contents", contents_area_tag.value);
			form_data.append("use_nickname", use_nickname_checkbox.checked);
			for(let i = 0; i < files.length; i++) {
				form_data.append("files", files[i]);
			}
			$.ajax({
				type: "post",
				url: "/api/v1/community/article",
				data: form_data,
				encType: "multipart/form-data",
				processData: false,
				contentType: false,
				dataType: "json",
				success: function (response) {
					if(response.code == 0) {
						if(response.data == true) {
							location.reload();
						} else {
							console.log(data);
						}
					} else {
						alert(response.message);
					}
				},
				error: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
		}
	}
}

function loadUploadFiles(event, modal_image_wrapper) {
	if(event.target.files.length + files.length > 10) {
		alert("파일은 10개까지만 등록할 수 있습니다.");
		return;
	}
	for(let i = 0; i < event.target.files.length; i++) {
		const fileReader = new FileReader();
		fileReader.onloadend = (e) => {
			modal_image_wrapper.classList.add("active");
			files.push(event.target.files[i]);
			const file_name = event.target.files[i].name;
			
			const image_tag = makeImageTag(e.target.result);
			modal_image_wrapper.appendChild(image_tag);
			image_tag.querySelector(".delete_image_button").onclick = () => {
				image_tag.remove();
				files = files.filter(file => file.name != file_name);
			}
		}
		
		fileReader.readAsDataURL(event.target.files[i]);
	}
}

function makeImageTag(img_src) {
	const div = document.createElement("div");
	div.className = "image_box";
	div.innerHTML = `
		<img class="image" src="${img_src}">
		<span class="hover_blind"></span>
		<button type="button" class="delete_image_button">
			<img src="/static/images/insert_new_article_delete_image_button.svg">
		</button>
	`;
	return div;
}

function makeTagSelectBox(tags) {
	const div = document.createElement("div");
	div.className = "tags";
	for(let i = 0; i < tags.length; i++) {
		div.innerHTML += `<div class="tag">${tags[i].tag_name}</div>`;
	}
	return div;
}

function makeCommunitySelectBox(categories) {
	const div = document.createElement("div");
	div.className = "categories";
	let prev_main_id = 0;
	for(let i = 0; i < categories.length; i++) {
		if(prev_main_id != categories[i].main_category_id) {
			if(categories[i].main_category_id > 1) {
				const hr = document.createElement("hr");
				hr.className = "separator";
				div.appendChild(hr);
			}
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
		<div class="icon ${class_name}">
			<img src="/static/images/${img_src}">
		</div>
		<span class="text">${category.category_kor_name}</span>
	`;
	return div;
}

function getTagsAbountSubCategory(sub_category_id) {
	let tags;
	$.ajax({
		type: "get",
		url: "/api/v1/community/" + sub_category_id + "/tag/list",
		async: false,
		dataType: "json",
		success: function (response) {
			if(response.code == 0) {
				tags = response.data;
			} else {
				alert(response.message);
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return tags;
}

function getJoinedCagories() {
	let categories;
	$.ajax({
		type: "get",
		url: "/api/v1/community/article/categories",
		async: false,
		dataType: "json",
		success: function (response) {
			if(response.code == 0) {
				categories = response.data;
			} else {
				alert(response.message);
			}
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
		success: function (response) {
			if(response.code == 0) {
				if(response.data == true) {
					location.reload();
				} else {
					alert("카테고리 가입에 실패했습니다.");
				}
			} else {
				alert(response.message);
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
		success: function (response) {
			if(response.code == 0) {
				category_name = response.data;
			} else {
				alert(response.message);
			}
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
		success: function (response) {
			if(response.code == 0) {
				flag = response.data;
			} else {
				alert(response.message);
			}
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

function makeJoinCategoryModal() {
	const category_name = getCategoryName();
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window join_category">
			<span class="text category">${category_name}</span>
			<span class="text big">커뮤니티에 참여하세요!</span>
			<span class="text small">참여 후 좋아요 및 글작성을 할 수 있습니다.</span>
			<div class="buttons">
				<button type="button" class="close_modal">취소</button>
				<button type="button" class="join_category_button">참여하기</button>
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
			<div class="writer"></div>
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
				<div class="modal_image_wrapper"></div>
				<div class="buttons">
					<div class="checkbox_wrapper">
						<input type="checkbox" class="use_nickname">
						<span class="text">닉네임으로 등록</span>
					</div>
					<div class="button_wrapper">
						<button type="button" class="close_modal">닫기</button>
						<button type="button" class="register_article_button">등록</button>
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