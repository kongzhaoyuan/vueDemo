<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      >
      <el-menu-item index="/welcome" :style="{width:isCollapse?'65px':'200px'}">
        <i class="el-icon-location"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2" :style="{width:isCollapse?'65px':'200px'}">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item index="/articleadd">发布文章</el-menu-item>
        <el-menu-item index="/article">文章列表</el-menu-item>
        <el-menu-item index="2-3">评论列表</el-menu-item>
        <el-menu-item index="/material">素材管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="/fans" :style="{width:isCollapse?'65px':'200px'}">
        <i class="el-icon-location"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/account" :style="{width:isCollapse?'65px':'200px'}">
        <i class="el-icon-location"></i>
        <span slot="title">账户管理</span>
      </el-menu-item>

    </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div id="lt">
          <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="isCollapse=!isCollapse"></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>

        <div id="rt">
          <el-input type="text" placeholder="请输入搜索的文章内容" style="width:300px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 10px;">消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="photo" alt width="40" height="40">
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>github地址</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入bus.js
import bus from '@/utils/bus.js'

export default {
  // name作用：方便在浏览器vuedevtools工具中查找该组件
  name: 'HomeCom',
  created () {
    // 给bus绑定事件,对账户的名字做更新
    bus.$on('upAccountName', nm => {
      // nm是更新后的名字
      // console.log(nm)
      // 把nm赋予给tmpname临时名字成员
      this.tmpname = nm

      // sessionStorage里边name也需要同步更新
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.name = nm // 更新名字
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))// 再把更新后的信息存储给sessionStorage里边
    })
    // // 给bus绑定事件,对账户的头像做更新
    bus.$on('upAccountPhoto', ph => {
      this.tmpphoto = ph

      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.photo = ph // 更新名字
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
    })
  },
  data () {
    return {
      tmpname: '', // 账户临时名字
      tmpphoto: '', // 账户临时名字
      isCollapse: false // 菜单是否折叠
    }
  },
  computed: {
    name () {
      // if (this.tmpname) {
      //   return this.tmpname
      // } else {
      //   return JSON.parse(window.sessionStorage.getItem('userinfo')).name
      // }
      // 代码升级
      return this.tmpname || JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return this.tmpphoto || JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  methods: {
    // 退出系统
    logout () {
      this.$confirm('确认退出么?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确定做该事情
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-header {
    background-color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 10px 0 9px;
    min-width: 950px;
    #lt {
      height: 100%;
      width: 40%;
      background-color: white;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    #rt {
      height: 100%;
      width: 50%;
      background-color: white;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
      }
    }
  }
  .el-main {
    background-color: rgb(242, 243, 245);
  }
}
</style>
