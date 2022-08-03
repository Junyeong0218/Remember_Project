const pager = document.querySelector(".pager");
const before_page_button = pager.querySelector(".prev_page");
const after_page_button = pager.querySelector(".next_page");

loadTotalArticleCount();

function loadTotalArticleCount() {
	const url = category_id == 0 ? "/api/v1/now/count" : "/api/v1/now/" + category_id + "/count";
	$.ajax({
		type: "get",
		url: url,
		dataType: "json",
		success: function (response) {
			if(response.code == 0) {
				appendPageLinks(Number(response.data));
			} else {
				alert(response.message);
			}
		},
		error: function (xhr, error) {
			console.log(xhr);
			console.log(error);
		}
	});
}

function appendPageLinks(count) {
	const current = page;
	const last_page = count == 0 ? 1 : count%10 == 0 ? Math.floor(count/10) : Math.floor(count/10) + 1;
	const min_page_number = Math.floor(page/10) + 1;
	const max_page_number = (Math.floor(page/10) + 1) * 10 < last_page ? (Math.floor(page/10) + 1) * 10 : last_page;
	console.log("min : " + min_page_number);
	console.log("max : " + max_page_number);
	if(min_page_number == max_page_number) {
		const tag = makeCurrentPageTag(min_page_number);
		pager.insertBefore(tag, after_page_button);
	} else {
		for(let i = min_page_number; i < max_page_number + 1; i++) {
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
	span.className = "page current";
	span.innerText = number;
	return span;
}

function makePageLinkTag(number) {
	const a = document.createElement("a");
	a.href = location.search == "" ? "?page=" + number : location.pathname + "?page=" + number;
	a.className = "page";
	a.innerText = number;
	return a;
}