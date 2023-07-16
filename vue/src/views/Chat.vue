<template>
  <div class="chat-container">
    <el-card class="chat-card">
      <div class="chat-list" style="flex-direction: column;">
        <div
            v-for="message in messages"
            :key="message.id"
            class="chat-message"
            :class="{ 'current-user': message.author === currentUser, 'other-user': message.author !== currentUser }"
            style="display: flex;"
        >
          <div class="chat-content-wrapper current-user-msg" v-if="message.author === currentUser">
            <div class="chat-content">{{ message.content }}</div>
            <div class="chat-info">
              <div class="chat-author">{{ message.author }}</div>
              <div class="chat-time">{{ message.time }}</div>
            </div>
          </div>
          <div class="chat-content-wrapper" v-else>
            <div class="chat-content">{{ message.content }}</div>
            <div class="chat-info">
              <div class="chat-author">{{ message.author }}</div>
              <div class="chat-time">{{ message.time }}</div>
            </div>
          </div>
        </div>
        <div v-if="messages.length === 0" class="chat-message chat-empty">暂无消息</div>
      </div>
      <div class="chat-input">
        <el-input v-model="newMessage" placeholder="请输入消息内容" @keydown.enter="sendMessage" />
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import { ElCard, ElInput, ElButton } from "element-plus";

export default {
  components: {
    ElCard,
    ElInput,
    ElButton,
  },
  data() {
    return {
      currentUser: "我",
      messages: [],
      newMessage: "",
    };
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage) {
        return;
      }
      const message = {
        id: Date.now(),
        author: this.currentUser,
        content: this.newMessage,
        time: new Date().toLocaleString(),
      };
      this.messages.push(message);
      this.newMessage = "";
      try {
        const response = await axios.post("/api/chat", { message: message.content });
        const responseData = response.data;
        const responseMessage = {
          id: Date.now(),
          author: "服务端",
          content: responseData,
          time: new Date().toLocaleString(),
        };
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", "other-user");
        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("chat-content-wrapper");
        const content = document.createElement("div");
        content.classList.add("chat-content");
        content.innerText = responseMessage.content;
        const info = document.createElement("div");
        info.classList.add("chat-info");
        const author = document.createElement("div");
        author.classList.add("chat-author");
        author.innerText = responseMessage.author;
        const time = document.createElement("div");
        time.classList.add("chat-time");
        time.innerText = responseMessage.time;
        info.appendChild(author);
        info.appendChild(time);
        contentWrapper.appendChild(content);
        contentWrapper.appendChild(info);
        messageElement.appendChild(contentWrapper);
        this.$el.querySelector(".chat-list").appendChild(messageElement);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.chat-card {
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  height: 500px;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.chat-message {
  margin-bottom: 20px;
  position: relative;
}

.other-user .chat-message {
  justify-content: flex-start;
}

.current-user .chat-message {
  justify-content: flex-end; /* 将 justify-content 设置为 flex-end */
}

.chat-author {
  font-size: 12px;
  color: #999;
}

.chat-content-wrapper {
  position: relative;
}

.other-user .chat-content {
  background-color: #fff;
  border: 1px solid #d9d9d9;
}

.current-user-msg .chat-content {
  background-color: #409eff;
  border: 1px solid #409eff;
  color: #fff;
}

.chat-content {
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 400px; /* 将 max-width 设置为 400px */
  word-wrap: break-word;
  word-break: break-all;
}

.other-user .chat-content::before {
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 0 10px 10px 0;
  border-color: transparent #d9d9d9 transparent transparent;
  left: -8px;
  bottom: 0;
}

.current-user-msg .chat-content::before {
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 0 0 10px 10px;
  border-color: transparent transparent #409eff transparent;
  right: -8px;
  bottom: 0
}

.chat-time{
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}

.chat-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
}

.chat-empty {
  text-align: center;
  color: #999;
}

.el-input__inner {
  border-radius: 20px;
}

.el-button {
  border-radius: 20px;
}
</style>