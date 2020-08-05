<template>
    <!--卡片区-->
    <el-card class="box-card">
      <!--命名插槽，头部内容设置-->
      <div slot="header" class="clearfix">
        <span>粉丝统计</span>
      </div>
      <!--匿名插槽，卡片主体内容-->
      <div class="text item">
        <!--图表显示占位符-->
        <div id="main" ref="main2" style="width:600px;height:400px;"></div>
      </div>
    </el-card>
</template>

<script>
// 引入echarts模块
import echarts from 'echarts'

export default {
  name: 'Fans',
  // 生命周期创建阶段第4个方法(div容器被编译好并已经完成了渲染)
  mounted () {
    this.paintPic()
  },
  methods: {
    // 绘制数据图表
    paintPic () {
    // 基于准备好的dom，初始化echarts实例
      // var myChart = echarts.init(document.getElementById('main'))
      var myChart = echarts.init(this.$refs.main2)
      // 绘制图表
      myChart.setOption({
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      // myChart.setOption({
      //   title: {
      //     text: 'ECharts 入门示例'
      //   },
      //   tooltip: {},
      //   xAxis: {
      //     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      //   },
      //   yAxis: {},
      //   series: [{
      //     name: '销量',
      //     type: 'bar',
      //     data: [5, 20, 36, 10, 10, 20]
      //   }]
      // })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
