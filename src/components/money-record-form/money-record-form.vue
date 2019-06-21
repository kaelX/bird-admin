<template>
  <Form ref="moneyRecordForm" :model="form" :rules="rules">
    <FormItem label="记录时间" prop="happened_at">
      <DatePicker type="date" placeholder="记录时间" v-model="form.happened_at" @on-change="happenedAtChanged"></DatePicker>
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
        <Radio v-for="item in form.moneyRecordTags" :label="item.label" :key="item.label">{{item.value}}</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="来源" prop="parent_id" v-if="form.income_flag === 'income'">
      <Select v-model="form.parent_id" placeholder="请选择来源记录" filterable>
        <Option v-for="item in form.investMoneyRecords" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
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
        this.form.amountVal = val
        callback()
      }
    }
    const amountRules = [
      {required: true, message: '金额不能为空', trigger: 'blur'},
      {validator: amountValidator, trigger: 'blur'}
    ]
    const tagRules = [{required: true, message: '标签不能为空', trigger: 'blur'}]
    const parentIdValidator = (rule, value, callback) => {
      console.log(value)
      if (value === undefined && this.form.income_flag === 'income' && this.form.tag_value === 'invest') {
        callback(new Error('投资收入的来源记录不能为空'))
      } else {
        callback()
      }
    }
    const parentIdRules = [{validator: parentIdValidator, trigger: 'blur'}]
    return {
      happenedAt: '',
      happenedAtRules: happenedAtRules,
      incomeFlagRules: incomeFlagRules,
      amountRules: amountRules,
      tagRules: tagRules,
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
        parent_id: this.parentIdRules
      }
    }
  },
  methods: {
    happenedAtChanged (val, type) {
      this.happenedAt = val
    },

    handleSubmit () {
      this.$refs.moneyRecordForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            id: this.form.id,
            happenedAt: this.happenedAt,
            incomeFlag: this.form.income_flag,
            amount: this.form.amountVal,
            tag: this.form.tag_value,
            remark: this.form.remark,
            parentId: this.form.parent_id
          })
        }
      })
    }
  }
}
</script>
