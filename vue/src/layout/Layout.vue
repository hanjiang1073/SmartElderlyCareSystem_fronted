<script setup>
import { RouterView } from 'vue-router'
import router from "@/router";
import {useUserStore} from "@/stores/user";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import Person from "@/views/Person.vue";

const userStore = useUserStore()
let user = userStore.getUser
// const activePath = router.currentRoute.value.path.replace('/', '')

const logout = () => {
  request.get('/logout/' + user.uid).then(res => {
    if (res.code === '200') {
      userStore.logout()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// const menus = userStore.getMenus

const getAvatarHandler = (avatar) => {
  user.avatar = avatar
}
</script>

<template>
  <div>
    <div style="height: 60px; line-height: 60px; border-bottom: 1px solid #ccc; background-color: aliceblue">
      <div style="display: flex">
        <div style="width: 200px; color: dodgerblue; font-weight: bold;  text-align: center; font-size: 20px">
          智慧养老系统
        </div>

        <div style="flex: 1; display: flex">
          <div style="flex: 1">
          </div>
          <div style="width: 300px; text-align: right; padding-right: 20px">
            <span style="margin-right: 5px; color: dodgerblue">欢迎您，{{ user.name }}</span>
            <el-dropdown>
              <el-avatar :size="40" :src="user.avatar" style="margin-top: 10px" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item><div @click="router.push('/person')">个人信息</div></el-dropdown-item>
                  <el-dropdown-item><div @click="router.push('/password')">修改密码</div></el-dropdown-item>
                  <el-dropdown-item><div @click="logout">退出登录</div></el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

          </div>
        </div>
      </div>
    </div>

    <div style="display: flex">
      <div style="width: 200px; min-height: calc(100vh - 60px); border-right: 1px solid #ccc">
        <el-menu
            class="el-menu-demo"
            style="border: none"
        >
          <el-menu-item index="/">
            <el-icon><house /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2" @click="router.push('/dashboard')">
            <el-icon><PieChart /></el-icon>
            <span>数据图表</span>
          </el-menu-item>
          <el-menu-item index="3" @click="router.push('/elderInfo')">
            <el-icon><document /></el-icon>
            <span>老年人信息管理</span>
          </el-menu-item>
          <el-menu-item index="4" @click="router.push('/volunteerInfo')">
            <el-icon><document /></el-icon>
            <span>义工信息管理</span>
          </el-menu-item>
          <el-menu-item index="5" @click="router.push('/staffInfo')">
            <el-icon><document /></el-icon>
            <span>工作人员信息管理</span>
          </el-menu-item>
          <el-submenu index="6">
            <template #title>
              <el-icon><Monitor /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="6-1">
              <span>情感分析</span>
            </el-menu-item>
            <el-menu-item index="6-2">
              <span>摔倒检测</span>
            </el-menu-item>
            <el-menu-item index="6-3">
              <span>闯入检测</span>
            </el-menu-item>
            <el-menu-item index="6-4">
              <span>义工互动</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <div style="flex: 1; padding: 10px">
        <RouterView @getAvatar="getAvatarHandler" />
      </div>
    </div>

  </div>
</template>
