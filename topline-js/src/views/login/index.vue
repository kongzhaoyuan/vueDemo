<template>
  <div class="login-container">
    <div class="login-box">
      <!--el-form是表单组件-->
      <!--ref是固定属性，每个表单都 必须有-->
      <!--:model,普通属性，名称为model，对表单数据对象进行绑定，与v-model没有关系，必须属性-->
      <!--label-width设置项目名称宽度，非必须属性-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt>
        <!--匿名插槽应用体现-->
        <!--el-form-item：是el-form的子组件(表单域项目体现)，每个el-form内部都有若干该组件-->
        <!--label：项目名称，非必须的-->
        <!--prop:定义被校验项目的名字，为了兼容性好，该名字与v-model的名字一致-->
        <el-form-item prop="mobile">
          <!--匿名插槽应用体现-->
          <!--v-model:双向数据绑定，必须属性-->
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码">
            <i slot="prefix" class="iconfont icon-shouji"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="验证码">
            <i slot="prefix" class="iconfont icon-ecurityCode"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="xieyi" style="text-align:left;">
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button :loading="isActive" :disabled="isActive" type="primary" style="width:100%;" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入极验的gt.js文件
// 注意该js文件没有做export default导出动作
// 现在增加一个全局函数可供使用，名称为initGeetest
import '@/assets/js/gt.js'

// 引入图标css文件
import '@/assets/iconfont/iconfont.css'

export default {
  name: 'LoginCom',
  data () {
    // 自定义校验函数，验证协议
    var xieyiTest = function (rule, value, callback) {
      // rule:校验规则，一般不用
      // value:当前被校验的信息
      // callback：回调函数，校验成功或失败都需要执行
      // if (value) {
      //   callback()
      // } else {
      //   return callback(new Error('请无条件遵守规矩'))
      // }

      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      // 登录按钮是否禁用/等待
      isActive: false,
      ctaObj: null, // 人机验证窗口对象
      // 定义表单数据对象
      loginForm: {
        mobile: '13811112222', // 手机号码
        code: '246810', // 验证码
        xieyi: true // 协议
      },
      // 表单校验
      loginFormRules: {
        // 校验字段: [{ 规则 }, { 规则 }, { 规则 }]
        mobile: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          { required: true, message: '验证码必填' }
        ],
        xieyi: [
          // { validator: 校验函数 }
          { validator: xieyiTest }
        ]
      }
    }
  },
  methods: {
    // 登录系统
    login () {
      // 首先表单校验(全部项目)成功，页面才进入后台
      // el-form组件获取：this.$refs.loginFormRef
      // this.$refs.loginFormRef.validate(回调函数/function(valid){}/箭头函数)
      this.$refs.loginFormRef.validate(valid => {
        // valid通过返回布尔值，就知道校验是否成功了
        // console.log(valid)
        // 表单校验成功
        if (valid) {
          // 判断人机窗口是否存在，存在直接用即可
          if (this.ctaObj !== null) {
            return this.ctaObj.verify()
          }
          // 登录按钮禁用/等待
          this.isActive = true
          // A.人机行为验证
          // axios获得极验的请求秘钥信息
          var pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(result => {
              // console.log(result) // config 【data】 request status statusText
              // 做对象解构赋值
              var { data } = result.data
              // 调用initGeetest函数，生成验证"窗口"
              // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
              window.initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind' // 没有点击按钮，通过登录按钮激活窗口
              }, captchaObj => {
                // 这里可以调用验证实例 captchaObj 的实例方法
                captchaObj.onReady(() => {
                  // 验证码ready之后才能调用verify方法显示验证码
                  // 显示验证窗口
                  captchaObj.verify()
                  // 把创建好的窗口对象赋予给ctaObj成员
                  this.ctaObj = captchaObj
                  // 登录按钮正常了
                  this.isActive = false
                }).onSuccess(() => {
                  // your code
                  // B.验证成功，登录后台系统
                  this.loginAct() // 真实校验、登录系统
                }).onError(() => {
                  // your code
                  // 验证失败逻辑
                })
              })
            })
            .catch(err => {
              return this.$message.error('极验秘钥有错误:' + err)
            })
        }
      })
    },
    // 账号真实校验，登录系统
    loginAct () {
      // 账号真实性校验
      var pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          // console.log(result) // config headers 【data】 status statusText
          if (result.data.message === 'OK') {
            // 通过sessionStorage把服务器端返回的信息做记录
            // 以便知道当前用户是处于登录状态的
            // result.data.data = {id/name/photo/token}
            window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))

            this.$router.push({ name: 'home' }) // 进入首页
          }
        })
        .catch(err => {
          // 错误的用户名或密码就会执行此处
          // return console.log('用户名或密码错误:' + err)
          // return this.$message({ type: 'error', message: '用户名或密码错误:' + err })
          return this.$message.error('用户名或密码错误:' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: gray;
  background-image: url("./login_bg.jpg");
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 340px;
    background-color: white;
    text-align: center;
    img {
      width: 50%;
      margin: 20px 0;
    }
    .el-form {
      width: 75%;
    }
  }
}
</style>
