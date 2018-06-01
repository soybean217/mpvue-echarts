<template>
  <div class="container">
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="detail-line" />
    </div>
    <div class="monitor" v-for="(detail,i1) in details" :key='i1'>{{detail.name}}
      <br>{{detail.value}}</div>
    <a class="monitor">0<br>设备异常</a>
    <a class="monitor">2<br>断电异常</a>
    <a class="monitor">0<br>其他异常</a>
  </div>
</template>
<script>
import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'
import { gatewayDetail, detailValueFormat } from '@/utils/api'
const GATEWAY_CONFIG_PREFIX = 'GC_'
const CURRENT_GATEWAY = 'CURRENT_GATEWAY'

let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: '#fff',
    color: ['#37A2DA', '#67E0E3', '#9FE6B8'],

    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['温度1', '温度2', '温度3']
    },
    grid: {
      containLabel: true
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00']
    },
    yAxis: {
      x: 'center',
      type: 'value'
    },
    series: [{
      name: '温度1',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }, {
      name: '温度2',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: '温度3',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  }

  chart.setOption(option);

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
      details: []
    }
  },
  methods: {
    async getInitData() {
      let gatewayId = wx.getStorageSync(CURRENT_GATEWAY)
      console.log('getInitData', gatewayId)
      let cache = wx.getStorageSync(GATEWAY_CONFIG_PREFIX + '' + gatewayId)
      console.log('getInitData', cache)
      wx.setNavigationBarTitle({
        title: cache._attributes.Name
      })
      let gw = await gatewayDetail({ gatewayId: gatewayId })
      console.log('gw', gw)
      let details = []
      for (let sensor of gw.Result.SensorDatas.Sensor) {
        for (let sensorConfig of cache.Sensors.Sensor) {
          if (sensorConfig._attributes.Id == sensor._attributes.Id) {
            details.push({ 'name': sensorConfig._attributes.Name, 'value': detailValueFormat({ config: sensorConfig, item: sensor, catalog: 'sensor' }) })
            break
          }
        }
      }
      for (let item of gw.Result.ControllerDatas.Controller) {
        for (let config of cache.Controllers.Controller) {
          if (config._attributes.Id == item._attributes.Id) {
            details.push({ 'name': config._attributes.Name, 'value': detailValueFormat({ config: config, item: item, catalog: 'controller' }) })
            break
          }
        }
      }
      this.details = details
    },
  },
  mounted() {
    console.log('roomDetail mounted', getCurrentPages())
    this.getInitData()
  }
}

</script>
<style scoped>
.monitor {
  float: left;
  width: 25%;
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
