<script setup>
import { nextTick, reactive, ref } from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import config from "../../config";
import {useUserStore} from "@/stores/user";
import router from "@/router";


const elderid = ref('')
// const pageNum = ref(1)
// const pageSize = ref(5)
// const total = ref(0)

const userStore = useUserStore()
const jwt = userStore.jwt
const OperationType = {
  ADD: 'add',
  UPDATE: 'update',
};
let type = null;

const state = reactive({
  tableData: [],
  form: {}
})

const valueHtml = ref('')  // 富文本内容



// const multipleSelection = ref([])

// 批量删除
// const handleSelectionChange = (val) => {
//   multipleSelection.value = val
// }


const load = () => {
  request.get('http://localhost:8080/elder').then(res => {
    console.log(res)
    state.tableData = res
  })
}
load()

// 保存
const save = () => {
  ruleFormRef.value.validate(valid => {
    if (valid)
      state.form.isOld = true
      // state.form.age = parseInt(state.form.age)
    console.log(JSON.stringify(state.form))
      request.request({
        url: 'http://localhost:8080/sse/connect3',
        method: 'post',
        data: state.form
      }).then(res => {
        console.log(res)
        // if(res.code == '200'){

          // dialogFormVisible.value = false
          // load()  // 刷新表格数据
          const id = res
        if(res == 0){
          ElMessage.success("输入信息无效")
        }
        else{
          ElMessage.success("保存成功")
          //跳转到老人人脸录入的页
          let isOld = true
          router.push({ name: 'Tracking', params: { id, isOld }})
        }

        // }else{
        //   ElMessage.error("保存失败")
        // }
      })
  })
}

const reset = () => {
  // name.value = ''
  load()
}

const dialogFormVisible = ref(false)

const rules = reactive({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ]
})
const ruleFormRef = ref()


// 新增
const handleAdd = () => {
  dialogFormVisible.value = true
  nextTick(() => {
    ruleFormRef.value.resetFields()
    state.form = {}
    valueHtml.value = ''  // 富文本
  })
}



// 编辑
const handleEdit = (raw) => {
  dialogFormVisible.value = true
  nextTick(() => {
    ruleFormRef.value.resetFields()
    state.form = JSON.parse(JSON.stringify(raw))
    valueHtml.value = raw.content  // 富文本
  })
}

//查询
const search = () => {
  const ID = parseInt(elderid.value)
  console.log(ID)
  request.get(`http://localhost:8080/elder/${ID}`).then(res => {
    // if (res.code === '200') {
    //   ElMessage.success('操作成功')
      console.log(res)
      state.tableData = [res]
    //   state.tableData = res
    // } else {
    //   ElMessage.error(res.msg)
    // }
  })
}

// 删除
const del = () => {
  const ID = parseInt(elderid.value)
  console.log(ID)
  request.delete('http://localhost:8080/elder/' + ID).then(res => {
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
      <el-input v-model="elderid" placeholder="请输入id" class="w300" />
      <el-button type="primary" class="ml5" @click="search">
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

    <div style="margin: 10px 0">
      <el-button type="success" @click="handleAdd" >
        <el-icon style="vertical-align: middle">
          <Plus />
        </el-icon>  <span style="vertical-align: middle"> 新增 </span>
      </el-button>
    </div>

    <div style="margin: 10px 0">
      <el-table :data="state.tableData" stripe border>
        <el-table-column type="selection" width="55" />
      <el-table-column prop="elderid" label="老人id"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="description" label="简介"></el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>

        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)" >编辑</el-button>
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

    <el-dialog v-model="dialogFormVisible" title="老人信息" width="40%">
      <el-form ref="ruleFormRef" :rules="rules" :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="state.form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="age" label="年龄">
          <el-input v-model="state.form.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="介绍">
          <el-input v-model="state.form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系方式">
          <el-input v-model="state.form.phone" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </span>
      </template>
    </el-dialog>


  </div>
</template>
