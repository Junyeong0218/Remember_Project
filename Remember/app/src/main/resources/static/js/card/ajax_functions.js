const ajax = {
	// insert functions
	insertNewCard: (data) => 																											insertNewCard(data),
	insertNewGroup: (group_name) => 																							insertNewGroup(group_name),
	insertNewTeam: (data) => 																											insertNewTeam(data),
	insertCardMemo: (card_id, contents) => 																				insertCardMemo(card_id, contents),
	insertTeamGroup: (selected_card_book_id, group_name) => 											insertTeamGroup(selected_card_book_id, group_name),
	insertTeamCardToPersonal: (team_card_id, memo_include_flag) => 								insertTeamCardToPersonal(team_card_id, memo_include_flag),
	insertTeamCardsToPersonal: (team_card_id_list, memo_include_flag) => 					insertTeamCardsToPersonal(team_card_id_list, memo_include_flag),
	insertTeamCardsToPersonal: (team_card_id_list, memo_include_flag) => 					insertTeamCardsToPersonal(team_card_id_list, memo_include_flag),
	insertAllTeamCardsInGroupToPersonal: (team_group_id, not_selected_card_id_list, memo_include_flag) => 
																																								insertAllTeamCardsInGroupToPersonal(team_group_id, not_selected_card_id_list, memo_include_flag),
	insertAllTeamCardsInCardBookToPersonal: (team_card_book_id, not_selected_card_id_list, memo_include_flag) => 
																																								insertAllTeamCardsInCardBookToPersonal(team_card_book_id, not_selected_card_id_list, memo_include_flag),
	
	// select functions
	isTeamJoined: () => 																														isTeamJoined(),
	loadUserGroups: () => 																													loadUserGroups(),
	loadCardsInAllGroups: (page) => 																								loadCardsInAllGroups(page),
	loadCardsInSpecificGroup: (group_id, page) => 																	loadCardsInSpecificGroup(group_id, page),
	loadCardDetail: (card_id) => 																										loadCardDetail(card_id),
	loadPrincipalProfile: () => 																											loadPrincipalProfile(),
	loadTeams: () => 																																loadTeams(),
	loadCardBooks: (selected_team_id) => 																					loadCardBooks(selected_team_id),
	loadTeamGroups: (selected_card_book_id) => 																		loadTeamGroups(selected_card_book_id),
	loadTeamCardsInCardBook: (selected_card_book_id, page, card_order_flag) =>	loadTeamCardsInCardBook(selected_card_book_id, page, card_order_flag),
	loadTeamCardsInSpecificGroup: (selected_group_id, page, card_order_flag) => 	loadTeamCardsInSpecificGroup(selected_group_id, page, card_order_flag),
	loadTeamMembers: (selected_team_id, page) => 																	loadTeamMembers(selected_team_id, page),
	loadCardBookJoinMembers: (selected_card_book_id, page) => 									loadCardBookJoinMembers(selected_card_book_id, page),
	loadTeamGroupBelongFlags: (card_id) => 																				loadCardBookJoinMembers(card_id),
	loadTeamGroupBelongFlagsForCards: (card_id_list) => 													loadTeamGroupBelongFlagsForCards(card_id_list),
	loadCardEmails: (card_id_list) => 																								loadCardEmails(card_id_list),
	loadCardEmailsInGroup: (team_group_id, not_selected_card_id_list) => 						loadCardEmailsInGroup(team_group_id, not_selected_card_id_list),
	loadCardEmailsInCardBook: (team_card_book_id, not_selected_card_id_list) => 	loadCardEmailsInCardBook(team_card_book_id, not_selected_card_id_list),
	
	// update functions
	updateGroupName: (group_id, group_name) => 																	updateGroupName(group_id, group_name),
	updateCard: (card_id, formdata) => 																						updateCard(card_id, formdata),
	updateCardMemo: (card_memo_id, contents) => 																updateCardMemo(card_memo_id, contents),
	updateCardsBelongGroups: (card_id_list, group_id_list, default_group_id) => 			updateCardsBelongGroups(card_id_list, group_id_list, default_group_id),
	updateTeamName: (team_id, title) => 																						updateTeamName(team_id, title),
	updateProfileNickname: (team_profile_id, nickname) => 													updateProfileNickname(team_profile_id, nickname),
	updateCardBookName: (selected_card_book_id, card_book_name) => 						updateCardBookName(selected_card_book_id, card_book_name),
	updateTeamCardBelongTeamGroup: (card_id, data) => 													updateTeamCardBelongTeamGroup(card_id, data),
	updateTeamCardsBelongTeamGroup: (data) => 																	updateTeamCardsBelongTeamGroup(data),
	
	// delete functions
	deleteGroup: (group_id) => 																											deleteGroup(group_id),
	deleteCard: (card_id) => 																												deleteCard(card_id),
	deleteCards: (card_id_list) => 																									deleteCards(card_id_list),
	deleteCardMemo: (card_memo_id) => 																						deleteCardMemo(card_memo_id),
	deleteTeam: (selected_team_id) => 																							deleteTeam(selected_team_id),
	leaveTeam: (selected_team_id) => 																								leaveTeam(selected_team_id),
	deleteAllCardsInTeamGroup: (selected_group_id, not_selected_card_id_list) => 		deleteAllCardsInTeamGroup(selected_group_id, not_selected_card_id_list),
	deleteAllCardsInCardBook: (selected_card_book_id, not_selected_card_id_list) => deleteAllCardsInCardBook(selected_card_book_id, not_selected_card_id_list),
}

