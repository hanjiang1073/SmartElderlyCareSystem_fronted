<template>
  <div>
    <el-button @click="closeSse">关闭连接</el-button>
    <div class="my_text">
      <div class="content">
        <div>{{ message }}</div>
        <div class="centered-text">禁区</div>
      </div>
    </div>

    <div class="image-container">
      <img :src="imgSrc" />
    </div>
  </div>
</template>

<script>
export default {
  name: "SseEmitter",
  data() {
    return {
      source: null,
      message: "建立连接...",
      imgSrc: "",
    };
  },
  mounted() {
    const userId = new Date().getTime();
    const type = /* session.Id */ 4;

    if (!!window.EventSource) {
      this.source = new EventSource(
          "http://localhost:8080/sse/connect/" + userId + "/" +type
      );
      this.source.addEventListener("message", (e) => {
        this.imgSrc = "data:image/png;base64," + e.data;
      });
      this.source.addEventListener("error", (e) => {
        if (e.readyState === EventSource.CLOSED) {
          this.message = "连接关闭";
        } else {
          console.log(e);
        }
      }, false);
    } else {
      this.message = "你的浏览器不支持SSE";
    }
    window.onbeforeunload = () => {
      this.closeSse();
    };
  },
  methods: {
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
  },
};
</script>

<style>
/* 样式可以根据需要添加 */
.my_text {
  display: flex;


  height: 5vh; /* 设置容器高度为视窗高度 */
}

.content {
  display: flex;
  margin-top: 20px

}

.centered-text {
  margin-left: 500px; /* 调整禁区与上方文字之间的间距 */
  /* 其他样式属性 */
}
</style>