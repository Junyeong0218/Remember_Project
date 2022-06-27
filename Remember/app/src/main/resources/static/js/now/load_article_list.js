const article = document.querySelector(".article");

loadArticleList();

function loadArticleList() {
	const url = category_id == 0 ? "/api/v1/now/list" : "/api/v1/now/" + category_id + "/list";
	const page_param = page > 0 ? page - 1 : page;
	const data = category_id == 0 ? {"page":page_param} :
																  {"page":page_param};
	
	$.ajax({
		type: "get",
		url: url,
		data: data,
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
		const article = article_list[i];
		const tag = makeArticleTag(article);
		feeds.appendChild(tag);
		tag.onclick = () => location.href = category_id == 0 ? `/now/detail/${article.id}` : `/now/${category_id}/detail/${article.id}`;
	}
}

function makeArticleTag(article) {
	const topic = article.category_id
	const new_tag = new Date() - new Date(article.create_date) < 1000 * 60 * 60 * 24 * 3;
	const upload_time = makeUploadTimeString(article.create_date);
	
	const div = document.createElement("div");
	div.className = "article";
	div.innerHTML = `
        <div class="article_info">
            <span class="upload_time">${upload_time}</span>
        </div>
		<div class="category">
${category_id = '<div class="' + topic + '">' + article.category_name + '</div>'}
        </div>
        <div class="article_contents">
            ${new_tag ? '<span class="new"></span>' : ''}
            <div class="texts">
                <div class="title">${article.title}</div>
                <div class="content_summary">${article.summary}</div>
            </div>
${article.file_name == null ? '' : '<div class="article_title_image"><img src="/image/article_title_image/' + article.file_name + '"></div>'}
        </div>
	`;
	return div;
}

function makeArticleUploadTimeString(create_date) {
	const date = new Date(create_date);
	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}년 ${month}월 ${day}일`;
}