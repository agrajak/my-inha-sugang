function deepCopy(obj){
  const newObj = JSON.parse(JSON.stringify(obj))
  if(obj instanceof Array){
    for(let i=0,size=obj.length;i<size;i++){
      if(obj[i] instanceof Cell){
        newObj[i] = Object.assign(obj[i], Object.create(Object.getPrototypeOf(obj[i])))
      }
    }
  }
  return newObj
}

const 교시2시간_시작 = (교시)=> {
  if(교시%2 == 1){
    return `${교시/2+8.5}시`
  }
  return `${교시/2+8}시 30분`
}
const 교시2시간_끝 = (교시)=> {
  if(교시%2 == 1){
    return `${교시/2+7.5}시 45분`
  }
  return `${교시/2+8}시 15분`
}

class TimeTables {
  constructor(){
    this.arr = []
  }
  push(obj){
    if(!(obj instanceof TimeTable)){
      throw new TypeError("obj must be instance of TimeTable")      
    }
    this.arr.push(obj)
  }
  get(index){
    return this.arr[index]
  }
  sort(field){
    const fields = ['총학점', '수업시간', '최장연강', '수업일수']
    if(!(fields.includes(field))){
      throw new Error("invalid field!")
    }
    this.arr = this.arr.sort((a,b)=>(a[field]-b[field]))
  }
}
// Cells의 배열을 출력하기 쉬운 정보로 가공
class TimeTable {
  constructor(cells){
    if(!(cells instanceof Cells)){
      throw new TypeError("obj must be instance of Cells")      
    }
    this.학점 = 0
    this.수업시간 = 0
    this.총학점 = cells.getCredit()
    this.최장연강 = 0
    this.수업일수 = 0
    this.arr = []
    this.obj = cells
    const arr = []
    let 전에_강의가_공강 = false
    const result = cells.print()
    
    for(let i=0;i<5;i++){
      const obj = []
      for(let j=0;j<25;){
        const 지금_공강 = result[j][i] == -1
        let k=j+1
        for(;k<25;k++){
          if(result[k][i] != result[j][i]) break;
        }
        // k-j : 연강 갯수
        // 1교시 공강이 붙어있을때 합치기
        if(전에_강의가_공강 && 지금_공강){
          obj[obj.length-1].연강 += k-j
          obj[obj.length-1].시간 += (k-j)*2
          obj[obj.length-1].공강 += 지금_공강
        }
        else {
          obj.push({
            index: result[j][i],
            상세: 지금_공강 ? null : cells.get(result[j][i]),
            연강: k-j,
            시간: 지금_공강 ? (k-j)*2 : (k-j)*2-1,
            공강: 지금_공강,
            시작시간: 교시2시간_시작(j+1),
            종료시간: 교시2시간_끝(k+1)
          })
        }
        if(!지금_공강){
          obj.push({
            index: -1,
            상세: null,
            연강: 0,
            시간: 1,
            공강: true
          })
          전에_강의가_공강 = true
        }
        else 전에_강의가_공강 = false
        j=k;
      }
      arr.push(obj)
    }
    this.arr = arr

    // 연강/수업일수/최장연강/수업시간을 계산한다.

    let 연강 = 0
    let flag = false
    for(let i=0;i<5;i++){
      flag = false
      연강 = 0
      for(let cell of arr[i]){
        if(cell.index != -1){
          flag = true
          this.수업시간 += cell.시간
          연강 += cell.시간
          if(this.최장연강 < 연강){
            this.최장연강 = 연강
          }
        }
        else if(cell.시간 != 1){
          연강 = 0
        }
      }
      this.수업일수 += !!flag
    }
  }
  get(){
    return this.arr
  }
  getCells(){
    return this.obj
  }
}

// Cell을 배열로 담고 있음
// isStrict=true 일때는 시간이 겹치게 merge할 수 없음
class Cells {
  constructor(obj, isStrict = false){
    this.arr = []
    this.isStrict = isStrict
    this.times = []
    this.subjects = []
    this.credit = 0
    if(obj){
      if(obj instanceof Cells){
        this.arr = deepCopy(obj.arr)
        this.times = deepCopy(obj.times)
        this.subjects = deepCopy(obj.subjects)
        this.isStrict = obj.isStrict
        this.credit = obj.credit
      }
      else throw new TypeError("obj must be instance of Cells or Cell")  
    }
    return this
  }
  
