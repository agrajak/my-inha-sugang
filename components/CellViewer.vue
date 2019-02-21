<template>
  <div :style="`height: ${height}em;`" class="cell">
    <span v-if="data" class="item-parent">
      <span v-if="data.공강">
      </span>
      <span v-else class="item">
        {{data.상세.getSubject()}}({{data.상세.getPf()}})
        <span class="item-hover">
          <div>
          {{data.상세.getSno()}}
          {{data.시작교시}} ~ {{data.종료교시}} <br>
          {{data.상세.getPlace()}} <br>
          {{data.상세.getBigo()}}
          </div>
        </span>
      </span>
    </span>
    <span v-else class="item-parent">
      <span v-if="time" class="item">
        {{time}}교시
        <span class="item-hover-time">
          <span v-if="time%2==1">
            {{`${time/2+8.5}시 ~ ${time/2+8.5}시 30분`}}
          </span>
          <span v-else>
            {{`${time/2+8}시 30분 ~ ${time/2+9}시`}}
          </span>
        </span>
      </span>
      <span v-if="text"> {{text}}
      </span>
    </span>
  </div>
</template>
<script>
export default {
  name: 'cell-viewer',
  props: ['data', 'height', 'time', 'text']
}
</script>
<style scoped>
.cell {
  border: 0.1px solid lightslategray;
  margin: 0 auto;
}
.item-parent {
  position: relative;
}
.item-hover {
  width: 300px;
  position: absolute;
  display: none; 
  background: rgba(0,0,0,0.8);
  color:white;
  z-index: 12;
  border-radius: 5px;
  padding: 5px;
}

.item-hover-time {
  width: 130px;
  position: absolute;
  display: none; 
  background: rgba(0,0,0,0.8);
  color:white;
  z-index: 12;
  border-radius: 5px;
  padding: 5px;
}
.item-parent:hover .item-hover{
  display: block;
}

.item-parent:hover .item-hover-time{
  display: block;
}
</style>


