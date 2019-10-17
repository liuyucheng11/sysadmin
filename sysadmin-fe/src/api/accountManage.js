import request from '@/utils/request'

// 刘新漳
export function getPage2(param) {
  return request({
    url: '/account/queryAccountList2.do',
    data: param,
    method: 'post',
    // 注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getPage(param) {
  return request({
    url: '/account/queryAccountList.do',
    data: param,
    method: 'post',
    // 注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getHistoryPage(param) {
  return request({
    url: '/account/queryHistoryList.do',
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function updateAccount(param) {
  return request({
    url: '/account/updateAccount.do',
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 黄雯婷
export function getAccountNoById(accountId) {
  return request({
    url: '/account/getAccountNoById.do',
    data: accountId,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 黄雯婷
export function getRoleInfoListByAccountId(accountId) {
  return request({
    url: '/account/getRoleInfoListByAccountId.do',
    data: accountId,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 黄雯婷
export function getRemainRoleIdList(accountId) {
  return request({
    url: '/account/getRemainRoleIdList.do',
    data: accountId,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 黄雯婷
export function getAllRoleList() {
  return request({
    url: 'account/getAllRoleList.do',
    // data:accountId,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// hwt
export function updateAccountRole(param) {
  return request({
    url: 'account/updateAccountRole.do',
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function addAccount(param) {
  return request({
    url: '/account/addAccount.do',
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getAccountById(id) {
  return request({
    url: '/account/getAccountById.do',
    data: id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function modifyAccount(param) {
  return request({
    url: '/account/modifyAccount.do',
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function setEmail(param) {
  return request({
    url: '/account/sentEmail.do',
    method: 'get',
    params: param
  })
}

/**
 * 查询所有员工不分页
 * @param param
 */
export function getAllAccount(param) {
  return request({
    url: '/account/getAllAccount.do',
    params: param,
    method: 'get'
  })
}

export function getAccountNotInIds(param) {
  return request({
    url: '/account/getAccountNotInIds.do',
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
