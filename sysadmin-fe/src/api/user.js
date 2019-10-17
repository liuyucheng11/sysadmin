import request from '@/utils/request'

export function login(loginInfo) {
  return request({
    url: '/account/verifyPassword.do',
    method: 'post',
    data:loginInfo,
    headers:{
      'Content-Type':'application/json'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/account/getAccountInfo',
    method: 'get',
    params: { token }
  })
}
export function getNowLoginInfo() {
    return request({
      url:'/account/getNowLoginInfo',
      method:'get'
    })
}

export function logout() {
  return request({
    url: '/account/logout',
    method: 'post'
  })
}
