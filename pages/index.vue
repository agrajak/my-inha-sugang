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
                <input class="input" v-model="search" placeholder="과목이름을 입력해보세요 예)ㅈㄹㄱㅈㄹ, 자료구조론">
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
                <input class="input" v-model.number="minCredit" placeholder="최소학점">
              </p>
            </div>
            <div class="field">
              <p class="control is-expanded">
                <input class="input" v-model.number="maxCredit" placeholder="최대학점">
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
                <label class="radio" v-for="(c, i) in  categoryList" :key="i+100">
                  <input type="radio" v-model="category" :value="c"> {{c}}
                </label>
              </div>
            </div>
          </div>      
        </div>
      </div>  
    </section>
    <section class="section">
      <!-- TODO: v-model 바인딩 -->
      <subject-viewer :search="search" :category="category" v-model="과목"></subject-viewer>
    </section>
    <div class="section">
      <div class="container">
        <button @click="getResult()" class="button is-centered" :class="{'is-loading':isProgress}">계산하기</button>
        <p class="help">계산에는 시간이 다소 걸릴 수 있습니다. (1분-3분)</p>
        <div v-if="result">
          <div v-if="result.length > 0">
            <button class="button is-small" @click="index = index==0?0:index-1">이전 페이지</button>
            <span class="button is-small">{{index}}</span>
            <button class="button is-small" @click="index = index==result.length-1?result.length-1:index+1">다음 페이지</button>
          </div>
          <table class="table is-bordered">
            <thead>
              <th>월</th>
              <th>화</th>
              <th>수</th>
              <th>목</th>
              <th>금</th>
            </thead>
            <tbody>
              <tr v-if="result.length == 0">
                <td colspan="5">
                  읍다
                </td>
              </tr>
              <tr v-else v-for="(col,i) in result[index].print()" :key="i">
                <td v-for="(row, j) in col" :key="j">{{row}}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="result.length > 0">
            {{result[index].getSubjects()}}
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="content has-text-centered">
          <div>
            <small>
              <strong>인하대 시간표 생성기(<a href="https://github.com/agrajak/my-inha-sugang">소스코드</a>)</strong> by Suhyun Jeon (korbots@gmail.com) 
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
      과목: [],
      categoryList: ['전체', '전공선택', '전공필수', '핵심교양', '교양선택', '교양필수'],
      index: 0,
      search: '',
      maxCredit: 19, 
      minCredit: 1,
      category: '전체',
      isProgress: false
    }
  },
  methods: {
    getResult(학과=['정보통신공학과']){
      this.isProgress = true
      const 희망과목 = this.과목.filter(x=>!x.important).map(x=>x.code)
      const 필수과목 = this.과목.filter(x=>x.important).map(x=>x.code)
      this.$forceUpdate()
      this.$nextTick().then(()=>{
        run(학과, 희망과목, 필수과목, this.maxCredit, this.minCredit).then(r=>{
          this.result = r
          this.isProgress = false
        }) 
        .catch(e=>{
          this.isProgress = false
          console.log('에러발생')
          console.log(e)
        })
      })
    }
  }
}
</script>