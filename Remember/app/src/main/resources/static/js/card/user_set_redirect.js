const uri = location.href.substring(location.href.indexOf("#") + 1, location.href.length);
const uris = uri.split("&");
const access_token = "Bearer " + uris[0].split("=")[1];
console.log(access_token);

let naver_id_login = new naver.LoginWithNaverId({
	clientId: "9_dnPO2aAshpkXkjaOfQ",
	callbackUrl: "http://localhost:8080/user/setting/redirect/naver/oauth",
	isPopup: false,
	callBackHandle: true,
	accessToken: access_token
});

window.onload = () => {
	naver_id_login.init();
	
	console.log(naver_id_login);
	naver_id_login.getLoginStatus(status => {
		console.log(status);
		if(status) {
			console.log(status);
			console.log(naver_id_login.user.id);
			window.opener.getNaverLoginId(naver_id_login.user.id);
			window.close();
		}
	});
}

function insertNewOauthDetail() {
	oauth_id = "naver_" + naver_id_login.user.id;
	let flag = false;
	$.ajax({
		type: "post",
		url: "/api/v1/auth/user/" + principal.id + "/oauth",
		async: false,
		data: {"oauth_username": oauth_id,
					 "provider": "naver"},
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