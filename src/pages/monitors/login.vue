<template>
  <div class="container">
    <form class="form-container">
      <input type="text" class="form-control" v-model="username" placeholder="用户名" />
      <input type="password" class="form-control" v-model="password" placeholder="密码" />
    </form>
    <span @click="login" class="counter">登录</span>
    <br>
    <a href='/pages/monitors/serverEdit' class="counter">修改服务器地址</a>
  </div>
</template>
<script>
import { getStorage, setStorage } from '@/utils/wechat'
import { userLogin } from '@/utils/api'
const LAST_SPLASH_DATA = 'LAST_SPLASH_DATA'
const LAST_SUCCESS_LOGIN_INPUT = 'LAST_SUCCESS_LOGIN_INPUT'
const LAST_SUCCESS_LOGIN_TICKET = 'LAST_SUCCESS_LOGIN_TICKET'



export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },

  methods: {
    async getCache() {
      try {
        let res = await getStorage(LAST_SPLASH_DATA)
        const { movies, expires } = res.data
        // 有缓存，判断是否过期
        if (movies && expires > Date.now()) {
          return res.data
        }
        // 已经过期
        console.log('uncached')
        return null
      } catch (error) {
        return null
      }
    },

    handleStart() {
      // TODO: 访问历史的问题
      wx.switchTab({
        url: '../board/main'
      })
    },

    async getInitData() {
      let ticketCache = await getStorage(LAST_SUCCESS_LOGIN_TICKET)
      console.log('getInitData', ticketCache)

    },
    async login() {
      // let data = await userLogin({ userName: this.username, password:this.password, count: 3 })
      var app = this
      let data = await userLogin({ userName: app.username, password: app.password })
      // let data = await userLogin()
      if (data.Result.ReturnFlag._text == '0' && data.Result.ReturnMsg._text == "success") {
        wx.switchTab({
          url: '/pages/index'
        })
      }
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

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}

</style>
