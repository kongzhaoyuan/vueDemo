<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>修改文章</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item">
      <el-form ref="editFormRef" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-form-item label="标题" prop="title">
          <el-input type="text" v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!--富文本编辑器-->
          <quill-editor v-model="editForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="editForm.cover.type">
            <!--注意：label前边需要设置冒号，表示接受整型的信息-->
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <channel-com @slt="selectHandler" :cid="editForm.channel_id" ></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editarticle(false)">修改</el-button>
          <el-button @click="editarticle(true)">存入草稿</el-button>
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

// 引入频道公共组件
import ChannelCom from '@/components/channel.vue'

export default {
  name: 'ArticleEdit',
  components: {
    // 简易成员赋值 quillEditor: quillEditor
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor></quill-editor>
    quillEditor,
    ChannelCom
  },
  data () {
    return {
      // 表单校验规则
      editFormRules: {
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
      editForm: {
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
  computed: {
    // 简化aid获取
    aid () {
      return this.$route.params.aid
    }
  },
  created () {
    this.getArticleByAid() // 获得当前修改文件信息
  },
  methods: {
    // 定义channel-com的事件响应方法，接收子组件传递的频道id
    selectHandler (val) {
      this.editForm.channel_id = val
    },
    // 根据"路由参数aid"获得被修改文章的信息
    getArticleByAid () {
      // axios
      let pro = this.$http.get(`/articles/${this.aid}`)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把文章赋予给editForm里边
            this.editForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取文章失败！：' + err)
        })
    },

    // 发表文章
    // flag=true  是存入草稿
    // flag=false  正式修改
    editarticle (flag) {
      // 表单校验
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          // 表单校验成功
          // put: 主要做信息修改操作
          // post: 主要做信息添加操作
          // get: 主要做信息获取操作
          // delete: 主要做信息删除操作
          let pro = this.$http.put(`/articles/${this.aid}`, this.editForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                this.$message.success('修改文章成功！')
                // 跳转到列表页面
                this.$router.push('/article')
              }
            })
            .catch(err => {
              return this.$message.error('修改文章失败！：' + err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/*给富文本编辑器设置内容区域高度*/
/* .ql-editor{   .ql-editor[data-v-xxx]不对了*/
/*deep：深度作用选择器，使得编译后的效果为：.el-form[data-v-xx] .ql-editor{}*/
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
