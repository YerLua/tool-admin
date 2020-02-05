import Mock from 'mockjs'

const List = []
const count = 100

const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
for(let i = 0; i < count; i++) {
    List.push(Mock.mock({
        personID: '@increment',
        userName: '@first',
        name: '@first',
        ICCardNo:  /\d{5,10}/,
        mobilePhone: /^1(3|4|5|6|7|8|9)\d{9}$/,
        'departmentID|1': [1, 2, 3, 11, 12],
        'departmentName|1': ['浙江省', "杭州市", "宁波市", "河南省", "河北省"],
        image_uri,
        'roleName|1':['领导','普通员工','管理员'],
        password: /\d\D{6,10}/,
        'enable|1': [0, 1],
        createTime: +Mock.Random.date('T'),
        updateTime: +Mock.Random.date('T'),
        lastLoginTime: +Mock.Random.date('T')
    }))  
}

export default [
  {
    url: '/vue-element-admin/person/list',
    type: 'get',
    response: config => {
        const { department, role, searchKey, pageNo, pageSize } = config.query
        let mockList = List.filter(item => {
          if (department && item.departmentID != department) return false
          if (role && item.roleName !== role) return false
          if (searchKey && (item.userName.indexOf(searchKey) < 0 
                         && item.name.indexOf(searchKey) < 0 
                         && item.mobilePhone.indexOf(searchKey) < 0)) return false
          return true
        })
  
        const pageList = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
  
        return {
          code: 20000,
          data: {
            total: mockList.length,
            items: pageList
          }
        }
      }
  },
  {
    url: '/vue-element-admin/person/create',
    type: 'post',
    response: _ => {
        return {
        code: 20000,
        data: 'success'
        }
    }
  },
  {
    url: '/vue-element-admin/person/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]