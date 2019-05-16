<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="28">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import {moneyRecordsStatic} from '@/api/money_manage'
export default {
  name: 'money_records_static',
  components: {
    InforCard,
    CountTo
  },
  data () {
    return {
      inforCardData: [
        { title: '投资总额', icon: 'md-card', count: 0, color: '#19be6b' },
        { title: '投资回报总额', icon: 'ios-cash', count: 0, color: '#9A66E4' },
        { title: '房贷总额', icon: 'ios-home', count: 0, color: '#ff9900' },
        { title: '房租总额', icon: 'ios-home-outline', count: 0, color: '#E46CBB' }
      ]
    }
  },
  methods: {
    setData () {
      moneyRecordsStatic().then(res => {
        let data = res.data.data
        this.inforCardData[0].count = data.total_invest
        this.inforCardData[1].count = data.total_invest_return
        this.inforCardData[2].count = data.total_houseloan
        this.inforCardData[3].count = data.total_houserent
      })
    }
  },
  mounted () {
    this.setData()
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 20px;
}
.header-title{
  display: inline-block;
}
.btn-header-add{
  float: right;
  height: -webkit-fill-available;
  margin-right: 1px;
}
</style>
