const uri = location.pathname.substring(1, location.pathname.length).split("/");
let category_id = 0;
let article_id = 0;
let page = 0;

// /now /now/category/{categoryId}
uri.forEach(e => console.log(e));

if(uri.length != 1 && uri[1] == "category") {
	category_id = Number(uri[2]);
} else if(uri.legnth != 1 && uri[1] == "detail") {
	article_id = Number(uri[2]);
}

if(location.search != null && location.search != "?") {
	const search = location.search.substring(1, location.search.length).split(",");
	for(let i = 0; i < search.length; i++) {
		if(search[i].includes("page")) {
			page = Number(search[i].split("=")[1]); 
		}
	}
}

console.log("category_id : " + category_id);
console.log("article_id : " + article_id);
console.log("page : " + page);