if(isConnectors()) {
	const button = makeLinkButton();
	document.querySelector("header .logo").appendChild(button);
	
	button.onclick = () => location.href = "/now/upload";
}

function getPrincipal() {
	let principal;
	$.ajax({
		type: "get",
		url: "/api/v1/auth/principal",
		async: false,
		dataType: "json",
		success: function (data) {
			principal = data;
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