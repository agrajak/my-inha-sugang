<template>
  <div id="timetable-viewer" v-if="result">
    <div v-if="result.length > 0">
      <button class="button is-small" @click="index = index==0?0:index-1" :disabled="index == 0">이전 페이지</button>
      <span class="button is-small">{{index+1}} / {{result.length}}</span>
      <button class="button is-small" @click="index = index==result.length-1?result.length-1:index+1" :disabled="index==result.length-1">다음 페이지</button>
    </div>
    <table class="table is-bordered is-fullwidth" v-if="result">
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
          <td v-for="(row, j) in col" :key="j+i*result.length">
            <span v-if="row != -1">
              {{result[index].get(row).getSubject()}}({{result[index].get(row).getPf()}})
            </span>
            </td>
        </tr>
      </tbody>
    </table>
    <div v-if="result.length > 0">
      {{result[index].getSubjects()}}
      {{result[index].getTimes()}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'timetable-viewer',
  props: ['result'],
  data (){
    return {
      index: 0
    }
  },
}
</script>
<style scoped>
#timetable-viewer{
  font-size: 0.8em;
}
</style>


