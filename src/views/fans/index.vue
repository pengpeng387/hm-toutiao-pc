<template>
  <div class="container-fans">
    <el-card>
      <div slot="header">
        <plugin-crumbs>粉丝管理</plugin-crumbs>
      </div>
      <el-tabs v-model="fansTabs" type="card">
        <el-tab-pane label="粉丝列表" name="fansList">
          <div class="fans_item" v-for="item in fansList" :key="item.id.toString()">
            <el-avatar :size="80" :src="item.photo"></el-avatar>
            <p>{{item.name}}</p>
            <el-button type="primary" plain size="small">+关注</el-button>
          </div>
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="parger"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="fansPic">
          <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
          <div ref="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    let dom = this.$refs.main
    var myChart = echarts.init(dom)
    var option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  data () {
    return {
      fansTabs: 'fansList',
      fansList: [],
      //   总页数
      total: 0,
      reqParams: {
        //   每页数量
        per_page: 21,
        // 当前页数
        page: 1
      }
    }
  },
  created () {
    this.getFansList()
  },
  methods: {
    async getFansList () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      this.fansList = data.results
      this.total = data.total_count
    },
    // 分页函数
    parger (newPage) {
      // 把当前页数赋值
      this.reqParams.page = newPage
      // 重新获取数据
      this.getFansList()
    }
  }
}
</script>

<style scoped lang='less'>
.fans_item {
  width: 150px;
  height: 190px;
  border: 1px dashed #ccc;
  text-align: center;
  margin-right: 20px;
  margin-bottom: 20px;
  padding-top: 20px;
  display: inline-block;
}
</style>
