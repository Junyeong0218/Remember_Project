const article_title = document.querySelector(".article_title");
const category_wrapper = document.querySelector(".category");
const main_image_wrapper = document.querySelector(".main_image");
const main_image_input = main_image_wrapper.querySelector("input");
const main_image_tag = main_image_wrapper.querySelector("img");
const main_image_button = main_image_wrapper.querySelector(".insert_main_image");
const submit_button = document.querySelector(".submit_button");
const text_editor = new FroalaEditor("#text_editor", {
	pastePlain: true,
	events: {
		"image.beforeUpload": (images) => {
			console.log(images);
			for(let i = 0; i < images.length; i++) {
				file_list.push({
					file: images[i],
					tag: null
				});
			}
		},
		"image.inserted": (image_tags, response) => {
			file_list[file_list.length - 1].tag = image_tags[0];
		},
		"image.beforeRemove": (image_tags) => {
			const remove_image = image_tags[0];
			for(let i = 0; i < file_list.length; i++) {
				if(file_list[i].tag == remove_image) {
					file_list.splice(i, 1);
					break;
				}
			}
		}
	}
});

let file_list = new Array();
let main_image_file;
const category_list = getCategories();

for(let i = 0; i < category_list.length; i++) {
	const option = document.createElement("option");
	option.value = category_list[i].id;
	option.innerText = category_list[i].name;
	
	category_wrapper.appendChild(option);
}

main_image_button.onclick = () => main_image_input.click();
main_image_tag.onclick = () => main_image_input.click();
main_image_input.onchange = () => {
	const file_reader = new FileReader();
	
	file_reader.onloadend = (event) => {
		main_image_file = main_image_input.files[0];
		main_image_tag.src = event.target.result;
		main_image_tag.classList.remove("hidden");
		main_image_button.classList.add("hidden");
		
		main_image_tag.style = "width: 100%;";
	}
	
	file_reader.readAsDataURL(main_image_input.files[0]);
}

submit_button.onclick = () => {
	if(article_title.value == "") {
		alert("제목을 입력해주세요.");
		return;
	}
	const category_id = category_wrapper.options[category_wrapper.selectedIndex].value;
	if(category_id == "") {
		alert("카테고리를 선택해주세요.");
		return;
	}
	if(main_image_file == null) {
		alert("메인 이미지는 필수로 등록해야 합니다.");
		return;
	}
	const contents = changeContentstoTag();
	if(contents == "<p></p>") {
		alert("내용을 입력해주세요.");
		return;
	}
	const formdata = makeFormData(category_id, contents);
	console.log(contents);
	if(insertArticle(formdata)) {
		location.replace("/now");
	} else {
		alert("게시글 인서트에 실패했습니다.");
	}
}

function changeContentstoTag() {
	const fr_view = document.querySelector(".fr-view");
	let tag = "";
	let blank_start_index = 0;
	let blank_end_index = -1;
	console.log(fr_view.childNodes);
	for(let i = 0; i < fr_view.childNodes.length; i++) {
		const p = fr_view.childNodes[i];
		if(p.innerHTML == "<br>" || p.innerHTML.startsWith("<img")) {
			blank_end_index = i;
			tag += `<p>`;
			for(let j = blank_start_index; j < blank_end_index + 1; j++) {
				if(fr_view.childNodes[j].innerHTML == "<br>") continue;
				if(fr_view.childNodes[j].innerHTML.includes("<img")) {
					tag += fr_view.childNodes[j].innerHTML.substring(0, fr_view.childNodes[j].innerHTML.indexOf("<img"));
					tag += `</p><p><img></p><p>`;
					tag += fr_view.childNodes[j].innerHTML.substring(fr_view.childNodes[j].innerHTML.indexOf(">") + 1, fr_view.childNodes[j].innerHTML.length);
				} else {
					tag += `${fr_view.childNodes[j].innerHTML}\n`;
				}
			}
			tag += `</p>`;
			blank_start_index = blank_end_index + 1;
		} else if(i == fr_view.childNodes.length - 1) {
			blank_end_index = i;
			tag += `<p>`;
			for(let j = blank_start_index; j < blank_end_index + 1; j++) {
				if(fr_view.childNodes[j].innerHTML == "<br>") continue;
				if(fr_view.childNodes[j].innerHTML.includes("<img")) {
					tag += fr_view.childNodes[j].innerHTML.substring(0, fr_view.childNodes[j].innerHTML.indexOf("<img"));
					tag += `</p><p><img></p><p>`;
					tag += fr_view.childNodes[j].innerHTML.substring(fr_view.childNodes[j].innerHTML.indexOf(">") + 1, fr_view.childNodes[j].innerHTML.length);
				} else {
					tag += `${fr_view.childNodes[j].innerHTML}\n`;
				}
			}
			tag += `</p>`;
		}
	}
	while(tag.includes("<p></p>")) {
		tag = tag.replace("<p></p>", "");
	}
	return tag;
}

function insertArticle(formdata) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/now/article",
		async: false,
		data: formdata,
		encType: "multipart/form-data",
		processData: false,
		contentType: false,
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function getCategories() {
	let categories;
	$.ajax({
		type: "get",
		url: "/api/v1/now/categories",
		async: false,
		dataType: "json",
		success: function (data) {
			categories = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return categories;
}

function makeFormData(category_id, contents) {
	const formdata = new FormData();
	formdata.append("category_id", category_id);
	formdata.append("title", article_title.value);
	let summary = contents.substring(3, contents.indexOf("</p>"));
	console.log(summary);
	console.log(summary.length);
	formdata.append("summary", summary);
	formdata.append("contents", contents);
	formdata.append("title_image",main_image_file);
	for(let i = 0; i < file_list.length; i++) {
		formdata.append("contents_images", file_list[i].file);
	}
	return formdata;
}