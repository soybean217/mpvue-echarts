<template>
  <div class="container">
    <div class="wrap" v-for="gateway in farmInfo.gateways" :key="gateway._attributes.Id" @click="toRoomDetail">
      <div class="left">
        <img class="imgLeft" src='/static/images/home.png'>
        <br>{{gateway._attributes.Name}}</div>
      <div class="right">温度：
        <br> 湿度：
        <br> 氨气：
        <br> 地暖：
      </div>
    </div>
  </div>
</template>
<script>
import { getStorage, setStorage } from '@/utils/wechat'
import { syncGatewaysConfig, gatewayDetail } from '@/utils/api'
const GATEWAY_LIST_FOR_LAST_FARM = 'GATEWAY_LIST_FOR_LAST_FARM'
const GATEWAY_CONFIGS = 'GATEWAY_CONFIGS'
export default {
  data() {
    return {
      farmInfo: {}
    }
  },
  methods: {
    toRoomDetail() {
      console.log('toRoomDetail')
      // TODO: 访问历史的问题
      // wx.switchTab({
      //   url: '/pages/monitors/roomDetail'
      // })
      // wx.navigateTo({
      //   url: 'roomDetail'
      // })
    },
    async getInitData() {
      console.log('getInitData')
      let data = await getStorage(GATEWAY_LIST_FOR_LAST_FARM)
      console.log('getInitData', data)
      wx.setNavigationBarTitle({
        title: data.data.data.farm.name._text
      })
      this.farmInfo = data.data.data
      console.log('getInitData', data)
      syncGatewaysConfig({ gateways: this.farmInfo.gateways })
      for (var gateway of this.farmInfo.gateways) {
        gatewayDetail({ gatewayId: gateway._attributes.Id })
      }
    },
  },
  mounted() {
    console.log('roomList mounted')
    this.getInitData()
    this.toRoomDetail()
  }
}

</script>
<style scoped>
.imgLeft {
  width: 40px;
  height: 40px;
}

.left {
  align-items: center;
  width: 40%;
  text-align: center;
  float: left;
  padding: 15px 0;
}

.right {
  width: 50%;
  float: left;
  padding: 5px 0;
}

.wrap {
  width: 100%;
}

</style>
