<template>
  <el-container class="container">
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="logo" :class="{smallLogo:isCollapse}"></div>
      <el-menu
        default-active="/"
        class="el-menu-vertical-demo"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        :router="true"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span class="el-icon-s-fold icon" @click="toggleMenu"></span>
        <span class="text">江苏传智播客科技教育有限公司</span>
        <el-dropdown  @command="handleCommand">
          <span class="el-dropdown-link" >
            <img class="headIcon" :src="photo" alt />
            <span class="username">{{name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="logout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import userLocal from '@/utils/userLocal'
export default {
  data () {
    return {
      // 折叠菜单栏设的参数
      isCollapse: false,
      // 头像
      photo: '',
      // 名称
      name: ''
    }
  },
  methods: {
    // 点击折叠菜单栏
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    },
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      userLocal.delUser()
      this.$router.push('/login')
    },
    handleCommand (command) {
      this[command]()
    }
  },
  created () {
    // 得到数据
    const data = userLocal.getUser() || {}
    // 赋值
    this.photo = data.photo
    this.name = data.name
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background-color: #002033;
    .logo {
      height: 60px;
      background: #002244 url("../../assets/logo_admin.png") no-repeat center /
        140px auto;
    }
    .smallLogo {
      background: #002244 url("../../assets/logo_admin_01.png") no-repeat center /
        34px auto;
    }
  }
  .header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 30px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
      margin-left: 5px;
    }
    .el-dropdown {
      float: right;
      .el-dropdown-link {
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
          vertical-align: middle;
        }
        .username {
          font-weight: 700;
          margin-left: 5px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
