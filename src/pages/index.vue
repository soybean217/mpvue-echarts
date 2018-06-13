<template>
  <div class="container">
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="index-pie" />
    </div>
    <a href="/pages/monitors/warnList?type=1" class="exception">昨日警报<br><span class="boldNumber">{{remindCount['1']}}</span></a>
    <a href="/pages/monitors/warnList?type=2" class="exception">日常事务<br><span class="boldNumber">{{remindCount['2']}}</span></a>
    <a href="/pages/monitors/warnList?type=3" class="exception">设备到期<br><span class="boldNumber">{{remindCount['3']}}</span></a>
    <a href="/pages/monitors/warnList?type=4" class="exception">参数修改<br><span class="boldNumber">{{remindCount['4']}}</span></a>
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
    color: ['#7CCD7C', '#ff0000', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
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
    }
  },
  methods: {
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

      let data = await getAlarmInfo()
      this.normalNumber = Number(data.Result.Alarm._attributes.rate.replace('%', ''))
      console.log('data.Result.Alarm.Id', data.Result.Alarm.Id)
      data.Result.Alarm.Id = formatArray(data.Result.Alarm.Id)
      console.log('data.Result.Alarm.Id', data.Result.Alarm.Id)
      if (Array.isArray(data.Result.Alarm.Id)) {
        for (let gateway of data.Result.Alarm.Id) {
          gateway._attributes = {}
          gateway._attributes.Id = gateway._text
        }
        wx.setStorageSync(WARN_GATEWAY_LIST, {
          data: { gateways: data.Result.Alarm.Id }
        })
      }
      if (this.normalNumber > 0) {
        option.series[0].data = [{
          value: 100 - this.normalNumber,
          name: '正常栏舍',
        }, {
          value: this.normalNumber,
          name: '异常栏舍',
        }]
      } else {
        option.series[0].data = [{
          value: 100,
          name: '正常栏舍',
        }]
      }
      chartPie.clear()
      chartPie.setOption(option);
      chartPie.on("mousedown", function(params) {
        console.log('mousedown', params)
        if (params.name == "异常栏舍") {
          wx.navigateTo({
            url: '/pages/monitors/warnRoomList'
          })
        }
      });
      chartPie.on("mousedown", this.registerMouseDown)

      // this.drawChart()
    },

  },
  mounted() {
    // console.log('mounted')
    this.getInitData()
  },
  onShow() {
    console.log('onShow')
    // this.getInitData()
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
.exception {
  width: 49%;
  text-align: center;
  padding: 20px 0;
  background-color: #DBDBDB;
  border: 1px solid #f8f9fb;
}

.boldNumber {
  color: #6E8B3D;
  font-size: 30px;
  font-weight: bold;
}

.echarts-wrap {
  width: 100%;
  height: 300px;
}

</style>
