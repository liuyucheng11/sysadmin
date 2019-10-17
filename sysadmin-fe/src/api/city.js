import request from '@/utils/request'


export const cityApi = {
  queryProvince: (query)=>request({url: '/city/queryProvince?t=' + (new Date().getTime()), data: query, method: 'post'}),
  queryCity: (query)=>request({url: '/city/queryCity?t=' + (new Date().getTime()), data: query, method: 'post'}),
  queryCounty: (query)=>request({url: '/city/queryCounty?t=' + (new Date().getTime()), data: query, method: 'post'}),
  create: (city)=>request({url: '/city/create?t=' + (new Date().getTime()), data: city, method: 'post'}),
  update: (city)=>request({url: '/city/update?t=' + (new Date().getTime()), data: city, method: 'post'}),
  getCityByParent: (parentId)=>request({url: '/city/getCityByParentId?t=' + (new Date().getTime()), params: {parentId:parentId}, method: 'post'})
}

