const signin_box = document.querySelector(".signin_box");
const signup_box = document.querySelector(".signup_box");

signin_box.onclick = () => location.href = "/auth/company/signin";
signup_box.onclick = () => location.href = "/auth/company/signup";