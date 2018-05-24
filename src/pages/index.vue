<template>
  <div class="container">
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" canvasId="index-pie" />
    </div>
    <a href="/pages/monitors/warnList" class="exception">1<br>环境异常</a>
    <a href="/pages/monitors/warnList" class="exception">0<br>设备异常</a>
    <a href="/pages/monitors/warnList" class="exception">2<br>断电异常</a>
    <a href="/pages/monitors/warnList" class="exception">0<br>其他异常</a>
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
    backgroundColor: '#ffffff',
    color: ['#53ff53', '#ff0000', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: [{
        value: 3,
        name: '正常'
      }, {
        value: 1,
        name: '异常'
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
