<template>
  <div>
    <el-button @click="closeSse">关闭连接</el-button>
    <div>{{ message }}</div>
    <img :src="imgSrc" />
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
    const id = /* session.Id */ 0;

    if (!!window.EventSource) {
      this.source = new EventSource(
          "http://localhost:8080/sse/connect/" + userId + "/" + id
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
</style>