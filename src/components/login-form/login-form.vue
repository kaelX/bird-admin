<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
      <span class="login-tip">{{loginTip}}</span>
    </FormItem>

    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import {rsaEncrypt} from '@/libs/encryption'
export default {
  name: 'LoginForm',
  props: {
    loginTip: String,
    userNameRules: {
      type: Array,
      default: () => {
        return [
          {required: true, message: '账号不能为空', trigger: 'blur'}
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: ''
      }
    }
  },
  watch: {
    loginTip (val) {
      if (val !== '') {
        const elem = document.getElementsByClassName('login-tip')[0]
        const grandElem = elem.parentNode.parentNode
        if (!grandElem.classList.contains('with-login-tip')) {
          grandElem.classList.add('with-login-tip')
        }
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: rsaEncrypt(this.form.password)
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.login-tip {
  font-size: 0.9rem;
  color: #FF6A6A !important;
}
.with-login-tip {
  margin-bottom: 0.7rem;
}
</style>
