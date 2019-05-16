<template>
  <Form ref="userForm" :model="form" :rules="rules">
    <FormItem label="昵称" prop="name">
      <Input v-model="form.name" placeholder="昵称" clearable/>
    </FormItem>
    <FormItem label="头像" prop="avatar">
      <Input v-model="form.avatar" placeholder="头像" clearable/>
    </FormItem>
    <FormItem label="密码" prop="password">
      <Input type="password" v-model="form.password" placeholder="密码" clearable/>
    </FormItem>
    <FormItem label="确认密码" prop="passwordConfirm">
      <Input type="password" v-model="form.passwordConfirm" placeholder="再次输入密码" clearable/>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>提交</Button>
    </FormItem>
  </Form>
</template>

<script>
import {checkName} from '@/api/user'
import {isSuc} from '@/api/common'
import {rsaEncrypt} from '@/libs/encryption'
export default {
  name: 'UserForm',
  props: {form: Object},
  data () {
    const nameUniquenessValidator = (rule, value, callback) => {
      checkName(this.form.id, value).then(res => {
        const data = res.data
        if (!isSuc(data)) {
          callback(new Error(data.msg))
        } else {
          callback()
        }
      }).catch(err => {
        callback(err)
      })
    }
    const passwordConfirmValidator = (rule, value, callback) => {
      if (value !== this.form.password) {
        if (this.form.password !== undefined || (this.form.password === undefined && value !== '')) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const nameRules = [
      {required: true, message: '昵称不能为空', trigger: 'blur'},
      {validator: nameUniquenessValidator, trigger: 'blur'}
    ]
    const passwordConfirmRules = {validator: passwordConfirmValidator, trigger: 'blur'}
    return {
      nameRules: nameRules,
      passwordConfirmRules: passwordConfirmRules
    }
  },
  computed: {
    rules () {
      return {
        name: this.nameRules,
        passwordConfirm: this.passwordConfirmRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          if (this.form.password === undefined) {
            this.form.password = ''
          }
          this.$emit('on-success-valid', {
            id: this.form.id,
            name: this.form.name,
            avatar: this.form.avatar,
            password: rsaEncrypt(this.form.password)
          })
        }
      })
    }
  }
}
</script>
