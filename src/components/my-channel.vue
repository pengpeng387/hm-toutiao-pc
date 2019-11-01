<template>
  <el-select clearable :value="value" placeholder="请选择" @change="fn">
    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'my-channel',
  props: ['value'],
  data () {
    return {
      options: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    // 获取频道列表
    async getChannelOptions () {
      // 发送axios请求，拿到数据并赋值
      const {
        data: { data }
      } = await this.$http.get('channels')
      this.options = data.channels
    },
    // 当值变化时，id传给父元素
    fn (channelId) {
      if (channelId === '') {
        channelId = null
      }
      this.$emit('input', channelId)
    }
  }
}
</script>

<style scoped lang='less'></style>
