<template>
  <div class="container">
    <!-- <div class="wrap">
      <div class="stat">合格率(%)
        <br>0</div>
      <div class="stat">总次数
        <br>4</div>
      <div class="stat">总时长
        <br>21：20</div>
    </div> -->
    <div class="wrap" v-for="i in remindInfo" :key="i" @click='redirectToRoomDetail(i.basic_gateway_id._text)'>
      <div>
        {{i.typeName}} {{i.contentInfo.alarmTime}} </div>
      <div>{{i.gatewayName._text}} {{i.contentInfo.alarmMsg}}
      </div>
    </div>
  </div>
</template>
<script>
import { getRemindInfo, redirectToRoomDetail } from '@/utils/api'
export default {
  data() {
    return {
      remindInfo: [],
    }
  },
  methods: {
    redirectToRoomDetail(gatewayId) {
      redirectToRoomDetail(gatewayId)
    },
    async getInitData() {
      let remindInfo = await getRemindInfo()
      for (let info of remindInfo.Result.Reminds.Remind) {
        console.log('info.content._text', this.typeName(info.remind_type._text), info.content._text)
        if (Array.isArray(info.content._text)) {
          info.contentInfo = {}
          info.contentInfo.alarmMsg = info.content._text.join()
        } else {
          info.contentInfo = JSON.parse(info.content._text)
        }
        info.typeName = this.typeName(info.remind_type._text)
      }
      this.remindInfo = remindInfo.Result.Reminds.Remind
      console.log('getInitData end')
    },
    typeName(typeId) {
      switch (typeId) {
        case '1':
          return '栏舍警报'
          break
        case '2':
          return '日常事务'
          break
        case '3':
          return '设备到期'
          break
        case '4':
          return '参数修改'
          break
        default:
          return '未定义'
      }
    }
  },
  mounted() {
    this.getInitData()
  }
}

</script>
<style scoped>
.stat {
  align-items: center;
  width: 30%;
  text-align: center;
  float: left;
  padding: 15px 0;
}

.wrap {
  width: 100%;
  padding-left: 20px;
}

</style>
