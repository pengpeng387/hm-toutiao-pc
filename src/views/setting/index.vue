<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <plugin-crumbs>个人设置</plugin-crumbs>
      </div>
      <el-row>
        <!-- 表单 -->
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机号：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input :rows="3" type="textarea" v-model="userInfo.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            :http-request="uploadPhoto"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/eventBus'
import userLocal from '@/utils/userLocal'
export default {
  data () {
    return {
      userInfo: {
        name: null,
        intro: null,
        email: null,
        photo: null
      }
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.userInfo = data
    },
    // 发送修改请求
    async saveInfo () {
      await this.$http.patch('user/profile', {
        name: this.userInfo.name,
        intro: this.userInfo.intro,
        email: this.userInfo.email
      })
      // 更新home组件的用户名
      eventBus.$emit('userName', this.userInfo.name)
      // 更新本地存储的用户名
      const data = userLocal.getUser()
      data.name = this.userInfo.name
      userLocal.setUser(data)
      // 提示信息
      this.$message.success('修改成功')
    },
    // 修改头像
    async uploadPhoto (res) {
      // 拿到修改后的图片
      let file = res.file
      // 创建一个formData的对象
      let formData = new FormData()
      // 把图片数据添加进去
      formData.append('photo', file)
      const {
        data: { data }
      } = await this.$http.patch('user/photo', formData)
      // 预览效果
      this.userInfo.photo = data.photo
      // 更新home组件的用户名
      eventBus.$emit('photo', this.userInfo.photo)
      // 更新本地存储
      const user = userLocal.getUser()
      user.photo = this.userInfo.photo
      userLocal.setUser(user)
      // 提示信息
      this.$message.success('修改成功')
    }
  }
}
</script>

<style scoped lang='less'></style>
