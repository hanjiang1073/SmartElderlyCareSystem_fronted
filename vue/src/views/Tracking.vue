<template>
  <div class="container">
    <div>
      <div class="video-box">
        <video id="video" width="800" height="600" preload autoplay loop muted></video>
        <canvas id="canvas" width="800" height="600"></canvas>
      </div>
      <canvas id="screenshotCanvas" width="800" height="600"></canvas>
      <div class="switch-button">
        <el-row>
          <el-button type="primary" @click="destroyed">关闭摄像头</el-button>
          <el-button type="primary" @click="init">拍照</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/tracking/build/tracking-min.js';
import '@/assets/tracking/build/data/face-min.js';
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      id: null,
      isOld: null,
      trackerTask: null,
      mediaStreamTrack: null,
      video: null,
      screenshotCanvas: null,
      uploadLock: true // 上传锁
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化设置
    init() {
      this.id = parseInt(this.$route.params.id);
      this.isOld = this.$route.params.isOld === 'true';
      this.video = this.mediaStreamTrack = document.getElementById('video');
      this.screenshotCanvas = document.getElementById('screenshotCanvas');

      let canvas = document.getElementById('canvas');
      let context = canvas.getContext('2d');

      // 固定写法
      let tracker = new window.tracking.ObjectTracker('face');
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);
      //摄像头初始化
      this.trackerTask = window.tracking.track('#video', tracker, {
        camera: true
      });

      let _this = this;
      tracker.on('track', function(event) {

        // 检测出人脸 绘画人脸位置
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
          context.strokeStyle = '#0764B7';
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });
        // event.data.length长度为多少代表检测几张人脸
        if(_this.uploadLock && event.data.length){
          //上传图片
          _this.screenshotAndUpload();
        }
      });
    },
    // 上传图片
    screenshotAndUpload() {
      // 上锁避免重复发送请求
      this.uploadLock = false;

      // 绘制当前帧图片转换为base64格式
      let canvas = this.screenshotCanvas;
      let video = this.video;
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let base64Img = canvas.toDataURL('image/jpeg');

      // 打印出 base64Img
      console.log(this.id, this.isOld)
      console.log('base64Img:',base64Img)

      axios.post('http://localhost:8080/sse/connect4', {
        id: this.id,
        isOld: this.isOld,
        img: base64Img,
      }).then(response => {
        console.log(response.data)
        router.push('/elderInfo')
      }).catch(error => {
            console.error(error)
          })
      // 请求接口成功以后打开锁
      // this.uploadLock = true;
    },
    //关闭摄像头
    destroyed(){
      if(!this.mediaStreamTrack){
        return
      }
      this.mediaStreamTrack.srcObject.getTracks()[0].stop();
      this.trackerTask.stop()
    }
  }
}
</script>

<style scoped>
/* 绘图canvas 不需显示隐藏即可 */
#screenshotCanvas{
  display: none;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}

.video-box{
  position: relative;
  margin-left: 30px;
  width: 800px;
  height: 600px;
}

.switch-button{
  margin-top: 30px;
  margin-left: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
video,canvas{
  position: absolute;
  top: 0;
  left: 0;
  border: darkgray 1px solid;
}

</style>

