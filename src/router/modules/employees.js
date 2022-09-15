// 员工的路由规则
import Layout from '@/layout'
export default {
// 路由规则
  path: '/employees', // 路由地址
  name: 'employees', // 给模块的一级路由加一个name属性，这个属性我们在后面做权限的时候会用到
  component: Layout,
  children: [{
    // 二级路由什么都不用写的时候，此时表示二级路由的默认路由
    path: '', // 这里不用写，表示路由路径为/employees
    component: () => import('@/views/employees'),
    // 路由元信息，其实就是一个存储数据的地方，可以放任何内容
    meta: {
      title: '员工管理', // 这里用title是因为左侧导航栏读取这里的title属性
      icon: 'people'
    }
  },
  {
    path: 'detail/:id', // query传参 动态路由传参
    component: () => import('@/views/employees/detail'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  },
  {
    path: 'print/:id', // 二级默认路由
    component: () => import('@/views/employees/print'), // 按需加载
    hidden: true,
    meta: {
      title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      icon: 'people'
    }
  }]
}