// ============================================================================================================================
// 																											insert functions
// ============================================================================================================================

function insertNewGroup(group_name) {
	let group_id;
    $.ajax({
        type: 'post',
        url: '/api/v1/card/group',
        async: false,
        data: {"group_name": group_name},
        dataType: 'json',
        success: function (data) {
            group_id = data;
        },
        error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return group_id;
}

function insertNewCard(data) {
	let card_id;
	$.ajax({
		type:'post',
		url:'/api/v1/card',
		async: false,
		data: data,
		dataType:'json',
		success:function(data){
			card_id = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return card_id;
}

function insertCardMemo(card_id, contents) {
	let flag = false;
	const url = location.pathname.includes("team") ? "/api/v1/card/team/card/" + card_id + "/memo" : "/api/v1/card/" + card_id + "/memo";
	$.ajax({
		type: "post",
		url: url,
		async: false,
		data: {"contents":contents},
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

function insertNewTeam(data) {
	let flag  = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/team",
		async: false,
		data: data,
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

function insertTeamGroup(selected_card_book_id, group_name) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/team/book/" + selected_card_book_id,
		async: false,
		data: {"group_name":group_name},
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

function insertTeamCardToPersonal(team_card_id, memo_include_flag) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/team/card/" + team_card_id + "/to-personal",
		async: false,
		data: {"memo_include_flag":memo_include_flag},
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

function insertTeamCardsToPersonal(team_card_id_list, memo_include_flag) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/team/cards/to-personal",
		async: false,
		data: {"card_id_list":team_card_id_list,
					"memo_include_flag":memo_include_flag},
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

function insertAllTeamCardsInGroupToPersonal(team_group_id, not_selected_card_id_list, memo_include_flag) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/team/group/" + team_group_id + "/cards/to-personal",
		async: false,
		data: {"not_selected_card_id_list":not_selected_card_id_list,
					"memo_include_flag":memo_include_flag},
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

function insertAllTeamCardsInCardBookToPersonal(team_card_book_id, not_selected_card_id_list, memo_include_flag) {
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/card/team/book/" + team_card_book_id + "/cards/to-personal",
		async: false,
		data: {"not_selected_card_id_list":not_selected_card_id_list,
					"memo_include_flag":memo_include_flag},
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

// ============================================================================================================================
// 																											select functions
// ============================================================================================================================

function isTeamJoined() {
	let flag = false;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/user/" + principal.id,
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

function loadUserGroups() {
	let groups;
    $.ajax({
        type: 'get',
        url: '/api/v1/card/group',
        async: false,
        dataType: 'json',
        success: function (data) {
			groups = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return groups;
}

function loadCardsInAllGroups() {
	let cards;
    $.ajax({
        type: "get",
        url: "/api/v1/card/list",
        async: false,
        data: {"page" : page},
        dataType: 'json',
        success: function (data) {
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function loadCardsInSpecificGroup(group_id) {
	let cards;
    $.ajax({
        type: "get",
        url: "/api/v1/card/group/" + group_id,
        async: false,
        dataType: "json",
        success: function (data) {
			cards = data.card_list;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function loadCardDetail(card_id) {
	let card_detail;
	const url = location.pathname.includes("team") ? "/api/v1/card/team/card/" + card_id : "/api/v1/card/" + card_id;
	$.ajax({
		type: "get",
		url: url,
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			card_detail = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return card_detail;
}

function loadPrincipalProfile() {
	let profile;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/profile",
		async: false,
		dataType: "json",
		success: function (data) {
			profile = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return profile;
}

function loadTeams() {
	let team_list;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/list",
		async: false,
		dataType: "json",
		success: function (data) {
			team_list = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return team_list;
}

function loadCardBooks(selected_team_id) {
	let book_list;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/" + selected_team_id + "/book/list",
		async: false,
		dataType: "json",
		success: function (data) {
			book_list = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return book_list;
}

function loadTeamGroups(selected_card_book_id) {
	let groups;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + selected_card_book_id + "/group/list",
		async: false,
		dataType: "json",
		success: function (data) {
			groups = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return groups;
}

function loadTeamCardsInCardBook(selected_card_book_id, page, card_order_flag) {
	let cards;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + selected_card_book_id + "/card/list",
		async: false,
		data: {"page":page,
					 "card_order_flag":card_order_flag},
		dataType: "json",
		success: function (data) {
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function loadTeamCardsInSpecificGroup(selected_group_id, page, card_order_flag) {
	let cards;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/group/" + selected_group_id + "/card/list",
		async: false,
		data: {"page":page,
					 "card_order_flag":card_order_flag},
		dataType: "json",
		success: function (data) {
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function loadTeamMembers(selected_team_id, page) {
	let team_members;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/" + selected_team_id + "/member/list",
		async: false,
		data: {"page":page},
		dataType: "json",
		success: function (data) {
			team_members = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return team_members;
}

function loadCardBookJoinMembers(selected_card_book_id, page) {
	let card_book_members;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + selected_card_book_id + "/member/list",
		async: false,
		data: {"page":page},
		dataType: "json",
		success: function (data) {
			card_book_members = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return card_book_members;
}

function loadTeamGroupBelongFlags(card_id) {
	let group_belong_flags;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/card/" + card_id + "/belong",
		async: false,
		dataType: "json",
		success: function (data) {
			group_belong_flags = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return group_belong_flags;
}

function loadTeamGroupBelongFlagsForCards(card_id_list) {
	let group_belong_flags;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/cards/belong",
		async: false,
		data: {"card_id_list":card_id_list},
		dataType: "json",
		success: function (data) {
			group_belong_flags = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return group_belong_flags;
}

function loadCardEmails(card_id_list) {
	let cards;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/cards/email",
		async: false,
		data: {"card_id_list":card_id_list},
		dataType: "json",
		success: function (data) {
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function loadCardEmailsInGroup(team_group_id, not_selected_card_id_list) {
	let cards;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/group/" + team_group_id + "/cards/email",
		async: false,
		data: {"not_selected_id_list":not_selected_card_id_list},
		dataType: "json",
		success: function (data) {
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

function loadCardEmailsInCardBook(team_card_book_id, not_selected_card_id_list) {
	let cards;
	$.ajax({
		type: "get",
		url: "/api/v1/card/team/book/" + team_card_book_id + "/cards/email",
		async: false,
		data: {"not_selected_id_list":not_selected_card_id_list},
		dataType: "json",
		success: function (data) {
			cards = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return cards;
}

// ============================================================================================================================
// 																											update functions
// ============================================================================================================================

function updateGroupName(group_id, group_name) {
	let flag = false;
	$.ajax({
		type:'put',
		url:'/api/v1/card/group/' + group_id,
		async: false,
		dataType:'json',
		data:{"group_name":group_name},
		success:function(data) {
			flag = data;
		},
	    error: function (xhr, status) {
	        console.log(xhr);
	        console.log(status);
	    }
	});
	return flag;
}

function updateCard(card_id, formdata) {
	let flag = false;
	const url = location.pathname.includes("team") ? "/api/v1/card/team/card/" + card_id : "/api/v1/card/" + card_id;
	$.ajax({
		type:'put',
		url: url,
		async: false,
		data: formdata,
		encType: "multipart/form-data",
		processData: false,
		contentType: false,
		dataType:'json',
		success: function (data) {
			flag = data;
		},
		error: function (xhr, stauts) {
		console.log(xhr);
		console.log(stauts);
		}
	});
	return flag;	
}

function updateCardMemo(card_memo_id,contents) {
	let flag = false;
	const url = location.pathname.includes("team") ? "/api/v1/card/team/memo/" + card_memo_id : "/api/v1/card/memo/" + card_memo_id; 
	$.ajax({
		type:'put',
		url: url,
		async: false,
		data:{"contents":contents},
		success: function (data) {
			flag = data;
		},
		error: function (xhr, stauts) {
		console.log(xhr);
		console.log(stauts);
		}
	});
	return flag;
}

function updateCardsBelongGroups(card_id_list, group_id_list, default_card_group_id) {
	let flag = false;
	$.ajax({
		type:'put',
		url:'/api/v1/card/belong',
		async: false,
		data:{
			"card_id_list":card_id_list,
			"group_id_list":group_id_list,
			"default_card_group_id":default_card_group_id
		},
		dataType:'json',
		success:function(data){
			flag = data;
		},
        error: function (xhr, status) {
            console.log(xhr);
            console.log(status);
        }
	});
	return flag;
}

function updateTeamName(team_id, title) {
	let flag = false;
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/" + team_id,
		async: false,
		data: {"title":title},
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

function updateProfileNickname(team_profile_id, nickname) {
	let flag = false;
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/profile/" + team_profile_id,
		async: false,
		data: {"nickname":nickname},
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

function updateCardBookName(selected_card_book_id, card_book_name) {
	let flag = false;
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/book/" + selected_card_book_id,
		async: false,
		data: {"card_book_name":card_book_name},
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

function updateTeamCardBelongTeamGroup(card_id, data) {
	let flag = false;
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/card/" + card_id + "/belong",
		async: false,
		data: data,
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

function updateTeamCardsBelongTeamGroup(data) {
	let flag = false;
	$.ajax({
		type: "put",
		url: "/api/v1/card/team/cards/belong",
		async: false,
		data: data,
		dataType: "json",
		success: function (data) {
			flag = data;
		},
		error: function (xhr, status) {
			consoe.log(xhr);
			consoe.log(status);
		}
	});
	return flag;
}

// ============================================================================================================================
// 																											delete functions
// ============================================================================================================================

function deleteGroup(group_id) {
	let flag = false;
	$.ajax({
		type:'delete',
		url:'/api/v1/card/group/' + group_id,
		async: false,
		dataType:'json',
		success:function(data) {
			flag = data;
		},
	    error: function (xhr, status) {
	        console.log(xhr);
	        console.log(status);
	    }
	});
	return flag;
}

function deleteCard(card_id) {
	let flag;
	const url = location.pathname.includes("team") ? "/api/v1/card/team/card/" + card_id : "/api/v1/card/" + card_id;
	$.ajax({
		type:"delete",
		url: url,
		async: false,
		dataType:"json",
		success:function(data){
			flag = data;
		},
		error: function (xhr, stauts) {
			console.log(xhr);
			console.log(stauts);
		}
	});
	return flag;
}

function deleteCards(card_id_list) {
	let flag = false;
	const url = location.pathname.includes("team") ? "/api/v1/card/team/cards" : "/api/v1/card/list";
	const data = {"card_id_list":new Array()};
	card_id_list.forEach(e => data.card_id_list.push(e));
	$.ajax({
		type:'delete',
		url: url,
		async: false,
		data: data,
		dataType:'json',
		success:function (data) {
			flag = data;
		},
		error: function (xhr, stauts) {
		console.log(xhr);
		console.log(stauts);
		}
	});
	return flag;
}

function deleteCardMemo(card_memo_id) {
	let flag = false;
	const url = location.pathname.includes("team") ? "/api/v1/card/team/memo/" + card_memo_id : "/api/v1/card/memo/" + card_memo_id; 
	$.ajax({
		type: "delete",
		url: url,
		async: false,
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

function deleteTeam(selected_team_id) {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/" + selected_team_id,
		async: false,
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

function leaveTeam(selected_team_id) {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/" + selected_team_id + "/entry",
		async: false,
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

function deleteAllCardsInTeamGroup(selected_group_id, not_selected_card_id_list) {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/group/" + selected_group_id + "/cards",
		async: false,
		data: {"card_id_list":not_selected_card_id_list},
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

function deleteAllCardsInCardBook(selected_card_book_id, not_selected_card_id_list) {
	let flag = false;
	$.ajax({
		type: "delete",
		url: "/api/v1/card/team/book/" + selected_card_book_id + "/cards",
		async: false,
		data: {"card_id_list":not_selected_card_id_list},
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

// ============================================================================================================================
// 																											start team functions
// ============================================================================================================================

/*function deleteCards(card_id_list) {
	let flag = false;
	$.ajax({
		type: "delete",
		url: ,
		async: false,
		data: {"card_id_list":card_id_list},
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
}*/