import Layout from '@/layout'

const queryRouter = [
  {
    path: '/query',
    component: Layout,
    redirect: '/query/index',
    alwaysShow: true,
    meta: {
      title: 'query',
      icon: 'search',
      roles: ['/query']
    },
    children: [
      {
        path: 'department',
        component: () => import('@/views/department/query'),
        name: 'departmentQuery',
        meta: {
          title: 'departmentQuery',
          roles: ['/query/department'] // or you can only set roles in sub nav
        }
      },
      //角色账号明细查询
      {
        path: 'roleAccount',
        component: () => import('@/views/query/roleAccount'),
        name: 'roleAccountQuery',
        meta: {
          title: '角色账号明细查询',
          roles: ['/query/roleAccount'] // or you can only set roles in sub nav
        }
      },
      //角色功能权限明细查询
      {
        path: 'roleFunction',
        component: () => import('@/views/query/rolePermissions'),
        name: 'roleFunctionQuery',
        meta: {
          title: '角色功能权限明细查询',
          roles: ['/query/rolePermission'] // or you can only set roles in sub nav
        }
      },
      //账号功能权限明细查询
      {
        path: 'accountFunction',
        component: () => import('@/views/query/accountPermissions'),
        name: 'accountFunctionQuery',
        meta: {
          title: '账号功能权限明细查询',
          roles: ['/query/accountPermission'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  //部门查询详情页
  {
    path: '/query/department/:id',
    component: () => import('@/views/department/queryDetail'),
    name: 'departmentDetail',
    meta: {
      title: 'departmentDetail',
      roles: ['/query/department']
    },
    hidden: true
  }
]
export default queryRouter
