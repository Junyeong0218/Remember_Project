const pager = document.querySelector(".pager");
const before_page_button = pager.querySelector(".before");
const after_page_button = pager.querySelector(".after");

loadNowTotalArticleCount();

function loadNowTotalArticleCount() {
	const url = category_id == 0 ? "/api/v1/now/article/count" : "/api/v1/now/" + category_id + "article/count"; 
	$.ajax({
		type: "get",
		url: url,
		dataType: "json",
		success: function (count) {
			count = Number(count);
			console.log(count);
			appendPageLinks(count);
		},
		error: function (xhr, error) {
			console.log(xhr);
			console.log(error);
		}
	});
}

function appendPageLinks(count) {
	let current = location.search == "" ? 1 : Number(location.search.replace("?page=", ""));
	console.log(current);
	const last_page = count == 0 ? 1 : count%10 == 0 ? count/10 : count/10 + 1;
	console.log(last_page);
	const min_page_number = Math.floor(current/10) + 1;
	const max_page_number = (Math.floor(current/10) + 1) * 10 < last_page ? (Math.floor(current/10) + 1) * 10 : last_page;
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
	if(current > 1) {
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
	a.href = "?page=" + number;
	a.className = "page_link";
	a.innerText = number;
	return a;
}