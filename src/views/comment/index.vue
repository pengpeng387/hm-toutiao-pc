<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <plugin-crumbs>评论管理</plugin-crumbs>
      </div>
      <el-table :data="commentsList">
        <el-table-column prop="title" label="标题" width="400"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column prop label="状态">
          <template slot-scope="scope">{{scope.row.comment_status?"正常":"关闭"}}</template>
        </el-table-column>
        <el-table-column prop label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click="toggleStatus(scope.row)"
              v-if="scope.row.comment_status"
              type="danger"
              size="small"
            >关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row)" v-else type="success" size="small">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        style="margin-top:20px"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 文章列表
      commentsList: [],
      // 请求参数
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      // 总页数
      total: 0
    }
  },
  created () {
    this.getComments()
  },
  methods: {
    // 获取文章列表
    async getComments () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.commentsList = data.results
      this.total = data.total_count
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getComments()
    },
    // 切换评论状态
    toggleStatus (row) {
      const text = row.comment_status
        ? '你确定要关闭评论吗？用户将不能评论'
        : '你确定打开评论吗？'
      this.$confirm(text, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            data: { data }
          } = await this.$http.put(`comments/status?article_id=${row.id}`, {
            allow_comment: !row.comment_status
          })
          this.$message.success(
            data.allow_comment ? '打开评论成功' : '关闭评论成功'
          )
          row.comment_status = data.allow_comment
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang='less'></style>
