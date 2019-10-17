import request from "@/utils/request";

const group_name = "roleManage";
const api_name = "roleManage";

export default {

    //给角色添加账号
    addRoleAccount(addRoleAccountDTO) {
        return request({
            url: `/${group_name}/addRoleAccount.do`,
            data: addRoleAccountDTO,
            method: 'post',
            //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
            headers:{
                'Content-Type':'application/json'
            }
        });
    },

    //根据角色模糊查询角色列表&&全部角色列表
    getListByRole(roleManage) {
        return request({
            url: `/${group_name}/queryPageListByRole.do`,
            data: roleManage,
            method: 'post',
            //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
            headers:{
                'Content-Type':'application/json'
            }
        });
    },
    
    //根据角色模糊查询角色列表&&全部角色列表
    createRole(ruleForm) {
        return request({
            url: `/${group_name}/createRole.do`,
            data: ruleForm,
            method: 'post',
            //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
            headers:{
                'Content-Type':'application/json'
            }
        });
    },
    
    getRoleAccount(account) {
        return request({
            url: `/${group_name}/getRoleAccount.do`,
            data: account,
            method: 'post',
            //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
            headers:{
                'Content-Type':'application/json'
            }
        });
      },

    //根据id查询角色
    findById(id) {
        return request({
            url: `/${group_name}/findById/${id}`,
            method: "get",
        });
    },

    //更新角色
    updateRole(ruleForm) {
        return request({
            url: `/${group_name}/updateRole.do`,
            data: ruleForm,
            method: 'post',
            //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
            headers:{
                'Content-Type':'application/json'
            }
        });
    },

    //根据id删除角色
    deleteById(id) {
        return request({
            url: `/${group_name}/deleteById/${id}`,
            method: "get",
        });
    },

    //角色唯一效验
    queryTotalByName(roleName) {
        return request({
            url: `/${group_name}/queryTotalByName/${roleName}`,
            method: "get",
        });
    },

    //根据角色id查找账号id数组
    getRoleAccountId(id) {
        return request({
            url: `/${group_name}/getRoleAccountId/${id}`,
            method: "get",
        });
    },

    //删除角色账号
    deleteRoleAccount(ids) {
        return request({
            url: `/${group_name}/deleteRoleAccount.do`,
            data: ids,
            method: 'post',
            //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
            headers:{
                'Content-Type':'application/json'
            }
        });
    },

    //删除角色账号
    queryAllRole(roleManage) {
        return request({
            url: `/${group_name}/queryAllRole.do`,
            data: roleManage,
            method: 'post',
            //注意后端用@RequsetBody接收json时，请求头设置为json，否则会有异常, params:改为data:(踩坑。。。)
            headers:{
                'Content-Type':'application/json'
            }
        });
    },
    

};
