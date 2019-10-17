import request from '@/utils/request'

export function getDepartmentTree() {
  return request ({
    url: '/department/tree/query',
    method: 'get'
  })
}

export function getDepartmentInfo(params) {
  return request ({
    url: '/department/query',
    method: 'get',
    params: params
  })
}

export function addDepartment(data) {
  return request ({
    url: 'department/insert',
    method: 'post',
    data: data
  })
}

export function updateDepartment(data) {
  return request ({
    url: 'department/update',
    method: 'post',
    data: data
  })
}

export function updateParentDepartment(data) {
  return request({
    url: 'department/parent/update',
    method: 'post',
    data: data
  })
}

export function deleteDepartment(param) {
  return request ({
    url: 'department/delete',
    method: 'get',
    params: param
  })
}

export function getDepartmentList(param) {
  return request ({
    url: '/department/list/query',
    method: 'get',
    params: param
  })
}

export function getCompanyList(data) {
  return request({
    url: '/company/getAddCompany',
    data: data,
    method: 'post',
  })
}

export function insertRelateCompany(data) {
  return request({
    url: '/department/relateCompany/insert',
    method: 'post',
    data: data
  })
}

export function queryRelateCompanyList(param) {
  return request({
    url: '/department/relateCompany/query',
    method: 'get',
    params: param
  })
}

export function queryCity(param) {
  return request({
    url: '/city/queryCityAndCountyList',
    method: 'post',
    data: param
  })
}

export function exportDepartmentList(param) {
  return request({
    url: '/department/list/export',
    method: 'get',
    params: param
  })
}

export function queryDepartmentRelateCity(param) {
  return request({
    url: '/department//relateCity/query',
    method: 'get',
    params: param
  })
}
