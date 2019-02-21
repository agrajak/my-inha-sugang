import { Cell, Cells } from './util.js'
const 전공 = require('./data/전공.json')
const 일반교양 = require('./data/일반교양.json')
const 핵심교양 = require('./data/핵심교양.json')
const 영어 = require('./data/영어.json')
const 교양필수 = require('./data/교양필수.json')

async function 시간표_긁어오기(과들){
  const arr = []
  return [...전공, ...영어, ...일반교양, ...교양필수, ...핵심교양]
  // TODO: 핵심교양
}
async function 희망과목_고르기(시간표, 희망과목=[], 필수과목=[]){
  const list = new Cells()
  // TODO : 희망과목이 분반이 포함되어있지않으면 모든 분반 추가
  희망과목.forEach(s=>{
    if(s.indexOf('-') == -1){ // 과목일때
      시간표.filter(x=>x.sno.match(/(.*)-(.*)/)[1] == s).forEach(x=>list.merge(new Cell(x)))
    }
    else{ // 분반일때
      시간표.filter(x=>x.sno == s).forEach(x=>list.merge(new Cell(x)))
    }
  })
  
  const criteria = new Cells()
  필수과목.forEach((s,i)=>{
    if(s.indexOf('-') != -1){ // 분반일때
      시간표.filter(x=>x.sno == s).forEach(x=>criteria.merge(new Cell(x)))
      필수과목.splice(i,1)
    }
    else { // 과목일때
      시간표.filter(x=>x.sno.match(/(.*)-(.*)/)[1] == s).forEach(x=>list.merge(new Cell(x)))
    }
  })

  return {
    list, criteria, important: 필수과목
  }
}
async function run(depts, 희망과목, 필수과목, maxCredit=19, minCredit=1){
  console.log(` * 최소학점 : ${minCredit} 최대학점: ${maxCredit}`)
  console.log(` * 희망과목 : ${희망과목} 필수과목: ${필수과목}`)
  const { list, criteria, important } = await 희망과목_고르기(await 시간표_긁어오기(depts), 희망과목, 필수과목)
  console.log(`* list: ${list.size()}`)
  console.log(`* criteria: ${criteria.size()}`)
  console.log(`* important: ${important.length}`)
  // DP - 이중 배열 초기화 + 삼중
  const t = []
  for(let i=0,size=list.size();i<=size;i++){
    const c = []
      for(let j=0;j<=maxCredit;j++){
        c.push([])
    }
    t.push(c)
  }
  console.time('calc')
  for(let i=0, size=list.size();i<=size;i++){
    t[i][0].push(new Cells(criteria, true))
  }
  for(let i=0;i<=maxCredit;i++){
    t[0][i].push(new Cells(criteria, true))
  }
  for(let i=1, size=list.size();i<=size;i++){
    for(let j=1;j<=maxCredit;j++){
      const cellsList = t[i][j]
      for(let cells of t[i-1][j]){
        cellsList.push(new Cells(cells, true))
      } 
      const lastOne = list.get(i-1) 

      if(lastOne.getCredit() <= j){ // 선택 시
        for(let cells of t[i-1][j-lastOne.getCredit()]){
          if(cells.isAvailable(lastOne)){
            cellsList.push(cells.add(lastOne))
          }
        }
      }
    }
  }
  console.timeEnd('calc')
  const result = t[list.size()][maxCredit]
  console.log(` * 가능한 시간표 경우의 수 : ${result.length}`)
  const cResult1 = []
  result.forEach(x=>{
    if(x.getCredit() >= minCredit){
      cResult1.push(x)
    }
  })
  console.log(` * 최소 학점이 넘는 리스트 갯수 : ${cResult1.length}`)
  const cResult2 = []
  cResult1.forEach(x => {
    for(const c of important){
      if(!x.getSubjects().includes(c)) return
    }
    cResult2.push(x)
  })
  console.log(` * 필수로 포함시켜야할 과목이 포함된 리스트 갯수 : ${cResult2.length}`)
  // console.log(JSON.stringify(cResult1, null, 2))
  return cResult2
}
export default run 