/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const cityRouter = {
  path: '/cityManage',
  name: 'cityMange',
  redirect: '/cityManage',
  component:Layout,
  alwaysShow: true,
  meta: {title: 'cityManage', icon: 'excel',roles: ['/cityManage']},
  children:[
    {
      path: 'index',
      name: 'cityManage',
      component: ()=>import('@/views/city/index'),
      meta: {title: 'cityManage', roles: ['/cityManage/cityManage']}
    },
    {
      path:'queryCity',
      name:'cityQuery',
      component:()=>import('@/views/city/query-city'),
      meta: { title: 'cityQuery', roles: ['/cityManage/cityQuery'] }
     },
    {
      path:'queryCounty',
      name:'countyQuery',
      component:()=>import('@/views/city/query-county'),
      meta: { title: 'countyQuery', roles: ['/cityManage/countyQuery'] }
    },
    {
      path:'queryProcince',
      name:'provinceQuery',
      component:()=>import('@/views/city/query-province'),
      meta: { title: 'provinceQuery', roles: ['/cityManage/provinceQuery'] }
    },
   ]
}
export default cityRouter
