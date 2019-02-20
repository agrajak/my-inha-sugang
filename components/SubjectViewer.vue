<template>
  <div id="subject-viewer">
    <table class="table is-narrow is-hoverable is-fullwidth">
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
                <button class="button is-small is-danger" @click="$emit('delete_subject', cell.code)">해당 과목 삭제</button>
                <button @click="$emit('toggle_subject', cell.code)" class="button is-small" :class="{'is-link': cell.important}">필수여부({{cell.important?'O':'X'}})</button>
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
                <button class="button is-small is-danger" @click="$emit('delete_bunban', cell.code)">해당 분반 삭제</button>
                <button class="button is-small is-link">필수여부(O)</button>
              </div>
            </td>
          </template>
        </tr>
        <!-- 선택가능 과목들 -->
        <tr v-if="list_page.length == 0">
          <td colspan="11">조건에 해당하는 결과값이 없습니다.</td>
        </tr>

        <tr v-else v-for="(cell, i) in list_page" :key="i+desired_subject.length">
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
              <button class="button is-small" @click="$emit('add_subject', cell)">과목 선택</button>
              <button class="button is-small" @click="$emit('add_bunban', cell)">분반만 선택</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="field is-grouped is-grouped-centered">
      <button class="button is-small" @click="previous_page" :disabled="index == 0">이전 페이지</button>
      <span class="button is-small" disabled>{{index+1}} / {{max_page+1}}</span>
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
  props: ['add_subject', 'add_bunban', 'desired_subject', 'category', 'search'],
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
      pagination: 12
    }
  }
}
</script>
<style>
#subject-viewer{
  font-size: 0.8em;
}
</style>
