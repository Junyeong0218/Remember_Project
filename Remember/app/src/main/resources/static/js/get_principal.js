let principal = getPrincipal();

function getPrincipal() {
	let user_data;
	$.ajax({
		type: "get",
		url: "/api/v1/auth/principal",
		async: false,
		dataType: "json",
		success: function (data) {
			console.log(data);
			user_data = data;
		},
		error: function (xhr, status) {
			console.log(xhr);
			console.log(status);
			user_data = null;
		}
	});
	return user_data;
}