  getTimes() { return this.times }
  getCredit() { return this.credit }
  getSubjects() { return this.subjects }
  get(ind){ 
    return this.arr[ind]
  }
  size(){
    return this.arr.length
  }
  // Cell을 추가한 새로운 Cells를 반환함
  add(cell){
    const newCells = new Cells(this, this.isStrict)
    newCells.merge(cell)
    return newCells
  }
  // 해당 Cells 에 Cell을 추가함
  merge(cell){
    if(!(cell instanceof Cell)){
      throw new TypeError("obj is not instanceof Cell")
    }
    if(this.isStrict){
      if(!this.isAvailable(cell)) throw new Error('cell is not compatible with existing cells')
    }
    this.arr.push(new Cell(cell))
    cell.getTime().split(',').forEach(x=>{this.times.push(x)})
    this.times.sort()
    this.credit += cell.getCredit()
    this.subjects.push(cell.getSno())
  }

  // 새로 추가할 Cell이 Cells과 시간이 겹치는가 안겹치는가 확인시켜줌
  isAvailable(cell){
    if(!(cell instanceof Cell)) throw new TypeError("obj is not instanceof Cell")
    const b = cell.getTime().split(',')

    // 이미 리스트에 들어있는 과목이면 false 리턴
    if(this.subjects.includes(cell.getSno())) return false

    // 시간이 겹치면 false 리턴
    let i=0, j=0;
    b.sort();

    while(i < this.times.length && j < b.length){
      if(this.times[i] == b[j]){
        return false
      }
      else if(this.times[i] < b[j]){
        i++;
      }
      else j++;
    }
    // 아무 조건도 걸치지 않으면 true 리턴
    return true
  }
  // Cells에 담긴 시간표를 5*25사이즈 배열에 담아줌
  print(){
    let arr=[];
    for(let i=1;i<=25;i++){
      const a = [];
      for(let j=0;j<5;j++){
        a.push(-1)
      }
      arr.push(a)
    } 
    this.arr.forEach((x,i)=>{
      x.getTime().split(',').forEach(t=>{
        const day = t.match(/(.)(\d+)/)[1]
        const num = t.match(/(.)(\d+)/)[2]
        if(day == '월') arr[num-1][0] = i
        if(day == '화') arr[num-1][1] = i
        if(day == '수') arr[num-1][2] = i
        if(day == '목') arr[num-1][3] = i
        if(day == '금') arr[num-1][4] = i
      })
    })
    return arr
  }
}
class Cell {
  constructor(obj){
    this.set(obj)
    return this
  }
  get(){
    return this.data
  }
  set(obj){
    if(obj instanceof Cell){
      this.data = deepCopy(obj.get())
    }
    else if(this.validate(obj)){
      this.data = deepCopy(obj)
    }
    else throw new TypeError('target obj is not valid object')
  }
  validate() {
    // ToDo
    return true
  }
  getSubject(){ return this.data.subject}
  getPf(){ return this.data.name_pf}
  getTime(){ return this.data.time }
  getPlace(){ return this.data.place }
  getDetailPlace(){ return this.data.detail_place }
  getCredit(){ return Number(this.data.credit) }
  getBigo(){ return this.data.bigo }
  getSnoCode(){ return this.data.sno }
  getBunBan() { return this.data.sno.match(/(.*)-(.*)/)[2] }
  getSno() { return this.data.sno.match(/(.*)-(.*)/)[1] }
}
function 초성찾기(list, search){
  function is한글(str){
    return /[ㄱ-ㅎ|ㄳ-ㅄ|가-힝]/.test(str)
    // http://blog.daum.net/osban/14691815
  }
  function 초성(str) {
    if(is한글(str)){
      const 초 = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
      const 겹 = {"ㄳ": "ㄱㅅ", "ㄵ": "ㄴㅈ", "ㄶ": "ㄴㅎ", "ㄺ":"ㄹㄱ", "ㄻ":"ㄹㅁ", "ㄼ":"ㄹㅂ", "ㄽ":"ㄹㅅ", "ㄿ":"ㄹㅍ", "ㅀ":"ㄹㅎ", "ㅄ": "ㅂㅅ"}
      let result = "";
      for(let i=0;i<str.length;i++) {
        const code = str.charCodeAt(i)-44032
        const c = str.charAt(i)
        if(Object.keys(겹).includes(c)){
          result += 겹[c]
        }
        else if(초.includes(c)){
          result += c
        }
        else if(code>-1 && code<11172) result += 초[Math.floor(code/588)]; 
      }
      return result;
    }
    return str
  }
  return list.filter(x=>초성(x.subject).indexOf(초성(search))!= -1)
}
export { Cell, Cells, TimeTable, TimeTables, 초성찾기 }