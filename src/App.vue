<script>
export default {
  created() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}

</script>
<style>
.container {
  /*
  height: 100vh;
  */
  display: flex;
  align-items: center;
  /*
  background-color: #f8f9fb;
  justify-content: space-between;
*/
  padding: 10rpx 0;
  box-sizing: border-box;
  flex-wrap: wrap;
}

body {
  background-color: #f1f1f1;
}

.bigBtn
 {
  width: 80%;
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  text-align: center;
  color: black;
  border: 1px solid #000;
  border-radius: 25rpx;
  box-shadow: 2px 2px 5px #000;
}

.smallBtn
 {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: black;
  border: 1px solid #000;
  border-radius: 25rpx;
  box-shadow: 2px 2px 5px #000;
}

.formControl {
  display: block;
  padding: 5px 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5rpx;
}


.roomWarn {
  background: red;
  animation: myblink 3s;
  animation-iteration-count: infinite;
}

@keyframes myblink {
  0% {
    background: red;
  }
  50% {
    background: yellow;
  }
  100% {
    background: red;
  }
}

</style>
