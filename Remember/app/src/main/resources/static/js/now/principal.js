if(isConnectors()) {
	setTimeout(() => {
		const button = makeLinkButton();
		document.querySelector("header .logo").appendChild(button);
		
		button.onclick = () => location.href = "/now/upload";
	}, 0);
}

function getPrincipal() {
	let principal;
	$.ajax({
		type: "get",
		url: "/api/v1/auth/principal",
		async: false,
		dataType: "json",
		success: function (response) {
			if(response.code == 0) {
				principal = response.data;
			} else {
				alert(response.message);
			}
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});
	return principal;
}

function isConnectors() {
	const principal = getPrincipal();
	if(principal == null || ! principal.role.includes("CONNECTORS")) {
		return false;
	} else {
		return true;
	}
}

function makeLinkButton() {
	const button = document.createElement("button");
	button.type = "button";
	button.innerHTML = `글 작성`;
	return button;
}