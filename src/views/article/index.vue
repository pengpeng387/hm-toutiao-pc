<template>
  <div class="container-article">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <plugin-crumbs>内容管理</plugin-crumbs>
      </div>
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 频道 -->
        <el-form-item label="频道：">
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dataTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top:20px">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{total}} 条结果:</span>
      </div>
      <template>
        <el-table :data="article">
          <el-table-column label="封面">
            <template slot-scope="scope">
              <el-image :src="scope.row.cover.images[0]" style="width:150px;height:100px">
                <div slot="error" class="image-slot">
                  <img src="../../assets/error.gif" width="150" height="100" />
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.status===0">草稿</el-tag>
              <el-tag v-if="scope.status===1">待审核</el-tag>
              <el-tag type="success" v-if="scope.row.status===2">审核通过</el-tag>
              <el-tag type="warning" v-if="scope.row.status===3">审核失败</el-tag>
              <el-tag type="danger" v-if="scope.row.status===4">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                plain
                @click="toEdit(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                plain
                @click="delArticle(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="parger"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reqParams: {
        // 状态绑定的值
        status: null,
        // 频道绑定的值
        channel_id: null,
        // 起始时间
        begin_pubdate: null,
        // 结束时间
        end_pubdate: null,
        // 当前页码
        page: 1,
        // 每页多少条
        per_page: 20
      },
      // 频道的数据
      options: [],
      // 日期范围
      dataTime: [],
      // 文章列表
      article: [],
      // 总条数
      total: 0
    }
  },
  created () {
    // this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    // // 获取频道列表
    // async getChannelOptions () {
    //   // 发送axios请求，拿到数据并赋值
    //   const {
    //     data: { data }
    //   } = await this.$http.get('channels')
    //   this.options = data.channels
    // },
    // 获取文章列表
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      // 赋值 articles
      this.article = data.results
      // 获取总条数
      this.total = data.total_count
    },
    // 分页函数
    parger (newPage) {
      // 把当前页数赋值
      this.reqParams.page = newPage
      // 重新获取数据
      this.getArticles()
    },
    // 筛选按钮
    search () {
      // 处理频道空字符串问题
      if (this.reqParams.channel_id === '') {
        this.reqParams.channel_id = null
      }
      // 点击之后，页码设为1
      this.reqParams.page = 1
      this.getArticles()
    },
    // 日期事件
    changeDate (dataTime) {
      // 参数是数组【起始时间，结束时间】
      if (dataTime) {
        this.reqParams.begin_pubdate = dataTime[0]
        this.reqParams.end_pubdate = dataTime[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 编辑按钮
    toEdit (id) {
      // 第一种
      // this.$router.push(`/publish?id=${id}`)
      // 第二种
      this.$router.push({ path: '/publish', query: { id } })
    },
    // 删除按钮
    async delArticle (id) {
      // 发请求
      await this.$http.delete(`articles/${id}`)
      // 提示
      this.$message.success('删除成功')
      // 更新列表，重新获取数据
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'></style>
