import Layout from '@/layout'

const staffRouter =
{
  path: '/staffManage',
  name: 'staffManage',
  component: Layout,
  redirect: '/staffManage',
  // alwaysShow: true,
  meta: { 
    title: 'staffManage', 
    icon: 'peoples', 
    roles: ['/staff']
  },
  children: [
    {
      path: 'staff-index',
      name: 'staffIndex',
      component: () => import('@/views/staff/staff'),
      meta: {
        title: 'staffIndex',
        roles: ['/staff/manage'],
      }
    },
    // 暂时不用该段代码，全局rules影响表单及函数生命周期等
    // {
    //   path: 'staff-insert',
    //   name: 'insertStaff',
    //   component: () => import('@/views/staff/new'),
    //   meta: {
    //     title: 'insertStaff',
    //     // 防止没有按钮权限的用户，通过url直接进入页面
    //     roles: ['/staff/new']
    //   },
    //   hidden: true
    // },
    {
      path: 'staff-update',
      name: 'updateStaff',
      component: () => import('@/views/staff/update'),
      meta: {
        title: 'updateStaff',
        roles: ['/staff/update']
      },
      hidden: true
    },
    {
      path: 'staff-detail',
      name: 'detailStaff',
      component: () => import('@/views/staff/detail'),
      meta: {
        title: 'detailStaff',
        roles: ['/staff/detail']
      },
      hidden: true
    },
    {
      path: 'staff-add',
      name: 'addStaff',
      component: () => import('@/views/staff/insert'),
      meta: {
        title: 'addStaff',
        roles: ['/staff/new']
      },
      hidden: true
    },
    //分配部门
    {
      path: 'setDepartment',
      name: 'setDepartment',
      component: () => import('@/views/staff/setDepartment'),
      meta: {
        title: 'setDepartment',
        //roles: ['/staff/manage/updateDept']
      },
      hidden: true
    }
  ]
}

export default staffRouter
