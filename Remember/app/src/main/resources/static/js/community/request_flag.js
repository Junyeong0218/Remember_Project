const uri = location.pathname;
let request_flag = "";

if(uri.includes("/insight")) {
	request_flag = "/insight";
} else if(uri.includes("/job")) {
	request_flag = "/job";
} else if(uri.includes("/subject")) {
	request_flag = "/subject";
}