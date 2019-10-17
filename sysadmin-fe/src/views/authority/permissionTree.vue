<template>
  <div>
    <el-tree
      @check="handleNodeClick"
      :props="setProps"
      :data="permissionList"
      node-key="id"
      show-checkbox
      highlight-current
      :default-checked-keys="rootId"
      ref="tree"
      :check-strictly="true"
      @check-change="handleCheckChange"
    ></el-tree>
  </div>
  <!-- :render-content="renderContent" 内容区渲染 -->
</template>

<script>
  import {getPermissionTree} from "../../api/authority";

  export default {
    name: "permissionTree",
    props: ["select", "rolePer", "accountPer", "page"],
    data() {
      return {
        permissionList: [], //格式[{id: , label: , children: []}]
        setProps: {
          label: "name", //节点名称
          children: "childPermission" //子节点
        },
        selectName: [],
        rootId: [],
        find: false,
        cancel: []
      }
    },
    mounted() {
      this.getPermissionList()
    },
    //当peops内对应的值发生变化时会调用这里对应的方法
    watch: {},
    methods: {
      //共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
      handleCheckChange(data) {
        let ids = this.$refs.tree.getCheckedKeys()
        let node = this.$refs.tree.getCheckedNodes()
        this.$emit("menu-select-role", ids, node)
        this.$emit("menu-select-account", ids)
        this.$emit("menu-select-query", node)
      },
      showSelect() {
        //console.log(this.$refs.tree.getCheckedKeys());
      },
      getPermissionList() {
        let _this = this
        getPermissionTree().then(result => {
          _this.permissionList = result.data
          // 通过标识判断
          if (_this.page === 'role') {
            _this.rootId = _this.rolePer
          }
          if (_this.page === 'account') {
            _this.rootId = _this.accountPer
          }
        })
      },
      handleNodeClick(node, checked) {
        let fathers;
        fathers = this.getFathersById(this.permissionList, node.id);
        let hasSelected = this.$refs.tree.getCheckedKeys();
        let set = new Set(hasSelected);
        fathers.forEach(i => {
          set.add(i);
        });
        this.$refs.tree.setCheckedKeys([...set]);
        //取消点击事件清空其下所有子节点
        if (node.type !== 3) {
          this.findChildren(node.id, this.permissionList);
          // console.log("子节点:" + this.cancel)
          let hasCheck = new Set(this.$refs.tree.getCheckedKeys());
          this.cancel.forEach(i => {
            hasCheck.delete(i);
          });
          this.$refs.tree.setCheckedKeys([...hasCheck]);
          this.cancel = []
        }
      },
      //递归获取所有父节点
      getFathersById(data, id) {
        for (let i = 0; i < data.length; i++) {
          //递归终止搜索条件
          if (data[i].id === id) {
            return [];
          }
          //子节点不为空递归搜索
          if (data[i].childPermission) {
            let fatherIds = this.getFathersById(data[i].childPermission, id);
            if (fatherIds !== undefined) {
              return fatherIds.concat(data[i].id);
            }
          }
        }
      },
      //取消菜单选择同时取消子节点
      checkChildren(node) {
        let checkIds = this.$refs.tree.getCheckedKeys();
        let after = new Set(checkIds);
        let contains = checkIds.some(item => {
          return item.id === node.id;
        });
        if (!contains) {
          let child = node.childPermission;
          for (let i = 0; i < child.length; i++) {
            if (checkIds.indexOf(child[i].id) !== -1) {
              after.delete(child[i].id);
            }
          }
          let val = [...after];
          this.$refs.tree.setCheckedKeys(val);
        }
      },
      //获取当前节点下所有节点
      findChildren(id, list) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === id) {
            //找到所在位置
            console.log(list[i]);
            this.getChildren(list[i]);
          }
          if (list[i].childPermission) {
            this.findChildren(id, list[i].childPermission)
          }
        }
      },
      getChildren(node) {
        let children = node.childPermission;
        if (children !== null) {
          for (let i = 0; i < children.length; i++) {
            if (children[i]) {
              this.cancel.push(children[i].id);
              this.getChildren(children[i]);
            }
          }
        }
      }

    }
  };
</script>
<style scoped>
</style>
