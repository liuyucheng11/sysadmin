<template>
  <div style="margin:10px">
    <el-form :inline="true" label-width="150px">
      <div>
        <div style="float:left">
          <h3>
            分配
            <b style="color:red">{{ roleName }}</b>角色权限
          </h3>
        </div>
        <div style="float:right;margin:10px">
          <el-form-item>
            <el-button type="primary" :disabled="canSave" @click="onSubmit">保存</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </div>
      </div>
      <div style="clear:both">
        <permission-tree style="margin-left: 20px;" :role-per="rolePer" :page="page"
                         @menu-select-role="changeParentRoleId"/>
      </div>
    </el-form>
  </div>
</template>

<script>
import PermissionTree from '@/views/authority/permissionTree'
import {
  getRolePerById,
  addRolePer,
  cancelRole
} from '@/api/authority'
import {
  constants
} from 'crypto'

export default {
  components: {
    PermissionTree
  },
  data() {
    return {
      roleName: '',
      roleId: 0,
      rolePer: [],
      // 子组件传递的选中的id数组
      ids: [],
      // 返回给后台的数组 参数为PermissionRole对象
      param: [],
      // 页面标识
      page: 'role',
      canSave: true
    }
  },
  created() {
    this.roleName = this.$route.query.name
    this.roleId = this.$route.query.id

    // 获取当前选中的节点
    const _this = this
    getRolePerById({roleId: this.roleId}).then(result => {
      for (let i = 0; i < result.data.length; i++) {
        _this.rolePer[i] = result.data[i].permissionId
      }
    }).catch(error => {
      this.$store.dispatch('tagsView/delVisitedView',this.$route)
			this.$router.go(-1)
    })
  },
  methods: {
    changeParentRoleId(ids) {
      this.ids = ids
      this.canSave = false
    },
    onSubmit() {
      if (this.ids.length !== 0) {
        for (const id of this.ids) {
          this.param.push({
            roleId: this.roleId,
            permissionId: id
          })
        }
      }
      if (this.ids.length === 0) {
        //如果选中的节点为空，则返回roleId
        this.param.push({
          roleId: this.roleId,
          permissionId: 0
        })
      }
      addRolePer(JSON.stringify(this.param))
        .then(result => {
          if (result.code === 200) {
            this.$alert('保存成功', '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
              this.$store.dispatch('tagsView/delVisitedView', this.$route)
              this.$router.go(-1)
            }
          })
        }
      })
    },
    close() {
      //cancelRole({roleId:this.roleId}).then(result => {}).catch()
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  },
  beforeDestroy(){}
}
</script>
