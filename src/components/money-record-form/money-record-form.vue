<template>
  <Form ref="moneyRecordForm" :model="form" :rules="rules">
    <FormItem label="记录时间" prop="happened_at">
      <DatePicker type="date" placeholder="记录时间" v-model="form.happened_at"></DatePicker>
    </FormItem>

    <FormItem label="收入或支出" prop="income_flag">
      <RadioGroup v-model="form.income_flag">
        <Radio label="income">收入</Radio>
        <Radio label="outgo">支出</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="金额" prop="amount">
      <Input type="number" v-model="form.amount" placeholder="金额(单位为元，支持两位小数)"/>
    </FormItem>

    <FormItem label="标签" prop="tag_value">
      <RadioGroup v-model="form.tag_value">
        <Radio v-for="item in form.tagOptions" :label="item.value" :key="item.value">{{item.label}}</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="来源" prop="parent_id" v-if="isIncome()">
      <Select v-model="form.parent_id" placeholder="请选择来源记录" filterable clearable>
        <Option v-for="item in form.investMoneyRecords" :value="item.parent_value" :key="item.parent_value">{{item.parent_label}}</Option>
      </Select>
    </FormItem>

    <FormItem label="主体" prop="subject" v-if="!hasParent()">
      <RadioGroup v-model="form.subject">
        <Radio v-for="item in form.subjectOptions" :label="item.value" :key="item.value">{{item.label}}</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="个人份额" prop="personal_share" v-if="!hasParent() && !isSubjectNotMixed()">
      <Input type="number" v-model="form.personal_share" placeholder="个人份额(单位为元，支持两位小数)"/>
    </FormItem>

    <FormItem label="备注" prop="remark">
      <Input v-model="form.remark" placeholder="备注" clearable/>
    </FormItem>

    <FormItem>
      <Button @click="handleSubmit" type="primary" long>提交</Button>
    </FormItem>
  </Form>
</template>

<script>
import {parseDate} from '@/libs/time-and-date'
export default {
  name: 'MoneyRecordForm',
  props: {form: Object},
  data () {
    const happenedAtValidator = (rule, value, callback) => {
      let val = Date.parse(value)
      if (value === undefined || isNaN(val)) {
        callback(new Error('记录时间不能为空'))
      } else {
        callback()
      }
    }
    const happenedAtRules = [{required: true, validator: happenedAtValidator, trigger: 'blur'}]
    const incomeFlagRules = [{required: true, message: '收入或支出不能为空', trigger: 'blur'}]
    const amountValidator = (rule, value, callback) => {
      let val = parseFloat(value)
      if (isNaN(val) || val <= 0) {
        callback(new Error('金额必须大于0'))
      } else {
        callback()
      }
    }
    const amountRules = [
      {required: true, message: '金额不能为空', trigger: 'blur'},
      {validator: amountValidator, trigger: 'blur'}
    ]
    const tagRules = [{required: true, message: '标签不能为空', trigger: 'blur'}]
    const subjectRules = [{required: true, message: '主体不能为空', trigger: 'blur'}]
    const personalShareValidator = (rule, value, callback) => {
      let val = parseFloat(value)
      if (!this.isSubjectNotMixed() && (isNaN(val) || val <= 0 || val > this.form.amount)) {
        callback(new Error('主体为个人参股时个人份额必须大于0并且小于总金额'))
      } else {
        callback()
      }
    }
    const personalShareRules = [{validator: personalShareValidator, trigger: 'blur'}]
    const parentIdValidator = (rule, value, callback) => {
      if (value === undefined && this.isIncome() && this.isInvest()) {
        callback(new Error('投资收入的来源记录不能为空'))
      } else {
        callback()
      }
    }
    const parentIdRules = [{validator: parentIdValidator, trigger: 'blur'}]
    return {
      happenedAtRules: happenedAtRules,
      incomeFlagRules: incomeFlagRules,
      amountRules: amountRules,
      tagRules: tagRules,
      subject: this.form.subject,
      subjectRules: subjectRules,
      personalShareRules: personalShareRules,
      parentIdRules: parentIdRules
    }
  },
  computed: {
    rules () {
      return {
        happened_at: this.happenedAtRules,
        income_flag: this.incomeFlagRules,
        amount: this.amountRules,
        tag_value: this.tagRules,
        personal_share: this.personalShareRules,
        parent_id: this.parentIdRules
      }
    }
  },
  methods: {
    isSubjectNotMixed () {
      return this.form.subject !== 'mixed'
    },
    isIncome() {
      return this.form.income_flag === 'income'
    },
    isInvest() {
      return this.form.tag_value === 'invest'
    },
    hasParent () {
      return (this.form.parent_id !== undefined && this.form.parent_id !== null) || (this.isIncome() && this.isInvest())
    },
    handleSubmit () {
      this.form.happened_at = parseDate(this.form.happened_at)
      this.$refs.moneyRecordForm.validate((valid) => {
        if (valid) {
          if (this.form.subject === 'personal') {
            this.form.personal_share = this.form.amount
          } else if (this.form.subject === 'other') {
            this.form.personal_share = 0
          }
          this.$emit('on-success-valid', {
            id: this.form.id,
            happenedAt: this.form.happened_at,
            incomeFlag: this.form.income_flag,
            amount: this.form.amount,
            tag: this.form.tag_value,
            subject: this.form.subject,
            personalShare: this.form.personal_share,
            remark: this.form.remark,
            parentId: this.form.parent_id
          })
        }
      })
    }
  }
}
</script>
