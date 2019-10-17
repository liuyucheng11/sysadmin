import request from '@/utils/request'

/*
* */
export function addCompany(param) {
  return request({
    url: '/company/add.do', // 假地址 自行替换
    data: param,
    method: 'post',
  });

}

//图片请求路径
export const fileUrl = process.env.VUE_APP_BASE_API+'/licenses/getLicense?id=';

/**
 * 获取列表
 * @param param
 */
export function getPage(param) {
  return request({
    url: '/company/pageList.do',
    data: param,
    method: 'post',
    headers: {'Content-Type': 'application/json'}
  })
}

/**
 * 删除执照
 * @param param
 */
export function deleteLicense(param) {
   return request({
     url:'/licenses/deleteLicense',
     data:param,
     method:'post',
     headers:{'Content-Type':'application/x-www-form-urlencoded'}
   })
}

/**
 * 修改公司
 * @param param
 */
export function modifyCompany(param) {
     return request({
       url:'/company/modify.do',
       data:param,
       method:'post',
     })
}

/**
 * 根据id获取公司的信息
 * @param param
 */
export function getCompanyById(param) {
  return request({
    url:'/company/getCompanyById',
    data:param,
    method:'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  })
}

/**
 * 添加执照
 * @param param
 */
export function addLicenses(param) {
  return request({
    url: '/licenses/addLicense', // 假地址 自行替换
    data: param,
    method: 'post',
  });
}

