<template>
  <!-- 희망과목, 필수과목 분반 선택을 도와줍니다. -->
  <div id="subject-selector">
    <table class="table is-narrow is-hoverable is-fullwidth">
      <thead>
        <th>{{string_resources.SNO}}</th>
        <th>{{string_resources.SUBJECT}}</th>
        <th>{{string_resources.DEPARTMENT}}</th>
        <th>{{string_resources.GRADE}}</th>
        <th>{{string_resources.CREDIT}}</th>
        <th>{{string_resources.CATEGORY}}</th>
        <th>{{string_resources.TIME}}</th>
        <th>{{string_resources.PLACE}}</th>
        <th>{{string_resources.PROFESSOR}}</th>
        <th>{{string_resources.RATE}}</th>
        <th>{{string_resources.REMARK}}</th>
        <th></th>
      </thead>
      <tbody>
        <!-- 선택가능 과목들 -->
        <tr v-if="list_page.length == 0">
          <td colspan="11" class="is-centered">{{string_resources.NO_RESULT_OF_CONDITION}}</td>
        </tr>

        <tr v-else v-for="(cell, i) in list_page" :key="i+value.length">
          <td>{{cell.sno}}</td>
          <td>{{cell.subject}}</td>
          <td>{{cell.deptName}}</td>
          <td>{{cell.grade}}</td>
          <td>{{cell.credit}}</td>
          <td>{{cell.category}}</td>
          <td>{{cell.time}}</td>
          <td>{{cell.place}}</td>
          <td>{{cell.name_pf}}</td>
          <td>{{cell.rate}}</td>
          <td>{{cell.bigo}}</td>
          <td>
            <div class="buttons has-addons">
              <button
                :disabled="value.map(x=>x.code).indexOf(cell.sno.substring(0,7)) != -1"
                class="button is-small"
                @click="희망과목_추가(cell)"
              >{{string_resources.SELECT_SUBJECT}}</button>
              <button
                :disabled="value.map(x=>x.code).indexOf(cell.sno) != -1"
                class="button is-small"
                @click="희망분반_추가(cell)"
              >{{string_resources.SELECT_THE_CLASS}}</button>
            </div>
          </td>
        </tr>
        <!-- 희망과목들 -->
        <tr v-for="(cell, i) in value" :key="i" class="is-selected">
          <template v-if="cell.code.indexOf('-') == -1">
            <td>{{cell.code}}</td>
            <td>{{cell.detail.subject}}</td>
            <td>{{cell.detail.deptName}}</td>
            <td>{{cell.detail.grade}}</td>
            <td>{{cell.detail.credit}}</td>
            <td>{{cell.detail.category}}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <div class="buttons has-addons">
                <button class="button is-small" @click="희망과목_삭제(cell.code)">해당 과목 선택해제</button>
                <button
                  @click="필수과목_토글(cell.code)"
                  class="button is-small"
                  :class="{'is-link': cell.important}"
                >{{string_resources.IS_REQUIRED}}({{cell.important?'O':'X'}})</button>
              </div>
            </td>
          </template>
          <template v-else>
            <td>{{cell.code}}</td>
            <td>{{cell.detail.subject}}</td>
            <td>{{cell.detail.deptName}}</td>
            <td>{{cell.detail.grade}}</td>
            <td>{{cell.detail.credit}}</td>
            <td>{{cell.detail.category}}</td>
            <td>{{cell.detail.time}}</td>
            <td>{{cell.detail.place}}</td>
            <td>{{cell.detail.name_pf}}</td>
            <td>{{cell.detail.rate}}</td>
            <td>{{cell.detail.bigo}}</td>
            <td>
              <div class="buttons has-addons">
                <button class="button is-small" @click="희망분반_삭제(cell.code)">해당 분반 선택해제</button>
                <button
                  @click="필수과목_토글(cell.code)"
                  class="button is-small"
                  :class="{'is-link': cell.important}"
                >{{string_resources.IS_REQUIRED}}({{cell.important?'O':'X'}})</button>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <div class="field is-grouped is-grouped-centered">
      <button class="button is-small" @click="previous_page" :disabled="index == 0">이전 페이지</button>
      <span class="button is-small">{{index+1}} / {{max_page+1}}</span>
      <button class="button is-small" @click="next_page" :disabled="index == max_page">다음 페이지</button>
    </div>
  </div>
</template>
<script>
import 전공 from "../data/전공.json";
import 일반교양 from "../data/일반교양.json";
import 핵심교양 from "../data/핵심교양.json";
import 영어 from "../data/영어.json";
import 교양필수 from "../data/교양필수.json";
import { 초성찾기 } from "../utils.js";
import string_resources from "../resources/stringresources.js"

export default {
  name: "subject-selector",
  props: ["category", "search", "value", "subject"],
  created() {
    this.string_resources = string_resources;
    this.list = [...전공, ...일반교양, ...핵심교양, ...영어, ...교양필수];
  },
  watch: {
    category() {
      this.index = 0;
    },
    search() {
      this.index = 0;
    }
  },
  computed: {
    // pagination
    list_page() {
      if (this.list_size < this.pagination) {
        return this.filtered_list;
      } else {
        return this.filtered_list.slice(
          this.index * this.pagination,
          (this.index + 1) * this.pagination
        );
      }
    },
    list_size() {
      return this.filtered_list.length;
    },
    max_page() {
      return Math.floor(this.list_size / this.pagination);
    },
    // 필터는 여기서 다하기
    filtered_list() {
      let list = 초성찾기(this.list, this.search);
      // 카테고리로 필터
      if (this.category != "전체") {
        list = list.filter(x => x.category == this.category);
      }
      list = list.filter(
        x => x.deptName == undefined || x.deptName.indexOf(this.subject) != -1
      );
      return list;
    }
  },
  methods: {
    next_page() {
      this.index = this.index == this.max_page ? this.max_page : this.index + 1;
    },
    previous_page() {
      this.index = this.index == 0 ? 0 : this.index - 1;
    },
    필수과목_토글(코드) {
      const index = this.value.map(x => x.code).indexOf(코드);
      if (index != -1) {
        this.value[index].important = !this.value[index].important;
      }
      this.$emit("change", this.value);
    },
    희망과목_삭제(과목코드) {
      const index = this.value.map(x => x.code).indexOf(과목코드);
      if (index != -1) {
        this.value.splice(index, 1);
      }
      this.$emit("change", this.value);
    },
    희망분반_삭제(분반코드) {
      const index = this.value.map(x => x.code).indexOf(분반코드);
      if (index != -1) {
        this.value.splice(index, 1);
      }
      this.$emit("change", this.value);
    },
    희망과목_추가(코드) {
      // 같은 과목이 없을때
      const 과목코드 = 코드.sno.match(/(.*)-(.*)/)[1];
      if (!this.value.map(x => x.code).includes(과목코드)) {
        this.value.push({
          code: 과목코드,
          detail: 코드,
          important: true
        });
      }
      this.$emit("change", this.value);
    },
    희망분반_추가(코드) {
      const 과목코드 = 코드.sno.match(/(.*)-(.*)/)[1];
      const 분반코드 = 코드.sno;
      // 같은 분반 && 과목이 없을때
      if (
        !this.value.map(x => x.code).includes(분반코드) &&
        !this.value.map(x => x.code).includes(과목코드)
      ) {
        this.value.push({
          code: 분반코드,
          detail: 코드,
          important: true
        });
      }
      this.$emit("change", this.value);
    }
  },
  data() {
    return {
      list: [],
      index: 0,
      pagination: 12
    };
  }
};
</script>
<style>
#subject-selector {
  font-size: 0.8em;
}
</style>
