import request from '@/utils/request'

/*
批量查询账户权限
* */
export function getAccountPermissions(param) {
  return request({
    url: 'query/selectAccountPermissions.do', // 假地址 自行替换
    data:param,
    method: 'post',
    //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    headers:{
      'Content-Type':'application/json'
    }
  })
}
