import request from '@/utils/request'
// 封装公司角色请求，读取公司角色信息
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 封装读取公司信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
// 删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
// 编辑角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
// 获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

