<template>
  <div class="container">
    <div class="wrap">
      <div class="stat">合格率(%)
        <br>0</div>
      <div class="stat">总次数
        <br>4</div>
      <div class="stat">总时长
        <br>21：20</div>
    </div>
    <div class="wrap" v-for="i in [11,12,13,14,15]" :key="i">
      <div>
        无数据 4/20 16：35 ~ 现在</div>
      <div>测试1 平均温度 无数据
      </div>
    </div>
  </div>
</template>
<script>


</script>
<style scoped>
.stat {
  align-items: center;
  width: 30%;
  text-align: center;
  float: left;
  padding: 15px 0;
}



.wrap {
  width: 100%;
  padding-left: 20px;
}

</style>
