const article_detail_tag = document.querySelector(".article_detail");

loadArticleDetail();

function loadArticleDetail(){
	const url = "/api/v1/now/detail/" + article_id;
	$.ajax({
		type: "get",
		url: url,
		datatype: "json",
		success: function (data) {
			const article_data = data.nowArticleDetail;
			const article_images = data.imageList;
			console.log(article_data);
			console.log(article_images);
			if(article_data == null){
				alert("asdfasdf");
			}else {
			document.querySelector("title").innerText = article_data.title;
			setArticleDetailTag(article_data, article_images);
			loadAnotherArticles();
			}
			
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		
		}
		
	});
}

function loadAnotherArticles(){
	$.ajax({
		type: "get",
		url: "/api/v1/now/" + article_id + "/another/list",
		datatype: "json",
		success: function(data) {
			console.log(data);
			const another_articles = document.querySelector(".another_articles");
			for(let i = 0; i < data.length; i++) {
				const tag = makeAnotherArticleTag(data[i], i + 1);
				another_articles.appendChild(tag);
				tag.onclick = () => location.href =  "/now/detail/" + data[i].id;
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeAnotherArticleTag(article_data){
	const a = document.createElement("a");
	a.className = "row"; 
	a.innerHTML = `
		${article_data.file_name = '<div class="main_image"><img src="/image/article_images/' + article_data.file_name + '"></div>'}
		<div class="texts">
		<span class="title">${article_data.title}</span>
		<span class="upload_time">${makeAnotherArticleUploadTimeString(article_data.create_date)}</span>
		</div>
	`;
	return a;
}

function setArticleDetailTag(article_data, article_images) {
	article_detail_tag.querySelector(".upload_time").innerText = makeArticleUploadTimeString(article_data.create_date);
	article_detail_tag.querySelector(".title").innerText = article_data.title;
	article_detail_tag.querySelector(".description").innerText = article_data.contents;
	article_detail_tag.querySelector(".insight_title").innerText = article_data.insight_title;
	article_detail_tag.querySelector(".insight_description").innerText = article_data.insight_contents;
	
	for(let i = 0; i < article_images.length; i++) {
	const image_tag = document.createElement("img");
	image_tag.className = "main_image";
	image_tag.src = "/image/article_images/" + article_images[i];
	}
}

function makeArticleUploadTimeString(create_date) {
	const date = new Date(create_date);
	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}년 ${month}월 ${day}일`;
}

function makeAnotherArticleUploadTimeString(create_date) {
	const date = new Date(create_date);
	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}. ${month}. ${day}`;
}

