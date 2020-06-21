/* 
后台用户管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/acl/user'
const product = '/admin/product/baseTrademark'
// /admin/product/baseTrademark/
export default {

  /* 
  获取后台用户分页列表(带搜索)
  */
  getList(page, limit) {
    if(page && limit){
        return request.get(`${product}/${page}/${limit}`)
    }else
    return request.get(`${product}/getTrademarklist`)
  },

  /* 
  根据ID获取品牌
  */
  get(id) {
    return request.get(`${api_name}/get/${id}`)
  },

/* 
  删除指定id的品牌
  DELETE /admin/product/baseTrademark/remove/{id}
  */
 remove(id) {
    return request.delete(`${api_name}/remove/${id}`)
  },


/* 
  添加品牌
  POST /admin/product/baseTrademark/save

  */
 add({tmName,logoUrl}) {
    return request.post(`${api_name}/save,{tmName,logoUrl}`)
  },


/* 
  更新品牌
 PUT /admin/product/baseTrademark/update

  */
 update(trademark) {
    return request.put(`${api_name}/update,trademark`)
  },





  add(user) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: user
    })
  },

  /* 
  更新一个后台用户
  */
  update(user) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: user
    })
  },

  /* 
  获取某个用户的所有角色
  */
  getRoles(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },

  /* 
  给某个用户分配角色
  roleId的结构: 字符串, 'rId1,rId2,rId3'
  */
  assignRoles(userId, roleId) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: {
        userId,
        roleId
      }
    })
  },

  /* 
  删除某个用户
  */
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },

  /* 
  批量删除多个用户
  ids的结构: ids是包含n个id的数组
  */
  removeUsers(ids) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: ids
    })
  }
}
