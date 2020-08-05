<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>发布文章</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item">
      <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="addFormRules">
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!--富文本编辑器-->
          <quill-editor v-model="addForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="addForm.cover.type">
            <!--注意：label前边需要设置冒号，表示接受整型的信息-->
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="addForm.channel_id" placeholder="请选择" clearable >
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
              <!--
                label:下拉列表小单元对外提示内容
                value:value值选项
              -->
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addarticle(false)">发布</el-button>
          <el-button @click="addarticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
// 引入富文本编辑器的css样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入编辑器主组件模块(按需导入)
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'ArticleAdd',
  components: {
    // 简易成员赋值 quillEditor: quillEditor
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor></quill-editor>
    quillEditor
  },
  data () {
    return {
      // 表单校验规则
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },
      channelList: [], // 服务器端真实频道数据(数组对象集)
      addForm: {
        title: '', // 标题
        content: '', // 文章内容
        // 封面(1-3张之间)
        cover: {
          // 默认设置为0张图片，不然报错
          type: 0, // 告知是几个图片 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 以数组元素形式存储多个封面图片路径名的
        },
        channel_id: '' // 接受频道信息
      }
    }
  },
  created () {
    this.getChannelList() // 获得频道
  },
  methods: {
    // 发表文章
    // flag=true  是存入草稿
    // flag=false  正式发布
    addarticle (flag) {
      // 表单校验
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 表单校验成功
          let pro = this.$http.post('/articles', this.addForm, { params: { draft: flag } })
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                this.$message.success('添加文章成功！')
                // 跳转到列表页面
                this.$router.push('/article')
              }
            })
            .catch(err => {
              return this.$message.error('添加文章失败！：' + err)
            })
        }
      })
    },
    // 获得频道列表数据
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把获得的频道信息赋予给channelList成员
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获得频道错误：' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
/*给富文本编辑器设置内容区域高度*/
/* .ql-editor{   .ql-editor[data-v-xxx]不对了*/
/*deep：深度作用选择器，使得编译后的效果为：.el-form[data-v-xx] .ql-editor{}*/
.el-form /deep/ .ql-editor{
  height:200px;
}
</style>
