# 리멤버 팀 프로젝트
> 리멤버라는 웹 사이트를 클론 코딩하는 팀 프로젝트입니다.<br>
> 리멤버는 대표적으로 개인, 팀 단위의 명함 관리 및 커뮤니티 기능이 있습니다.
<br>

![image](https://user-images.githubusercontent.com/94529254/182822664-c99c39b6-c658-4408-84a6-1964611f9952.png)

<br>

## 사용 기술 스택
<p>
  <img src="https://img.shields.io/badge/HTML-e34f26?style=flat-square&logo=HTML5&logoColor=white">&nbsp;
  <img src="https://img.shields.io/badge/Javascript-f7df1e?style=flat-square&logo=Javascript&logoColor=black">&nbsp;
  <img src="https://img.shields.io/badge/CSS-1572b6?style=flat-square&logo=css3&logoColor=white">&nbsp;
</p>
<p>
  <img src="https://img.shields.io/badge/Java-007396?style=flat-square&logo=Java&logoColor=white">&nbsp;
  <img src="https://img.shields.io/badge/SpringBoot-6db33f?style=flat-square&logo=Spring%20Boot&logoColor=white">&nbsp;
  <img src="https://img.shields.io/badge/MariaBD-1f305f?style=flat-square&logo=MariaDB%20Foundation&logoColor=white">&nbsp;
  <img src="https://img.shields.io/badge/MyBatis-6f4c5b?style=flat-square&logo=Java&logoColor=white">&nbsp;
</p>

## 구현 기능
### 휴대전화 인증 기능
> coolsms 서비스와 HashMap을 이용하여 인증코드 문자 전송 및 서버에서 인증 처리

![image](https://user-images.githubusercontent.com/94529254/182834464-af562303-1cfd-4aa8-9dca-5598352ee871.png)

<br>

### 간편 로그인 개별 연동 기능
> 로그인에서도 간편 로그인이 가능하지만, 설정 화면에서 어떤 provider와 연동중인지 확인이 가능하며 연동취소 및 연동하는 것이 가능

![간편1](https://user-images.githubusercontent.com/94529254/182838060-07d1f4aa-3f49-40b9-8547-13c1ecaf1389.png)
![간편2](https://user-images.githubusercontent.com/94529254/182838075-3f3910fc-9f80-48f7-9b6b-ead625f62ca7.png)

<br>

### 커뮤니티
> 카테고리에 가입해야만 게시글 작성이 가능하며 좋아요, 댓글, 답글, 댓글 좋아요, 댓글 정렬 가능<br>
> 좌측에서 카테고리 가입 여부 및 미가입한 경우 가입하기 버튼 / 게시글 리스트 및 베스트 게시글 출력

![image](https://user-images.githubusercontent.com/94529254/182838897-2cacf3ff-3a23-465b-b8e3-734cfb7e6c6a.png)

> 게시글 상세 페이지

![image](https://user-images.githubusercontent.com/94529254/182838494-cf8c3dad-0d7c-487c-bc37-6d8164568d07.png)

> 댓글달기 폼 및 게시글에 달린 댓글 조회

![image](https://user-images.githubusercontent.com/94529254/182838633-3e1de91a-a03c-4709-8ee5-10f5c3854cbe.png)

> 게시글 작성 폼

![image](https://user-images.githubusercontent.com/94529254/182839513-e54e7daa-ef0e-4d6f-97ed-c03ceeec01ab.png)

<br>

### 개인 명함첩 관리
> 직접 입력을 통해 명함을 등록하고 그룹별 관리 및 메모, 사진 등록 가능

![image](https://user-images.githubusercontent.com/94529254/182840346-6dad780f-715b-4cd9-845c-6fe1dc5231dd.png)

> 명함 상세

![image](https://user-images.githubusercontent.com/94529254/182840399-2aa38759-eacf-43c6-b780-fea73819e544.png)

> 팀 명함첩으로 이동 모달

![image](https://user-images.githubusercontent.com/94529254/182840773-b20eca4e-4777-44a7-a4ee-f63a96bac075.png)

> 명함 편집

![image](https://user-images.githubusercontent.com/94529254/182840825-416e4737-c416-49be-aec1-ab785985e4b1.png)

<br>

### 팀 단위 명함첩 관리
> 직접 입력을 통해 명합을 등록하거나, 개인 명함첩에서 팀 명함첩으로 이동 가능, 개인 명함첩과 같은 기능 제공<br>
> 팀 생성 화면

![image](https://user-images.githubusercontent.com/94529254/182841373-4f2f7df8-6a55-4839-9e9a-e34af960aaf1.png)
![image](https://user-images.githubusercontent.com/94529254/182841442-ab5dd31c-ef43-4a2a-9b76-cd7453b76fb6.png)

> 팀 기본 화면

![image](https://user-images.githubusercontent.com/94529254/182841687-6691f59d-054a-4e20-9a74-76058d6b3286.png)

<br>

### 결제 기능
> 아임포트 중 restApi 서비스를 통해 결제<br>
> 결제 화면

![image](https://user-images.githubusercontent.com/94529254/182841996-9eb77eb2-d446-408b-8352-b887ee485e37.png)

### 리멤버 나우
> 리멤버 커넥터스라는 특수한 권한을 가진 유저가 등록하는 인사이트 아티클을 조회 가능

![나우1](https://user-images.githubusercontent.com/94529254/182843565-995c5da6-850d-43d3-a99b-22bc92d7dfd5.png)

> 커넥터스라는 ROLE를 가진 유저의 경우 게시글 작성이 가능 (froala-editor 라이브러리 사용)

![image](https://user-images.githubusercontent.com/94529254/182843546-83ed42dc-5be2-4227-b97d-ccdc91832021.png)

## 배운 점 & 아쉬운 점
### 배운 점
> 웹 사이트에 세부적인 기능이 많아 다양한 기능을 구현해볼 수 있어서 좋았습니다.<br>
> 코드를 수정하는데 팀원과의 명세가 달라 수정에 많은 시간이 소요된 적이 있습니다. 그 경험을 통해 명세를 잘 지킬수록 유지보수에 들어가는 시간과 노력이 많이 단축된다는 것을 알게 되었습니다.<br>

### 아쉬운 점
> 5주라는 시간에 모든 기능을 다 구현할 수 있을 줄 알았는데 다 해내지 못한 것이 아쉽습니다.<br>
> 클론 대상 웹 사이트를 분석하는 능력이 부족했던 것 같습니다. 리멤버를 구현해보면서 현재 제 실력이라면 어느 정도 기간만에 구현해낼 수 있는지를 더 잘 알게되었습니다.<br>
> 팀 프로젝트는 끝났지만, 개인적으로 조금씩 수정 및 보완해나가고 있습니다.
