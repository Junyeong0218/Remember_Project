const uri = location.pathname.substring(1, location.pathname.length).split("/");
let category_id = 0;
let article_id = 0;
let tag_id = 0;
let page = 0;

uri.forEach(e => console.log(e));

if(uri.length == 2) {
	category_id = Number(uri[1]);
} else if(uri.length == 3) {
	article_id = Number(uri[2]);
} else if(uri.length == 4) {
	category_id = Number(uri[1]);
	article_id = Number(uri[3]);
}

if(location.search != null && location.search != "?") {
	const search = location.search.substring(1, location.search.length).split(",");
	for(let i = 0; i < search.length; i++) {
		if(search[i].includes("tag")) {
			tag_id = Number(search[i].split("=")[1]);
		}
		if(search[i].includes("page")) {
			page = Number(search[i].split("=")[1]); 
		}
	}
}

console.log("category_id : " + category_id);
console.log("article_id : " + article_id);
console.log("tag_id : " + tag_id);
console.log("page : " + page);