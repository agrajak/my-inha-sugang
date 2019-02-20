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
    <section class="section">
      <div class="container control">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">검색필터</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded">
                <input class="input" v-model="search" placeholder="과목이름/분류등을 입력해보세요">
              </p>
            </div>
          </div>      
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">최소학점 / 최대학점</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded">
                <input class="input" v-model="minCredit" placeholder="최소학점">
              </p>
            </div>
            <div class="field">
              <p class="control is-expanded">
                <input class="input" v-model="maxCredit" placeholder="최대학점">
              </p>
            </div>
          </div>      
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">분류</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="field is-grouped is-grouped-centered">
                <label class="radio">
                  <input type="radio" v-model="category" value="전체"> 전체
                </label>
                <label class="radio" >
                  <input type="radio" v-model="category" value="전공선택"> 전공선택
                </label>
                <label class="radio" >
                  <input type="radio" v-model="category" value="전공필수"> 전공필수
                </label>
                <label class="radio" >
                  <input type="radio" v-model="category" value="핵심교양"> 핵심교양
                </label>
                <label class="radio" >
                  <input type="radio" v-model="category" value="교양선택"> 교양선택
                </label>
                <label class="radio" >
                  <input type="radio" v-model="category" value="교양필수"> 교양필수
                </label>
              </div>
            </div>
          </div>      
        </div>
      </div>  
    </section>
    <section class="section">
      <!-- TODO: v-model 바인딩 -->
      <subject-viewer :search="search" :category="category" :desired_subject="희망과목"
       @add_subject="x=>희망과목_추가(x)" @add_bunban="x=>희망분반_추가(x)"
       @delete_subject="x=>희망과목_삭제(x)" @delete_bunban="x=>희망분반_삭제(x)"
       @toggle_subject="x=>필수과목_토글(x)"></subject-viewer>
    </section>
    <div class="section">
      <div class="container">
        <button @click="getResult()" class="button is-centered">계산하기</button>
        <p class="help">계산에는 시간이 다소 걸릴 수 있습니다. (1분-3분)</p>
        <div v-if="result">
          <div v-if="result.length > 0">
            <button class="button is-small" @click="index = index==0?0:index-1">이전 페이지</button>
            <span class="button is-small">{{index}}</span>
            <button class="button is-small" @click="index = index==result.length-1?result.length-1:index+1">다음 페이지</button>
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
      search: '',
      maxCredit: 19, 
      minCredit: 15,
      category: '전체',
      isProgress: false
    }
  },
  methods: {
    필수과목_토글(코드){
      const index = this.희망과목.map(x=>x.code).indexOf(코드)
      if(index != -1){
        this.희망과목[index].important = !this.희망과목[index].important
      }
      
    },
    희망과목_삭제(과목코드){
      const index = this.희망과목.map(x=>x.code).indexOf(과목코드)
      if(index != -1){
        this.희망과목.splice(index, 1)
      }
    },
    희망분반_삭제(분반코드){
      const index = this.희망과목.map(x=>x.code).indexOf(분반코드)
      if(index != -1){
        this.희망과목.splice(index, 1)
      }
    },
    희망과목_추가(과목) {
      // 같은 과목이 없을때
      const 과목코드 = 과목.sno.match(/(.*)-(.*)/)[1]
      console.log(`과목코드 : ${과목코드}`)
      if(!this.희망과목.map(x=>x.code).includes(과목코드)){
        this.희망과목.push({
          code: 과목코드,
          detail: 과목,
          important: true
        })
      }
    },
    희망분반_추가(분반){
      const 과목코드 = 분반.sno.match(/(.*)-(.*)/)[1]
      const 분반코드 = 분반.sno
      console.log(`분반코드 : ${분반코드}`)
      // 같은 분반 && 과목이 없을때 
      if(!this.희망과목.map(x=>x.code).includes(분반코드) && !this.희망과목.map(x=>x.code).includes(과목코드) ){
        this.희망과목.push({
          code: 분반코드,
          detail: 분반,
          important: true
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