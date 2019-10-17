/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const departmentRouter = [
  {
    path: '/department',
    component: Layout,
    redirect: '/department',
    children: [
      {
        path: 'department',
        component: () => import('@/views/department/index'),
        name: 'departmentView',
        meta: {
          title: 'departmentView',
          roles: ['/department'],
          icon: 'department'// or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/department/new',
    component: () => import('@/views/department/detail'),
    name: 'departmentCreate',
    meta: {
      title: 'departmentCreate',
      roles: ['/department/add']
    },
    hidden: true
  },
  {
    path: '/department/update/:id',
    component: () => import('@/views/department/detail'),
    name: 'departmentUpdate',
    meta: {
      title: 'departmentUpdate',
      roles: ['/department/update']
    },
    hidden: true
  }
]
export default departmentRouter
