import request from '@/utils/request'

/*
批量查询员工
* */
export function getStaff(param) {
  return request({
    url: '/staff/getStaffPageList.do', 
    params: param,
    method: 'get',
  })
}

/**
 * 新建员工
 * @param {*} param 
 */
export function insertStaff(param) {
  return request({
    url: '/staff/insertStaff.do', 
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 修改员工信息
 * @param {*} param 
 */
export function updateStaff(param) {
  return request({
    url: '/staff/updateStaff.do', 
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 根据id查询员工
 * @param {*} param 
 */
export function selectById(param) {
  return request({
    url: '/staff/selectStaffVOById.do', 
    params: param,
    method: 'get',
  })
}

/**
 * 批量更新员工为离职
 * @param {*} param 
 */
export function updateBatchIsLeft(param) {
  return request({
    url: '/staff/updateBatchIsLeft.do', 
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 批量更新员工为在职
 * @param {*} param 
 */
export function updateBatchIsNotLeft(param) {
  return request({
    url: '/staff/updateBatchIsNotLeft.do', 
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 批量删除员工
 * @param {*} param 
 */
export function updateBatchStatusFalse(param) {
  return request({
    url: '/staff/updateBatchStatusFalse.do', 
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 根据id、departmentId更新deprtmentId
 * @param {*} param 
 */
export function updateDepartment(param) {
  return request({
    url: '/staff/updateDepartmentIdById.do',
    data: param,
    method: 'post',
  })
}

/**
 * 查询所有登录账号为空的员工
 * @param {*} param 
 */
export function getAccountNoIsNullList(param) {
  return request({
    url: '/staff/getAccountNoIsNullList.do',
    params: param,
    method: 'get',
  })
}

/**
 * 更新登陆账号
 * @param {*} param 
 */
export function updateAccountNo(param) {
  return request({
    url: '/staff/updateAccountNo.do', 
    data: param,
    method: 'post',
  })
}

/**
 * 查询全部员工
 * @param {*} param 
 */
export function getStaffAll(param) {
  return request({
    url: '/staff/getStaffVOAllList.do', 
    params: param,
    method: 'get',
  })
}





