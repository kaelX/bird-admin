<template>
   <!-- style="width:25rem" -->
  <Select ref="dataSelect" v-model="date" @on-change="pieTimeChanged" size="large">
    <Option value="0">上个月</Option>
    <Option value="1">上周</Option>
    <Option value="2">过去7天</Option>
    <Option value="3">过去30天</Option>
    <Option value="4">过去90天</Option>
    <Option value="4">过去1年</Option>
    <Option value="5">自定义时间段</Option>
  </Select>
</template>
