<template>
  <div class="container">
    <div class="wrap" v-for="(gateway,i1) in farmInfo.gateways" :key="gateway._attributes.Id" @click="toRoomDetail(gateway._attributes.Id)">
      <div class="left">
        <img class="imgLeft" src='/static/images/home.png'>
        <br>{{gateway._attributes.Name}}</div>
      <div class="right">
        <div v-for="(detail,i2) in gateway.details" :key="i2">{{detail}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getStorage, setStorage } from '@/utils/wechat'
import { syncGatewaysConfig, gatewayDetail, redirectToRoomDetail } from '@/utils/api'
const GATEWAY_LIST_FOR_LAST_FARM = 'GATEWAY_LIST_FOR_LAST_FARM'
const GATEWAY_CONFIG_PREFIX = 'GC_'
const CURRENT_GATEWAY = 'CURRENT_GATEWAY'
const DETAIL_LIMIT = 4
export default {
  data() {
    return {
      farmInfo: {}
    }
  },
  methods: {
    toRoomDetail(gatewayId) {
      console.log('toRoomDetail')
      redirectToRoomDetail(gatewayId)
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
      for (let gateway of this.farmInfo.gateways) {
        var cache = wx.getStorageSync(GATEWAY_CONFIG_PREFIX + gateway._attributes.Id)
        let gw = await gatewayDetail({ gatewayId: gateway._attributes.Id })
        let tmpCount = 0
        for (let sensor of gw.Result.SensorDatas.Sensor) {
          if (tmpCount >= DETAIL_LIMIT) {
            break
          }
          if (parseInt(sensor._attributes.Val) > -600) {
            for (let sensorConfig of cache.Sensors.Sensor) {
              if (sensorConfig._attributes.Id == sensor._attributes.Id) {
                if (!gateway.details) {
                  gateway.details = []
                }
                gateway.details.push(sensorConfig._attributes.Name + ':' + sensor._attributes.Val)
                tmpCount++
                break
              }
            }
          }
        }
        let tmpInfo = this.farmInfo
        this.farmInfo = {}
        this.farmInfo = tmpInfo
      }
      console.log('this.farmInfo', this.farmInfo)
    },
  },
  mounted() {
    console.log('roomList mounted')
    this.getInitData()
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
