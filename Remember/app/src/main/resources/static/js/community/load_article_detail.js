const article_detail_tag = document.querySelector(".article_detail");
const comment_order_asc_button = document.querySelector(".order_asc");
const comment_order_desc_button = document.querySelector(".order_desc");

loadArticleDetail();

function loadArticleDetail() {
	updateViewCountPlusOne();
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

comment_order_asc_button.onclick = () => {
	$.ajax({
		type: "get",
		url: "/api/v1/community/article/" + article_id + "/comments/asc",
		dataType: "json",
		success: function (comment_list) {
			console.log(comment_list);
			const best_comments = document.querySelectorAll(".best_comments > .comment");
			const whole_comments = document.querySelectorAll(".whole_comments > .comment");
			comment_order_asc_button.classList.add("active");
			comment_order_desc_button.classList.remove("active");
			best_comments.forEach(e => e.remove());
			whole_comments.forEach(e => e.remove());
			setComments(comment_list);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

comment_order_desc_button.onclick = () => {
	$.ajax({
		type: "get",
		url: "/api/v1/community/article/" + article_id + "/comments/desc",
		dataType: "json",
		success: function (comment_list) {
			console.log(comment_list);
			const best_comments = document.querySelectorAll(".best_comments > .comment");
			const whole_comments = document.querySelectorAll(".whole_comments > .comment");
			comment_order_desc_button.classList.add("active");
			comment_order_asc_button.classList.remove("active");
			best_comments.forEach(e => e.remove());
			whole_comments.forEach(e => e.remove());
			setComments(comment_list);
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
}

function makeArticleDeleteConfirmModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window article_delete_confirm">
			<span class="text bold">???????????? ?????????????????????????</span>
			<span class="text">?????? ??????????????? ?????? ???????????? ?????? ???????????????</span>
			<div class="buttons">
				<button type="button" class="cancel_button">??????</button>
				<button type="button" class="delete_button">??????</button>
			</div>
		</div>
	`;
	return div;
}

function makeCommentDeleteConfirmModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window delete_confirm">
			<span class="text bold">????????? ?????????????????????????</span>
			<div class="buttons">
				<button type="button" class="cancel_button">??????</button>
				<button type="button" class="delete_button">??????</button>
			</div>
		</div>
	`;
	return div;
}

function makeCommentReportModal() {
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window comment_menu">
			<span class="text bold">??? ????????? ?????????????????????????</span>
			<span class="text">???????????? ???????????? ?????? ?????? ?????????</span>
			<span class="text">??????????????? ?????? ??? ???????????????.</span>
			<div class="buttons">
				<button type="button" class="cancel_button">??????</button>
				<button type="button" class="report_button">??????</button>
			</div>
		</div>
	`;
	return div;
}

function updateViewCountPlusOne() {
	if(principal != null) {
		$.ajax({
			type: "put",
			url: "/api/v1/community/article/" + article_id + "/view",
			dataType: "json",
			success: function (data) {
				console.log("is updated : " + data);
			},
			error: function (xhr, status) {
				console.log(xhr);
				console.log(status);
			}
		});
	}
}

function makeArticleMenuPopupForUser() {
	const div = document.createElement("div");
	div.className = "pop_up";
	div.innerHTML = `
		<span class="row amend">??????</span>
		<span class="row red delete">??????</span>
		<span class="row share">??????</span>
	`;
	return div;
}

function makeCommentMenuPopupForUser() {
	const div = document.createElement("div");
	div.className = "pop_up";
	div.innerHTML = `
		<span class="row amend">??????</span>
		<span class="row red delete">??????</span>
	`;
	return div;
}

function makeCommentMenuPopup() {
	const div = document.createElement("div");
	div.className = "pop_up";
	div.innerHTML = `
		<span class="row">??? ????????? ???/?????? ?????????</span>
		<span class="row red">??????</span>
	`;
	return div;
}

function setComments(comment_list) {
	const comments_wrapper = document.querySelector(".comments_wrapper");
	const best_comments = document.querySelector(".best_comments");
	const total_comment_count = best_comments.querySelector(".total_comment_count");
	const whole_comments = document.querySelector(".whole_comments");
	
	let like_count_ordered_comment_list = comment_list.filter(e => e.like_count != 0 && e.deleted == false)
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
						alert("?????? ????????? ?????? ??????");
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
					alert("?????? ????????? ??????");
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
			let comment_tag;
			if(comment_list[i].deleted == true) {
				comment_tag = makeDeletedCommentTag();
				whole_comments.appendChild(comment_tag);
				continue;
			}
			comment_tag = makeCommentTag(comment_list[i], comment_list);
			whole_comments.appendChild(comment_tag);
			
			// ?????? ?????? ?????? ?????? ??? ?????????
			const comment_menu_button = comment_tag.querySelector(".comment_menu_button");
			comment_menu_button.onclick = () => {
				let pop_up = comment_tag.querySelector(".pop_up");
				if(pop_up == null) {
					if(principal != null && (principal.id == comment_list[i].user_id)) {
						// ?????? ??????
						pop_up = makeCommentMenuPopupForUser();
						comment_tag.querySelector(".writer_info").appendChild(pop_up);
						pop_up.children[0].onclick = () => {
							console.log("?????? ????????? ??????");
							const exist_tag = whole_comments.querySelector(".comment_form");
							if(exist_tag != null) {
								exist_tag.remove();
							} 
							const amend_form = makeReplyCommentForm();
							const index = i == comment_list.length - 1 ? -1 : i;
							if(index != -1) {
								whole_comments.insertBefore(amend_form, whole_comments.children[index + 2]);
							} else {
								whole_comments.appendChild(amend_form);
							}
							comment_tag.classList.add("hidden");
							
							const input_wrapper = amend_form.querySelector(".input_wrapper");
							const amend_comment_contents = amend_form.querySelector(".comment_contents");
							const amend_comment_submit_button = amend_form.querySelector(".submit_comment");
							
							amend_comment_contents.innerText = comment_list[i].contents;
							input_wrapper.children[0].onclick = (event) => {
								if(event.target.checked == true) {
									amend_comment_contents.placeholder = principal.nickname + "(???)??? ?????? ??????...";
								} else {
									amend_comment_contents.placeholder = principal.name + "(???)??? ?????? ??????...";
								}
							}
							input_wrapper.children[1].onclick = () => input_wrapper.children[0].click();
							input_wrapper.children[0].click();
							amend_comment_contents.oninput = (event) => {
								activeCommentSubmitButton(event, amend_comment_submit_button);
							}
							amend_comment_submit_button.onclick = () => {
								amend_comment_submit_button.disabled = true;
								console.log(amend_comment_contents.value);
								console.log(article_id);
								console.log(input_wrapper.children[0].checked);
								console.log(comment_list[i].id);
								$.ajax({
									type: "put",
									url: "/api/v1/community/article/" + article_id + "/comment",
									data: {"id":comment_list[i].id,
												 "contents":amend_comment_contents.value,
												 "use_nickname":input_wrapper.children[0].checked,
												 "related_comment_id":comment_list[i].id},
									dataType: "json",
									success: function (data) {
										console.log(data);
										if(data == true) {
											location.reload();
										} else {
											alert("?????? ?????? ??????");
										}
									},
									error: function (xhr, status) {
										console.log(xhr);
										console.log(status);
									}
								});
							}
						}
						pop_up.children[1].onclick = () => {
							const modal = makeCommentDeleteConfirmModal();
							document.querySelector(".container").appendChild(modal);
							document.body.style = "overflow: hidden;";
							modal.querySelector(".cancel_button").onclick = () => {
								document.body.style = "";
								modal.remove();
							}
							modal.querySelector(".delete_button").onclick = (event) => {
								event.target.disabled = true;
								$.ajax({
									type: "delete",
									url: "/api/v1/community/article/" + article_id + "/comment/" + comment_list[i].id,
									dataType: "json",
									success: function (data) {
										if(data == true) {
											location.reload();
										} else {
											alert("?????? ?????? ??????");
										}
									},
									error: function (xhr, status) {
										console.log(xhr);
										console.log(status);
									}
								});
							}
						}
					} else {
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
								alert("????????????!");
								modal.remove();
								document.body.style = "";
							}
						}
					}
				} else {
					pop_up.remove();
				}
			}
			
			// ?????? ????????? ?????? ????????? 
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
						alert("?????? ????????? ?????? ??????");
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
					alert("?????? ????????? ??????");
				}
			}
			
			// ?????? ?????? ?????? ?????????
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
								reply_comment_contents.placeholder = principal.nickname + "(???)??? ?????? ??????...";
							} else {
								reply_comment_contents.placeholder = principal.name + "(???)??? ?????? ??????...";
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
										alert("?????? ?????? ??????");
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

function makeAmendCommentForm(comment) {
	const div = document.createElement("div");
	div.className = "comment_form";
	div.innerHTML = `
	    <form class="comment_textarea">
	        <div class="profile_image">
	            <img src="/static/images/default_profile_image.png">
	        </div>
	        <textarea name="contents" class="comment_contents" placeholder="${comment.nickname}(???)??? ?????? ??????..." value="${comment.contents}"></textarea>
	    </form>
	    <div class="buttons">
	        <div class="input_wrapper">
	            <input type="checkbox" class="register_to_nickname" checked="${comment.use_nickname}">
	            <span>??????????????? ??????</span>
	        </div>
	        <button type="button" class="submit_comment" disabled>??????</button>
	    </div>
	`;
	return div;
}

function makeReplyCommentForm() {
	const div = document.createElement("div");
	div.className = "comment_form";
	div.innerHTML = `
	    <form class="comment_textarea">
	        <div class="profile_image">
	            <img src="/static/images/default_profile_image.png">
	        </div>
	        <textarea name="contents" class="comment_contents" placeholder="??????(???)??? ?????? ??????..."></textarea>
	    </form>
	    <div class="buttons">
	        <div class="input_wrapper">
	            <input type="checkbox" class="register_to_nickname">
	            <span>??????????????? ??????</span>
	        </div>
	        <button type="button" class="submit_comment" disabled>??????</button>
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
		<span>????????? ????????? ????????????.</span>
		<span>??? ????????? ???????????????</span>
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
			console.log("?????? ????????? ??????");
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
          ${comment.user_id == 0 ? '<span class="article_writer">?????????</span>' : ''}
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

function makeDeletedCommentTag() {
	const div = document.createElement("div");
	div.className = "comment";
	div.innerHTML = `<div class="deleted">????????? ???????????????.</div>`;
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
          ${comment.user_id == 0 ? '<span class="article_writer">?????????</span>' : ''}
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
			<span>????????????</span>
		`;
		const related_comment_count = comment_list.filter(e => e.related_comment_id == comment.id).length;
		if(related_comment_count != 0) {
			reply_button.innerHTML += `<span>&nbsp;|&nbsp;<span class="reply_comment_count">${related_comment_count}</span>???</span>`;
		}
	}
	return div;                      
}

function makeCommentUploadTimeString(create_date) {
	const time_array = [31536000000, 		// 1???
										  	2592000000,			// 1???
										  		 86400000,			// ??????
										  		 	3600000,			// 1??????
										  		 		 60000,			// 1???
										  		 		 	1000];		// 1???
	const upload_time = new Date(create_date);
	const now = new Date();
	const ago = now - upload_time;
	
	if(ago > time_array[0]) {
		return `${Math.floor(ago / time_array[0])}??? ???`;
	} else if(ago > time_array[1]) {
		return `${Math.floor(ago / time_array[1])}?????? ???`;
	} else if(ago > time_array[2]) {
		return `${Math.floor(ago / time_array[2])}??? ???`;
	} else if(ago > time_array[3]) {
		return `${Math.floor(ago / time_array[3])}?????? ???`;
	} else if(ago > time_array[4]) {
		return `${Math.floor(ago / time_array[4])}??? ???`;
	} else {
		return `${Math.floor(ago / time_array[5])}??? ???`;
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
			// ????????? ?????? ?????? ??????
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
				alert("????????? ????????? ????????? ??????????????????.");
			}
		} else if(insertLike()) {
			article_data.like_flag = true;
			like_count_tag.innerText = Number(like_count_tag.innerText) + 1; 
			article_like_button.classList.add("pressed");
		} else {
			alert("????????? ???????????? ??????????????????.");
		}
	}
	
	const article_menu_button = article_detail_tag.querySelector(".article_menu_button");
	article_menu_button.onclick = () => {
		let pop_up = article_detail_tag.querySelector(".tags > .pop_up");
		if(pop_up == null) {
			if(principal == null || article_data.user_id != principal.id) {
				pop_up = makeCommentMenuPopup();
				article_detail_tag.querySelector(".tags").appendChild(pop_up);
				pop_up.children[1].onclick = () => {
					const modal = makeCommentReportModal();
					document.querySelector(".container").appendChild(modal);
					document.body.style = "overflow: hidden;";
					modal.querySelector(".cancel_button").onclick = () => {
						modal.remove();
						document.body.style = "";
					}
					modal.querySelector(".report_button").onclick = () => {
						alert("????????????!");
						modal.remove();
						document.body.style = "";
					}
				}
			} else {
				pop_up = makeArticleMenuPopupForUser();
				article_detail_tag.querySelector(".tags").appendChild(pop_up);
				
				pop_up.querySelector(".amend").onclick = () => {
					console.log("????????? ??????");
					let files = new Array();
					const modal = makeAmentArticleModal(article_data);
					let origin_images = new Array();
					article_images.forEach(e => origin_images.push(e));
					for(let i = 0; i < origin_images.length; i++) {
						const image_tag = makeImageTag("/image/article_images/" + origin_images[i]);
						const image_name = origin_images[i];
						modal.querySelector(".modal_image_wrapper").appendChild(image_tag);
						image_tag.querySelector(".delete_image_button").onclick = () => {
							origin_images.splice(origin_images.findIndex(e => e == image_name), 1);
							image_tag.remove();
							
							console.log(origin_images);
						}
					}
					if(origin_images.length > 0) modal.querySelector(".modal_image_wrapper").classList.add("active");
					
					document.querySelector(".container").appendChild(modal);
					document.body.style = "overflow: hidden;";
					modal.querySelector(".close_modal").onclick = () => {
						document.body.style = "";
						modal.remove();
					}
					
					const writer_name_tag = modal.querySelector(".writer");
					const use_nickname_checkbox = modal.querySelector(".use_nickname");
					const use_nickname_text = use_nickname_checkbox.nextElementSibling;
					use_nickname_checkbox.onclick = (event) => {
						if(event.target.checked) {
							writer_name_tag.innerText = `${principal.nickname}(?????????)`;
						} else {
							writer_name_tag.innerText = `${principal.name}(??????)`;
						}
					}
					use_nickname_text.onclick = () => use_nickname_checkbox.click();

					const tag_selector = modal.querySelector(".tag_selector");
					let is_opened_tag_selector = false;
					let tags = getTagsAbountSubCategory(article_data.sub_category_id);
					let selected_tag_index = tags.findIndex(e => e.tag_name == article_data.tag_name);
					
					tag_selector.onclick = (event) => {
						if(! is_opened_tag_selector) {
							const select_box = makeTagSelectBox(tags);
							event.target.parentElement.appendChild(select_box);
							const children = select_box.children;
							for(let i = 0; i < children.length; i++) {
								children[i].onclick = () => {
									selected_tag_index = i;
									tag_selector.innerText = children[i].innerText;
									tag_selector.classList.remove("clicked");
									select_box.remove();
									is_opened_tag_selector = false;
								}
							}
							tag_selector.classList.add("clicked");
							is_opened_tag_selector = true;
						} else {
							tag_selector.classList.remove("clicked");
							modal.querySelector(".tags").remove();
							is_opened_tag_selector = false;
						}
					}
					
					const add_image_button = modal.querySelector(".add_image_button"); 
					const file_input = modal.querySelector("input[name='file']");
					const modal_image_wrapper = modal.querySelector(".modal_image_wrapper");
					add_image_button.onclick = () => file_input.click();
					file_input.onchange = (event) => {
						loadUploadFiles(event, modal_image_wrapper, origin_images, files);
					}
					
					const title_input_tag = modal.querySelector("input[name='title']");
					const contents_area_tag = modal.querySelector("textarea[name='contents']");
					const insert_article_button = modal.querySelector(".register_article_button");
					insert_article_button.onclick = () => {
						if(selected_tag_index == -1 ||
							title_input_tag.value == "" ||
							contents_area_tag.value == "") {
							alert("????????? ????????? ????????? ??????????????????.");	
						} else {
							const form_data = new FormData();
							form_data.append("sub_category_id", article_data.sub_category_id);
							form_data.append("article_tag_id", tags[selected_tag_index].id);
							form_data.append("title", title_input_tag.value);
							form_data.append("contents", contents_area_tag.value);
							form_data.append("use_nickname", use_nickname_checkbox.checked);
							console.log("new images");
							for(let i = 0; i < files.length; i++) {
								form_data.append("files", files[i]);
								console.log(files[i]);
							}
							const delete_images = new Array();
							for(let i = 0; i < article_images.length; i++) {
								console.log(origin_images.findIndex(e => e == article_images[i]));
								if(origin_images.findIndex(e => e == article_images[i]) == -1) {
									form_data.append("delete_file_names", article_images[i]);
									delete_images.push(article_images[i]);
								}
							}
							console.log("delete target images");
							console.log(delete_images);
							$.ajax({
								type: "put",
								url: "/api/v1/community/article/" + article_data.id,
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
				}
				pop_up.querySelector(".delete").onclick = () => {
					console.log("????????? ??????");
					const modal = makeArticleDeleteConfirmModal();
					document.querySelector(".container").appendChild(modal);
					document.body.style = "overflow: hidden;";
					modal.querySelector(".cancel_button").onclick = () => {
						document.body.style = "";
						modal.remove();
					}
					
					modal.querySelector(".delete_button").onclick = () => {
						$.ajax({
							type: "delete",
							url: "/api/v1/community/article/" + article_id,
							dataType: "json",
							success: function (data) {
								if(data == true) {
									alert("????????? ????????? ?????????????????????.");
									location.href = "/community";
								} else {
									alert("????????? ?????? ??????");
								}
							},
							error: function (xhr, status) {
								console.log(xhr);
								console.log(status);
							}
						});
					}
				}
				pop_up.querySelector(".share").onclick = () => {
					console.log("????????? ??????");
				}
			}
		} else {
			pop_up.remove();
		}
	}
}

function makeTagSelectBox(tags) {
	const div = document.createElement("div");
	div.className = "tags";
	for(let i = 0; i < tags.length; i++) {
		div.innerHTML += `<div class="tag">${tags[i].tag_name}</div>`;
	}
	return div;
}

function loadUploadFiles(event, modal_image_wrapper, origin_images, files) {
	if(event.target.files.length + origin_images.length + files.length > 10) {
		alert("????????? 10???????????? ????????? ??? ????????????.");
		return;
	}
	for(let i = 0; i < event.target.files.length; i++) {
		const fileReader = new FileReader();
		fileReader.onloadend = (e) => {
			modal_image_wrapper.classList.add("active");
			files.push(event.target.files[i]);
			const file_name = event.target.files[i].name;
			
			const image_tag = makeImageTag(e.target.result);
			modal_image_wrapper.appendChild(image_tag);
			image_tag.querySelector(".delete_image_button").onclick = () => {
				image_tag.remove();
				files = files.filter(file => file.name != file_name);
			}
		}
		
		fileReader.readAsDataURL(event.target.files[i]);
	}
}

function makeImageTag(img_src) {
	const div = document.createElement("div");
	div.className = "image_box";
	div.innerHTML = `
		<img class="image" src="${img_src}">
		<span class="hover_blind"></span>
		<button type="button" class="delete_image_button">
			<img src="/static/images/insert_new_article_delete_image_button.svg">
		</button>
	`;
	return div;
}

function getTagsAbountSubCategory(sub_category_id) {
	let tags;
	$.ajax({
		type: "get",
		url: "/api/v1/community/" + sub_category_id + "/tag/list",
		async: false,
		dataType: "json",
		success: function (tag_list) {
			console.log(tag_list);
			tags = tag_list;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return tags;
}

function makeAmentArticleModal(article_data) {
	const placeholder_message = getTextAreaPlaceholderMessage(article_data.sub_category_id);
	const div = document.createElement("div");
	div.className = "modal";
	div.innerHTML = `
		<div class="window register_article">
			<div class="title">????????? ??????</div>
			<div class="writer">${article_data.nickname}(${article_data.use_nickname == true ? '?????????' : '??????'})</div>
			<hr>
			<form>
				<div class="row active disabled">
					<div class="community_selector">${article_data.category_name}</div>
				</div>
				<div class="row active">
					<div class="tag_selector">${article_data.tag_name}</div>
				</div>
				<input type="text" class="article_title" name="title" placeholder="????????? ???????????????" value="${article_data.title}">
				<textarea class="article_contents" name="contents" placeholder="${placeholder_message}">${article_data.contents}</textarea>
				<div class="row active">
					<button type="button" class="add_image_button">
						<span class="text">?????? ??????</span>
						<img src="/static/images/insert_new_article_add_image_button.svg">
						<input type="file" name="file" accept=".jpg, .png, .jpeg" multiple>
					</button>
				</div>
				<div class="modal_image_wrapper"></div>
				<div class="buttons">
					<div class="checkbox_wrapper">
						<input type="checkbox" class="use_nickname" ${article_data.use_nickname == true ? 'checked' : ''}>
						<span class="text">??????????????? ??????</span>
					</div>
					<div class="button_wrapper">
						<button type="button" class="close_modal">??????</button>
						<button type="button" class="register_article_button">??????</button>
					</div>
				</div>
			</form>
		</div>
	`;
	return div;
}

function getTextAreaPlaceholderMessage(category_id) {
	return category_id < 9 ? "????????? ???????????????" : 
				  category_id > 48 ? "????????? ???????????????\n\n* ?????????, ???????????? ??? ???????????? ???????????? ?????????\n* ???????????? ?????????, ????????? ????????? ?????? ????????????" : 
				  category_id > 8 ? "????????? ???????????????\n\n* ?????? ??? ?????? ???????????? ???????????? ????????????\n* ????????? ?????????, ?????? ?????????, ????????? ????????????\n* ???????????? ?????????, ????????? ????????? ?????? ????????????" : "????????? ???????????????";
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
				<span class="text">??? ????????? ????????? ???????????? ??? ????????????.</span>
				<span class="text">???????????? ?????????????????????????</span>
			</div>
			<span class="login_link">?????? ????????????????&nbsp;<a href="/auth/signin">????????? ??????</a></span>
			<div class="buttons">
				<button type="button" class="close_modal">??????</button>
				<button type="button" class="to_signup_button">????????????</button>
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