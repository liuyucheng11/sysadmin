<template>
  <el-tree :data="permissionList"
           :props="setProps"
           node-key="id"
           :default-expanded-keys="rootId"
           :auto-expand-parent="false"
           :expand-on-click-node="false"
           :render-content="renderContent"
           :check-strictly="true"
           style="margin-top: 1rem">
  </el-tree>
</template>

<script>
import {getPermissionTree} from "@/api/authority"
export default {
  name: "radioTree",
  props: ['select', 'refresh', 'returnName', 'clearChoose'],
  data() {
      return {
        permissionList: [], //格式[{id: , label: , children: []}]
        setProps: {
          label: "name", //节点名称
          children: "childPermission" //子节点
        },
        selectId: null,
        selectName: '', //选中节点名称
        selectAllName:'',//父节点-子节点
        rootId: null,
        expanded: false,
        unDrawRadio: [],
        find: false
      }
    },
    created() {
      this.getPermissionList()
    },
    watch: {
      selectId(val) {
        if (this.returnName) {
          this.findId(val,this.permissionList,true)
          let param = {
            id: val,
            name: this.selectName,
            allName: this.selectAllName
          }
          this.$emit('selectId', param)
        } else {
          this.$emit('selectId', val)
        }
      },
      select(val) {
        if (val !== null) {
          this.unDrawRadio = []
          this.getPermissionList()
        }
      },
      refresh(val) {
        if (val) {
          this.getPermissionList()
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
    methods: {
      getPermissionList() {
        let _this = this
        getPermissionTree().then(result => {
          _this.permissionList = result.data
          if (this.select !== undefined) {
            this.findId(_this.select , _this.permissionList,false)
          }
          if (!this.expanded) {
            this.rootId = [this.permissionList[0].id]
            this.expanded = true
          }
        })
      },
      // setName(id, pid, list){ // 19  15
      //   for (let i = 0; i < list.length; i++) {
      //     if(list[i].id === pid){
      //       let children = list[i].childPermission
      //       if(children !== null){
      //         for (let j = 0; j < children.length; j++){
      //           if(children[j].id === id){//找到这个节点
      //             this.selectName = list[i].name + '-' + this.selectName
      //           }else{
      //             this.setName(children[j].id, children[j].pid, children)
      //           }
      //         }
      //       }
      //     }else{
      //       this.setName(children[j].id, children[j].pid, children)
      //     }
      //   }
      // },
      wirte(id, data) { //19
        let fatherIds = []
        for (let i = 0; i < data.length; i++) {
          //子节点不为空递归搜索
          let children = data[i].childPermission
          if (children) {
            let fatherIds = this.wirte(id, data[i].childPermission)
            if (fatherIds !== undefined) {
              return fatherIds.concat(data[i].name)
            }
          }
          //递归终止搜索条件
          if (data[i].id === id) {
            return fatherIds.concat(data[i].name)
          }
        }
      },
      findId(id, list, isPush) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === id) {
            this.selectAllName = ''
            if (isPush) {
              let arr = this.wirte(list[i].id, this.permissionList)
              this.selectName = arr[0]
              for (let name of arr){
                if(this.selectAllName){
                  this.selectAllName = name + '-'  + this.selectAllName
                }else{
                  this.selectAllName = name + this.selectAllName
                }
              }
              return
            } else {
              this.unDrawRadio.push(list[i].id)
              this.pushUndrawId(list[i])
            }
          } else {
            if (list[i].childPermission !== null) {
              this.findId(id,list[i].childPermission,isPush)
            }
          }
        }
      },
      pushUndrawId(permission) {
        if (permission.childPermission !== null) {
          for (let j = 0; j < permission.childPermission.length; j++) {
            this.unDrawRadio.push(permission.childPermission[j].id)
            this.pushUndrawId(permission.childPermission[j])
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