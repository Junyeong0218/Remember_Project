
const main_contents = document.querySelector(".main_contents");
const user_delete = document.querySelector(".contents.delete");
const setting_button = document.querySelector(".setting_list.set");

const email = document.querySelector('.item_description.mail');
const phone = document.querySelector('.item_description.phone');

email.innerText = principal.email;
phone.innerText = principal.phone;

setting_button.onclick = () => location.reload();

document.querySelector(".contents.password").onclick = () => {
	const update_password_modal = makeUpdatePasswordModal();
	appendModalToContainer(update_password_modal);
	
	update_password_modal.querySelector(".close_modal").onclick = () => removeModal(update_password_modal);
}

user_delete.onclick = () => {
	const user_delete_tag = makeUserDeleteTag();
	replaceTagInMainContents(user_delete_tag);
	
	const delete_user_button = user_delete_tag.querySelector('#delete_user_button');
	user_delete_tag.querySelector('.input_wrapper > input').onclick = (event) => {
		if(event.target.checked) {
			delete_user_button.disabled = false;
		} else {
			delete_user_button.disabled = true;
		}
	}
	
	delete_user_button.onclick = () => {
		const delete_user_modal = makeDeleteUserModal();
		appendModalToContainer(delete_user_modal);
		
		const delete_opinion_selector = delete_user_modal.querySelector(".delete_opinion_selector");
        const opinion_list = delete_user_modal.querySelector('.opinion_list');

        delete_user_modal.querySelector(".close_modal").onclick = () => removeModal(delete_user_modal);
        delete_user_modal.querySelector(".cancel_button").onclick = () => removeModal(delete_user_modal);

        delete_opinion_selector.onclick = () => opinion_list.classList.toggle('hidden');

        file_types = opinion_list.querySelectorAll("span");
        file_types.forEach(e => e.onclick = () => {
            delete_opinion_selector.querySelector("span").innerText = e.innerText;
            opinion_list.classList.add("hidden");
        });
        
        const submit_button =  delete_user_modal.querySelector(".submit_button");
        submit_button.onclick = () => {
			if(ajax.deleteUserData(principal.id)) {
				location.reload();	
			}else {
				alert("탈퇴 실패");
			}
		}
	}
}