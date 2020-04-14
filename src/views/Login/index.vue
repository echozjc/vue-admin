<template>
<div id="login">
   <div class="login-wrap">
       <ul class="menu-tab">
           <li @click="Active(index)" :class="{'current':isActive==index}" v-for="(item,index) in menuTab" :key="index">{{item.tex}}</li>
       </ul>
       <!--from表单-->
       <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="login-form" size="small">
           <el-form-item prop="username" class="item-form">
               <label>邮箱</label>
               <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
           </el-form-item>

           <el-form-item  prop="password" class="item-form">
               <label>密码</label>
               <el-input type="password" v-model="ruleForm.password" autocomplete="off" maxlength="16" minlength="6"></el-input>
           </el-form-item>

           <el-form-item  prop="passwords" class="item-form" v-show="isActive==1">
               <label>重复密码</label>
               <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" maxlength="16" minlength="6"></el-input>
           </el-form-item>
           <el-form-item  prop="code" class="item-form" v-show="isActive==1">
               <label >验证码</label>
               <el-row :gutter="20">
                   <el-col :span="15">
                       <el-input v-model.number="ruleForm.code" maxlength="16" minlength="6"></el-input>
                   </el-col>
                   <el-col :span="9">
                       <el-button type="success" class="block">获取验证码</el-button>
                   </el-col>
               </el-row>

           </el-form-item>

           <el-form-item >
               <el-button type="primary" round class="block login-btn" @click="submitForm('ruleForm')">提交</el-button>
           </el-form-item>
       </el-form>
   </div>
</div>
</template>

<script>
  export default {
    name: "login",
    data(){
      //验证邮箱
      let validateUsername = (rule, value, callback) => {
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else if(!reg.test(value)){
          callback(new Error('邮箱格式有误'));
        }else{
          callback();
        }
      };
      //验证密码
      let validatePassword = (rule, value, callback) => {
        let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,16}$/;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!reg.test(value)) {
          callback(new Error('密码为6至16位数字加字母组合'));
        } else {
          callback();
        }
      };
      //验证密码是否一致
      let validatePasswords = (rule, value, callback) => {
        if(this.isActive===0){callback();}
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(value != this.ruleForm.password){
          callback(new Error('密码不一致'));
        }else{
          callback();
        }
      };
      //验证验证码
      let checkCode = (rule, value, callback) => {
        if(this.isActive===0){callback();}
        let reg = /[a-zA-Z0-9]{6}$/;
        if (!value) {
          return callback(new Error('请输入验证码'));
        }else if(!reg.test(value)){
          return callback(new Error('验证码格式有误'));
        }else{
          callback();
        }
      };
      return {
        ruleForm: {
          username: '',
          password: '',
          passwords:'',
          code: '',
        },
        rules: {
          username: [
            /*trigger:失去焦点的时候触发*/
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwords: [
            { validator: validatePasswords, trigger: 'blur' }
          ],
          code: [
            { validator: checkCode, trigger: 'blur' }
          ],
        },
        menuTab:[
          {'tex':'登录'},
          {'tex':'注册'},
        ],
        isActive:0
      };
    },
    created() {},
    mounted() {},
    methods:{
      Active(index){
        this.isActive = index;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
    #login {
        height: 100vh;
        background-color: #344a5f;
    }
    .login-wrap{
        width: 330px;
        margin: auto;
    }
    .menu-tab{
        text-align: center;
        li{
            display: inline-block;
            width: 88px;
            line-height: 36px;
            font-size: 14px;
            color: white;
            border-radius: 2px;
            cursor: pointer;
        }
        .current{
            background-color: rgba(0,0,0,.1);
        }
    }
    .login-form{
        margin-top: 29px;
        label{
            display: block;
            margin-bottom: 3px;
            font-size: 14px;
            color: white;
        }
        .item-form{
            margin-bottom: 18px;
        }
        .login-btn{ margin-top: 13px;}
        .block{
            width: 100%;
            display: block;
        }
    }

</style>
