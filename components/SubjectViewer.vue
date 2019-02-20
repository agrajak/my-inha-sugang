<template>
  <div id="subject-viewer">
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
      <div class="container">
        <table class="table is-narrow is-hoverable">
          <thead>
            <th>학수번호</th>
            <th>과목이름</th>
            <th>학년</th>
            <th>학점</th>
            <th>분류</th>
            <th>시간</th>
            <th>장소</th>
            <th>교수이름</th>
            <th>평가</th>
            <th>비고</th>
            <th></th>
          </thead>
          <tbody>
            <!-- 희망과목들 -->
            <tr v-for="(cell, i) in desired_subject" :key="i" class="is-selected">
              <template v-if="cell.code.indexOf('-') == -1">
                <td>{{cell.code}}</td>
                <td>{{cell.detail.subject}}</td>
                <td>{{cell.detail.grade}}</td>
                <td>{{cell.detail.credit}}</td>
                <td>{{cell.detail.category}}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div class="buttons">
                    <button class="button is-small is-danger" @click="$emit('delete_subject', cell)">해당 과목 삭제</button>
                    <button class="button is-small is-link">필수여부(O)</button>
                  </div>
                </td>
              </template>
              <template v-else>
                <td>{{cell.code}}</td>
                <td>{{cell.detail.subject}}</td>
                <td>{{cell.detail.grade}}</td>
                <td>{{cell.detail.credit}}</td>
                <td>{{cell.detail.category}}</td>
                <td>{{cell.detail.time}}</td>
                <td>{{cell.detail.place}}</td>
                <td>{{cell.detail.name_pf}}</td>
                <td>{{cell.detail.rate}}</td>
                <td>{{cell.detail.bigo}}</td>
                <td>
                  <div class="buttons">
                    <button class="button is-small is-danger" @click="$emit('delete_bunban', cell)">해당 분반 삭제</button>
                    <button class="button is-small is-link">필수여부(O)</button>
                  </div>
                </td>
              </template>
            </tr>
            <!-- 선택가능 과목들 -->
            <tr v-for="(cell, i) in list_page" :key="i">
              <td>{{cell.sno}}</td>
              <td>{{cell.subject}}</td>
              <td>{{cell.grade}}</td>
              <td>{{cell.credit}}</td>
              <td>{{cell.category}}</td>
              <td>{{cell.place_detail}}</td>
              <td>{{cell.place}}</td>
              <td>{{cell.name_pf}}</td>
              <td>{{cell.rate}}</td>
              <td>{{cell.bigo}}</td>
              <td>
                <div class="buttons has-addons">
                  <button class="button is-small" @click="$emit('add_subject', cell)">과목 추가</button>
                  <button class="button is-small" @click="$emit('add_bunban', cell)">분반만 추가</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
    
    
    
    <div class="field is-grouped is-grouped-centered">
      <button class="button is-small" @click="previous_page" :disabled="index == 0">이전 페이지</button>
      {{index+1}} / {{max_page+1}}
      <button class="button is-small" @click="next_page" :disabled="index == max_page">다음 페이지</button>
    </div>

  </div>
</template>
<script>
import 전공 from '../data/전공.json'
import 일반교양 from '../data/일반교양.json'
import 핵심교양 from '../data/핵심교양.json'
import 영어 from '../data/영어.json'
import 교양필수 from '../data/교양필수.json'
export default {
  name: 'subject-viewer',
  props: ['add_subject', 'add_bunban', 'desired_subject'],
  created (){
    this.list = [...전공, ...일반교양, ...핵심교양, ...영어, ...교양필수]
  },
  watch: {
    category () {
      this.index = 0
    }
  },
  computed: {
    list_page () {
      if(this.list_size < this.pagination){
        return this.filtered_list
      }
      else {
        return this.filtered_list.slice(this.index*this.pagination, (this.index+1)*this.pagination)
      }
    },
    list_size(){
      return this.filtered_list.length
    },
    max_page(){
      return Math.floor(this.list_size / this.pagination)
    },
    filtered_list (){
      let list = []
      list = this.list.filter(x=>Object.values(x).join(',').indexOf(this.search) != -1)
      if(this.category != '전체'){
        list = list.filter(x=>x.category == this.category)
      } 
      return list      
    }
  },
  methods: {
    next_page () {
      this.index = this.index==this.max_page ? this.max_page:this.index+1
    },
    previous_page() {
      this.index = this.index==0?0:this.index-1
    }
  },
  data (){
    return {
      list: [],
      index: 0,
      pagination: 12,
      search: '',
      category: '전체'
    }
  }
}
</script>
<style>
#subject-viewer{
  font-size: 0.8em;
}
table {
}
</style>
