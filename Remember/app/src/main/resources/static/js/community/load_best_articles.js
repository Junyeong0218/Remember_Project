loadBestArticleList();

function loadBestArticleList() {
	$.ajax({
		type: "get",
		url: "/api/v1/community/best/list",
		dataType: "json",
		success: function (article_summary_list) {
			console.log(article_summary_list);
			addBestArticleSummaryTags(article_summary_list);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function addBestArticleSummaryTags(article_summary_list) {
	const uri = location.pathname;
	if(uri.includes("detail")) {
		const best_article_aside = document.querySelector(".best_articles_aside");
		const best_article_list = best_article_aside.querySelector(".article_summary_list");
		for(let i = 0; i < article_summary_list.length; i++) {
			const article_summary = article_summary_list[i];
			const tag = makeBestArticleSummaryTag(article_summary);
			best_article_list.appendChild(tag);
			tag.onclick = () => location.href = `/community/${article_summary.id}`;
		}
	} else {
		const best_article_list = document.querySelector(".best_articles");
		if(article_summary_list.length > 3) {
			for(let i = 0; i < 3; i++) {
				const tag = makeMainBestArticleTag(article_summary_list[i]);
				best_article_list.appendChild(tag);
			}
		} else {
			for(let i = 0; i < article_summary_list.length; i++) {
				const tag = makeMainBestArticleTag(article_summary_list[i]);
				best_article_list.appendChild(tag);
			}
		}
	}
}

function makeMainBestArticleTag(article_summary) {
	const div = document.createElement("div");
	div.className = "row";
	div.innerHTML = `
        <span class="title">${article_summary.title}</span>
        <div class="summary">
            <span class="subject_topic">${article_summary.category_name}</span>
            <div class="reactions">
                <div class="views">
                    <img src="/static/images/community_views_icon.svg">
                    <span class="view_count">${article_summary.view_count}</span>
                </div>
                <div class="likes">
                    <img src="/static/images/community_likes_icon.svg">
                    <span class="like_count">${article_summary.like_count}</span>
                </div>
                <div class="comments">
                    <img src="/static/images/community_comments_icon.svg">
                    <span class="comment_count">${article_summary.comment_count}</span>
                </div>
            </div>
        </div>
	`;
	return div;
}

function makeBestArticleSummaryTag(article_summary) {
	const li = document.createElement("li");
	li.className = "best_article_summary";
	li.innerHTML = `
		<div class="button_wrapper">
            <span class="title">${article_summary.title}</span>
            <span class="topic">${article_summary.category_name}</span>
            <div class="reactions">
                <div class="views">
                    <img src="/static/images/community_views_icon.svg">
                    <span class="view_count">${article_summary.view_count}</span>
                </div>
                <div class="likes">
                    <img src="/static/images/community_likes_icon.svg">
                    <span class="like_count">${article_summary.like_count}</span>
                </div>
                <div class="comments">
                    <img src="/static/images/community_comments_icon.svg">
                    <span class="comment_count">${article_summary.comment_count}</span>
                </div>
            </div>
        </div>
	`;
}

