<template>
  <div class="container-img">
    <el-card>
      <div slot="header">
        <plugin-crumbs>素材管理</plugin-crumbs>
      </div>
      <!-- 按钮区域 -->
      <div class="btn_box">
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          @click="open"
          style="float:right"
          size="small"
          type="success"
        >添加素材</el-button>
        <!-- 对话框 -->
        <el-dialog title="添加素材" :visible.sync="dialogTableVisible" width="300px">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            name="image"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-dialog>
      </div>
      <!-- 素材区域 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" />
          <div class="footer" v-show="!reqParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span class="el-icon-delete" @click="deleteImage(item.id)"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import userLocal from '@/utils/userLocal.js'
export default {
  data () {
    return {
      // 提交的筛选参数
      reqParams: {
        collect: false,
        per_page: 10,
        page: 1
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 控制对话框显示或隐藏
      dialogTableVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,
      headers: {
        Authorization: `Bearer ${userLocal.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 添加素材的点击事件
    open () {
      // 打开对话框
      this.dialogTableVisible = true
      // 清空对话框里面图片的地址
      this.imageUrl = null
    },
    // 图片上传成功的函数
    handleAvatarSuccess (res) {
      // 预览效果
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      setTimeout(() => {
        // 成功后关闭对话框
        this.dialogTableVisible = false
        // 更新列表
        this.getImages()
      }, 2000)
    },
    // 获取图片
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换功能
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 切换添加收藏或取消
    async toggleStatus (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      item.is_collected = data.collect
      this.$message.success(data.collect ? '添加收藏' : '取消收藏')
    },
    // 删除
    deleteImage (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发请求
          await this.$http.delete(`user/images/${id}`)
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 更新列表
          this.getImages()
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang='less'>
.img_list {
  margin-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    display: inline-block;
    position: relative;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0px;
      left: 0;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
