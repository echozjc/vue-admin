import axios from 'axios';
import { Message } from 'element-ui';
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi'
const server = axios.create({
  baseURL: BASEURL,
  timeout:5000
});

// console.log(process.env.NODE_ENV);
// console.log(process.env.VUE_APP_ABC);
/*
* 请求接口前，做一些数据处理(请求拦截器)
* */
server.interceptors.request.use((config)=>{
  //在请求之前做些什么
  return config;
},(err)=>{
  return Promise.reject(err)
})

/*
* 请求接口，返回数据进行拦截(响应拦截器)
* */
server.interceptors.response.use((response)=>{
  let data = response.data;
  if(data.resCode !== 0){
    Message.error(data.message);
    return Promise.reject(data);
  }else{
    return Promise.resolve(response);
  }
},(err)=>{
  return Promise.reject(err)
})


export default server;
