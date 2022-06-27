 function getCategoryName() {
	let category_name;
	$.ajax({
		type: "get",
		url: "/api/v1/now/" + category_id,
		async: false,
		dataType: "text",
		success: function (data) {
			console.log(data);
			category_name = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return category_name;
}

getCategories();

function getCategories() {
	$.ajax({
		type: "get",
		url: "/api/v1/now/categories",
		dataType: "json",
		success: function (category_list) {
			console.log(category_list);
			
			const category_wrapper = document.querySelector(".category_nav");
			if(category_id != 0) category_wrapper.querySelector(".category").classList.remove("active");
			
			for(let i = 0; i < category_list.length; i++) {
				const category_tag = makeCategoryTag(category_list[i]);
				category_wrapper.appendChild(category_tag);
				if(category_id == category_list[i].id) {
					category_tag.classList.add("active");
				}
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeCategoryTag(category) {
	const a = document.createElement("a");
	a.className = "category";
	a.href = "/now/" + category.id;
	a.innerText = category.name;
	return a;
}