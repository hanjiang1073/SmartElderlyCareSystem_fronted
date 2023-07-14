<script setup>
import { nextTick, reactive, ref } from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import config from "../../config";
import {useUserStore} from "@/stores/user";


const elderid = ref('')
// const pageNum = ref(1)
// const pageSize = ref(5)
// const total = ref(0)

const userStore = useUserStore()
const jwt = userStore.jwt

const state = reactive({
  tableData: [],
  form: {}
})
state.form.idOld = true;

const valueHtml = ref('')  // 富文本内容



// const multipleSelection = ref([])

// 批量删除
// const handleSelectionChange = (val) => {
//   multipleSelection.value = val
// }


const SseEmitter = {
  source: null,
  message: ref("建立连接..."),
  imgSrc: ref(""),

  closeSse() {
    this.source.close();
    const httpRequest = new XMLHttpRequest();
    const userId = new Date().getTime();
    httpRequest.open(
        "GET",
        "http://localhost:8080/sse/close/" + userId,
        true
    );
    httpRequest.send();
    console.log("close");
  },

  handleSse(res) {
    if (res.code === "200") {
      this.source = new EventSource(res.data);
      this.source.addEventListener(
          "message",
          (e) => {
            this.imgSrc.value = "data:image/png;base64," + e.data;
          },
          false
      );
      this.source.addEventListener(
          "error",
          (e) => {
            console.log(e);
          },
          false
      );
      this.message.value = "请求成功";
    } else {
      ElMessage.error(res.msg);
    }
  },
};

const load = () => {
  request.get('/elder').then(res => {
    state.tableData = res.data
  })
}
load()

// 保存
const save = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {
      state.form.content = valueHtml.value;
      request.request({
        url: '/connect3',
        method: 'post',
        data: JSON.stringify(state.form)
      }).then(res => {
        if(res.code == '200'){
          ElMessage.success("保存成功")
        }else{
          ElMessage.error("保存失败")
        }
      })
    }
  })
}

const reset = () => {
  name.value = ''
  load()
}

const dialogFormVisible = ref(false)

const rules = reactive({
  elderid: [
    { required: true, message: '请输入id', trigger: 'blur' },
  ],
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
      <el-input v-model="elderid" placeholder="请输入id" class="w300" />
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

    <div style="margin: 10px 0">
      <el-button type="success" @click="handleAdd" >
        <el-icon style="vertical-align: middle">
          <Plus />
        </el-icon>  <span style="vertical-align: middle"> 新增 </span>
      </el-button>
    </div>

    <div style="margin: 10px 0">
      <el-table :data="state.tableData" stripe border  @selection-change="handleSelectionChange">
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