<template>
  <Form ref="moneyRecordForm" :model="form" inline>
    <FormItem label="记录时间" prop="happened_at">
      <DatePicker type="date" placeholder="记录时间" v-model="form.happened_at"></DatePicker>
    </FormItem>

    <FormItem label="收入或支出" prop="income_flag">
      <Select v-model="form.income_flag" placeholder="收入或支出">
        <Option value="income">收入</Option>
        <Option value="outgo">支出</Option>
      </Select>
    </FormItem>

    <!-- <FormItem label="金额" prop="amount">
      <Input type="number" v-model="form.amount" placeholder="金额(单位为元，支持两位小数)"/>
    </FormItem> -->

    <FormItem label="标签" prop="tag_value">
      <Select v-model="form.tag_value" placeholder="请选择标签" filterable>
        <Option v-for="item in form.moneyRecordTags" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
    </FormItem>

    <FormItem label="来源" prop="parent_id">
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
  name: 'MoneyRecordSearchForm',
  props: {form: Object},
  methods: {
    handleSubmit () {
      this.$refs.moneyRecordForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            id: this.form.id,
            happenedAt: this.form.happened_at_str,
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
