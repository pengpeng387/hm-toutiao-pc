<template>
  <div class="my-image">
    <!-- 图片式按钮 -->
    <div class="box_btn" @click="open">
      <!-- 如果value有值就用value的值，否则用defaultImage -->
      <img :src="value || defaultImage" alt />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="images">
          <!-- 全部与收藏 -->
          <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 图片展示 -->
          <div class="img_list">
            <div
              class="img_item"
              :class="{selected:selectedImageUrl===item.url}"
              v-for="item in images"
              :key="item.id"
              @click="selectImage(item.url)"
            >
              <img :src="item.url" />
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
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="headers"
            name="image"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userLocal from '@/utils/userLocal.js'
import defaultImage from '../assets/default.png'
export default {
  name: 'my-image',
  props: ['value'],
  data () {
    return {
      // 提交的筛选参数
      reqParams: {
        collect: false,
        per_page: 8,
        page: 1
      },
      // 是否打开对话框
      dialogVisible: false,
      // tab栏切换
      activeName: 'images',
      // 素材列表
      images: [],
      // 总页数
      total: 0,
      // 上传成功后的图片地址
      imageUrl: null,
      headers: {
        Authorization: `Bearer ${userLocal.getUser().token}`
      },
      // 是否选中的图片
      selectedImageUrl: null,
      // 图片式按钮的默认图片
      defaultImage
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 选中图片
    selectImage (url) {
      this.selectedImageUrl = url
    },
    // 图片式按钮的点击事件
    open () {
      this.dialogVisible = true
      this.selectedImageUrl = null
      this.imageUrl = null
    },
    // 获取图片
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    // 切换功能
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 图片上传成功的函数
    handleAvatarSuccess (res) {
      // 预览效果
      this.imageUrl = res.data.url
    },
    // 确认图片
    confirmImage () {
      // 素材库
      if (this.activeName === 'images') {
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选中一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.selectedImageUrl
        // 提交图片地址给父组件
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        // 上传图片
        if (!this.imageUrl) {
          return this.$message.warning('请上传一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.imageUrl
        // 提交图片地址给父组件
        this.$emit('input', this.imageUrl)
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.box_btn {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  img {
    width: 100%;
    height: 100%;
  }
}
.dialog-footer {
  width: 100%;
  text-align: center;
  display: inline-block;
}
.img_list {
  margin-top: 20px;
  .img_item {
    width: 150px;
    height: 150px;
    display: inline-block;
    border: 1px dashed #ccc;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center / 50px 50px;
    }
  }
}
</style>
