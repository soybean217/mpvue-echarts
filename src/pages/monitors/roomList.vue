<template>
  <div class="container">
    <div class="wrap" v-for="i in [1,2,3,4,5]" :key="i" @click="toRoomDetail">
      <div class="left">
        <img class="imgLeft" src='/static/images/home.png'>
        <br>{{i}}号舍</div>
      <div class="right">温度：29
        <br> 湿度：82.9 RH
        <br> 氨气：21.0 PPM
        <br> 地暖：21.4
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    toRoomDetail() {
      console.log('toRoomDetail')
      // TODO: 访问历史的问题
      wx.switchTab({
        url: '/pages/monitors/roomDetail'
      })
      // wx.navigateTo({
      //   url: 'roomDetail'
      // })
    },
  },
}

</script>
<style scoped>
.imgLeft {
  width: 40px;
  height: 40px;
}

.left {
  align-items: center;
  width: 30%;
  text-align: center;
  float: left;
  padding: 15px 0;
}

.right {
  width: 60%;
  float: left;
  padding: 5px 0;
}

.wrap {
  width: 100%;
}

</style>
