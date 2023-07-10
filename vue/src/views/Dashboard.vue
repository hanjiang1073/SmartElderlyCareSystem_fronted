<script setup>
import * as echarts from 'echarts'
import {onMounted, reactive} from "vue";
import request from "@/utils/request";

onMounted(() => {
  let option = {
    title: {
      text: "各地区用户统计",
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      top: '20%',
      height: '60%'
    },
    series: [
      {
        data: [],
        type: 'bar',
        itemStyle: {
          normal: {
            color: function(params) {
              //颜色列表长度需要设置大于柱的数量，颜色循环结束不会继续循环
              const colorList = ['#4169E1','#7FFFD4', '#FFA500', '#d48265', '#91c7ae','#749f83', '#ca8622'];
              return colorList[params.dataIndex]
            }
          }
        }
      },
    ]
  }
  let pieOption = {
    title: {
      text: "用户地区分布图",
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
        },
        data: []
      }
    ]
  }
  let myChart = echarts.init(document.getElementById("main"))
  let pieChart = echarts.init(document.getElementById("pie"))


  // 数据处理
  request.get('/users').then(res => {
    option.xAxis.data = res.data.map(v => v.name)
    option.series[0].data = res.data.map(v => v.value)
    // 绘制图表
    myChart.setOption(option)

    pieOption.series[0].data = res.data
    pieChart.setOption(pieOption)
  })
})

const state = reactive({
  dashboard: {
    users: 0,
    roles: 0,
    permissions: 0,
    files: 0,
  }
})
request.get('/dashboard').then(res => {
  state.dashboard = res.data
})
</script>

<template>
<!--  <div>-->
<!--    <div>-->
<!--      <el-row :gutter="10">-->
<!--        <el-col :span="6">-->
<!--          <el-card style="height: 100px;">-->
<!--            <div style="color: #888">用户数量</div>-->
<!--            <div style="font-size: 24px; font-weight: bold">{{ state.dashboard.users }}</div>-->
<!--          </el-card>-->
<!--        </el-col>-->
<!--        <el-col :span="6">-->
<!--          <el-card style="height: 100px;">-->
<!--            <div style="color: #888">角色数量</div>-->
<!--            <div style="font-size: 24px; font-weight: bold">{{ state.dashboard.roles }}</div>-->
<!--          </el-card>-->
<!--        </el-col>-->
<!--        <el-col :span="6">-->
<!--          <el-card style="height: 100px;">-->
<!--            <div style="color: #888">菜单数量</div>-->
<!--            <div style="font-size: 24px; font-weight: bold">{{ state.dashboard.permissions }}</div>-->
<!--          </el-card>-->
<!--        </el-col>-->
<!--        <el-col :span="6">-->
<!--          <el-card style="height: 100px;">-->
<!--            <div style="color: #888">文件数量</div>-->
<!--            <div style="font-size: 24px; font-weight: bold">{{ state.dashboard.files }}</div>-->
<!--          </el-card>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->

<!--    <div style="margin: 20px 0">-->
<!--      <el-row :gutter="10">-->
<!--        <el-col :span="12">-->
<!--          <div style="width:100%; height: 500px" id="main"></div>-->
<!--        </el-col>-->

<!--        <el-col :span="12">-->
<!--          <div style="width:100%; height: 500px" id="pie"></div>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->


<!--  </div>-->
</template>
