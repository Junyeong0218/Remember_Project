const uri = location.pathname.substring(1, location.pathname.length).split("/");
let category_id = 0;
let article_id = 0;

uri.forEach(e => console.log(e));

if(uri.length == 2) {
	category_id = Number(uri[1]);
} else if(uri.length == 3) {
	article_id = Number(uri[2]);
} else if(uri.length == 4) {
	category_id = Number(uri[1]);
	article_id = Number(uri[3]);
}