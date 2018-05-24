<template>
  <div class="container">
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="detail-line" />
    </div>
    <a class="monitor">平均温度<br>无数据</a>
    <a class="monitor">点温差<br>0.0</a>
    <a class="monitor">温度1<br>无数据</a>
    <a class="monitor">温度2<br>--</a>
    <a class="monitor">温度3<br>无数据</a>
    <a class="monitor">温度4<br>--</a>
    <a class="monitor">室外温度<br>无数据</a>
    <a class="monitor">温度1<br>无数据</a>
    <a class="monitor">温度2<br>--</a>
    <a class="monitor">0<br>设备异常</a>
    <a class="monitor">2<br>断电异常</a>
    <a class="monitor">0<br>其他异常</a>
  </div>
</template>
<script>
import echarts from 'echarts'
import mpvueEcharts from 'mpvue-echarts'

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
      onInit: initChart
    }
  }
}

</script>
<style scoped>
.monitor {
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
