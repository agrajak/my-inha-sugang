# 인하대학교 수강신청 시간표 생성기
> Beta

[이동하기](https://agrajak.github.io/my-inha-sugang/)
## 해야할 것
 - 이름 멋진거로 바꾸기
 - 핵교 선택 넣기
   - utils.js안의 Cells.prototype.isAvailable()에서 같은 핵교가 추가되면 false를 리턴하도록 변경하게
 - 전공.json에 다른 과 추가하기 
 - 표 꾸미기(bulma 사용안해도 상관없음)
## 기여
 - 이슈든 건의사항이든 풀 리퀘스트든 언제든 환영입니다!

## 설치
```bash
npm install
npm run dev
```

## 배포 
```bash
npm install 
npm run generate
```
master 브랜치에 병합되면 자동으로 CircleCI가 gh-pages에 배포합니다.