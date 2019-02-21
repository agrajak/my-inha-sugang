const { getTimeTable, getDeptCode } = require('inha-timetable')
const fs = require('fs-extra')
async function init () {
  const 과들 = ['정보통신공학과', '컴퓨터공학과']
  const result = []
  // 일반교양, 영어, 핵심교양
  await Promise.all([
    getTimeTable(getDeptCode('정보통신공학과'), '일반교양', true, 'data/일반교양.json'),
    getTimeTable(getDeptCode('정보통신공학과'), '영어', true, 'data/영어.json'),
    getTimeTable(getDeptCode('정보통신공학과'), '핵심교양', true, 'data/핵심교양.json')
  ])
  // 교양필수  
  try{
    const 교양필수 = []
    for(let 과 of 과들){
      교양필수.concat(await getTimeTable(getDeptCode(과), '교양필수', true))
    }
    await fs.writeFile('data/교양필수.json', 교양필수)
  
    const 전공 = []
  
    for(let 과 of 과들){
      전공.concat(await getTimeTable(getDeptCode(과), '교양필수', true))
    }
    await fs.writeFile('data/전공.json', 전공)
  }
  catch(e){
    console.log('에러발생!')
    console.log(e)
  }
}
init()