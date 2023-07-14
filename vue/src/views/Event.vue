<script setup>
import { nextTick, reactive, ref } from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import config from "../../config";
import {useUserStore} from "@/stores/user";


const eventid = ref('')


const userStore = useUserStore()
const jwt = userStore.jwt

const state = reactive({
  tableData: [],
  form: {}
})

const valueHtml = ref('')  // 富文本内容


const load = () => {
  request.get('/event').then(res => {
    state.tableData = res.data
    // total.value = res.data.total
  })
}
load()  // 调用 load方法拿到后台数据

const reset = () => {
  name.value = ''
  load()
}

// 删除
const del = (id) => {
  request.delete('/elder/' + id).then(res => {
    if (res.code === '200') {
      ElMessage.success('操作成功')
      load()  // 刷新表格数据
    } else {
      ElMessage.error(res.msg)
    }
  })
}

</script>

<template>
  <div>
    <div>
      <el-input v-model="eventid" placeholder="请输入id" class="w300" />
      <el-button type="primary" class="ml5" @click="load">
        <el-icon style="vertical-align: middle">
          <Search />
        </el-icon>  <span style="vertical-align: middle"> 搜索 </span>
      </el-button>
      <el-button type="warning" class="ml5" @click="reset">
        <el-icon style="vertical-align: middle">
          <RefreshLeft />
        </el-icon>  <span style="vertical-align: middle"> 重置 </span>
      </el-button>

    </div>

<!--    <div style="margin: 10px 0">-->
<!--      <el-button type="success" @click="handleAdd" >-->
<!--        <el-icon style="vertical-align: middle">-->
<!--          <Plus />-->
<!--        </el-icon>  <span style="vertical-align: middle"> 新增 </span>-->
<!--      </el-button>-->
<!--    </div>-->

    <div style="margin: 10px 0">
      <el-table :data="state.tableData" stripe border  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="eventid" label="事件id"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="desc" label="介绍"></el-table-column>

        <el-table-column label="操作" width="180">
          <template #default="scope">
<!--            <el-button type="primary" @click="handleEdit(scope.row)" >编辑</el-button>-->
            <el-popconfirm title="您确定删除吗？" @confirm="del(scope.row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin: 10px 0">
      <el-pagination
          background
          layout=" sizes, prev, pager, next, jumper"
      />
    </div>


  </div>
</template>