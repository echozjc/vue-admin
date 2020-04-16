<template>
<div id="login">
   <div class="login-wrap">
       <ul class="menu-tab">
           <li @click="Active(index)" :class="{'current':isActive==index}" v-for="(item,index) in menuTab" :key="index">{{item.tex}}</li>
       </ul>
       <!--from表单-->
       <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="login-form" size="small">
           <!--prop绑定字段名，表单验证的时候就会验证绑定的变量ruleForm.username-->
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
           <el-form-item  prop="code" class="item-form" >
               <label>验证码</label>
               <el-row :gutter="20">
                   <el-col :span="15">
                       <el-input v-model="ruleForm.code" maxlength="16" minlength="6"></el-input>
                   </el-col>
                   <el-col :span="9">
                       <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button>
                   </el-col>
               </el-row>
           </el-form-item>

           <el-form-item >
               <el-button type="primary" round class="block login-btn" @click="submitForm('ruleForm')" :disabled="submitBtn">{{isActive==0?"登录":"注册"}}</el-button>
           </el-form-item>
       </el-form>
   </div>
</div>
</template>

<script>
  import {reactive,ref,onMounted} from '@vue/composition-api';
  import {GetSms,Register,Login} from '@/api/login.js';
  import {validateEmail} from '@/utils/validate.js'
  import sha1 from 'js-sha1'
  export default {
    name: "login",
    //setup(props,context):{refs}即context.refs  解构赋值
    setup(props,{refs,root}){
      // {
      //   context.attrs;  对应this.$attrs
      //   context.listeners;  对应this.$listeners
      //   context.parent; 对应this.parent
      //   context.root;   对应this
      //   context.emit;   对应this.$emit
      //   context.refs;   对应this.refs
      // }
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
        if(isActive.value==0){callback();}
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if(value != ruleForm.password){
          callback(new Error('密码不一致'));
        }else{
          callback();
        }
      };
      //验证验证码
      let checkCode = (rule, value, callback) => {
        let reg = /[a-zA-Z0-9]{6}$/;
        if (!value) {
          return callback(new Error('请输入验证码'));
        }else if(!reg.test(value)){
          return callback(new Error('验证码格式有误'));
        }else{
          callback();
        }
      };
      /*
      * 声明数据
      * */
      //这里放置data数据，生命周期，自定义函数
      //ref(声明基础数据类型变量时使用)
      let isActive = ref(0);
      let codeButtonStatus = reactive({
        status:false,
        text:"获取验证码"
      });
      let submitBtn = ref(true);
      let timer = ref(null);

      //reactive(声明单一对象时使用)
      const menuTab = reactive([
        {'tex':'登录'},
        {'tex':'注册'},
      ])
      //console.log(menuTab);
      let ruleForm = reactive({
        username: '',
        password: '',
        passwords:'',
        code: '',
      });
      const rules = reactive({
          username: [
            /*trigger:失去焦点的时候触发*/
            /*validator：指定验证的方法*/
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
        });

      //console.log(isActive.value);
      //判断是否是基本数据类型
      //console.log(isRef(isActive)?true:false);

      // const obj = reactive({
      //   x:0,
      //   y:1
      // })
      //toRefs将reactive对象转为普通对象
      // function useMousePosition() {
      //   const pos = reactive({
      //     x:0,
      //     y:0
      //   });
      //   return toRefs(pos);
      // }
      // const {x,y} = useMousePosition();
      /*
      * 声明函数
      * */
      const Active = (index=>{
        if(isActive.value != index){
          resetFromData();
        }
        clearCountDown();
        isActive.value = index;
      });
      const resetFromData = (() => {
        // 重置表单
        refs["ruleForm"].resetFields();  // 3.0
      })


      /*
      * 清除倒计时
      * */
      const clearCountDown = (()=>{
        clearInterval(timer.value);
        codeButtonStatus.status = false;
        codeButtonStatus.text = "获取验证码";
      })
      /*
      * 获取验证码
      * */
      const getSms = (()=>{
        if(ruleForm.username === ''){
          root.$message.error('邮箱不能为空');
          return false;
        }
        if(validateEmail(ruleForm.username)){
          root.$message.error("邮箱格式有误，请重新输入");
          return false;
        }
        //获取验证码
        let requestData = {
          username:ruleForm.username,
          module:isActive.value===0?"login":"register",
        }
        /*修改验证码按钮的状态*/
        codeButtonStatus.status = true;
        codeButtonStatus.text = "验证码发送中";

        setTimeout(()=>{
          //延时显示
          GetSms(requestData).then(response=>{
            let data = response.data;
            root.$message({
              message:data.message,
              type:"success",
            })
            //启用登录或注册按钮
            submitBtn.value = false;
            //调用定时器，倒计时
            countDown(10);
          }).catch((error)=>{
            if(error.message === "邮箱不存在！！"){
              clearCountDown();
            }
            console.log(error)
          })
        },1000);
      });
      /*
      * 提交表单
      * */
      const submitForm = (formName=>{
        refs[formName].validate((valid) => {
          if (valid) {
            isActive.value === 1?register():login();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      });
      /*
      * 登录
      * */
      const login = (()=>{
        let requestData = {
          username:ruleForm.username,
          password:sha1(ruleForm.password),
          code:ruleForm.code,
          module:'login'
        }
        Login(requestData).then(response=>{
          let data = response.data;
          root.$message({
            message:data.message,
            type:"success",
          })
        }).catch(err=>{})
      })
      /*
      * 注册
      * */
      const register = (()=>{
        let requestData = {
          username:ruleForm.username,
          password:sha1(ruleForm.password),
          code:ruleForm.code,
          module:'register'
        }
        Register(requestData).then(response=>{
          let data = response.data;
          root.$message({
            message:data.message,
            type:"success",
          })
          Active(0);
          submitBtn.value = true;
        }).catch(err=>{})
      })
      /*
      * 倒计时
      * */
      const countDown = ((number)=>{
        let time = number;
        clearInterval(timer.value);
        timer.value = setInterval(()=>{
          time--;
          if (time === 0){
            codeButtonStatus.status = false;
            codeButtonStatus.text = '重新获取'
            clearInterval(timer.value);
          }else{
            codeButtonStatus.text = `倒计时${time}秒`;
          }
        },1000)
      })

      /*
      * 生命周期
      * */
      //挂载完成后
      onMounted(()=>{});
      //将要使用的全都return出去
      return{
        menuTab,
        isActive,
        Active,
        submitForm,
        ruleForm,
        rules,
        getSms,
        codeButtonStatus,
        submitBtn,
      }

    },
    created() {},
    mounted() {},
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
