<template>
  <div class="container">
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="index-pie" />
    </div>
    <div class="divFull" v-if='alartCount' @click='goWarnRoomList'>
      <span class="roomWarn">报警栏舍数量：{{alartCount}}</span>
    </div>
    <!-- <div class="divB1"> -->
    <div @click="goWarnMsgList('1')" class="exception">昨日警报
      <br><span class="boldNumber">{{remindCount['1']}}</span></div>
    <div @click="goWarnMsgList('2')" class="exception">日常事务
      <br><span class="boldNumber">{{remindCount['2']}}</span></div>
    <div @click="goWarnMsgList('3')" class="exception">设备到期
      <br><span class="boldNumber">{{remindCount['3']}}</span></div>
    <div @click="goWarnMsgList('4')" class="exception">参数修改
      <br><span class="boldNumber">{{remindCount['4']}}</span></div>
    <!-- </div> -->
  </div>
</template>
<script>
import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'
import { getAlarmInfo, getRemindInfo, formatArray } from '@/utils/api'
const WARN_GATEWAY_LIST = 'WARN_GATEWAY_LIST'

var chartPie = null;
var option = {}

function initChart(canvas, width, height) {
  chartPie = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chartPie);
  // chartPie.on("mousedown", function(params) {
  //   console.log('mousedown', params)
  //   if (params.name == "异常栏舍") {
  //     wx.navigateTo({
  //       url: '/pages/monitors/warnRoomList'
  //     })
  //   }
  // });

  option = {
    backgroundColor: '#84c1ff',
    color: ['#1A9D54', '#fe0000', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
    series: [{
      label: {
        show: false,
        normal: {
          fontSize: 14
        }
      },
      labelLine: {
        show: false
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: [{
        value: 3,
        name: '正常',
      }, {
        value: 1,
        name: '异常',
      }],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  }

  // chartPie.setOption(option);

  return chartPie; // 返回 chartPie 后可以自动绑定触摸操作
}


export default {
  components: {
    mpvueEcharts
  },
  data() {
    return {
      echarts,
      onInit: initChart,
      remindCount: { "1": 0, "2": 0, "3": 0, "4": 0 },
      normalNumber: 0,
      alartCount: 0,
      needReload: false,
    }
  },
  methods: {
    goWarnMsgList(id) {
      if (this.remindCount[id] > 0) {
        wx.navigateTo({
          url: '/pages/monitors/warnList?type=' + id
        })
      }
    },
    goWarnRoomList() {
      wx.navigateTo({
        url: '/pages/monitors/warnRoomList'
      })
    },
    async getInitData() {
      let remindInfo = await getRemindInfo()
      for (let tmp in this.remindCount) {
        this.remindCount[tmp] = 0
      }
      if (!Array.isArray(remindInfo.Result.Reminds.Remind)) {
        let tmpInfo = remindInfo.Result.Reminds.Remind
        remindInfo.Result.Reminds.Remind = []
        remindInfo.Result.Reminds.Remind.push(tmpInfo)
      }
      for (let info of remindInfo.Result.Reminds.Remind) {
        if (this.remindCount[info.remind_type._text]) {
          this.remindCount[info.remind_type._text]++
        } else {
          this.remindCount[info.remind_type._text] = 1
        }
      }
      this.alartCount = 0
      let data = await getAlarmInfo()
      this.normalNumber = Number(data.Result.Alarm._attributes.rate.replace('%', '')).toFixed(0)
      if (data.Result.Alarm.Id) {
        data.Result.Alarm.Id = formatArray(data.Result.Alarm.Id)
        this.alartCount = data.Result.Alarm.Id.length
        if (Array.isArray(data.Result.Alarm.Id)) {
          for (let gateway of data.Result.Alarm.Id) {
            gateway._attributes = {}
            gateway._attributes.Id = gateway._text
          }
          wx.setStorageSync(WARN_GATEWAY_LIST, {
            data: { gateways: data.Result.Alarm.Id }
          })
        }
      }
      if (this.normalNumber > 0) {
        option.series[0].data = [{
          value: 100 - this.normalNumber,
          name: '正常' + (100 - this.normalNumber) + '%',
        }, {
          value: this.normalNumber,
          name: '异常' + this.normalNumber + '%',
        }]
      } else {
        option.series[0].data = [{
          value: 100,
          name: '正常100%',
        }]
      }
      chartPie.clear()
      chartPie.setOption(option);
      chartPie.off("mousedown")
      chartPie.on("mousedown", function(params) {
        console.log('mousedown', params)
        if (params.name.startsWith("异常")) {
          wx.navigateTo({
            url: '/pages/monitors/warnRoomList'
          })
        }
      });
      // this.drawChart()
    },
  },
  mounted() {
    // console.log('mounted')
    this.getInitData()
    this.needReload = true
  },
  onShow() {
    console.log('onShow')
    if (this.needReload) {
      this.getInitData()
    }

    // chartPie.on("mousedown", function(params) {
    //   console.log('mousedown', params)
    //   if (params.name == "异常栏舍") {
    //     wx.navigateTo({
    //       url: '/pages/monitors/warnRoomList'
    //     })
    //   }
    // });
    // chartPie.setOption(option);
  }
}

</script>
<style scoped>
.divFull {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 5px;
}

.divB1 {
  width: 90%;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}

.exception {
  width: 360rpx;
  float: left;
  text-align: center;
  padding: 20px 0;
  /*
  background-color: #DBDBDB;
  */
  font-weight: bold;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 25rpx;
}

.boldNumber {
  color: #6E8B3D;
  font-size: 30px;
  font-weight: bold;
}

.container {
  height: 100%;
  display: flex;
  /*
  flex-direction: column;
  */
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.echarts-wrap {
  width: 100%;
  height: 300px;
}

</style>
