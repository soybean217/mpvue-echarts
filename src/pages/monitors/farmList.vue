<template>
  <div class="container">
    <div class="list" v-for="(f0,i0)  in parentLeave" :key='f0.id._text'>
      <div>{{f0.name._text}}</div>
      <div class="list" v-for="(f1,i1)  in childList[f0.id._text]" :key='f1.id._text'>
        <div>{{f1.name._text}}</div>
        <div class="list" v-for="f2  in childList[f1.id._text]" :key='f2.id._text'>
          <div>{{f2.name._text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getStorage, setStorage } from '@/utils/wechat'
import { userLogin } from '@/utils/api'
import { farmList } from '@/utils/api'
const LAST_SPLASH_DATA = 'LAST_SPLASH_DATA'
const LAST_SUCCESS_LOGIN_INPUT = 'LAST_SUCCESS_LOGIN_INPUT'
const LAST_SUCCESS_LOGIN_TICKET = 'LAST_SUCCESS_LOGIN_TICKET'
const DEFAULT_CHILD_SHOW = true

export default {
  data() {
    return {
      farmData: {},
      parentLeave: [],
      childList: {},
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
      // let data = await userLogin({})
      let data = await farmList()
      console.log('data', data)
      this.farmData = data
      this.procLeaveMark()
      this.initParent()
    },
    procLeaveMark() {
      for (let i of this.farmData.Result.Farms.Farm) {
        for (let j of this.farmData.Result.Farms.Farm) {
          if (i.id._text == j.parentId._text) {
            i.hasChild = true
            if (!this.childList[i.id._text]) {
              this.childList[i.id._text] = []
            }
            this.childList[i.id._text].push(j)
          }
        }
      }
    },
    initParent() {
      this.parentLeave = []
      for (let farm of this.farmData.Result.Farms.Farm) {
        if (farm.parentId._text == '-100') {
          farm.childShow = DEFAULT_CHILD_SHOW
          this.parentLeave.push(farm)
        }
      }
      console.log('initParent', this.farmData.Result.Farms.Farm)
    },
  },

  mounted() {
    console.log('mounted')
    this.getInitData()
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

.list {
  width: 100%;
  padding-left: 40rpx;
}

</style>
