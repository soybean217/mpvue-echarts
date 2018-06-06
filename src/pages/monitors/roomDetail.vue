<template>
  <div class="container">
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="detail-line" />
    </div>
    <div class="monitor" v-for="(detail,i1) in details" :key='i1' @click='hourDataMachine(detail)'><span class="dataTitle">{{detail.name}}</span>
      <br><span class="dataValue">{{detail.value}}</span></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'
import { gatewayDetail, detailValueFormat, hourData } from '@/utils/api'
const GATEWAY_CONFIG_PREFIX = 'GC_'
const CURRENT_GATEWAY = 'CURRENT_GATEWAY'

let chart = null;
var option = {}

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  option = {
    backgroundColor: '#fff',
    color: ['#37A2DA', '#67E0E3', '#9FE6B8'],
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 'bottom',
      // bottom: '10%',
      data: ['温度']
    },
    grid: {
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      x: 'center',
      type: 'value'
    },
    series: [{
      name: '温度',
      type: 'line',
      smooth: true,
      data: []
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
    async hourDataMachine(machine) {
      console.log('hourDataMachine machine', machine)
      let data = await hourData({ machineId: machine.config._attributes.Id })
      console.log('data', data)
      let text = data.Result.Datas._text
      if (text.indexOf('categories\:') != -1) {
        text = text.replace('categories', '\"categories\"')
      }
      if (text.indexOf('data\:') != -1) {
        text = text.replace('data', '"data"')
      }
      text = text.replace('[00,', '[0,')
      for (let i = 1; i <= 9; i++) {
        text = text.replace(',0' + i + ',', ',' + i + ',')
        text = text.replace(',0' + i + ']', ',' + i + ']')
      }
      console.log('text', text)
      let chartData = JSON.parse(text)
      console.log('chartData', chartData)
      option.legend = {
        data: [machine.name]
      }
      option.xAxis = {
        type: 'category',
        boundaryGap: false,
        data: chartData.categories
      }
      option.series = [{
        name: machine.name,
        type: 'line',
        smooth: true,
        data: chartData.data
      }]
      chart.setOption(option);
    },
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
      if (gw.Result.SensorDatas.Sensor) {
        for (let sensor of gw.Result.SensorDatas.Sensor) {
          for (let sensorConfig of cache.Sensors.Sensor) {
            if (sensorConfig._attributes.Id == sensor._attributes.Id) {
              details.push({ 'name': sensorConfig._attributes.Name, config: sensorConfig, 'value': detailValueFormat({ config: sensorConfig, item: sensor, catalog: 'sensor' }) })
              break
            }
          }
        }
      }
      if (gw.Result.ControllerDatas.Controller) {
        for (var item of gw.Result.ControllerDatas.Controller) {
          for (let config of cache.Controllers.Controller) {
            if (config._attributes.Id == item._attributes.Id) {
              details.push({ 'name': config._attributes.Name, config: config, 'value': detailValueFormat({ config: config, item: item, catalog: 'controller' }) })
              break
            }
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

.dataTitle {
  font-size: 16px;
  color: #6fb7b7;
}

.dataValue {
  font-weight: bold;
}

</style>
