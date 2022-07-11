let files = new Array();

insertArticle();

function insertArticle(){
	const upload = makeInsertArticle();
	document.querySelector(".container").appendChild(upload);
	
	const add_contents_image_button = upload.querySelector(".add_contents_image_button"); 
	const file_input = upload.querySelector("input[name='file']");
	const image_wrapper = upload.querySelector(".image_wrapper");
	add_contents_image_button.onclick = () => file_input.click();
	file_input.onchange = (event) => {
		loadUploadFiles(event, image_wrapper);
	}
	
	const title_input_tag = upload.querySelector("input[name='title']");
	const contents_area_tag = upload.querySelector("textarea[name='contents']");
	const summary_input_tag = upload.querySelector("input[name='summary']");
	const insight_title_input_tag = upload.querySelector("input[name='insight_title']");
	const insight_contents_input_tag = upload.querySelector("input[name='insight_contents']");
	const insert_article_button = upload.querySelector(".register_article_button");
	insert_article_button.onclick = () => {
		const form_data = new FormData();
		form_data.append("title", title_input_tag.value);
		form_data.append("contents", contents_area_tag.value);
		form_data.append("summary", summary_input_tag.value);
		form_data.append("insight_title", insight_title_input_tag.value);
		form_data.append("insight_contents", insight_contents_input_tag.value);
		for(let i = 0; i < files.length; i++) {
		form_data.append("files", files[i]);
		}
		$.ajax({
				type: "post",
				url: "/api/v1/now/article",
				data: form_data,
				encType: "multipart/form-data",
				processData: false,
				contentType: false,
				dataType: "json",
				success: function (data) {
					if(data == true) {
						location.reload();
					} else {
						console.log(data);
					}
				},
				error: function (xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
	}
}

function loadUploadFiles(event, image_wrapper) {
		for(let i = 0; i < event.target.files.length; i++) {
		const fileReader = new FileReader();
		fileReader.onloadend = (e) => {
			image_wrapper.classList.add("active");
			files.push(event.target.files[i]);
			const file_name = event.target.files[i].name;
			
			const image_tag = makeImageTag(e.target.result);
			image_wrapper.appendChild(image_tag);
			files = files.filter(file => file.name != file_name);
			}
			
		fileReader.readAsDataURL(event.target.files[i]);
		}
	}

function makeImageTag(img_src) {
	const div = document.createElement("div");
	div.className = "image_box";
	div.innerHTML = `
		<img class="image" src="${img_src}">
	`;
	return div;
}


function makeInsertArticle() {
	const div = document.createElement("div");
	div.className = "upload";
	div.innerHTML = `
		<div class="register_article">
			<div class="title">게시글 쓰기</div>
			<hr>
			<form>
				<input type="text" class="article_title" name="title" placeholder="제목을 입력하세요">
				<textarea class="article_contents" name="contents" placeholder="내용을 입력하세요"></textarea>
				<input type="text" class="article_summary" name="summary" placeholder="요약글을 입력하세요">
				<input type="text" class="article_insight_title" name="insight_title" placeholder="작성자를 입력하세요">
				<input type="text" class="article_insight_contents" name="insight_contents" placeholder="작성자 소개를 입력하세요">
				<div class="row active">
					<button type="button" class="add_title_image_button">
						<span class="text">제목사진 첨부</span>
						<img src="/static/images/insert_new_article_add_image_button.svg">
						<input type="file" name="file" accept=".jpg, .png, .jpeg" multiple>
					</button>
				</div>
				<div class="row active">
					<button type="button" class="add_contents_image_button">
						<span class="text">내용사진 첨부</span>
						<img src="/static/images/insert_new_article_add_image_button.svg">
						<input type="file" name="file" accept=".jpg, .png, .jpeg" multiple>
					</button>
				</div>
				<div class="image_wrapper"></div>
				<div class="buttons">
					<div class="button_wrapper">
						<button type="button" class="register_article_button">등록</button>
					</div>
				</div>
			</form>	
		</div>
	`;
	return div;
}