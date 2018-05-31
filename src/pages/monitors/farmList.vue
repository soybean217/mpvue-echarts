<template>
  <div class="container">
    <div class="list" v-for="(f0,i0)  in parentLeave" :key='f0.id._text'>
      <div @click='chooseFarm(f0)'>
        {{f0.name._text}}
        <span v-if="f0.hasChild"><span v-if="f0.childShow">-</span><span v-else>+</span></span>
      </div>
      <div v-if="f0.childShow" class="list " v-for="(f1,i1) in childMapList[f0.id._text] " :key='f1.id._text'>
        <div @click='chooseFarm(f1)'>{{f1.name._text}}</div>
        <span v-if="f1.hasChild"><span v-if="f1.childShow">-</span><span v-else>+</span></span>
        <div v-if="f1.childShow" class="list " v-for="f2 in childMapList[f1.id._text] " :key='f2.id._text'>
          <div @click='chooseFarm(f2)'>{{f2.name._text}}</div>
          <span v-if="f2.hasChild"><span v-if="f2.childShow">-</span><span v-else>+</span></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getStorage, setStorage } from '@/utils/wechat'
import { userLogin, farmList, gatewayList } from '@/utils/api'
const LAST_SPLASH_DATA = 'LAST_SPLASH_DATA'
const GATEWAY_LIST_FOR_LAST_FARM = 'GATEWAY_LIST_FOR_LAST_FARM'

const DEFAULT_CHILD_SHOW = true

export default {
  data() {
    return {
      farmData: {},
      parentLeave: [],
      childMapList: {},
    }
  },

  methods: {
    async chooseFarm(farm) {
      if (farm.hasChild) {
        farm.childShow = !farm.childShow
        let tmp = this.farmData
        this.farmData = []
        this.farmData = tmp
      } else {
        let data = await gatewayList({ farmId: farm.id._text })
        if (data.Result.ReturnFlag._text == '0' && data.Result.ReturnMsg._text == "success") {
          await setStorage(GATEWAY_LIST_FOR_LAST_FARM, {
            data: { gateways: data.Result.Gateways.Gateway, farm: farm }
          })
          console.log('saved')
          wx.redirectTo({
            url: '/pages/monitors/roomList'
          })
        }
      }
    },
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
        let hasChild = false
        for (let j of this.farmData.Result.Farms.Farm) {
          if (i.id._text == j.parentId._text) {
            if (!hasChild) {
              hasChild = true
            }
            if (!this.childMapList[i.id._text]) {
              this.childMapList[i.id._text] = []
            }
            this.childMapList[i.id._text].push(j)
          }
        }
        i.hasChild = hasChild
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
