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
  add(cell){
    const newCells = new Cells(this, this.isStrict)
    newCells.merge(cell)
    return newCells
  }
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
  print(){
    let arr=[];
    for(let i=1;i<=25;i++){
      const a = [];
      for(let j=0;j<5;j++){
        a.push(' ')
      }
      arr.push(a)
    } 
    this.arr.forEach((x,i)=>{
      x.getTime().split(',').forEach(t=>{
        const day = t.match(/(.)(\d+)/)[1]
        const num = t.match(/(.)(\d+)/)[2]
        if(day == '월') arr[num][0] = String(i)
        if(day == '화') arr[num][1] = String(i)
        if(day == '수') arr[num][2] = String(i)
        if(day == '목') arr[num][3] = String(i)
        if(day == '금') arr[num][4] = String(i)
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
  getTime(){ return this.data.time }
  getCredit(){ return Number(this.data.credit) }
  getSnoCode(){ return this.data.sno }
  getSno() { return this.data.sno.match(/(.*)-(.*)/)[1] }
}
export { Cell, Cells }