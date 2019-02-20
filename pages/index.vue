<template>
  <div>
    <div class="container">
      <div class="hero is-small is-primary is-bold">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              인하대학교 시간표 생성기
            </h1>
            <h2 class="subtitle">
              Work In Progress
            </h2>
          </div>
        </div>
      </div>
    </div>
    <subject-viewer :desired_subject="희망과목" @add_subject="x=>희망과목_추가(x)" @add_bunban="x=>희망분반_추가(x)"></subject-viewer>
    <div class="section">
      <div class="container">
        <!-- <div class="content control is-center">
          <div class="field is-grouped is-grouped-multiline">
            <div v-for="(item, i) in 희망과목" :key="i" class="control">
              <div class="tags has-addons" v-if="item.code.indexOf('-')==-1">
                <span class="tag is-warning">{{item.detail.subject}}</span>
                <span class="tag is-primary">{{item.detail.credit}}</span>
                <span class="tag is-danger">삭제</span>
              </div>
              <div class="tags has-addons" v-else>
                <span class="tag is-warning">{{item.detail.subject}}</span>
                <span class="tag is-primary">{{item.detail.credit}}</span>
                <span class="tag is-info">{{item.detail.name_pf}}</span>
                <span class="tag is-text">{{item.detail.sno.match(/(.*)-(.*)/)[2]}}분반</span>
                <span class="tag is-danger">삭제</span>
              </div>
            </div>
          </div>
        </div> -->
        <button @click="getResult()" class="button is-centered">계산하기</button>
        <p class="help">계산에는 시간이 다소 걸릴 수 있습니다. (1분-3분)</p>
        <div v-if="result">
          <div v-if="result.length > 0">
            <button @click="index = index==0?0:index-1">이전 페이지</button>
            {{index}}
            <button @click="index = index==result.length-1?result.length-1:index+1">다음 페이지</button>
          </div>
          <table>
            <thead>
              <th>월</th>
              <th>화</th>
              <th>수</th>
              <th>목</th>
              <th>금</th>
            </thead>
            <tbody>
              <tr v-for="(col,i) in result[index].print()" :key="i">
                <td v-for="(row, j) in col" :key="j">{{row}}</td>
              </tr>
            </tbody>
          </table>
          <div>
            {{result[index].getSubjects()}}
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="content has-text-centered">
          <div>
            <small>
              <strong>인하대 시간표 생성기</strong> by Suhyun Jeon (korbots@gmail.com)
            </small>
          </div>
          <div>
            <a href="https://bulma.io">
              <img src="https://bulma.io/images/made-with-bulma.png" alt="Made with Bulma" width="128" height="24">
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import {Cell, Cells} from '../util.js'
import run from '../index.js'
import SubjectViewer from '../components/SubjectViewer.vue'
export default {
  name: 'index',
  components: {
    SubjectViewer
  },
  data(){
    return {
      result: undefined,
      희망과목: [],
      필수과목: ['모바일응용소프트웨어설계', '디지털영상처리설계', '인공지능 응용시스템'],
      index: 0,
      isProgress: false
    }
  },
  methods: {
    희망과목_추가(과목) {
      // 같은 과목이 없을때
      const 과목코드 = 과목.sno.match(/(.*)-(.*)/)[1]
      console.log(`과목코드 : ${과목코드}`)
      if(!this.희망과목.map(x=>x.code).includes(과목코드)){
        this.희망과목.push({
          code: 과목코드,
          detail: 과목
        })
      }
    },
    희망분반_추가(분반){
      const 분반코드 = 분반.sno
      console.log(`분반코드 : ${분반코드}`)
      // 같은 분반 && 과목이 없을때 
      if(!this.희망과목.map(x=>x.code).includes(분반코드)){
        this.희망과목.push({
          code: 분반코드,
          detail: 분반
        })
      }
    },
    getResult(학과=['정보통신공학과']){
      this.isProgress = true
      this.$forceUpdate()
      run(학과, this.희망과목.map(x=>x.code), this.필수과목).then(r=>{
        this.result = r
        this.isProgress = false
      }) 
      .catch(e=>{
        this.isProgress = false
        console.log(e)
      })
    }
  }
}
</script>