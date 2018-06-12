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
import { getAlarmInfo, getRemindInfo } from '@/utils/api'
const WARN_GATEWAY_LIST = 'WARN_GATEWAY_LIST'

let chart = null;
var option = {}

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

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
  chart.on("mousedown", function(params) {
    if (params.name == "异常栏舍") {
      wx.navigateTo({
        url: '/pages/monitors/warnRoomList'
      })
    }
  });

  // chart.setOption(option);

  return chart; // 返回 chart 后可以自动绑定触摸操作
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
    }
  },
  methods: {
    clickPie() {
      console.log('clickPie')
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

      let data = await getAlarmInfo()
      let normalNumber = Number(data.Result.Alarm._attributes.rate.replace('%', ''))
      if (Array.isArray(data.Result.Alarm.Id)) {
        for (let gateway of data.Result.Alarm.Id) {
          gateway._attributes = {}
          gateway._attributes.Id = gateway._text
        }
        wx.setStorageSync(WARN_GATEWAY_LIST, {
          data: { gateways: data.Result.Alarm.Id }
        })
      }
      if (normalNumber > 0) {
        option.series[0].data = [{
          value: 100 - normalNumber,
          name: '正常栏舍',
        }, {
          value: normalNumber,
          name: '异常栏舍',
        }]
      } else {
        option.series[0].data = [{
          value: 100,
          name: '正常栏舍',
        }]
      }
      chart.setOption(option);
    },
  },
  mounted() {
    console.log('roomList mounted')
    this.getInitData()
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
  font-color: #6E8B3D;
  color: #6E8B3D;
  font-size: 30px;
  font-weight: bold;
}

.echarts-wrap {
  width: 100%;
  height: 300px;
}

</style>
