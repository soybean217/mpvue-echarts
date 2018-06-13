<template>
  <div class="container">
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="detail-line" />
    </div>
    <div class="divFull" v-if="status.alarm"><span class="roomWarn">报警：{{status.alarm}}</span></div>
    <div class="divFull">
      <div class="status">
        日龄：{{status.days}}
      </div>
      <div class="status">
        状态：{{status.online}}
      </div>
      <div class="status">
        通风级别：{{status.vLevel}}
      </div>
      <div class="status">
        运行模式：{{status.runMode}}
      </div>
    </div>
    <div class="monitors">
      <div class="monitor" v-bind:class="{ monitorSelected: detail.isSelected }" v-for="(detail,i1) in details" :key='i1' @click='selectMachine(detail)'><span class="dataTitle">{{detail.name}}</span>
        <br><img v-if="detail.icon" class="imgIcon" :src="detail.icon" /><span v-else class="dataValue">{{detail.value}}</span></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'
import { gatewayDetail, detailValueFormat, hourData, minData } from '@/utils/api'
const GATEWAY_CONFIG_PREFIX = 'GC_'
const CURRENT_GATEWAY = 'CURRENT_GATEWAY'

var chart = null;
var option = {}

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });

  canvas.setChart(chart);

  option = {
    // backgroundColor: '#fff',
    backgroundColor: 'rgba(128, 128, 128, 0)',
    color: ['#37A2DA', '#67E0E3', '#9FE6B8'],
    // tooltip: {
    //   trigger: 'axis'
    // },
    legend: {
      bottom: '10%',
      data: ['温度']
    },
    grid: {
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      // axisPointer: {
      //   label: {
      //     formatter: function(params) {
      //       console.log('params', params)
      //     }
      //   }
      // },
    },
    yAxis: {
      x: 'center',
      type: 'value'
    },
    series: [{
      name: '温度',
      type: 'line',
      symbolSize: 16,
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
      details: [],
      status: {},
      selectedHour: '',
      timeType: 'hour'
    }
  },
  methods: {
    selectMachine(sensor) {
      if (sensor.catalog == 'sensor') {
        let countSelected = 0
        for (let item of this.details) {
          if (item.isSelected) {
            countSelected++
            if (countSelected >= 3) {
              break;
            }
          }
        }
        if (countSelected != 3) {
          sensor.isSelected = !sensor.isSelected
          this.refreshDetails()
        } else {
          if (sensor.isSelected) {
            sensor.isSelected = !sensor.isSelected
            this.refreshDetails()
          }
        }
      }
    },
    refreshDetails() {
      let tmpDetails = this.details
      this.details = []
      this.details = tmpDetails
      if (this.timeType == 'hour') {
        this.hourDataMachine()
      } else {
        this.minDataMachine()
      }
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    procChartData(text) {
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
      return JSON.parse(text)
    },
    async hourDataMachine() {
      option.legend.data = []
      option.series = []
      for (let sensor of this.details) {
        if (sensor.isSelected) {
          // console.log('hourDataMachine sensor', sensor)
          let data = await hourData({ machineId: sensor.config._attributes.Id })
          let chartData = this.procChartData(data.Result.Datas._text)
          option.legend.data.push(sensor.name)
          option.xAxis = {
            type: 'category',
            boundaryGap: false,
            data: chartData.categories
          }
          option.series.push({
            name: sensor.name,
            type: 'line',
            symbolSize: 16,
            smooth: true,
            data: chartData.data
          })
        }
      }
      option.title = {
        left: '40%',
        text: '小时数据',
        textStyle: {
          fontSize: 16,
        }
      }
      // console.log('chartData', chartData)
      // option.legend.data = [sensor.name]
      chart.clear()
      chart.setOption(option);
      this.timeType = 'hour'
      chart.off("mousedown");
      let app = this
      chart.on("mousedown", function(params) {
        console.log('mousedown', params)
        app.selectedHour = params.name
        app.minDataMachine()
      });
    },
    async minDataMachine() {
      option.legend.data = []
      option.series = []
      // console.log('this.details', this.details)
      for (let sensor of this.details) {
        if (sensor.isSelected) {
          let data = await minData({ machineId: sensor.config._attributes.Id, hour: this.selectedHour })
          let chartData = this.procChartData(data.Result.Datas._text)
          option.legend.data.push(sensor.name)
          option.xAxis = {
            type: 'category',
            boundaryGap: false,
            data: chartData.categories
          }
          option.series.push({
            name: sensor.name,
            type: 'line',
            symbolSize: 16,
            smooth: true,
            data: chartData.data
          })
        }
      }
      // console.log('chartData', chartData)
      // option.legend.data = [sensor.name]
      option.title = {
        left: '33%',
        text: this.selectedHour + '点的分钟数据',
        textStyle: {
          fontSize: 16,
        }
      }
      chart.clear()
      chart.setOption(option);
      this.timeType = 'minute'
      chart.off("mousedown");
      let app = this
      chart.on("mousedown", function(params) {
        console.log('mousedown', params)
        app.hourDataMachine()
      });
    },
    async getInitData() {
      let gatewayId = wx.getStorageSync(CURRENT_GATEWAY)
      // console.log('getInitData', gatewayId)
      let cache = wx.getStorageSync(GATEWAY_CONFIG_PREFIX + '' + gatewayId)
      console.log('gateway config cache', cache)
      wx.setNavigationBarTitle({
        title: cache._attributes.Name
      })
      let gw = await gatewayDetail({ gatewayId: gatewayId })
      console.log('gw', gw)
      this.status = {}
      this.status.days = gw.Result.Days._text
      this.status.online = gw.Result.OnLine._text == 'Y' ? '在线' : '离线'
      if (gw.Result.Alarm) {
        this.status.alarm = gw.Result.Alarm._text
      }
      this.status.vLevel = gw.Result.VLevel._text
      this.status.runMode = this.getRunModeText(gw.Result.RunMode._text)
      let details = []
      if (gw.Result.SensorDatas.Sensor) {
        for (let sensor of gw.Result.SensorDatas.Sensor) {
          for (let sensorConfig of cache.Sensors.Sensor) {
            if (sensorConfig._attributes.Id == sensor._attributes.Id) {
              details.push({
                isSelected: false,
                catalog: 'sensor',
                'name': sensorConfig._attributes.Name,
                config: sensorConfig,
                'value': detailValueFormat({ config: sensorConfig, item: sensor, catalog: 'sensor' })
              })
              break
            }
          }
        }
      }
      if (gw.Result.ControllerDatas.Controller) {
        for (var item of gw.Result.ControllerDatas.Controller) {
          for (let config of cache.Controllers.Controller) {
            if (config._attributes.Id == item._attributes.Id) {
              details.push({
                isSelected: false,
                catalog: 'controller',
                'name': config._attributes.Name,
                config: config,
                'value': detailValueFormat({ config: config, item: item, catalog: 'controller' }),
                'icon': this.getControlIcon({ config: config, item: item, catalog: 'controller' }),
              })
              break
            }
          }
        }
      }
      this.details = details
    },
    getControlIcon({ config = {}, item = {} } = {}) {
      let dictory = '/static/images/breed/'
      if (item._attributes.Degree.length > 0 && item._attributes.Degree != '0') {
        return false
      } else {
        switch (item._attributes.Val) {
          case '0':
            return dictory + config._attributes.Type.toLowerCase() + '_forwardoff.png'
          case '1':
            return dictory + config._attributes.Type.toLowerCase() + '_forwardinhandon.png'
          case '2':
            return dictory + config._attributes.Type.toLowerCase() + '_forwardinhandon.png'
          case '3':
            return dictory + config._attributes.Type.toLowerCase() + '_forwarderror.png'
          default:
            return false
        }
      }
    },
    getRunModeText(mode) {
      switch (mode) {
        case "1":
          return "智能模式"
        case "2":
          return "受控模式"
        case "10":
          return "最小通风"
        case "11":
          return "横向通风"
        case "12":
          return "过渡通风"
        case "13":
          return "隧道通风"
        case "99":
          return "空舍模式"
        default:
          return "未定义"
      }
    },
  },
  onHide() {
    console.log('onHide')
  },
  onUnload() {
    console.log('onUnload')
  },
  mounted() {
    console.log('roomDetail mounted', getCurrentPages())
    this.getInitData()
  }
}

</script>
<style scoped>
.divFull {
  width: 100%;
  text-align: center;
  font-size: 14px;
}


.monitor {
  float: left;
  width: 24%;
  height: 60px;
  text-align: center;
  padding: 30rpx 0;
  /*
  background-color: #DBDBDB;
  */
  background-color: #fff;
  border: 1px solid #f8f9fb;
  border-radius: 25rpx;
}

.status {
  font-size: 14px;
  padding: 0 0 5px;
  float: left;
  width: 48%;
  background-color: #f3f3f3;
  border: 1px solid #f8f9fb;
}

.monitorSelected {
  background-color: #99FFFF;
}

.imgIcon {
  width: 40px;
  height: 40px;
}

.monitors {
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
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
  font-size: 14px;
}

.dataValue {
  font-weight: bold;
  font-size: 16px;
  color: #6E8B3D;
}

</style>
