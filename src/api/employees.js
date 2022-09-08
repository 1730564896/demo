import request from '@/utils/request'
// 获取员工简单信息
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
