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
			/*if(article_data == null) {
				alert("asfadsfasdf");
			} else {*/
				/*document.head.title = article_data.title;
				setArticleDetailTag(article_data);*/
				loadRelatedArticles(1);
			/*}*/
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
			const related_article_list = document.querySelector(".related_article_list");
			for(let i = 0; i < data.length; i++) {
				const tag = makeRelatedArticleTag(data[i], i + 1);
				related_article_list.appendChild(tag);
				tag.onclick = () => location.href = location.pathname.substring(0, location.pathname.lastIndexOf("/")) + `${data[i].id}`;
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeRelatedArticleTag(related_article, numbering) {
	const li = document.createElement("li");
	li.className = "row"; 
	li.innerHTML = `
	    <span class="numbering">${numbering}</span>
        <span class="title">${related_article.title}</span>
	`;
	return li;
}

function addCommentTags(comment_list) {
	document.querySelector(".total_comment_count").innerText += comment_list.lenght;
	const best_comments_wrapper = document.querySelector(".best_comments");
	const whole_comments_wrapper = document.querySelector(".whole_comments");
	for(let i = 0; i < comment_list.length; i++) {
		const tag = makeCommentTag(comment_list[i], comment_list);
		whole_comments_wrapper.appendChild(tag);
	}
	comment_list = comment_list.sort((a, b) => b.like_count - a.like_count );
	console.log(comment_list);
	for(let i = 0; i < comment_list.length; i++) {
		if(i > 2) break;
		const tag = makeBestCommentTag(commet_list[i]);
		best_comments_wrapper.appendChild(tag);
	}
}

function makeBestCommentTag(comment) {
	const upload_time = makeCommentUploadTimeString(comment.create_date);
	const div = document.createElement("div");
	div.className = "comment";
	div.innerHTML = `
		<div class="writer_info">
            <div class="profile_image">
                <img src="/static/images/default_profile_image.png">
            </div>
            <div class="texts">
                <div class="userinfo">
                    <span class="nickname">${comment.nickname}</span>
                    <div class="badge">
                        <img src="/static/images/bronze_badge.webp">
                    </div>
          ${comment.user_id == 0 ? '<span class="article_writer">작성자</span>' : ''}
                    <button type="button" class="comment_menu_button">
                        <img src="/static/images/article_detail_article_menu.svg">
                    </button>
                </div>
                <div class="comment_info">
                    <span class="department_name">${comment.department_name}</span>
                    <span>|</span>
                    <span class="upload_time">${upload_time}</span>
                </div>
            </div>
        </div>
        <div class="contents"><span class="best">BEST</span>${comment.contents}</div>
        <div class="comment_reaction_wrapper">
            <button type="button" class="reply_comment" disabled></button>
            <button type="button" class="comment_like">
                <img src="/static/images/article_detail_article_like_icon.png">
                <span class="like_count">${comment.like_count}</span>
            </button>
        </div>
	`;
	return div;
}

function makeCommentTag(comment, comment_list) {
	const upload_time = makeCommentUploadTimeString(comment.create_date);
	const div = document.createElement("div");
	div.className = comment.related_comment_id == 0 ? "comment" : "comment reply";
	div.innerHTML = `
		<div class="writer_info">
            <div class="profile_image">
                <img src="/static/images/default_profile_image.png">
            </div>
            <div class="texts">
                <div class="userinfo">
                    <span class="nickname">${comment.nickname}</span>
                    <div class="badge">
                        <img src="/static/images/bronze_badge.webp">
                    </div>
          ${comment.user_id == 0 ? '<span class="article_writer">작성자</span>' : ''}
                    <button type="button" class="comment_menu_button">
                        <img src="/static/images/article_detail_article_menu.svg">
                    </button>
                </div>
                <div class="comment_info">
                    <span class="department_name">${comment.department_name}</span>
                    <span>|</span>
                    <span class="upload_time">${upload_time}</span>
                </div>
            </div>
        </div>
        <div class="contents">${comment.contents}</div>
        <div class="comment_reaction_wrapper">
            <button type="button" class="reply_comment">
                
            </button>
            <button type="button" class="comment_like">
                <img src="/static/images/article_detail_article_like_icon.png">
                <span class="like_count">${comment.like_count}</span>
            </button>
        </div>
	`;
	if(comment.related_comment_id == 0) {
		const reply_button = div.querySelector(".reply_comment");
		reply_button.innerHTML += `
			<img src="/static/images/article_detail_reply_comment.svg">
			<span>댓글달기</span>
		`;
		const related_comment_count = comment_list.filter(e => e.id == comment.id).length;
		if(related_comment_count != 0) {
			reply_button.innerHTML += `<span>&nbsp;|&nbsp;<span class="reply_comment_count">${related_comment_count}</span>개</span>`;
		}
	}
	return div;                      
}

function makeCommentUploadTimeString(create_date) {
	const upload_time = new Date(create_date);
	const now = new Date();
	const ago = new Date(now - upload_time);
	ago.setUTCHours(-9);
	
	let year = ago.getFullYear() - 1970;
	let month = ago.getMonth() + 1;
	let date = ago.getDate();
	let hour = ago.getHours();
	let minute = ago.getMinutes();
	let second = ago.getSeconds();
	
	if(year > 0) {
		return `${year}년 전`;
	} else if(month > 1) {
		return `${month}개월 전`;
	} else if((date == 1 && upload_time.getDay() != now.getDay()) || date > 1) {
		return `${date}일 전`;
	} else if(hour > 0) {
		return `${hour}시간 전`;
	} else if(minute > 0) {
		return `${minute}분 전`;
	} else {
		return `${second}초 전`;
	}
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