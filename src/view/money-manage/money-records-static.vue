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

    <Row style="margin-top: 10px;">
      <i-col span="8">
        <Select v-model="pieDate" @on-change="pieDateChanged" size="large" placeholder="请选择时间段">
          <Option value="lastMonth">上个月</Option>
          <Option value="lastWeek">上周</Option>
          <Option value="currentMonth">本月</Option>
          <Option value="currentWeek">本周</Option>
          <Option value="pastWeek">过去7天</Option>
          <Option value="pastMonth">过去30天</Option>
          <Option value="pastQuater">过去90天</Option>
          <Option value="pastYear">过去365天</Option>
          <Option value="custom">自定义时间段</Option>
        </Select>
      </i-col>

      <i-col span="8" style="margin-left: 4px;">
        <Select v-model="subjects" :multiple="isSubjectMultiple" size="large" placeholder="请选择主体">
          <Option v-for="item in subjectOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>

      <i-col span="7" style="margin-left: 8px;">
        <Checkbox v-model="personalShareFlag" size="large" style="font-size: 1.2rem;">只统计个人份额</Checkbox>
      </i-col>
    </Row>

    <Row style="margin-top: 10px;" v-if="pieDate === 'custom'">
      <i-col span="16">
        <label class="time-at">起始时间</label>
        <DatePicker type="date" placeholder="起始时间" size="large" :editable="datePickerEditable" v-model="startDate" @on-change="startDateChanged"></DatePicker>
        <label class="time-at time-end">终止时间</label>
        <DatePicker type="date" placeholder="终止时间" size="large" :editable="datePickerEditable" v-model="endDate" @on-change="endDateChanged"></DatePicker>
      </i-col>
    </Row>

    <Row :gutter="20" style="margin-top: 4px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <ve-pie :data="totals" height='300px' :settings="pieSettings" judge-width :width-change-delay="widthChangeDelay"></ve-pie>
          <span class="pieTitle">收支对比</span>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <ve-pie :data="outgos" height='300px' :settings="pieSettings" judge-width :width-change-delay="widthChangeDelay"></ve-pie>
          <span class="pieTitle">支出详情</span>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <ve-pie :data="incomes" height='300px' :settings="pieSettings" judge-width :width-change-delay="widthChangeDelay"></ve-pie>
          <span class="pieTitle">收入详情</span>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import {ChartPie} from '_c/charts'
import {moneyRecordsStatic, staticTagPercent, options} from '@/api/moneyRecord'
import {parseDateFlag} from '@/libs/time-and-date'
export default {
  name: 'money_records_static',
  components: {
    InforCard,
    CountTo,
    ChartPie
  },
  data () {
    return {
      pieSettings: {radius: 90, offsetY: 200},
      widthChangeDelay: 100,
      pieDate: 'lastMonth',
      subjects: 'personal',
      startAt: '',
      endAt: '',
      datePickerEditable: false,
      subjectOptions: [],
      isSubjectMultiple: true,
      personalShareFlag: true,
      inforCardData: [
        { title: '投资总额', icon: 'md-card', count: 0, color: '#19be6b' },
        { title: '投资回报总额', icon: 'ios-cash', count: 0, color: '#9A66E4' },
        { title: '房贷总额', icon: 'ios-home', count: 0, color: '#ff9900' },
        { title: '房租总额', icon: 'ios-home-outline', count: 0, color: '#E46CBB' }
      ],
      totals: {
        columns: ['name', 'value'],
        rows: []
      },
      outgos: {
        columns: ['name', 'value'],
        rows: []
      },
      incomes: {
        columns: ['name', 'value'],
        rows: []
      }
    }
  },
  watch: {
    startAt (startAt) {
      this.setPieData(startAt, this.endAt, this.subjects, this.personalShareFlag)
    },
    endAt (endAt) {
      this.setPieData(this.startAt, endAt, this.subjects, this.personalShareFlag)
    },
    subjects (subjects) {
      this.setPieData(this.startAt, this.endAt, subjects, this.personalShareFlag)
    },
    personalShareFlag (flag) {
      this.setPieData(this.startAt, this.endAt, this.subjects, flag)
    }
  },
  methods: {
    setOptions () {
      options().then(res => {
        const data = res.data.data
        this.subjectOptions = data.subject_options
      })
    },

    setInforCardData () {
      moneyRecordsStatic().then(res => {
        let data = res.data.data
        this.inforCardData[0].count = data.total_invest
        this.inforCardData[1].count = data.total_invest_return
        this.inforCardData[2].count = data.total_houseloan
        this.inforCardData[3].count = data.total_houserent
      })
    },

    setPieData (startAt, endAt, subjects, personalShareFlag) {
      staticTagPercent(startAt, endAt, subjects, personalShareFlag).then(res => {
        let data = res.data.data
        this.totals.rows = data.totals
        this.outgos.rows = data.outgos
        this.incomes.rows = data.incomes
      })
    },

    pieDateChanged (dateValue) {
      this.pieDate = dateValue
      if (dateValue === 'custom') {
        this.startDate = this.startAt
        this.endDate = this.endAt
      } else {
        var dates = parseDateFlag(dateValue)
        this.startAt = dates[0]
        this.endAt = dates[1]
      }
    },

    startDateChanged(val, type) {
      this.startAt = val
    },

    endDateChanged(val, type) {
      this.endAt = val
    }
  },
  mounted () {
    this.setOptions()
    this.setInforCardData()
    this.pieDateChanged(this.pieDate)
  }
}
</script>
<style lang="less">
.count-style {
  font-size: 1rem;
}
.pieTitle {
  font-size: 1.1rem;
}
.time-at {
  font-size: 1rem;
  margin-right: 0.5rem;
}
.time-end {
  margin-left: 1.5rem;
}
</style>
