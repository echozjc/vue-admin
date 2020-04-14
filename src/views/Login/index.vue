<template>
<div id="login">
    登录页面
    <el-row>
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
    </el-row>
</div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style lang="scss" scoped>
#login{
   height: 100vh;
   background-color: #344a5f;
}
</style>
