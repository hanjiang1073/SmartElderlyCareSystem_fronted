# SmartElderlyCareSystem_fronted
## 技术栈
- 前端：Vue3 + Element-Plus + Pinia + Vue-Router4

## 注意事项
- 项目启动之前先安装并启动redis。
- 数据库表都要存在 `deleted` 这个字段，默认值是0，必须写，用于软删除。
- id主键，自增 int类型，必填字段
- 表一定要写注释
