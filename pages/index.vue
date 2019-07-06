<template>
  <div>
    <div class="container">
      <div class="hero is-small is-primary is-bold">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              인하대학교 시간표 생성기 v{{version}}
            </h1>
            <h2 class="subtitle">
              임시로 정보통신공학과와 컴퓨터공학과만 지원합니다. ({{date}}일자 시간표) <strong>사용법</strong>(<a href="https://www.notion.so/agrajak/c6732e39aa41449a8e3e596bf9054f73" target="_blank">클릭</a>)
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
                <input class="input" @input="e=>search=e.target.value" placeholder="과목이름을 입력해보세요(초성검색도 지원) 예)ㅈㄺㅈㄹ, 자료구조론">
              </p>
            </div>
          </div>      
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">학과 검색</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded">
                <input class="input" v-model="subject" placeholder="예) 정보통신, 컴퓨터">
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
    <section>
      <div class="container has-text-centered">
        <p>하단의 표에서 원하는 과목/분반을 고른 다음 우측 버튼을 눌러주세요</p> 
        <p>과목 선택을 누르면 모든 분반이 추가됩니다.</p>
        <p>필수여부(O)를 토글해서 필수로 시간표에 포함시킬 것인지 정할 수 있습니다.</p>
      </div>
    </section>
    <section class="section">
      <subject-selector :search="search" :subject="subject" :category="category" v-model="과목"></subject-selector>
    </section>
    <section>
      <div class="container has-text-centered" >
        <div v-if="!result && !isProgress">
          <p>모바일 페이지에서는 표가 보이지 않습니다. 토요일 시간표는 제공하지 않습니다.</p>
          <p>해당 서비스는 이용자가 제공하는 시간표를 사용하는 것에 대하여 어떠한 책임도 지지 않습니다.</p>
        </div>
        <div class="section">
          <button @click="getResult()" class="button is-centered is-link is-medium" :class="{'is-loading':isProgress}">시간표 계산하기</button>
        </div>
        <time-table-viewer :result="result"></time-table-viewer>
      </div>
    </section>
    <section class="section">
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
    </section>
  </div>
</template>
<script>
import {Cell, Cells} from '../utils.js'
import {run, getUpdatedDate} from '../index.js'
import TimeTableViewer from '../components/TimeTableViewer.vue'
import SubjectSelector from '../components/SubjectSelector.vue'
import Package from '../package.json'
export default {
  name: 'index',
  components: {
    TimeTableViewer, SubjectSelector
  },
  data(){
    return {
      result: undefined,
      과목: [],
      categoryList: ['전체', '전공선택', '전공필수', '핵심교양', '교양선택', '교양필수'],
      search: '',
      subject: '',
      maxCredit: 19, 
      minCredit: 1,
      category: '전체',
      isProgress: false
    }
  },
  computed: {
    version () {
      return Package.version
    },
    date(){
      return getUpdatedDate()
    }
  },
  methods: {
    getResult(){
      this.isProgress = true
      this.result = null
      this.$forceUpdate()
      console.log(`현재 진행! ${this.isProgress}`)
      const 희망과목 = this.과목.filter(x=>!x.important).map(x=>x.code)
      const 필수과목 = this.과목.filter(x=>x.important).map(x=>x.code)
      this.$nextTick(()=>{
        window.requestAnimationFrame(()=>{
          setTimeout(() => {
            run(희망과목, 필수과목, this.maxCredit, this.minCredit).then(r=>{
              this.isProgress = false
              this.result = r
            }) 
            .catch(e=>{
              this.isProgress = false
              console.log('에러발생')
              console.log(e)
            })            
          }, 0);
        })
      })
    }
  }
}
</script>