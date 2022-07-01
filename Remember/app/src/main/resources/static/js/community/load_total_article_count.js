const pager = document.querySelector(".pager");
const before_page_button = pager.querySelector(".before");
const after_page_button = pager.querySelector(".after");

loadTotalArticleCount();

function loadTotalArticleCount() {
	const url = category_id == 0 ? "/api/v1/community/count" : "/api/v1/community/" + category_id + "/count";
	const page_param = page > 0 ? page - 1 : page;
	const data = category_id == 0 ? {"page":page_param} :
																  {"tagId":tag_id,
																    "page":page_param};
	$.ajax({
		type: "get",
		url: url,
		data: data,
		dataType: "json",
		success: function (count) {
			appendPageLinks(Number(count));
		},
		error: function (xhr, error) {
			console.log(xhr);
			console.log(error);
		}
	});
}

function appendPageLinks(count) {
	const current = page + 1;
	const last_page = count == 0 ? 1 : count%15 == 0 ? Math.floor(count/15) : Math.floor(count/15) + 1;
	const min_page_number = Math.floor(page/15) + 1;
	const max_page_number = (Math.floor(page/15) + 1) * 15 < last_page ? (Math.floor(page/15) + 1) * 15 : last_page;
	console.log("min : " + min_page_number);
	console.log("max : " + max_page_number);
	if(min_page_number == max_page_number) {
		const tag = makeCurrentPageTag(min_page_number);
		pager.insertBefore(tag, after_page_button);
	} else {
		for(let i = min_page_number; i < max_page_number; i++) {
			if(current == i) {
				const tag = makeCurrentPageTag(i);
				pager.insertBefore(tag, after_page_button);
			} else {
				const tag = makePageLinkTag(i);
				pager.insertBefore(tag, after_page_button);
			}
		}
	}
	if(max_page_number < last_page) {
		after_page_button.disabled = false;
	} else {
		after_page_button.disabled = true;
	}
	if(page > 1) {
		before_page_button.disabled = false;
	} else {
		before_page_button.disabled = true;
	}
}

function makeCurrentPageTag(number) {
	const span = document.createElement("span");
	span.className = "page_link current";
	span.innerText = number;
	return span;
}

function makePageLinkTag(number) {
	const a = document.createElement("a");
	a.href = location.search == "" ? "?page=" + number : 
					location.search == "?" ? location.pathname + "?page=" + number : 
					location.search.includes("tag=") ? location.pathname + "tag_id=" + tag_id +",page=" + number : "";
	a.className = "page_link";
	a.innerText = number;
	return a;
}