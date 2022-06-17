const article_detail_tag = document.querySelector(".article_detail");

loadArticleDetail();

function loadArticleDetail() {
	const url = "/api/v1/community/detail/" + article_id;
	$.ajax({
		type: "get",
		url: url,
		dataType: "json",
		success: function (data) {
			const article_data = data.articleDetail;
			const comment_list = data.commentList;
			const article_images = data.imageList;
			console.log(article_data);
			console.log(comment_list);
			console.log(article_images);
			if(article_data == null) {
				alert("asfadsfasdf");
			} else {
				document.querySelector("title").innerText = article_data.title;
				setArticleDetailTag(article_data, article_images);
				loadRelatedArticles(article_data.sub_category_id);
				setComments(comment_list);
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeCommentReportModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window comment_menu">
			<span class="text bold">이 댓글을 신고하시겠습니까?</span>
			<span class="text">커뮤니티 에티켓에 따라 신고 사유에</span>
			<span class="text">해당하는지 검토 후 처리됩니다.</span>
			<div class="buttons">
				<button type="button" class="cancel_button">취소</button>
				<button type="button" class="report_button">신고</button>
			</div>
		</div>
	`;
	return div;
}

function makeCommentMenuPopup() {
	const div = document.createElement("div");
	div.className = "pop_up";
	div.innerHTML = `
		<span class="row">이 회원의 글/댓글 숨기기</span>
		<span class="row red">신고</span>
	`;
	return div;
}

function setComments(comment_list) {
	const comments_wrapper = document.querySelector(".comments_wrapper");
	const best_comments = document.querySelector(".best_comments");
	const total_comment_count = best_comments.querySelector(".total_comment_count");
	const whole_comments = document.querySelector(".whole_comments");
	
	let like_count_ordered_comment_list = comment_list.filter(e => e.like_count != 0)
																										.sort((a, b) => b.like_count - a.like_count);
	if(like_count_ordered_comment_list.length > 3) {
		like_count_ordered_comment_list = like_count_ordered_comment_list.splice(3, like_count_ordered_comment_list.length - 3);
	}
	
	const has_best = comment_list.filter(e => e.like_count > 0).length > 0;
	if(has_best == false) best_comments.classList.add("no_bests");
	else {
		let max_count = like_count_ordered_comment_list.length;
		if(like_count_ordered_comment_list.length > 3) {
			max_count = 3;
		}
		for(let i = 0; i < max_count; i++) {
			const best_comment_tag = makeBestCommentTag(like_count_ordered_comment_list[i]);
			best_comments.appendChild(best_comment_tag);
			const best_comment_like_button = best_comment_tag.querySelector(".comment_like");
			best_comment_like_button.onclick = () => {
				if(principal == null) {
					const modal = makeLoginModal();
					document.querySelector(".container").appendChild(modal);
					document.body.style = "overflow: hidden;";
					modal.querySelector(".close_modal").onclick= () => {
						modal.remove();
						document.body.style = "";
					}
				} else if(like_count_ordered_comment_list[i].like_flag == true) {
					if(deleteCommentLike(like_count_ordered_comment_list[i].id)) {
						best_comment_like_button.classList.remove("pressed");
						best_comment_like_button.children[1].innerText = Number(best_comment_like_button.children[1].innerText) - 1;
						like_count_ordered_comment_list[i].like_flag = false;
						
						const target_index = comment_list.findIndex(e => e.id == like_count_ordered_comment_list[i].id);
						if(target_index != -1) {
							const comment_like_button = whole_comments.children[target_index + 1].querySelector(".comment_like");
							comment_like_button.classList.remove("pressed");
							comment_like_button.children[1].innerText = Number(comment_like_button.children[1].innerText) - 1;
							comment_list[target_index].like_flag = false;
						}
					} else {
						alert("댓글 좋아요 취소 실패");
					}
				} else if(insertCommentLike(like_count_ordered_comment_list[i].id)) {
					best_comment_like_button.classList.remove("pressed");
					best_comment_like_button.children[1].innerText = Number(best_comment_like_button.children[1].innerText) + 1;
					like_count_ordered_comment_list[i].like_flag = true;
					
					const target_index = comment_list.findIndex(e => e.id == like_count_ordered_comment_list[i].id);
					if(target_index != -1) {
						const comment_like_button = whole_comments.children[target_index + 1].querySelector(".comment_like");
						comment_like_button.classList.remove("pressed");
						comment_like_button.children[1].innerText = Number(comment_like_button.children[1].innerText) + 1;
						comment_list[target_index].like_flag = true;
					}
				} else {
					alert("댓글 좋아요 실패");
				}
			}
		}
	}
	
	if(comment_list.length == 1 && comment_list[0].id == 0) {
		total_comment_count.innerText += ` ${comment_list.length - 1}`;
		const no_comments_tag = makeNoCommentsTag();
		whole_comments.classList.add("hidden");
		comments_wrapper.appendChild(no_comments_tag);
	} else {
		total_comment_count.innerText += ` ${comment_list.length}`;
		for(let i = 0; i < comment_list.length; i++) {
			const comment_tag = makeCommentTag(comment_list[i], comment_list);
			whole_comments.appendChild(comment_tag);
			
			// 댓글 메뉴 버튼 팝업 및 모달창
			const comment_menu_button = comment_tag.querySelector(".comment_menu_button");
			comment_menu_button.onclick = () => {
				let pop_up = comment_tag.querySelector(".pop_up");
				if(pop_up == null) {
					pop_up = makeCommentMenuPopup();
					comment_tag.querySelector(".writer_info").appendChild(pop_up);
					pop_up.children[1].onclick = () => {
						const modal = makeCommentReportModal();
						document.querySelector(".container").appendChild(modal);
						document.body.style = "overflow: hidden;";
						modal.querySelector(".cancel_button").onclick = () => {
							modal.remove();
							document.body.style = "";
						}
						modal.querySelector(".report_button").onclick = () => {
							alert("신고완료!");
							modal.remove();
							document.body.style = "";
						}
					}
				} else {
					pop_up.remove();
				}
			}
			
			// 댓글 좋아요 버튼 이벤트 
			const comment_like_button = comment_tag.querySelector(".comment_like");
			comment_like_button.onclick = () => {
				if(principal == null) {
					const modal = makeLoginModal();
					document.querySelector(".container").appendChild(modal);
					document.body.style = "overflow: hidden;";
					modal.querySelector(".close_modal").onclick= () => {
						modal.remove();
						document.body.style = "";
					}
				} else if(comment_list[i].like_flag == true) {
					if(deleteCommentLike(comment_list[i].id)) {
						comment_like_button.classList.remove("pressed"); 
						comment_like_button.children[1].innerText = Number(comment_like_button.children[1].innerText) - 1;
						comment_list[i].like_flag = false;
						
						const best_index = like_count_ordered_comment_list.findIndex(e => e.id == comment_list[i].id);
						if(best_index != -1) {
							const best_comment_like_button = best_comments.children[best_index + 1].querySelector(".comment_like");
							best_comment_like_button.classList.remove("pressed");
							best_comment_like_button.children[1].innerText = Number(best_comment_like_button.children[1].innerText) - 1;
							like_count_ordered_comment_list[best_index].like_flag = false;
						}
					} else {
						alert("댓글 좋아요 취소 실패");
					}
				} else if(insertCommentLike(comment_list[i].id)) {
					comment_like_button.classList.add("pressed"); 
					comment_like_button.children[1].innerText = Number(comment_like_button.children[1].innerText) + 1;
					comment_list[i].like_flag = true;
					
					const best_index = like_count_ordered_comment_list.findIndex(e => e.id == comment_list[i].id);
					if(best_index != -1) {
						const best_comment_like_button = best_comments.children[best_index + 1].querySelector(".comment_like");
						best_comment_like_button.classList.add("pressed");
						best_comment_like_button.children[1].innerText = Number(best_comment_like_button.children[1].innerText) + 1;
						like_count_ordered_comment_list[best_index].like_flag = true;
					}
				} else {
					alert("댓글 좋아요 실패");
				}
			}
			
			// 답글 달기 버튼 이벤트
			const reply_comment_button = comment_tag.querySelector(".reply_comment");
			if(reply_comment_button != null) {
				reply_comment_button.onclick = () => {
					if(principal == null) {
						const modal = makeLoginModal();
						document.querySelector(".container").appendChild(modal);
						document.body.style = "overflow: hidden;";
						modal.querySelector(".close_modal").onclick= () => {
							modal.remove();
							document.body.style = "";
						}
					} else {
						const exist_tag = whole_comments.querySelector(".comment_form");
						if(exist_tag != null) {
							exist_tag.remove();
						} 
						const reply_comment_tag = makeReplyCommentForm();
						const index = i == comment_list.length - 1 ? -1 : i;
						if(index != -1) {
							whole_comments.insertBefore(reply_comment_tag, whole_comments.children[index + 2]);
						} else {
							whole_comments.appendChild(reply_comment_tag);
						}
						
						const input_wrapper = reply_comment_tag.querySelector(".input_wrapper");
						const reply_comment_contents = reply_comment_tag.querySelector(".comment_contents");
						const reply_comment_submit_button = reply_comment_tag.querySelector(".submit_comment");
						input_wrapper.children[0].onclick = (event) => {
							if(event.target.checked == true) {
								reply_comment_contents.placeholder = principal.nickname + "(으)로 댓글 달기...";
							} else {
								reply_comment_contents.placeholder = principal.name + "(으)로 댓글 달기...";
							}
						}
						input_wrapper.children[1].onclick = () => input_wrapper.children[0].click();
						input_wrapper.children[0].click();
						reply_comment_contents.oninput = (event) => {
							activeCommentSubmitButton(event, reply_comment_submit_button);
						}
						reply_comment_submit_button.onclick = () => {
							reply_comment_submit_button.disabled = true;
							console.log(reply_comment_contents.value);
							console.log(article_id);
							console.log(input_wrapper.children[0].checked);
							console.log(comment_list[i].id);
							$.ajax({
								type: "post",
								url: "/api/v1/community/article/" + article_id + "/comment",
								data: {"contents":reply_comment_contents.value,
											 "use_nickname":input_wrapper.children[0].checked,
											 "related_comment_id":comment_list[i].id},
								dataType: "json",
								success: function (data) {
									console.log(data);
									if(data == true) {
										location.reload();
									} else {
										alert("댓글 달기 실패");
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
		}
	}
}

function makeReplyCommentForm() {
	const div = document.createElement("div");
	div.className = "comment_form";
	div.innerHTML = `
	    <form class="comment_textarea">
	        <div class="profile_image">
	            <img src="/static/images/default_profile_image.png">
	        </div>
	        <textarea name="contents" class="comment_contents" placeholder="회원(으)로 댓글 달기..."></textarea>
	    </form>
	    <div class="buttons">
	        <div class="input_wrapper">
	            <input type="checkbox" class="register_to_nickname">
	            <span>닉네임으로 등록</span>
	        </div>
	        <button type="button" class="submit_comment" disabled>등록</button>
	    </div>
	`;
	return div;
}

function insertCommentLike(comment_id) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/community/comment/" + comment_id + "/like",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function deleteCommentLike(comment_id) {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/community/comment/" + comment_id + "/like",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function makeNoCommentsTag() {
	const div = document.createElement("div");
	div.className = "no_comments";
	div.innerHTML = `
		<span>등록된 댓글이 없습니다.</span>
		<span>첫 댓글을 남겨주세요</span>
	`;
	return div;
}

function loadRelatedArticles(article_category_id) {
	$.ajax({
		type: "get",
		url: "/api/v1/community/" + article_category_id + "/best/list",
		dataType: "json",
		success: function (data) {
			console.log(data);
			const related_article_list = document.querySelector(".related_article_list");
			for(let i = 0; i < data.length; i++) {
				const tag = makeRelatedArticleTag(data[i], i + 1);
				related_article_list.appendChild(tag);
				tag.onclick = () => location.href = category_id == 0 ? "/community/detail" + data[i].id : "/community/" + category_id + "/detail/" + data[i].id;
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
			console.log("관련 게시글 없음");
		}
	});
}

function makeRelatedArticleTag(related_article, numbering) {
	const li = document.createElement("li");
	li.className = "row"; 
	li.innerHTML = `
	    <span class="numbering">${numbering}</span>
        <span class="title">${related_article.title}</span>
	`;
	return li;
}

function makeBestCommentTag(comment) {
	const upload_time = makeCommentUploadTimeString(comment.create_date);
	const div = document.createElement("div");
	div.className = "comment";
	div.innerHTML = `
		<div class="writer_info">
            <div class="profile_image">
                <img src="/static/images/default_profile_image.png">
            </div>
            <div class="texts">
                <div class="userinfo">
                    <span class="nickname">${comment.nickname}</span>
                    <div class="badge">
                        <img src="/static/images/bronze_badge.webp">
                    </div>
          ${comment.user_id == 0 ? '<span class="article_writer">작성자</span>' : ''}
                </div>
                <div class="comment_info">
                    <span class="department_name">${comment.department_name}</span>
                    <span>|</span>
                    <span class="upload_time">${upload_time}</span>
                </div>
            </div>
        </div>
        <div class="contents"><span class="best">BEST</span>${comment.contents}</div>
        <div class="comment_reaction_wrapper">
            <button type="button" class="reply_comment" disabled></button>
            <button type="button" class="comment_like ${comment.like_flag == true ? 'pressed' : ''}">
                <span class="comment_like_icon"></span>
                <span class="like_count">${comment.like_count}</span>
            </button>
        </div>
	`;
	return div;
}

function makeCommentTag(comment, comment_list) {
	const upload_time = makeCommentUploadTimeString(comment.create_date);
	const div = document.createElement("div");
	div.className = comment.related_comment_id == 0 ? "comment" : "comment reply";
	div.innerHTML = `
		<div class="writer_info">
            <div class="profile_image">
                <img src="/static/images/default_profile_image.png">
            </div>
            <div class="texts">
                <div class="userinfo">
                    <span class="nickname">${comment.nickname}</span>
                    <div class="badge">
                        <img src="/static/images/bronze_badge.webp">
                    </div>
          ${comment.user_id == 0 ? '<span class="article_writer">작성자</span>' : ''}
                </div>
                <div class="comment_info">
                    <span class="department_name">${comment.department_name}</span>
                    <span>|</span>
                    <span class="upload_time">${upload_time}</span>
                </div>
            </div>
            <button type="button" class="comment_menu_button">
                <img src="/static/images/article_detail_article_menu.svg">
            </button>
        </div>
        <div class="contents">${comment.contents}</div>
        <div class="comment_reaction_wrapper">
            <button type="button" class="reply_comment">
                
            </button>
            <button type="button" class="comment_like ${comment.like_flag == true ? 'pressed' : ''}">
                <span class="comment_like_icon"></span>
                <span class="like_count">${comment.like_count}</span>
            </button>
        </div>
	`;
	if(comment.related_comment_id == 0) {
		const reply_button = div.querySelector(".reply_comment");
		reply_button.innerHTML += `
			<img src="/static/images/article_detail_reply_comment.svg">
			<span>댓글달기</span>
		`;
		const related_comment_count = comment_list.filter(e => e.related_comment_id == comment.id).length;
		if(related_comment_count != 0) {
			reply_button.innerHTML += `<span>&nbsp;|&nbsp;<span class="reply_comment_count">${related_comment_count}</span>개</span>`;
		}
	}
	return div;                      
}

function makeCommentUploadTimeString(create_date) {
	const time_array = [31536000000, 		// 1년
										  	2592000000,			// 1달
										  		 86400000,			// 하루
										  		 	3600000,			// 1시간
										  		 		 60000,			// 1분
										  		 		 	1000];		// 1초
	const upload_time = new Date(create_date);
	const now = new Date();
	const ago = now - upload_time;
	
	if(ago > time_array[0]) {
		return `${Math.floor(ago / time_array[0])}년 전`;
	} else if(ago > time_array[1]) {
		return `${Math.floor(ago / time_array[1])}개월 전`;
	} else if(ago > time_array[2]) {
		return `${Math.floor(ago / time_array[2])}일 전`;
	} else if(ago > time_array[3]) {
		return `${Math.floor(ago / time_array[3])}시간 전`;
	} else if(ago > time_array[4]) {
		return `${Math.floor(ago / time_array[4])}분 전`;
	} else {
		return `${Math.floor(ago / time_array[5])}초 전`;
	}
}

function setArticleDetailTag(article_data, article_images) {
	const category_tag = article_detail_tag.querySelector(".tags > .tag");
	category_tag.className = article_data.sub_category_id < 9 ? "insight" : 
														article_data.sub_category_id > 48 ? "subject" : "job";
	category_tag.innerText = article_data.category_name;
	const tag = document.createElement("button");
	tag.type = "button";
	tag.className = "tag";
	tag.innerText = article_data.tag_name;
	article_detail_tag.querySelector(".tags").appendChild(tag);
	
	article_detail_tag.querySelector(".title").innerText = article_data.title;
	article_detail_tag.querySelector(".upload_time").innerText = makeArticleDetailUploadTimeText(article_data.create_date);
	article_detail_tag.querySelector(".article_info .view_count").innerText = article_data.view_count;
	article_detail_tag.querySelector(".userinfo .nickname").innerText = article_data.nickname;
	article_detail_tag.querySelector(".userinfo .department_name").innerText = article_data.department_name;
	article_detail_tag.querySelector(".description").innerText = article_data.contents;
	article_detail_tag.querySelector(".related_articles .topic").innerText = article_data.category_name;
	
	const like_count_tag = article_detail_tag.querySelector(".article_like .like_count");
	like_count_tag.innerText = article_data.like_count;
	const article_like_button = article_detail_tag.querySelector(".article_like_button");
	if(article_data.like_flag) article_like_button.classList.add("pressed");
	
	for(let i = 0; i < article_images.length; i++) {
		const image_tag = document.createElement("img");
		image_tag.className = "article_image";
		image_tag.src = "/image/article_images/" + article_images[i];
		
		article_detail_tag.querySelector(".contents").insertBefore(image_tag, article_detail_tag.querySelector(".article_like"));
	}
	
	article_like_button.onclick = () => {
		if(principal == null) {
			// 로그인 이동 모달 출력
			const modal = makeLoginModal();
			document.querySelector(".container").appendChild(modal);
			document.body.style = "overflow: hidden;";
			modal.querySelector(".to_signup_button").onclick = () => location.href = "/auth/signup";
			modal.querySelector(".close_modal").onclick = () => {
				modal.remove();
				document.body.style = "";
			}
		} else if(article_data.like_flag == true) {
			if(deleteLike()) {
				article_data.like_flag = false;
				like_count_tag.innerText = Number(like_count_tag.innerText) - 1; 
				article_like_button.classList.remove("pressed");
			} else {
				alert("게시글 좋아요 삭제에 실패했습니다.");
			}
		} else if(insertLike()) {
			article_data.like_flag = true;
			like_count_tag.innerText = Number(like_count_tag.innerText) + 1; 
			article_like_button.classList.add("pressed");
		} else {
			alert("게시글 좋아요에 실패했습니다.");
		}
	}
}

function insertLike() {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/community/article/" + article_id + "/like",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function deleteLike() {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/community/article/" + article_id + "/like",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			flag = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return flag;
}

function makeLoginModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div. innerHTML = `
		<div class="window not_login">
			<div class="title">
				<span class="text">이 기능은 회원만 이용하실 수 있습니다.</span>
				<span class="text">회원으로 가입하시겠습니까?</span>
			</div>
			<span class="login_link">이미 회원이라면?&nbsp;<a href="/auth/signin">로그인 하기</a></span>
			<div class="buttons">
				<button type="button" class="close_modal">닫기</button>
				<button type="button" class="to_signup_button">회원가입</button>
			</div>
		</div>
	`;
	return div;
}

function makeArticleDetailUploadTimeText(create_date) {
	const date = new Date(create_date);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	return `${month}.${day} ${hour}:${minute}`;
}