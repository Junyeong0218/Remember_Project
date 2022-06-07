console.log(request_flag);

loadTotalArticleCount();

function loadTotalArticleCount() {
	const url = request_flag == "" ? "/api/v1/community/all/count" : "/api/v1/community" + request_flag + "/count"; 
	$.ajax({
		type: "get",
		url: url,
		dataType: "text",
		success: function (count) {
			console.log(Number(count));
		},
		error: function (xhr, error) {
			console.log(xhr);
			console.log(error);
		}
	});
}