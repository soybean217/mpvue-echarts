<template>
  <div class="container">
    <a class="wrap" href="login">
      重新登录
    </a>
    <a class="wrap" href="serverEdit">
      设置服务器
    </a>
    <span class="wrap" @click='logout'>
      注销
    </span>
  </div>
</template>
<script>
const LAST_SUCCESS_LOGIN_INPUT = 'LAST_SUCCESS_LOGIN_INPUT'
const LAST_SUCCESS_LOGIN_TICKET = 'LAST_SUCCESS_LOGIN_TICKET'
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      wx.setStorageSync(LAST_SUCCESS_LOGIN_INPUT, false)
      wx.setStorageSync(LAST_SUCCESS_LOGIN_TICKET, false)
      wx.showModal({
        title: '注销成功',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({ url: '/pages/monitors/login' })
          }
        }
      })
    },
  },
  mounted() {}
}

</script>
<style scoped>
body {
  background-color: #f8f9fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap {
  width: 80%;
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  text-align: center;
  color: blue;
  border: 1px solid blue;
  border-radius: 25rpx;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}

</style>
