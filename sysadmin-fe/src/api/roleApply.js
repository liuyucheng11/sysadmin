import request from '@/utils/request'

/*
* */
export function insertRoleApply(param) {
  return request({
    url: '/role/insertRoleApply.do', // 假地址 自行替换
    data: param,
    method: 'post',
    //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


export function getRoleApplySingle(param) {
  return request({
    url: '/role/getRoleApplyList.do', // 假地址 自行替换
    data: param,
    method: 'post',
    //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


export function ajaxParams(url, params) {
  return request({
    url: url,
    // data:param,
    params: params,
    method: 'post',
    //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    // headers:{
    //   'Content-Type':'application/json'
    // }
  })
}

export function ajaxData(url, params) {
  return request({
    url: url,
    data: params,
    method: 'post',
    //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

