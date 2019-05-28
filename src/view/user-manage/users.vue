<template>
  <div>
    <Card>
      <tables ref="tables" searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete">
        <header slot="header" class="header">
          <span class="header-title">用户列表</span>
          <Page :total="totalCount" :current="currentPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-sizer></Page>
          <Button type="primary" ghost class="btn-header-add" @click="handleCreate">新增用户</Button>
        </header>
      </tables>
    </Card>
    <Modal v-model="modalVisible" :title="modalTitle">
      <UserForm @on-success-valid="handleSubmit" :form="getFormModel"/>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import UserForm from '_c/user-form'
import {getUsers, createUser, updateUser, deleteUser} from '@/api/user'
import {CreateFlag, isCreating, isSuc} from '@/api/common'
export default {
  name: 'users',
  components: {
    Tables,
    UserForm
  },
  data () {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      pageSizeOpts: [10, 20, 50, 100],
      modalTitle: '',
      modalVisible: false,
      user: {},
      columns: [
        {title: '昵称', key: 'name'},
        {
          title: '头像',
          key: 'avatar',
          render: (h, params) => {
            return h('Avatar', {attrs: {src: params.row.avatar}})
          }
        },
        {title: '角色权限', key: 'role'},
        {title: '账号状态', key: 'delete_status'},
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
      getUsers(this.currentPage, this.pageSize).then(res => {
        let data = res.data.data
        let pageInfo = data.page_info
        this.totalCount = pageInfo.total_count
        this.tableData = data.users
      })
    },
    setModalTitle (title) {
      this.modalTitle = title
    },
    setModalVisible (visible) {
      this.modalVisible = visible
    },
    setUser (user) {
      this.user = user
    },
    handleCreate () {
      this.setUser({id: CreateFlag})
      this.setModalTitle('新增用户')
      this.setModalVisible(true)
    },
    handleEdit (user) {
      this.setUser(user)
      this.setModalTitle('编辑用户')
      this.setModalVisible(true)
    },
    handleDelete (user_id) {
      deleteUser(user_id).then(res => {
        const data = res.data
        if (isSuc(data)) {
          this.setTableData()
          this.$Notice.success({title: '用户删除成功'})
        } else {
          this.$Notice.error({title: '用户删除失败', desc: data.msg})
        }
      })
    },
    createSubmit (name, avatar, password) {
      createUser(name, avatar, password).then(res => {
        this.setModalVisible(false)
        const data = res.data
        if (isSuc(data)) {
          this.setTableData()
          this.$Notice.success({title: '用户创建成功'})
        } else {
          this.$Notice.error({title: '用户创建失败', desc: data.msg})
        }
      })
    },
    updateSubmit (id, name, avatar, password) {
      updateUser(id, name, avatar, password).then(res => {
        this.setModalVisible(false)
        const data = res.data
        if (isSuc(data)) {
          this.setTableData()
          this.$Notice.success({title: '用户更新成功'})
        } else {
          this.$Notice.error({title: '用户更新失败', desc: data.msg})
        }
      })
    },
    handleSubmit ({id, name, avatar, password}) {
      if (isCreating(id)) {
        this.createSubmit(name, avatar, password)
      } else {
        this.updateSubmit(id, name, avatar, password)
      }
    }
  },
  computed: {
    getFormModel () {
      return this.user
    }
  },
  mounted () {
    this.setTableData()
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.header-title{
  margin-left: 1px;
  font-size: 1.3rem;
  font-weight: bold;
}
.btn-header-add{
  height: -webkit-fill-available;
  margin-right: 1px;
}
</style>
