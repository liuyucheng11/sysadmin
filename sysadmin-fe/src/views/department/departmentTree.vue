<template>
  <el-tree :data="departmentList"
           :props="setProps"
           node-key="id"
           :default-expanded-keys="rootId"
           :auto-expand-parent="false"
           :expand-on-click-node="false"
           :render-content="renderContent"
           style="margin-top: 1rem">
  </el-tree>
</template>

<script>
  import {getDepartmentTree} from "../../api/department";

  export default {
    name: "departmentTree",
    props: ['select', 'refresh', 'returnName', 'clearChoose'],
    data() {
      return {
        departmentList: [],
        setProps: {
          children: 'childDepartment',
          label: 'name'
        },
        selectId: null,
        selectName: '',
        rootId: null,
        expanded: false,
        unDrawRadio: [],
        find: false
      }
    },
    watch: {
      selectId(val) {
        if (this.returnName) {
          this.findId(val,this.departmentList,true)
          let param = {
            id:val,
            name: this.selectName
          }
          this.$emit('selectId', param)
        } else {
          this.$emit('selectId', val)
        }
      },
      select(val) {
        if (val !== null) {
          this.unDrawRadio = []
          console.log("接收到选择部门",val)
          // this.findId(val,this.departmentList)
          this.getDepartmentList()
        }
      },
      refresh(val) {
        if (val) {
          this.getDepartmentList()
          this.$emit('refresh',true)
        } else {
          this.$emit('refresh',false)
        }
      },
      clearChoose(val) {
        if (val) {
          this.selectId = null
          this.$emit('clear',true)
        } else {
          this.$emit('clear',false)
        }
      }
    },
    created() {
      this.getDepartmentList()
    },
    methods: {
      getDepartmentList() {
        getDepartmentTree().then(res => {
          this.departmentList = res.data
          if (this.select !== undefined) {
            this.findId(this.select,this.departmentList,false)
          }
          if (!this.expanded) {
            this.rootId = [this.departmentList[0].id]
            this.expanded = true
          }
        })
      },
      findId(id, departmentList, isPush) {
        for (let i = 0; i < departmentList.length; i++) {
          if (departmentList[i].id === id) {
            if (isPush) {
              this.selectName = departmentList[i].name
              return
            } else {
              this.unDrawRadio.push(departmentList[i].id)
              this.pushUndrawId(departmentList[i])
            }
          } else {
            if (departmentList[i].childDepartment !== null) {
              this.findId(id,departmentList[i].childDepartment,isPush)
            }
          }
        }
      },
      pushUndrawId(department) {
        if (department.childDepartment !== null) {
          for (let j = 0; j < department.childDepartment.length; j++) {
            this.unDrawRadio.push(department.childDepartment[j].id)
            this.pushUndrawId(department.childDepartment[j])
          }
        }
      },
      renderContent(h, {node, data, store}) {
        let radio = ''
        let color = ''
        if (data.status === 0) {
          color = 'color:red'
          radio = (<span style="font-size: 14px;padding-left:28px">{node.label}</span>)
        } else {
          if (this.unDrawRadio.indexOf(data.id) !== -1) {
            radio = (<span style="font-size: 14px;padding-left:28px">{node.label}</span>)
          } else {
            radio = (<el-radio v-model={this.selectId} label={data.id}> {node.label} </el-radio>)
          }
        }
        return (
          <span style={color}>{radio}</span>
        )
      }
    }
  }
</script>

<style scoped>

</style>
