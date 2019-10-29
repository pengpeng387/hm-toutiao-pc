<template>
  <div class="container">
    <el-card class="box-card">
      <img src="../../assets/logo_index.png" alt />
      <el-form status-icon :rules="rules" :model="loginForm" ref="loginFrom">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            style="width:65%;margin-right:10px;"
            placeholder="请输入验证码"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
          <el-button type="primary" style="width:100%;" @click="submitForm('loginFrom')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
// 引入工具函数
import userLocal from '@/utils/userLocal'
export default {
  data () {
    const codeMobile = (rules, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('手机号格式有误'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        mobile: '',
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: codeMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { len: 6, message: '验证码长度有误', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    submitForm (loginForm) {
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          this.$http({
            url: 'authorizations',
            data: this.loginForm,
            method: 'post'
          })
            .then(res => {
              // 成功res是响应对象，res.data是响应主题
              // 保存用户信息(token)
              userLocal.setUser(res.data.data)
              this.$router.push('/')
            })
            .catch(() => {
              this.$message.error('手机号或验证码有误')
            })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url("../../assets/login_bg.jpg") no-repeat center / cover;
  .el-card {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      display: block;
      width: 200px;
      margin: 0 auto 30px;
    }
  }
}
</style>
