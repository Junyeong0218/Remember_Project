const selected_category = document.querySelector(".selected_category");

selected_category.querySelector(".tags").children[0].onclick = () => location.href = "/community/" + category_id;
getCategoryDetail();

function getCategoryDetail() {
	$.ajax({
		type: "get",
		url: "/api/v1/community/category/" + category_id + "/detail",
		dataType: "json",
		success: function (data) {
			console.log(data);
			setCategoryDetail(data);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function setCategoryDetail(category_detail) {
	selected_category.querySelector(".title").innerText = category_detail.category_name;
	selected_category.querySelector(".join_count").innerText = category_detail.join_count;
	selected_category.querySelector(".welcome_article > .title").innerText = category_detail.article_summary.title;
	selected_category.querySelector(".welcome_article").onclick = () => location.href = "/community/" + category_id + "/detail/" + category_detail.article_summary.id;
	const tag_list = category_detail.tag_list;
	for(let i = 0; i < tag_list.length; i++) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "tag";
		button.innerText = tag_list[i].tag_name;
		button.onclick = () => {
			location.href = "/community/" + category_id + "?tag_id=" + tag_list[i].id;
		}
		selected_category.querySelector(".tags").appendChild(button);
	}
	const tag_index = tag_list.findIndex(e => e.id == tag_id);
	setTabBorder(tag_index == -1 ? 0 : tag_index + 1);
	if(principal != null) {
		 selected_category.querySelector(".join_info > span").innerHTML += " ·&nbsp;";
		if(category_detail.join_flag == true) {
			const button = document.createElement("button");
			button.type = "button";
			button.className = "leave_community";
			button.innerText = "나가기";
			selected_category.querySelector(".join_info").appendChild(button);
			button.onclick = () => {
				$.ajax({
					type: "delete",
					url: "/api/v1/community/category/" + category_id,
					dataType: "json",
					success: function (data) {
						console.log(data);
						if(data == true) {
							location.reload();
						} else {
							alert("카테고리 퇴장 실패");
						}
					},
					error: function (xhr, status) {
						console.log(xhr);
						console.log(status);
					}
				});
			}
		} else {
			const button = document.createElement("button");
			button.type = "button";
			button.className = "join_community ";
			button.classList.add(category_detail.id < 9 ? "insight" : category_detail.id > 48 ? "subject" : "job");
			button.innerText = "참여하기";
			selected_category.querySelector(".join_info").appendChild(button);
			button.onclick = () => {
				$.ajax({
					type: "post",
					url: "/api/v1/community/category/" + category_id,
					dataType: "json",
					success: function (data) {
						console.log(data);
						if(data == true) {
							location.reload();
						} else {
							alert("카테고리 참가 실패");
						}
					},
					error: function (xhr, status) {
						console.log(xhr);
						console.log(status);
					}
				});
			}
		}
	}
}

function setTabBorder(index) {
	const tags = selected_category.querySelector(".tags").children;
	for(let i = 0; i < tags.length; i++) {
		if(i == index) {
			tags[i].classList.add("selected");
		} else {
			tags[i].classList.remove("selected");
		}
	}
}