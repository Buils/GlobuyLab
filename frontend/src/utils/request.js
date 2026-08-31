import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端接口的基础地址
  timeout: 5000 // 超时时间
})

export default request