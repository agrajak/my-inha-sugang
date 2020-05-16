<template>
  <!-- 계산된 시간표들을 보여줍니다. -->
  <div id="timetable-viewer" v-if="result">
    <div v-if="result.length == 0">
      {{string_resources.NO_RESULT_OF_CONDITION_TIMETABLE_VIEW}}. <br>
      {{string_resources.PLEASE_CONFIRM}}
    </div>
    <div v-else>
      <div v-if="result.length > 0">
        <div class="container">
          <!-- PAGINATION NAV -->
          <div class="field is-grouped is-grouped-centered">
            <button class="button is-small" @click="index = index==0?0:index-1" :disabled="index == 0">이전 페이지</button>
            <span class="button is-small">{{index+1}} / {{result.length}}</span>
            <button class="button is-small" @click="index = index==result.length-1?result.length-1:index+1" :disabled="index==result.length-1">다음 페이지</button>
          </div>
          <div>
            <!-- INFO -->
            <div class="container">
              <nav class="level box" v-if="timetable">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">{{string_resources.SORT_CONDITION}}</p>
                    <div class="select">
                      <select v-model="sortBy">
                        <option v-for="(field,i) in sortFields" :key="i" :value="field">{{field}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">{{string_resources.SUM_CREDIT}}</p>
                    <p class="title">{{timetable.총학점}}</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">{{string_resources.SUM_TIME}}</p>
                    <p class="title">{{Math.floor(timetable.수업시간/4)}}시간 {{(timetable.수업시간*15)%60}}분</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">{{string_resources.LONGEST_CONTINUOUS_CLASS}}</p>
                    <p class="title">{{Math.floor(timetable.최장연강/4)}}시간 {{(timetable.최장연강*15)%60}}분</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">{{string_resources.DAY}}</p>
                    <p class="title">{{timetable.수업일수}}/5</p>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div class="section column is-10 is-offset-1" v-if="timetable">
        <!-- 시간표 헤더 -->
        <div class="tile is-ancestor">
          <div class="tile is-parent is-1">
            <div class="tile is-child day cell">
              <cell-viewer text="시간" :height="2"></cell-viewer>
            </div>
          </div>
          <div class="tile is-parent is-2" v-for="(day, i) in timetable.get()" :key="i+30">
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
          <div class="tile is-parent is-vertical is-2" v-for="(day, i) in timetable.get()" :key="i+30">
            <div class="tile is-child cell" v-for="(cell, j) in day" :key="j+52">
              <cell-viewer :data="cell" :height="cell.시간"></cell-viewer>
            </div>
          </div>
        </div>
      </div>
      <p class="has-text-centered">
        {{string_resources.MORE_INFO}}<br>
        {{string_resources.CANNOT_SEE_ONE_VIEW}} <br>
        {{string_resources.TOO_MANY_TIMETABLES}}
      </p>

    </div>
  </div>
</template>
<script>
import CellViewer from './CellViewer.vue'
import { TimeTables, TimeTable } from '../utils.js'
import string_resources from "../resources/stringresources.js"
export default {
  name: 'timetable-viewer',
  props: ['result'],
  components: {
    CellViewer
  },
  watch: {
    result (){
      this.index = 0
      this.convertCells()
    },
    sortBy (){
      this.index = 0
      this.timetables.sort(this.sortBy)
    }
  },
  computed: {
    timetable (){
      if(this.timetables){
        return this.timetables.get(this.index)
      }
    }
  },
  data (){
    return {
      index: 0,
      days: ["월", "화", "수", "목", "금"],
      sortBy: '수업일수',
      sortFields: ['총학점', '수업시간', '최장연강', '수업일수'],
      timetables: null
    }
  },
  mounted (){
    this.string_resources = string_resources;
    this.convertCells()
  },
  methods: {
    convertCells(){
      this.timetables = new TimeTables()
      if(this.result){
        this.result.map(x=>(new TimeTable(x))).forEach(x=>this.timetables.push(x))
      }
      this.timetables.sort(this.sortBy)
    }
  }
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


