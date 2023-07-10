<script setup>
import { RouterView } from 'vue-router'
import router from "@/router";
import {useUserStore} from "@/stores/user";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
const userStore = useUserStore()
let user = userStore.getUser
const activePath = router.currentRoute.value.path
console.log(activePath)

const logout = () => {
  request.get('/logout/' + user.uid).then(res => {
    if (res.code === '200') {
      userStore.logout()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const menus = userStore.getMenus

const getAvatarHandler = (avatar) => {
  user.avatar = avatar
}
</script>

<template>
  <div>
    <!--    头部-->
    <div style="display: flex; height: 60px; line-height: 60px; border-bottom: 1px solid #eee">
      <div style="width: 280px; display: flex; padding-left: 30px">
        <el-icon></el-icon>
        <div style="flex: 1; font-size: 20px; color: lightskyblue; font-weight: bold">智慧养老系统</div>
      </div>
      <div style="flex: 1">
        <el-menu :default-active="activePath" mode="horizontal" router style="border: none; height: 100%">
          <el-menu-item index="/front/home">首页</el-menu-item>
          <el-menu-item index="/front/dashboard">数据图表</el-menu-item>
        </el-menu>
      </div>
      <div style="width: 300px; text-align: right; padding-right: 10px">
        <div v-if="!user.id" style="text-align: right; padding-right: 30px">
          <el-button @click="router.push('/login')">登录</el-button>
          <el-button @click="router.push('/register')">注册</el-button>
        </div>
        <div v-else>
          <span style="margin-right: 5px; color: steelblue">欢迎您，{{ user.name }}</span>
          <el-dropdown>
            <el-avatar :size="40" :src="user.avatar" style="margin-top: 10px" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item><div @click="router.push('/')" v-if="user.role === 'ADMIN'">后台管理</div></el-dropdown-item>
                <el-dropdown-item><div @click="router.push('/front/person')">个人信息</div></el-dropdown-item>
                <el-dropdown-item><div @click="router.push('/front/password')">修改密码</div></el-dropdown-item>
                <el-dropdown-item><div @click="logout">退出登录</div></el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div style="width: 70%; margin: 10px auto;">
      <RouterView :key="router.currentRoute.value.fullPath + Math.random()" @getAvatar="getAvatarHandler"  />
    </div>

  </div>
</template>
