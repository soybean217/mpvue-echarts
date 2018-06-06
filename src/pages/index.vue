<template>
  <div class="container">
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="index-pie" />
    </div>
    <a href="/pages/monitors/warnList" class="exception">{{remindCount['1']}}<br>栏舍警报</a>
    <a href="/pages/monitors/warnList" class="exception">{{remindCount['2']}}<br>日常事务</a>
    <a href="/pages/monitors/warnList" class="exception">{{remindCount['3']}}<br>设备到期</a>
    <a href="/pages/monitors/warnList" class="exception">{{remindCount['4']}}<br>参数修改</a>
  </div>
</template>
<script>
import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'
import { getAlarmInfo, getRemindInfo } from '@/utils/api'

let chart = null;
var option = {}

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  option = {
    backgroundColor: '#ffffff',
    color: ['#53ff53', '#ff0000', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
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
    async getInitData() {
      let data = await getAlarmInfo()
      let normalNumber = Number(data.Result.Alarm._attributes.rate.replace('%', ''))
      if (normalNumber > 0) {
        option.series[0].data = [{
          value: 100 - normalNumber,
          name: '正常',
        }, {
          value: normalNumber,
          name: '异常',
        }]
      } else {
        option.series[0].data = [{
          value: 100,
          name: '正常',
        }]
      }
      chart.setOption(option);
      let remindInfo = await getRemindInfo()
      for (let tmp in this.remindCount) {
        this.remindCount[tmp] = 0
      }
      for (let info of remindInfo.Result.Reminds.Remind) {
        if (this.remindCount[info.remind_type._text]) {
          this.remindCount[info.remind_type._text]++
        } else {
          this.remindCount[info.remind_type._text] = 1
        }
      }
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
  width: 50%;
  text-align: center;
  padding: 30px 0;
}

.link {
  width: 50%;
  text-align: center;
  padding: 10px 0;
}

.echarts-wrap {
  width: 100%;
  height: 300px;
}

</style>
