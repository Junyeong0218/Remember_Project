const article = document.querySelector(".article");

loadArticleList();

function loadArticleList() {
	const url = category_id == 0 ? "/api/v1/now/list" : "/api/v1/now/" + category_id + "/list";
	const page_param = page > 0 ? page - 1 : page;
	$.ajax({
		type: "get",
		url: url,
		data: {"page":page_param},
		dataType: "json",
		success: function (article_list) {
			console.log(article_list);
			addArticleTags(article_list);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function addArticleTags(article_list) {
	for(let i = 0; i < article_list.length; i++) {
		const tag = makeArticleTag(article_list[i]);
		article.appendChild(tag);
		tag.onclick = () => location.href = `/now/detail/${article_list[i].id}`;
	}
}

function makeArticleUploadTimeString(create_date) {
	const date = new Date(create_date);
	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}년 ${month}월 ${day}일`;
}

function makeArticleTag(article) {
	const new_tag = new Date() - new Date(article.create_date) < 1000 * 60 * 60 * 24 * 3;
	const upload_time = makeArticleUploadTimeString(article.create_date);
	const div = document.createElement("div");
	div.className = "article";
	div.innerHTML = `
		<div class="article_info">
			 <span class="upload_time">${upload_time}</span>
			 <span class="category">${article.category_name}</span>
		</div>
		<a class="title">${new_tag ? '<span class="new">N</span>' : ''}${article.title}</a>
		<div class="article_summary">
			<span class="text">${article.summary}</span>
			${article.file_name = '<div class="main_image"><img src="/image/article_images/' + article.file_name + '"></div>'}
		</div>
	`;
	return div;
}

