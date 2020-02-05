import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/person/list',
    method: 'get',
    params: query
  })
}

export function createPerson(data) {
  return request({
    url: '/vue-element-admin/person/create',
    method: 'post',
    data
  })
}

export function updatePerson(data) {
  return request({
    url: '/vue-element-admin/person/update',
    method: 'post',
    data
  })
}
