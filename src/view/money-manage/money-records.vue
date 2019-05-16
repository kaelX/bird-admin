<template>
  <div>
    <Card>
      <tables ref="tables" searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete">
        <header slot="header" class="header">
          <p class="header-title">资金流水记录</p>
          <Page :total="totalCount" :current="currentPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-sizer></Page>
          <Button type="primary" ghost class="btn-header-add" @click="handleCreate">新增记录</Button>
        </header>
      </tables>
    </Card>

    <Modal v-model="modalVisible" :title="modalTitle">
      <MoneyRecordForm @on-success-valid="handleSubmit" :form="getFormModel"/>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import MoneyRecordForm from '_c/money-record-form'
import {CreateFlag, isCreating, isSuc} from '@/api/common'
import {getMoneyRecords, createMoneyRecord, updateMoneyRecord, deleteMoneyRecord, getAllTag} from '@/api/money_manage'
export default {
  name: 'money_records',
  components: {
    Tables,
    MoneyRecordForm
  },
  data () {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      pageSizeOpts: [10, 20, 50, 100],
      modalTitle: '',
      modalVisible: false,
      moneyRecord: {},
      investMoneyRecords: [],
      moneyRecordTags: [],
      columns: [
        { title: '发生时间', key: 'happened_at_str', sortable: true },
        {
          title: '收入或支出',
          key: 'income_flag',
          filters: [
            {
              label: '收入',
              value: 'income'
            },
            {
              label: '支出',
              value: 'outgo'
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            return row.income_flag.indexOf(value) > -1
          }
        },
        { title: '金额', key: 'amount', sortable: true },
        {
          title: '标签',
          key: 'tag_label',
          filters: [],
          filterMultiple: false,
          filterMethod (value, row) {
            return row.tag_label.indexOf(value) > -1
          }
        },
        {title: '备注', key: 'remark'},
        {
          title: '操作',
          key: 'id',
          searchable: false,
          render: (h, params) => {
            return [
              h('Button', {
                attrs: {
                  icon: 'md-create',
                  size: 'large',
                  style: 'border: none;'
                },
                on: {
                  click: () => { this.handleEdit(params.row) }
                }
              }),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {'on-ok': () => { this.handleDelete(params.row.id) }}
              }, [
                h('Button', {
                  attrs: {
                    icon: 'md-trash',
                    size: 'large',
                    style: 'margin-left: 1px;border: none'
                  }
                })
              ])
            ]
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    changePage (currentPage) {
      this.currentPage = currentPage
      this.setTableData()
    },
    changePageSize (currentPageSize) {
      this.pageSize = currentPageSize
      this.setTableData()
    },
    setTableData () {
      getMoneyRecords(this.currentPage, this.pageSize).then(res => {
        let data = res.data.data
        let pageInfo = data.page_info
        this.totalCount = pageInfo.total_count
        this.tableData = data.money_records
        this.investMoneyRecords = data.invest_money_records
      })
    },
    setMoneyRecordTags () {
      getAllTag().then(res => {
        this.moneyRecordTags = res.data.data
        const len = this.moneyRecordTags.length
        for (var i = 0; i < len; i++) {
          var item = this.moneyRecordTags[i]
          this.columns[3].filters.push({label: item.value, value: item.value})
        }
      })
    },
    setModalTitle (title) {
      this.modalTitle = title
    },
    setModalVisible (visible) {
      this.modalVisible = visible
    },
    setMoneyRecord (moneyRecord) {
      this.moneyRecord = moneyRecord
      this.moneyRecord.investMoneyRecords = this.investMoneyRecords
      this.moneyRecord.moneyRecordTags = this.moneyRecordTags
    },
    handleCreate () {
      this.setMoneyRecord({id: CreateFlag})
      this.setModalTitle('新增资金流水记录')
      this.setModalVisible(true)
    },
    handleEdit (moneyRecord) {
      this.setMoneyRecord(moneyRecord)
      this.setModalTitle('编辑流水记录')
      this.setModalVisible(true)
    },
    handleDelete (moneyRecordId) {
      deleteMoneyRecord(moneyRecordId).then(res => {
        const data = res.data
        if (isSuc(data)) {
          this.setTableData()
          this.$Notice.success({title: '记录删除成功'})
        } else {
          this.$Notice.error({title: '记录删除失败', desc: data.msg})
        }
      })
    },
    createSubmit (happenedAt, incomeFlag, amount, tag, remark, parentId) {
      createMoneyRecord(happenedAt, incomeFlag, amount, tag, remark, parentId).then(res => {
        this.setModalVisible(false)
        const data = res.data
        if (isSuc(data)) {
          this.setTableData()
          this.$Notice.success({title: '记录创建成功'})
        } else {
          this.$Notice.error({title: '记录创建失败', desc: data.msg})
        }
      })
    },
    updateSubmit (id, happenedAt, incomeFlag, amount, tag, remark, parentId) {
      updateMoneyRecord(id, happenedAt, incomeFlag, amount, tag, remark, parentId).then(res => {
        this.setModalVisible(false)
        const data = res.data
        if (isSuc(data)) {
          this.setTableData()
          this.$Notice.success({title: '记录更新成功'})
        } else {
          this.$Notice.error({title: '记录更新失败', desc: data.msg})
        }
      })
    },
    handleSubmit ({id, happenedAt, incomeFlag, amount, tag, remark, parentId}) {
      if (isCreating(id)) {
        this.createSubmit(happenedAt, incomeFlag, amount, tag, remark, parentId)
      } else {
        this.updateSubmit(id, happenedAt, incomeFlag, amount, tag, remark, parentId)
      }
    }
  },
  computed: {
    getFormModel () {
      return this.moneyRecord
    }
  },
  mounted () {
    this.setTableData()
    this.setMoneyRecordTags()
  }
}
</script>

<style lang="less">
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.header-title {
  font-size: 1.3rem;
  font-weight: bold;
}
.btn-header-add {
  height: -webkit-fill-available;
  margin-right: 1px;
}
</style>
