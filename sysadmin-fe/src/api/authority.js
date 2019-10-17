import request from '@/utils/request'
//返回权限表
export function getPermissionPageList(param) {
  return request({
    url: '/shiro/getPermissionPageList',
    method: 'get',
    params: param
  })
}
//返回权限树
export function getPermissionTree() {
  return request({
    url: '/shiro/getPermissionListTree',
    method: 'get'
  })
}

//通过角色id返回权限列表
export function getRolePerById(param) {
  return request({
    url: '/role/getRolePerById',
    params: param,
    method: 'get'
  })
}

//通过账号id返回权限列表
export function getAccountPerById(param) {
  return request({
    url: '/account/getAccountPerById',
    params: param,
    method: 'get'
  })
}
//返回账号所有id
export function getAllAccountPer(param) {
  return request({
    url: '/account/getAllAccountPer',
    params: param,
    method: 'get'
  })
}

//把账号id从全局容器中删除
export function cancelAccount(accountId) {
  return request({
    url: '/account/cancel',
    params: accountId,
    method: 'get'
    
  })
}
//把角色id从全局容器中删除
export function cancelRole(roleId) {
  return request({
    url: '/role/cancel',
    params: roleId,
    method: 'get'
  })
}

/* post */
//添加角色权限
export function addRolePer(param) {
  return request({
    url: '/role/addRolePer',
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

//添加账号权限
export function addAccountPer(param) {
  return request({
    url: '/account/addAccountPer',
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
