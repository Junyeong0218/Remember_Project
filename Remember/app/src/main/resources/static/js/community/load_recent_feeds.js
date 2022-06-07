const feeds = document.querySelector(".feeds");

loadRecentFeeds();














function loadRecentFeeds() {
	$.ajax({
		type: "get",
		url: "/api/v1/community/recent/all",
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
		if(i == 2) {
			const ad_tag = makeInnerAdTag();
			feeds.appendChild(ad_tag);
		}
		const article = article_list[i];
		const tag = makeArticleTag(article);
		feeds.appendChild(tag);
		tag.onclick = () => location.href = `/community/${article.id}`;
	}
}

function makeInnerAdTag() {
	const div = document.createElement("div");
	div.className = "inner_ad";
	div.innerHTML = `
		<a href="#" class="ad">
            <img src="/static/images/community_main_ad1.webp">
        </a>
	`;
	return div;
}

function makeArticleTag(article) {
	const topic = article.sub_category_id == 1 ? "insight" : 
							   article.sub_category_id == 2 ? "job" : "subject";
	const is_today = new Date() - new Date(article.create_date) < 1000 * 60 * 60 * 24;
	const upload_time = makeUploadTimeString(article_create_date);
	
	const div = document.createElement("div");
	div.className = "feed";
	div.innerHTML = `
		<div class="tag_wrapper">
            <div class="${topic}">${article.category_name}</div>
        </div>
        <div class="article_contents">
            ${is_today ? '<span class="today"></span>' : ''}
            <div class="texts">
                <div class="title">${article.title}</div>
                <div class="content_summary">${article.contents.substring(0, 50)}</div>
            </div>
        </div>
        <div class="userinfo">
            <img src="/static/file_upload/${article.profile_img}" class="upload_user_profile_image">
            <span class="nickname">${article.nickname}</span>
            <span class="user_job_category">${article.department_name}</span>
        </div>
        <div class="article_summary">
            <span class="upload_time">${upload_time}</span>
            <div class="reactions">
                <div class="views">
                    <img src="/static/images/community_views_icon.svg">
                    <span class="view_count">${article.view_count}</span>
                </div>
                <div class="likes">
                    <img src="/static/images/community_likes_icon.svg">
                    <span class="like_count">${article.like_count}</span>
                </div>
                <div class="comments">
                    <img src="/static/images/community_comments_icon.svg">
                    <span class="comment_count">${article.comment_count}</span>
                </div>
            </div>
        </div>
	`;
	return div;
}

function makeUploadTimeString(create_date) {
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