const uri = location.href.substring(location.href.indexOf("#") + 1, location.href.length);
const uris = uri.split("&");
const access_token = "Bearer " + uris[0].split("=")[1];
console.log(access_token);

const naver_id_login = new naver.LoginWithNaverId({
	clientId: "9_dnPO2aAshpkXkjaOfQ",
	callbackUrl: "http://localhost:8080/user/setting/redirect/naver/oauth",
	isPopup: true,
	loginButton: {color: "white", type: 3, height: "38"},
	callBackHandle: true 
});

window.onload = () => {
	console.log(naver_id_login);
	naver_id_login.getLoginStatus(status => {
		console.log(status);
		if(status) {
			alert(status)
			window.close();
			/*const result = insertNewOauthDetail();
			if(result) {
				window.returnValue = true;
				window.close();
			} else {
				window.returnValue = false;
				window.close();
			}*/
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