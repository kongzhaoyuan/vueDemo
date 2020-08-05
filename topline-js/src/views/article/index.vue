<template>
  <div>
    <!--卡片区-->
    <div></div>
    <el-card class="box-card">
      <!--命名插槽，头部内容设置-->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!--匿名插槽，卡片主体内容-->
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm">
          <el-form-item label="文章状态：">
            <!--给多个单选按钮设置一个组别-->
            <!--好处：v-model给组别设置一份即可-->
            <el-radio-group  v-model="searchForm.status" >
              <el-radio label>全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="频道列表：">
            <!--应用频道组件-->
            <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--文章列表卡片区-->
    <el-card class="box-card">
      <!--命名插槽，头部内容设置-->
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <!--匿名插槽，卡片主体内容-->
      <div class="text item">
        <!--table表格-->
        <!--data:最大数据来源，可以是数组对象集-->
        <el-table :data="articleList">
          <!--el-table-column:设置表格的列的信息-->
          <!--prop:信息来源，是数据的字段名称-->
          <el-table-column label="图标" prop="cover.images[0]">
            <!--给当前列自定义内容-->
            <!--还要使用数据里边的图片地址信息，其是"作用域插槽"提供的-->
            <img
              :src="stData.row.cover.images[0]"
              slot-scope="stData"
              alt="没有图片"
              width="150"
              height="100"
            >
            <!-- <span slot-scope="stData">{{stData.row}}</span> 展示每个文章记录效果 -->
          </el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="状态">
            <!--通过一个template统一接收插槽数据-->
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-else type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作">
            <!--给当前列自定义内容-->
            <template slot-scope="stData">
              <el-button type="primary" size="mini" @click="$router.push(`/articleedit/${stData.row.id}`)">修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text item">
        <!--
          @size-change="handleSizeChange"  // 每页显示条数变化的处理事件，需要methods方法配合
          @current-change="handleCurrentChange" // 当前页码变化的回调处理事件，需要methods方法配合
          :current-page="currentPage4" // 默认当前页码 1
          :page-sizes="[100, 200, 300, 400]" // 下拉列表，设计每页显示条数的
          :page-size="100" // 默认每页显示条数
          layout="total, sizes, prev, pager, next, jumper" // 分页元素构成设计
          :total="400" // 记录总条数
        -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 15, 20, 40]"
          :page-size="searchForm.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tot"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入频道公共组件
import ChannelCom from '@/components/channel.vue'

export default {
  // 每个组件都命名一个名字，方便后期调试使用
  name: 'ArticleList',
  components: {
    // 注册频道独立组件
    ChannelCom
  },
  // 设置监听器
  watch: {
    // 给searchForm做深度监听
    searchForm: {
      handler: function (newV, oldV) {
        // 内部成员有变化，就根据变化的条件重新检视数据
        this.getArticleList()
      },
      deep: true
    },
    // 名称：data成员属性名字(timetotime)
    // 名称: function (v1, v2) {
    //   v1:该data变化后的新值
    //   v2:该data之前的旧值
    // }
    timetotime: function (newv, oldv) {
      // console.log(newv)
      // console.log(oldv)
      if (newv) {
        // 拆分时间给到表单
        this.searchForm.begin_pubdate = newv[0]
        this.searchForm.end_pubdate = newv[1]
      } else {
        // 清除表单时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      // 根据变化后时间范围，重新获得文章
      // this.getArticleList()
    }
  },
  data () {
    return {
      timetotime: '', // 临时接收搜索时间的范围信息(array数组，两个单元，开始/结束时间)
      articleList: [], // 服务器端返回的文章列表信息
      searchForm: {
        status: '', // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        channel_id: '', // 频道
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        page: 1, // 当前页码
        per_page: 10 // 每页显示条数
      },
      tot: 0 // 记录总条数
    }
  },
  created () {
    this.getArticleList() // 获得文章列表
  },
  methods: {
    // 频道组件方法，获得子组件传递过来的频道id并赋予给channel_id成员
    selectHandler (val) {
      this.searchForm.channel_id = val
    },
    // 删除文章
    del (id) {
      this.$confirm('确认要删除该文章么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let pro = this.$http.delete(`/articles/${id}`)
        pro
          .then(result => {
            // 直接更新列表页面
            this.getArticleList()
          })
          .catch(err => {
            return this.$message.error('删除文章失败:' + err)
          })
      }).catch(() => { })
    },

    // 分页相关
    // 每页显示条数变化的处理事件
    handleSizeChange (val) {
      // val:每页条数变化后的新值
      // console.log(val)
      // 更新变化后的每页条数
      this.searchForm.per_page = val
      // 根据变化后每页条数重新获得数据
      // this.getArticleList()
    },
    // 当前页码变化的回调处理事件
    handleCurrentChange (val) {
      // val: 代表变化后的页码数字
      // console.log(val)
      // 更新当前页码
      this.searchForm.page = val
      // 根据当前页码重新获得数据
      // this.getArticleList()
    },

    // 获得文章列表信息
    getArticleList () {
      // 把searchForm内部为空的成员都过滤掉
      let searchData = {}
      for (var i in this.searchForm) {
        // i:代表对象的成员属性名称, status、channel_id、begin_pudate等等
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          // 成员值非空
          searchData[i] = this.searchForm[i]
        }
      }

      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把文章赋予给articleList成员
            this.articleList = result.data.data.results
            // 把total_count中条数信息赋予给tot成员
            this.tot = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('获得文章列表错误:' + err)
        })
    }

  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
