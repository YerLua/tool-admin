// Just a mock data

export const constantRoutes = [
  {
    path: '/redirect',
    component: 'layout/Layout',
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: 'views/redirect/index'
      }
    ]
  },
  {
    path: '/login',
    component: 'views/login/index',
    hidden: true
  },
  {
    path: '/404',
    component: 'views/error-page/404',
    hidden: true
  },
  {
    path: '/401',
    component: 'views/error-page/401',
    hidden: true
  },
  {
    path: '',
    component: 'layout/Layout',
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: 'views/dashboard/index',
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/permission',
    component: 'layout/Layout',
    redirect: '/permission/index',
    alwaysShow: true,
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'page',
        component: 'views/permission/page',
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin']
        }
      },
      {
        path: 'role',
        component: 'views/permission/role',
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/error',
    component: 'layout/Layout',
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: 'views/error-page/401',
        name: 'Page401',
        meta: { title: 'Page 401', noCache: true }
      },
      {
        path: '404',
        component: 'views/error-page/404',
        name: 'Page404',
        meta: { title: 'Page 404', noCache: true }
      }
    ]
  },
  {
    path: '/sysmanager',
    component: 'layout/Layout',
    redirect: '/sysmanager/index',
    alwaysShow: true, // will always show the root menu
    name: 'SysManager',
    meta: { 
       title:'系统管理',
       icon: 'component',
       roles:['admin']
    },
    children: [
      {
          path: 'person',
          component: () => import('views/sysmgr/person'),
          name: 'PersonMgr',
          meta: {
            title: '人员管理',
            roles: ['admin'] // or you can only set roles in sub nav
          }
      },
      {
          path: 'department',
          component: () => import('views/sysmgr/department'),
          name: 'DepartmentMgr',
          meta: {
            title: '部门管理',
            roles: ['admin'] // or you can only set roles in sub nav
          }
      }
    ]
  },
  {
    path: '/error-log',
    component: 'layout/Layout',
    redirect: 'noRedirect',
    children: [
      {
        path: 'log',
        component: 'views/error-log/index',
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
