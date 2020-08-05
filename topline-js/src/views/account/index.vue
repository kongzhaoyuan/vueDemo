<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item cardbody">
      <div class="lt">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          label-width="100px"
          :rules="accountFormRules"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rt">
        <!--
          class="avatar-uploader" 设置组件样式
          action="https://jsonplaceholder.typicode.com/posts/" // 服务器端接收图片的地址
          :show-file-list="false" // 是否以列表形式显示上传好的图片
          :on-success="handleAvatarSuccess" // 图片上传成功的回调处理
          :before-upload="beforeAvatarUpload" // 图片上传之前的回调处理
          :http-request="httpRequest" 自定义上传行为，本身会覆盖默认的，此时action已经失效,必须属性，留空即可on-success也会失效
        -->
        <el-upload
          action=""
          :show-file-list="false"
          :http-request="httpRequest"
        >
          <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" width="200" height="200">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
// 导入bus.js
import bus from '@/utils/bus.js'

export default {
  name: 'Account',
  data () {
    return {
      // 表单校验
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          // 后端要求title长度介于1-7个字符
          {
            min: 1,
            max: 7,
            message: '名字长度介于1-7个字符之间'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      },
      accountForm: {
        name: '', // 名称
        mobile: '', // 手机
        email: '', // 邮箱
        intro: '', // 简介
        photo: ''
      }
    }
  },
  created () {
    // 获得账户信息
    this.getAccountInfo()
  },
  methods: {
    // 自定义头像上传行为
    // resource：代表被上传图片的对象信息
    //           可以获得被上传图片的信息(resource.file)
    //
    httpRequest (resource) {
      /**
      var form = document.getElementById('xx')
      let fd = new FormData(form)  // fd有两部分信息：普通表单、上传附件
      axios.post(url,fd)

       */

      // FormData收集图片
      let fd = new FormData()
      // fd.append(name,value)
      fd.append('photo', resource.file)
      // axios传递图片到服务器端存储
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 对当前图像进行更新
            this.accountForm.photo = result.data.data.photo
            // bus通过$emit调用 upAccountPhoto，更新home头像
            bus.$emit('upAccountPhoto', result.data.data.photo)
            // 提示成功
            this.$message.success('更新头像成功')
          }
        })
        .catch(err => {
          return this.$message.error('更新头像失败：' + err)
        })
    },
    // 更新账户，收集并存储数据到服务器端
    editAccount () {
      // 表单校验
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          // axios行动了
          // get/post/put/delete
          // put: 修改，修改全部表单
          // patch：修改，修改部分项目
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                // bus调用$emit触发事件upAccountName，使得头部及时显示
                bus.$emit('upAccountName', this.accountForm.name)
                // 提示成功
                this.$message.success('修改账号信息成功')
              }
            })
            .catch(err => {
              return this.$message.error('修改失败：' + err)
            })
        }
      })
    },
    // 获得管理员基本账户信息
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把账户信息赋予给表单
            this.accountForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获得账号信息失败：' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.cardbody {
  display: flex;
  justify-content: space-between;
  .lt {
    width: 40%;
    background-color: pink;
  }
  .rt {
    width: 30%;
    background-color: yellowgreen;
  }
}
</style>
