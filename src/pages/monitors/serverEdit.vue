<template>
  <div class="container">
    <form class="form-container">
      <input type="text" class="formControl" v-model="serverHost" placeholder="服务器地址" />
    </form>
    <span @click="modifyServer" class="smallBtn">修改</span>
  </div>
</template>
<script>
import { getStorage, setStorage } from '@/utils/wechat'
import { userLogin } from '@/utils/api'
import request from '@/utils/request'
const LAST_SPLASH_DATA = 'LAST_SPLASH_DATA'
const LAST_SUCCESS_LOGIN_INPUT = 'LAST_SUCCESS_LOGIN_INPUT'
const LAST_SUCCESS_LOGIN_TICKET = 'LAST_SUCCESS_LOGIN_TICKET'



export default {
  data() {
    return {
      serverHost: wx.getStorageSync('SERVER_HOST'),
    }
  },

  methods: {
    modifyServer() {
      wx.setStorageSync('SERVER_HOST', this.serverHost)
      request.initConfig()
      wx.showModal({
        title: '服务器地址',
        content: '已修改',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({ url: '/pages/monitors/login' })
          }
        }
      })
    }
  },

  mounted() {}
}

</script>
<style scoped>
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
