<template>
  <div class="container-publish">
    <el-card>
      <div slot="header">
        <plugin-crumbs>{{$route.query.id?"修改":"发布"}}文章</plugin-crumbs>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <!-- 富文本 -->
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="articleForm.cover.type" @change="articleForm.cover.images = []">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 上传图片组件 -->
          <div v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type===3">
            <my-image v-for="item in 3" :key="item" v-model="articleForm.cover.images[item-1]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button type="primary" @click="update(false)">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="create(false)">发表</el-button>
          <el-button @click="create(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null,
        content: ''
      },
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  methods: {
    // 发布事件
    async create (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },
    // 修改事件
    async update (draft) {
      await this.$http.put(`articles/${this.$route.query.id}?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      this.$router.push('/article')
    },
    // 获取文章详情
    async getArticle (id) {
      const {
        data: { data }
      } = await this.$http.get(`articles/${id}`)
      this.articleForm = data
    }
  },
  created () {
    const articleId = this.$route.query.id
    if (articleId) {
      // 修改逻辑
      // 填充表单内容
      this.getArticle(articleId)
    }
  },
  // 监听地址
  watch: {
    // key===>被监听的（this下的）数据的字段的名字
    // value===>值改变后触发的函数（newVal，oldVal）新值，旧值
    '$route.query.id': function (newVal, oldVal) {
      if (newVal) {
        // 修改表单
        this.getArticle(newVal)
      } else {
        this.articleForm = {
          title: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null,
          content: ''
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.my-image {
  display: inline-block;
  margin-right: 20px;
}
</style>
