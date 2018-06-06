<template>
  <div class="container">
    <!-- <div class="wrap">
      <div class="stat">合格率(%)
        <br>0</div>
      <div class="stat">总次数
        <br>4</div>
      <div class="stat">总时长
        <br>21：20</div>
    </div> -->
    <div class="wrap">
    </div>
    <a class="wrap" href="login">
      重新登录
    </a>
    <a class="wrap" href="serverEdit">
      设置服务器
    </a>
  </div>
</template>
<script>
import { getRemindInfo, redirectToRoomDetail } from '@/utils/api'
export default {
  data() {
    return {}
  },
  methods: {

  },
  mounted() {}
}

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
