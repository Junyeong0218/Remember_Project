
const qna_button = document.querySelector(".qna_title img");
const qna_title= document.querySelector(".qna_box");

qna_button.onclick = () => {
	qna_button.classList.toggle("deg");
	let answer = qna_title.querySelector(".qna_answer");
	if(answer == null) {
		answer = makeAnswerTag();
		qna_title.appendChild(answer);
	} else {
		answer.remove();
	}
};
	


function makeAnswerTag(){
	const div = document.createElement('div');
	div.className="qna_answer";
	div.innerHTML=`
	<div class="answer_box">
        <div div class="answer">A.</div>
        <div class="answer">아니오, 명함으로 연결된 회원님들께 프로필이 공개되지 않습니다.프로필은 리멤버에서 승인한 기업의 채용담당자와 헤드헌터만볼 수 있습니다.</div>
    </div>
`;
	return div;
}

