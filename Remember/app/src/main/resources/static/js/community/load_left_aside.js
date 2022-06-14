const insight_section = document.querySelector(".insight_section > .insight_list");
let job_section = document.querySelector(".job_section > .job_list");
const subject_section = document.querySelector(".subject_section > .subject_list");

loadCategoryData();

function loadCategoryData() {
	$.ajax({
		type: "get",
		url: "/api/v1/community/categories",
		dataType: "json",
		success: function (category_list) {
			console.log(category_list);
			addLiTags(category_list);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function addLiTags(category_list) {
	let has_profile = principal?.department_name != null;
	console.log(has_profile);
	if(principal == null || has_profile == true) {
		for(let i = 0; i < category_list.length; i++) {
			const category = category_list[i];
			const li = makeLiTag(category);
			if(category.main_category_id == 1) {
				insight_section.appendChild(li);
			} else if(category.main_category_id == 2) {
				job_section.appendChild(li);
			} else if(category.main_category_id == 3) {
				subject_section.appendChild(li);
			}
			li.onclick = () => location.href = "/community/" + category.id;
		}
	} else if(has_profile == false) {
		for(let i = 0; i < category_list.length; i++) {
			const category = category_list[i];
			if(category.main_category_id == 1) {
				const li = makeLiTag(category);
				insight_section.appendChild(li);
				li.onclick = () => location.href = "/community/" + category.id;
			}else if(category.main_category_id == 3) {
				const li = makeLiTag(category);
				subject_section.appendChild(li);
				li.onclick = () => location.href = "/community/" + category.id;
			}
		}
		const select_job_tag = makeSelectJobTag();
		const new_section = document.createElement("section");
		new_section.className = "job_section";
		new_section.innerHTML = `
			<div class="title">
	            <div class="title_logo">
	                <img src="/static/images/community_aside_job.svg">
	            </div>
	            <span class="accent_text">직무·업종 커뮤니티</span>
	        </div>
		`;
		new_section.appendChild(select_job_tag);
		document.querySelector(".job_section").parentNode.insertBefore(new_section, insight_section.parentElement);
		job_section.parentElement.remove();
	}
}

function makeSelectJobTag() {
	const div = document.createElement("div");
	div.className = "select_job";
	div.innerHTML = `
		<img src="/static/images/community_left_aside_select_job.svg">
		<div class="texts">
			<span class="text bold">무슨 일 하세요?</span>
			<span class="text gray">같은 일 하는 사람들과 교류해 보세요!</span>
		</div>
		<button type="button" class="select_job_modal_button">5초만에 내 직무 선택하기</button>
	`;
	return div;
}

function makeLiTag(category) {
	const li = document.createElement("li");
	li.className = category.main_category_id == 1 ? "insight" : 
								category.main_category_id == 2 ? "job" : "subject";
	li.innerHTML = `
		<div class="button_wrapper">
            <span class="title">${category.category_name}</span>
            <span class="joiner">참여자 <span class="joiner_count">${category.article_count}</span>명</span>
        </div>
	`;
	return li;
}