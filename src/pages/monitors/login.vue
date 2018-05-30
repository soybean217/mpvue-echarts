<template>
  <div class="container">
    <form class="form-container">
      <input type="text" class="form-control" v-model="username" placeholder="用户名" />
      <input type="password" class="form-control" v-model="password" placeholder="密码" />
    </form>
    <span @click="login" class="counter">登录</span>
  </div>
</template>
<script>
import { getStorage, setStorage } from '@/utils/wechat'
import { userLogin } from '@/utils/api'
var parseString = require('xml2js').parseString;
var convert = require('xml-js');
var fastXmlParser = require('fast-xml-parser');
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
      // let data = await userLogin({ userName: app.username, password: app.password })
      let data = await userLogin()
      console.log('data', data)
      if (data.Result.ReturnFlag._text == '0' && data.Result.ReturnMsg._text == "success") {

      }
      // var result1 = convert.xml2json(data, { compact: true });
      // console.log('result1', result1)
      // parseString(data, async function(err, result) {
      //   console.log('res2', result);
      //   console.log('res2', result.Result.ReturnFlag[0]);
      //   console.log('res2', result.Result.ReturnMsg[0]);
      //   if (result.Result.ReturnFlag[0] == '0' && result.Result.ReturnMsg[0] == "success" && result.Result.Ticket[0]) {
      //     await setStorage(LAST_SUCCESS_LOGIN_TICKET, {
      //       data: { ticket: result.Result.Ticket[0] },
      //       expires: Date.now() + 365 * 24 * 60 * 60 * 1000
      //     })
      //     await setStorage(LAST_SUCCESS_LOGIN_INPUT, {
      //       data: { userName: app.username, password: app.password },
      //       expires: Date.now() + 365 * 24 * 60 * 60 * 1000
      //     })
      //   }
      // })
      // let cache = await this.getCache()
      // if (cache) {
      //   this.movies = cache.movies
      //   return
      // }
      // let data = await getBoardData({ board: 'coming_soon', page: 1, count: 3 })
      // this.movies = data.subjects
      // await setStorage(LAST_SPLASH_DATA, {
      //   movies: data.subjects,
      //   expires: Date.now() + 1 * 24 * 60 * 60 * 1000
      // })
    }
  },

  mounted() {
    console.log('mounted')
    // this.getInitData()
    this.login()
  }
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
