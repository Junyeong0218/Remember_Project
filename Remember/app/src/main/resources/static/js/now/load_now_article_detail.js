const now_article_detail_tag = document.querySelector(".article_detail");

loadNowArticleDetail();

function loadNowArticleDetail() {
	const url = "/api/v1/now/article/detail/" + article_id;
	$.ajax({
		type: "get",
		url: url,
		dataType: "json",
		success: function (data) {
			const now_article_data = data.nowArticleDetail;
			console.log(now_article_data);
			/*if(now_article_data == null) {
				alert("asfadsfasdf");
			} else {*/
				/*document.head.title = now_article_data.title;
				setArticleDetailTag(now_article_data);*/
				loadNowRelatedArticles(1);
			/*}*/
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
			const now_related_article_list = document.querySelector(".now_related_article_list");
			for(let i = 0; i < data.length; i++) {
				const tag = makeRelatedArticleTag(data[i], i + 1);
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


function setNowArticleDetailTag(now_article_data) {
	const tag = now_article_detail_tag.querySelector(".tags > .tag");
	tag.className = now_article_data.category_name;
	tag.innerText = now_article_data.category_name;
	
	now_article_detail_tag.querySelector(".title").innerText = now_article_data.title;
	now_article_detail_tag.querySelector(".upload_time").innerText = makeNowArticleDetailUploadTimeText(now_article_data.create_date);
	now_article_detail_tag.querySelector(".description").innerText = now_article_data.contents;
	now_article_detail_tag.querySelector(".now_related_articles > .topic").innerText = now_article_data.title;

}
	