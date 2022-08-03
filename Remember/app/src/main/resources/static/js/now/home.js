 function getCategoryName() {
	let category_name;
	$.ajax({
		type: "get",
		url: "/api/v1/now/" + category_id,
		async: false,
		dataType: "text",
		success: function (response) {
			if(response.code == 0) {
				category_name = response.data;
			} else {
				alert(response.message);
			}
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
		success: function (response) {
			if(response.code == 0) {
				const category_wrapper = document.querySelector(".category_nav");
				if(category_id != 0) category_wrapper.querySelector(".category").classList.remove("active");
				
				for(let i = 0; i < response.data.length; i++) {
					const category_tag = makeCategoryTag(response.data[i]);
					category_wrapper.appendChild(category_tag);
					if(category_id == response.data[i].id) {
						category_tag.classList.add("active");
					}
				}
			} else {
				alert(response.message);
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
	a.href = "/now/category/" + category.id;
	a.innerText = category.name;
	return a;
}