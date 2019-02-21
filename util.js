function deepCopy(obj){
  const newObj = JSON.parse(JSON.stringify(obj))
  if(obj instanceof Array){
    for(let i=0,size=obj.length;i<size;i++){
      if(obj[i] instanceof Cell){
//        console.log( Object.create(Object.getPrototypeOf(obj[i])))
        newObj[i] = Object.assign(obj[i], Object.create(Object.getPrototypeOf(obj[i])))
      }
    }
  }
  return newObj
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
  getCredit(){ return Number(this.data.credit) }
  getBigo(){ return this.data.bigo }
  getSnoCode(){ return this.data.sno }
  getBunBan() { return this.data.sno.match(/(.*)-(.*)/)[2] }
  getSno() { return this.data.sno.match(/(.*)-(.*)/)[1] }
}
export { Cell, Cells }