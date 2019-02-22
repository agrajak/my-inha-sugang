<template>
  <!-- 계산된 시간표들을 보여줍니다. -->
  <div id="timetable-viewer" v-if="result">
    <div v-if="result.length == 0">
      조건에 맞는 시간표가 하나도 없어요... <br>
      필수 분반끼리 시간이 겹치는지 한번 확인해주세요..
    </div>
    <div v-else>
      <div v-if="result.length > 0">
        <div class="container">
          <div class="field is-grouped is-grouped-centered">
            <button class="button is-small" @click="index = index==0?0:index-1" :disabled="index == 0">이전 페이지</button>
            <span class="button is-small">{{index+1}} / {{result.length}}</span>
            <button class="button is-small" @click="index = index==result.length-1?result.length-1:index+1" :disabled="index==result.length-1">다음 페이지</button>
          </div>
          <div>
            <p class="has-text-centered">
              과목과 교시에 마우스 커서를 올리시면 더 자세한 정보를 확인할 수 있습니다.<br>
              표가 한 화면에 보이지 않으면 Ctrl +, -로 조정하세요
            </p>
            <nav class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">총 학점</p>
                  <p class="title">{{result[index].getCredit()}}</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">총 수업시간</p>
                  <p class="title">{{Math.floor(summary.수업시간/4)}}시간 {{(summary.수업시간*15)%60}}분</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">최장 연강</p>
                  <p class="title">{{Math.floor(summary.최장연강/4)}}시간 {{(summary.최장연강*15)%60}}분</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">수업일수</p>
                  <p class="title">{{summary.수업일수}}/5</p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div class="section column is-10 is-offset-1">
        <!-- 시간표 헤더 -->
        <div class="tile is-ancestor">
          <div class="tile is-parent is-1">
            <div class="tile is-child day cell">
              <cell-viewer text="시간" :height="2"></cell-viewer>
            </div>
          </div>
          <div class="tile is-parent is-2" v-for="(day, i) in table" :key="i+30">
            <div class="tile is-child day cell">
              <cell-viewer :text="days[i]" :height="2"></cell-viewer>
            </div>
          </div>
        </div>
        <!-- 시간표 바디 -->
        <div class="tile is-ancestor is-hidden-mobile is-text-centered">
          <div class="tile is-parent is-vertical is-1">
            <div class="tile is-child cell" v-for="(time, i) in (new Array(25))" :key="i"> 
              <cell-viewer :time="i+1" :height="2"></cell-viewer>
            </div>
          </div>
          <div class="tile is-parent is-vertical is-2" v-for="(day, i) in table" :key="i+30">
            <div class="tile is-child cell" v-for="(cell, j) in day" :key="j+52">
              <cell-viewer :data="cell" :height="cell.시간"></cell-viewer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CellViewer from './CellViewer.vue'
export default {
  name: 'timetable-viewer',
  props: ['result'],
  components: {
    CellViewer
  },
  watch: {
    result (){
      this.index = 0
    }
  },
  computed: {
    summary () {
      let 수업일수 = 0
      let 최장연강 = 0
      let 수업시간 = 0
      let 연강 = 0
      let flag = false
      if(this.table){
        for(let i=0;i<5;i++){
          flag = false
          연강 = 0
          for(let cell of this.table[i]){
            if(cell.index != -1){
              flag = true
              수업시간 += cell.시간
              연강 += cell.시간
              if(최장연강 < 연강){
                최장연강 = 연강
              }
            }
            else if(cell.시간 != 1){
              연강 = 0
            }
          }
          수업일수 += !!flag
        }
      }
      return {
        수업일수, 최장연강, 수업시간
      }
    },
    table () {
      // TODO: 해당내용 Cells.print()로 옮겨버리기
      const arr = []
      if(this.result){
        let 전에_강의가_공강 = false
        const result = this.result[this.index].print()
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
                상세: 지금_공강?null:this.result[this.index].get(result[j][i]),
                연강: k-j,
                시간: 지금_공강?(k-j)*2:(k-j)*2-1,
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
      }
      return arr
    }
  },
  data (){
    return {
      index: 0,
      days: ["월", "화", "수", "목", "금"]
    }
  },
}
</script>
<style scoped>
#timetable-viewer{
  font-size: 0.8em;
}
.tile.is-vertical>.tile.is-child:not(:last-child) {
  margin: 0 !important;
}
.tile.is-parent {
  padding: 0 !important;
}
.tile {
  flex-shrink: 0 !important;
  flex-grow: 1 !important;
  flex-basis: auto !important;
  box-sizing: border-box;
}
.day {
  font-size: 1.2em;
  margin: 0.4em;
  text-align: center;
}
.is-text-centered {
  text-align: center;
}
</style>


