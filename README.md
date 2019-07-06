# 인하대학교 수강신청 시간표 생성기
> 현재는 컴퓨터공학과와 정보통신공학과만 지원합니다.

수강을 희망하는 과목들을 선택하면 다양한 조건(분반, 최소학점, 최대학점)에 맞는 가능한 모든 경우의 수를 구해줍니다!
![Imgur](https://i.imgur.com/y4ELmpo.png)

[![CircleCI](https://circleci.com/gh/Agrajak/my-inha-sugang/tree/master.svg?style=svg)](https://circleci.com/gh/Agrajak/my-inha-sugang/tree/master)


[**바로 사용해보기**](https://agrajak.github.io/my-inha-sugang/)

## 해야할 것
 - 이름, 로고, 파비콘 멋진거로 바꾸기
 - 툴팁 형식의 가이드 추가
 - 핵교 선택 넣기
   - utils.js안의 Cells.prototype.isAvailable()에서 같은 핵교가 추가되면 false를 리턴하도록 변경하게

## 기여
 1. 작업할 내용 이슈로 써놓기
 2. 포크해서 작업하기
 3. 풀 리퀘스트 하기 
 - 이슈든 건의사항이든 언제든지 환영입니다!

## 설치
```bash
npm install
mkdir data # data 폴더 만들기
npm run fetch # 시간표 긁어오기
npm run dev
```
http://localhost:3000/my-inha-sugang 으로 이동

## 배포 
```bash
npm install 
npm run fetch # 시간표 긁어오기
npm run generate
```
master 브랜치에 병합되면 자동으로 CircleCI가 gh-pages에 배포합니다.