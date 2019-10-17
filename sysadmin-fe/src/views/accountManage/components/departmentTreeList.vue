<template>
  <div>
    <!--<el-button size="mini" type="primary" style="width:75px" @click="getKeys">确定选择</el-button>-->
    <el-tree :data="departmentList"
             :props="setProps"
             node-key="id"
             ref="tree"
             show-checkbox
             :auto-expand-parent="false"
             :expand-on-click-node="false"
             :render-content="renderContent"
             :check-strictly="true"
             :default-checked-keys="trees"
             @check-change="getKeys"
             empty-text="正在加载"
             style="width:250px;">
    </el-tree>

  </div>
</template>
<script>
  import {getDepartmentTree} from "../../../api/department";

  export default {
    name: "departmentTreeList",
    props: ['trees'],//父组件传过来的已经选中的节点ID数组
      data() {
      return {
        departmentList: [],
        checkNodes: [],
        setProps: {
          children: 'childDepartment',
          label: 'name',
          disabled: this.disabledFn,
        }
      }
    },
    watch: {

    },
    created() {
      this.getDepartmentList()
    },
    methods: {
      //将无效节点禁用
      disabledFn(data, node) {
        return data.status === 0;
      },
      //获取节点数据
      getDepartmentList() {
        getDepartmentTree().then(res => {
          this.departmentList = res.data;
        })
      },
      //加载部门树
      renderContent(h, {node, data, store}) {
        let color = '';
        if (data.status === 0) {
          color = 'color:red'
        }
        return (
          <span style={color}>{node.label}</span>
        )
      },
      getKeys() {
        this.checkNodes = this.$refs.tree.getCheckedKeys();
        this.$emit("selectDeptIds", this.checkNodes);
      },
    }
  }
</script>

<style scoped>

</style>
