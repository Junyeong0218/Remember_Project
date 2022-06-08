const insight_section = document.querySelector(".insight_section > .insight_list");
const job_section = document.querySelector(".job_section > .job_list");
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