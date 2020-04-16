import server from "../network/request";
/*
* 获取验证码
* */
export function GetSms(data) {
  return server.request({
    method:'post',
    url:'/getSms/',
    data,//参数同名情况下，写一个即可，ES6写法
  })
}


/*
* 获取用户名
* */


/*
* 登录
* */
export function Login(data) {
  return server.request({
    method:'post',
    url:'/login/',
    data,//参数同名情况下，写一个即可，ES6写法
  })
}

/*
* 注册
* */
export function Register(data) {
  return server.request({
    method:"post",
    url:"/register/",
    data
  })
}
