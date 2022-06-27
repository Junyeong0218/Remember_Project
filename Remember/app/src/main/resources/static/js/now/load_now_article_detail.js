const now_article_detail_tag = document.querySelector(".article_detail");

loadNowArticleDetail();

function loadNowArticleDetail() {
	const url = "/api/v1/now/detail/" + article_id;
	$.ajax({
		type: "get",
		url: url,
		dataType: "json",
		success: function (data) {
			const article_data = data.articleDetail;
			const article_images = data.imageList;
			console.log(article_data);
			console.log(article_images);
			if(article_data == null) {
				alert("abcd");
			} else {
				document.querySelector("title").innerText = article_data.title;
				setArticleDetailTag(article_data, article_images);
				loadRelatedArticles(article_data.category_id);
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeNowArticleDetailUploadTimeText(create_date) {
	const date = new Date(create_date);
	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}년 ${month}월 ${day}일`;
}


function loadNowRelatedArticles() {
	$.ajax({
		type: "get",
		url: "/api/v1/now/article/related/" + article_id,
		dataType: "json",
		success: function (data) {
			console.log(data);
			const now_related_article_list = document.querySelector(".");
			for(let i = 0; i < data.length; i++) {
				const tag = makeRelatedArticleTag(data[i], i + 3);
				now_related_article_list.appendChild(tag);
				tag.onclick = () => location.href = location.pathname.substring(0, location.pathname.lastIndexOf("/")) + `${data[i].id}`;
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}


function makeRelatedArticleTag(related_article) {
	const li = document.createElement("li");
	li.className = "row"; 
	li.innerHTML = `
        <span class="title">${related_article.title}</span>
        <span class="create_date">${related_article.create_date}</span>
        <div class="main_image">${related_article.file_name}</span>
	`;
	return li;

}
	