import request from '@/utils/request'

/*
* */
export function getPage(param) {
  return request({
    url: '/pageQuery.do', // 假地址 自行替换
    data:param,
    method: 'post',
    //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    headers:{
      'Content-Type':'application/json'
    }
  })
}
