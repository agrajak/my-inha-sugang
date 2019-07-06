import { Cell, Cells } from './utils.js'
const 전공 = require('./data/전공.json')
const 일반교양 = require('./data/일반교양.json')
const 핵심교양 = require('./data/핵심교양.json')
const 영어 = require('./data/영어.json')
const 교양필수 = require('./data/교양필수.json')
const metadata = require('./data/metadata.json')


function getUpdatedDate(){
  return metadata.date || 'NO DATE!'
}
async function 희망과목_고르기(희망과목=[], 필수과목=[]){
  const list = new Cells()
  const 시간표 = [...전공, ...영어, ...일반교양, ...교양필수, ...핵심교양]
  // 희망과목을 분반과 과목으로 분리해서 조건에 맞는 시간표를 list에 추가한다.
  희망과목.forEach(s=>{
    if(s.indexOf('-') == -1){ // 과목일때
      시간표.filter(x=>x.sno.match(/(.*)-(.*)/)[1] == s).forEach(x=>list.merge(new Cell(x)))
    }
    else{ // 분반일때
      시간표.filter(x=>x.sno == s).forEach(x=>list.merge(new Cell(x)))
    }
  })
  
  const criteria = new Cells()
  // 필수과목을 분반과 과목으로 쪼갠다.

  // 분반 => criteria
  // 분반에 추가되지 않는 과목들은 important에 저장
  // 과목 => list에 추가
  
  for(let i=0;i<필수과목.length;i++){
    if(필수과목[i].indexOf('-') != -1){ // 분반일때
      시간표.filter(x=>x.sno == 필수과목[i]).forEach(x=>criteria.merge(new Cell(x)))
      필수과목.splice(i,1)
      i--;
    }
    else { // 과목일때
      시간표.filter(x=>x.sno.match(/(.*)-(.*)/)[1] == 필수과목[i]).forEach(x=>list.merge(new Cell(x)))
    }
  }

  return {
    list, criteria, important: 필수과목
  }
  // list: 조합해야할 과목 목록
  // criteria: 무조건 포함되어야할 분반들, Cells의 초기값이다.
  // important: criteria가 들어있는 Cells에 list에 적혀있는 과목/분반등을 조합해 많은 수의 시간표를 만들어내면,
  //            그 중 important에 적혀있는 과목들이 모두 포함 된 시간표만 반환해준다.

}
async function run(희망과목, 필수과목, maxCredit=19, minCredit=1){
  console.log(` * 최소학점 : ${minCredit} 최대학점: ${maxCredit}`)
  console.log(` * 희망과목 : ${희망과목} 필수과목: ${필수과목}`)
  const { list, criteria, important } = await 희망과목_고르기(희망과목, 필수과목)
  console.log(`* list: ${list.size()}`)
  console.log(`* criteria: ${criteria.size()}`)
  console.log(`* important: ${important.length}`)
  // DP
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
  let result = t[list.size()][maxCredit]
  console.log(` * 가능한 시간표 경우의 수 : ${result.length}`)

  // 학점 기준 필터링
  result = result.filter(x => x.getCredit() >= minCredit && x.getCredit() <= maxCredit)
  console.log(` * 학점 기준이 맞는 리스트 갯수 : ${result.length}`)

  // important가 모두 포함되어있지 않은 시간표는 제외한다.
  result = result.filter(x => {
    for(const c of important){
      if(!x.getSubjects().includes(c)) return false
    }
    return true
  })
  console.log(` * 필수로 포함시켜야할 과목이 포함된 리스트 갯수 : ${result.length}`)
  return result
}
export {run, getUpdatedDate}