const article_detail_tag = document.querySelector(".article_detail");

loadArticleDetail();

function loadArticleDetail() {
	const url = "/api/v1/community/detail/" + article_id;
	$.ajax({
		type: "get",
		url: url,
		dataType: "json",
		success: function (data) {
			const article_data = data.articleDetail;
			const comment_list = data.commentList;
			console.log(article_data);
			console.log(comment_list);
			if(article_data == null) {
				alert("asfadsfasdf");
			} else {
				document.head.title = article_data.title;
				setArticleDetailTag(article_data);
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function loadRelatedArticles(article_category_id) {
	$.ajax({
		type: "get",
		url: "/api/v1/community/" + article_category_id + "/best/list",
		dataType: "json",
		success: function (data) {
			console.log(data);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function setArticleDetailTag(article_data) {
	const tag = article_detail_tag.querySelector(".tags > .tag");
	tag.className = article_data.category_name;
	tag.innerText = article_data.category_name;
	
	article_detail_tag.querySelector(".title").innerText = article_data.title;
	article_detail_tag.querySelector(".upload_time").innerText = makeArticleDetailUploadTimeText(article_data.create_date);
	article_detail_tag.querySelector(".article_info .view_count").innerText = article_data.view_count;
	article_detail_tag.querySelector(".userinfo > .nickname").innerText = article_data.nickname;
	article_detail_tag.querySelector(".userinfo > .department_name").innerText = article_data.department_name;
	article_detail_tag.querySelector(".description").innerText = article_data.contents;
	article_detail_tag.querySelector(".article_like > .like_count").innerText = article_data.like_count;
	article_detail_tag.querySelector(".related_articles > .topic").innerText = article_data.category_name;
}

function makeArticleDetailUploadTimeText(create_date) {
	const date = new Date(create_date);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	return `${month}.${day} ${hour}:${minute}`;
}