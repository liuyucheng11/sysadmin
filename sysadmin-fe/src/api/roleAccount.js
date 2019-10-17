import request from '@/utils/request'
/*
* 批量查询账号
* */
export function getRoleAccount(param) {
  return request({
    url: 'query/selectRoleAccount.do', // 假地址 自行替换
    data:param,
    method: 'post',
    //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    headers:{
      'Content-Type':'application/json'
    }
  })
}
/*
* 根据账号id查询账号的详细信息
* */
export function getAccountById(id) {
  return request({
    url: '/query/getAccountById.do',
    data: id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/*
* 根据角色id查询角色详细信息
* */
export function getRoleById(id) {
  return request({
    url: '/query/getRoleById.do',
    data: id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
