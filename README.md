# 인하대학교 수강신청 시간표 생성기
> 현재는 컴퓨터공학과와 정보통신공학과만 지원합니다.
수강을 희망하는 과목들을 선택하면 다양한 조건(분반, 최소학점, 최대학점)에 맞는 가능한 모든 경우의 수를 구해줍니다!

[![CircleCI](https://circleci.com/gh/Agrajak/my-inha-sugang/tree/master.svg?style=svg)](https://circleci.com/gh/Agrajak/my-inha-sugang/tree/master)

[이동하기](https://agrajak.github.io/my-inha-sugang/)

## 해야할 것
 - 이름, 로고, 파비콘 멋진거로 바꾸기
 - SubjectSelector에서 선택된 과목은 표시 안되도록 변경
 - 핵교 선택 넣기
   - utils.js안의 Cells.prototype.isAvailable()에서 같은 핵교가 추가되면 false를 리턴하도록 변경하게
 - **셀 배경색깔 추천 받습니다.**
 - 결과로 나온 시간표들 정렬 기준 만들기
   - 학점 순서? 금공강 순서?
   - 공강 시간표 몇개인지 보여주기 ex) 총 13개 시간표 중 월 공강 2개, 금 공강 1강 

## 기여
 1. 작업할 내용 이슈로 써놓기
 2. 포크해서 작업하기
 3. 풀 리퀘스트 하기 
 - 이슈든 건의사항이든 언제든지 환영입니다!

## 설치
```bash
npm install
mkdir data # data 폴더 만들기
node init # 시간표 긁어오기
npm run dev
```
http://localhost:3000/my-inha-sugang 으로 이동

## 배포 
```bash
npm install 
node init # 시간표 긁어오기
npm run generate
```
master 브랜치에 병합되면 자동으로 CircleCI가 gh-pages에 배포합니다.