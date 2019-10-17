import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import departmentRouter from "./modules/department";
import queryRouter from "./modules/query";
import staffRouter from "./modules/staff";
import cityRouter from "./modules/city"
//import personalAccountRouter from "./modules/personlAccountManage";
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
	{
	  path: '/firstPasswordReset',
		name: 'firstPasswordReset',
	  component: () => import('@/views/personalaccountmanage/components/passwordReset'),
	  hidden:true
	 },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authRedirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes =
  departmentRouter.concat(
    [
      staffRouter,
      cityRouter,
      {
        path: '/accountManage',
        name: 'accountManage',
        redirect: '/accountManage/list',
        component: Layout,
        meta: {
          title: 'accountManage',
          roles: ['/accountManage/components'],
          icon: 'excel',
        },
        children: [
          {
            path: 'list',
            name: 'accountManage',
            component: () => import('@/views/accountManage/components/list'),
            meta: {
              title: 'accountManage'
            },
            hidden: true
            },
        {
          path: 'add',
          name: 'add',
          component: () => import('@/views/accountManage/components/add'),
          meta: {
            title: 'add',
          },
          hidden: true
        },
        {
          path: 'modify',
          name: 'modify',
          component: () => import('@/views/accountManage/components/modify'),
          meta: {
            title: 'modify',
          },
          hidden: true
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('@/views/accountManage/components/history'),
          meta: {
            title: 'history',
          },
          hidden: true

          },
          {
            path: 'assignPermissions',//账号管理分配权限的分配角色
            name: 'assignPermissions',
            component: () => import('@/views/accountManage/components/assignPermissions'),
            meta: {
              title: 'assignPermissions',
            },
            hidden: true
          }
        ]
      },
      {
        path: '/companyManage',
        name: 'companyMange',
        redirect: '/companyManage/list',
        component: Layout,
        alwaysShow: true,
        meta: {
          title: 'companyManage',
          icon: 'excel',
          roles:['/companyManage']
        },
        children: [
          {
            path: 'list',
            name: 'companyManage',
            component: () => import('@/views/companyManage/list'),
            meta: {
              title: 'companyManage'
            }
          },
          {
            path: '/companyManage/add',
            name: 'companyAdd',
            component: () => import('@/views/companyManage/add'),
            meta: {
              title: 'companyAdd'
            },
            hidden: true
          },
          {
            path: '/companyManage/edit',
            name: 'company-modify',
            component: () => import('@/views/companyManage/edit'),
            meta: {
              title: 'companyModify'
            },
            hidden: true
          },
        ]
      },
      {
        path: '/role',//角色管理一级导航
        name: 'Role',
        component: Layout,
        alwaysShow: true,
        meta: {
          title: 'role',
            roles
      :
        ['/roleManage'],
          icon: 'people',
        },// or you can only set roles in sub nav
        children: [
          {
            path: '/roleManage',//角色管理二级导航
            name: 'RoleManage',
            component: () => import('@/views/roleManage/roleManage'),
            meta: {
              title: 'roleManage',
              roles: ['/roleManage/roleManage'],
              icon: 'table'
            }
          },
          {
            path: '/roleManage/Form',//角色新建
            name: 'RoleManageForm',
            component: () => import('@/views/roleManage/form'),
            meta: {
              title: 'roleManageForm',
              roles: ['/roleManage/roleManage/add'],
            },
            hidden: true
          },
          {
            path: '/roleManage/roleDec',//角色详情
            name: 'RoleManageDec',
            component: () => import('@/views/roleManage/roleDec'),
            meta: {
              title: 'roleManageDec'
            },
            hidden: true
          },
          {
            path: '/roleManage/selectAccount',//审批人账号查询
            name: 'ApproverQuery',
            component: () => import('@/views/roleManage/approverQuery'),
            meta: {
              title: 'selectAccount'
            },
            hidden: true
          },
          {
            path: '/roleManage/roleManageEdit',//角色修改
            name: 'RoleManageEdit',
            component: () => import('@/views/roleManage/roleEdit'),
            meta: {
              title: 'roleManageEdit',
              roles: ['/roleManage/roleManage/update'],
            },
            hidden: true
          },
          {
            path: '/roleManage/roleAccount',//账号添加
            name: 'RoleAccount',
            component: () => import('@/views/roleManage/roleAccount'),
            meta: {
              title: 'roleAccount',
              roles: ['/roleManage/roleManage/addAccount'],
            },
            hidden: true
          },
          {
            path: '/roleManage/selectAccountList',
            name: 'SelectAccountList',
            component: () => import('@/views/roleManage/selectAccountList'),
            meta: {
              title: 'addRoleAccount',
            },
            hidden: true
          },
          {
            path: 'roleApply',//角色申请
            name: 'roleApply',
            component: () => import('@/views/roleApply/roleApply'),
            meta: {
              title: 'roleApply',
                roles
          :
            ['/roleManage/roleApply'],
              icon: 'table'
            }
          },
          {//角色申请新建
            path: '/roleApply/add',
            name: 'createRoleForm',
            component: () => import('@/views/roleApply/add'),
            meta: {
            title: 'createRoleForm',
            },
            hidden: true
          },

          {//角色申请修改
            path: '/roleApply/edit',
            name: 'editRoleForm',
            component: () => import('@/views/roleApply/edit'),
            meta: {
              title: 'editRoleForm'
            },
            hidden: true
          },
          {
            path: 'roleApprove',//角色审批
            name: 'roleApprove',
            component: () => import('@/views/roleApprove/list'),
            meta: {
              title: 'roleApprove',
                roles
          :
            ['/roleManage/roleApprove'],
              icon: 'table'
            }
          },
          {//角色审批详情
            path: '/roleApprove/edit',
            name: 'RoleApproveEdit',
            component: () => import('@/views/roleApprove/edit'),
            meta: {
              title: 'RoleApproveEdit'
            },
            hidden: true
          },
          {
            path: '/roleApprove/roleInfo',//角色详情
            name: 'ApproveRoleInfo',
            component: () => import('@/views/roleApprove/roleInfo'),
            meta: {
              title: 'ApproveRoleInfo'
            },
            hidden: true
          },
          {//角色权限管理
            path: '/authority/rolePermission',
            name: 'rolePermission',
            component: () => import('@/views/authority/rolePermission'),
            meta: {
              title: 'rolePermission',
              roles: ['/roleManage/roleManage/permission'],
            },
            hidden: true
          },
          {//角色申请表选择角色
            path: '/roleApply/addFormRole',
            name: 'addFormRole',
            component: () => import('@/views/roleApply/addFormRole'),
            meta: {
              title: 'addFormRole'
            },
            hidden: true
          },

        ]
      },
      {
        path: '/dictionary',
        component: Layout,
        redirect: 'dictionary',
        children: [
          {
            path: 'dictionary',
            component: () => import('@/views/dictionary/dictionary'),
            name: 'dictionary',
            meta: { title: 'dictionary', icon: 'dashboard', roles: ['1'] }
          }
        ]
      },
      {
        path: '/personlAccountManage',
        component: Layout,
        alwaysShow: true,
        meta: {
          title: 'personalAccountManage',
            roles
      :
        ['/personal'],
          icon: 'excel',
        },
        children: [
          {
            path: '/basicInfoView',
            component: () => import('@/views/personalaccountmanage/components/basicInfoView'),
            name: 'basicInfoView',
            meta: {
        title: 'basicInfoView',
          roles
      :
        ['/personal/see'],
            }
          },
          {
            path: '/passwordReset',
            component: () => import('@/views/personalaccountmanage/components/passwordReset'),
            name: 'passwordReset',
            meta: {
            title: 'passwordReset',
              roles
          :
            ['/personal/reset'],
            }
          }]
      }
    ].concat(queryRouter)

      .concat([{ path: '*', redirect: '/404', hidden: true }])
  )

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
