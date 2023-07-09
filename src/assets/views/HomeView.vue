<script setup>
import adapter from 'webrtc-adapter';

// 将 adapter 暴露出去
defineExpose({ adapter });

// 组件代码
const mounted = () => {
  navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = $refs.video;
        video.srcObject = stream;
        video.play();
      })
      .catch(error => {
        console.log(error);
      });
};
</script>


<template>
  <!-- 主页-->
  <el-main>
    <div>
      <video ref="video" autoplay></video>
    </div>
  </el-main>
</template>

<style>

</style>
