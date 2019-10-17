<template>
  <div style="margin:10px">
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData('search')">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-row>
        <el-row>
          <el-button :disabled="disabled" type="primary" @click="toCreateFrom()">确认选择</el-button>
          <el-button @click="setCurrent()">取消</el-button>
        </el-row>
      </el-row>
    </div>

    <div>
      <el-table ref="singleTable" :data="list" highlight-current-row>
        <el-table-column label="选择" width="100" align="center">
          <template slot-scope="scope">
            <el-radio v-model="selectRole" :label="scope.row">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="角色ID">
          <template slot-scope="scope">
            <el-button type="text" @click="toRoleManageDec(scope.row.id)">{{
              scope.row.id
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="approverAccount" label="审批人账号"></el-table-column>
        <el-table-column prop="approverNumber" label="审批人员工编号"></el-table-column>
        <el-table-column prop="approverName" label="审批人姓名"></el-table-column>
        <el-table-column prop="approverDepartment" label="审批人所属部门"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ getStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="描述"></el-table-column>
      </el-table>
    </div>

    <div class="block" style="margin: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPage" :current-page="currentPage"
        :page-sizes="[5, 8, 10]" :page-size="8" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import roleManageApi from "@/api/roleManage";
  export default {
    name: 'addFormRole',
    data() {
      return {
        selectRole: {},
        list: [], //List<roleManageVO>
        total: 10, //总记录数
        currentPage: 1, //当前页
        pageSize: 8, //每页大小
        roleName: "", //角色名
        id: "", //当前用户修改的角色ID
        radio: "",
        disabled: true, //按钮状态
        currentRow: null, //当前行
        roleManage: {
          //查询条件
          limit: "",
          currentPage: "",
          roleName: ""
        }
      };
    },
    created() {
      this.fetchData();
    },
    watch: {
      selectRole(val) {
        //根据是否选中单选框决定是否禁用按钮
        this.id = val;
        console.log(this.id)
        if (val != null) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      }
    },

    methods: {
      setCurrent(row) {
        // 回调关闭父组件的弹框
        this.$emit("cancel", null);
      },
      fetchData(status) {
        if(status == "search"){
          this.roleManage.roleName = this.roleName;
          this.currentPage = 1;
        }
        //加载列表数据&&模糊查询
        (this.roleManage.limit = this.pageSize),
        (this.roleManage.currentPage = this.currentPage),
        roleManageApi
          .getListByRole(JSON.stringify(this.roleManage))
          .then(response => {
            this.list = response.data.list;
            this.total = response.data.totalCount;
          })
          .catch(error => {
            console.log(error);
          });
      },
      toRoleManageDec(id) {
        //跳转至角色详情页
        this.$router.push({
          name: "RoleManageDec",
          params: {
            id: id
          }
        });
      },

      toRoleEdit() {
        //跳转至角色修改页
        this.$router.push({
          name: "RoleManageEdit",
          params: {
            id: this.id
          }
        });
      },

      toCreateFrom() {
        this.$emit('selectRole', this.selectRole);
        // //跳转至新建表单页
        // let this_ = this;
        // this.$router.push({
        //   name: 'createRoleForm',
        //   params: {
        //     selectRole: this_.selectRole,
        //     isEdit:true
        //   }
        // })
      },

      getStatus(status) {
        return status == "1" ? "有效" : "无效";
      },


      handleSizeChange(val) {
        //改变每页数量
        this.pageSize = val;
        this.fetchData();
      },

      handleCurrentPage(val) {
        //跳转页码
        this.radio = null;
        this.currentPage = val;
        this.fetchData();
      },

      //添加权限 修改人：郑伟坤
      rolePermission() {
        let id;
        let roleName;
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === this.id) {
            roleName = this.list[i].roleName;
            id = this.list[i].id;
          }
        }
        //跳转至添加角色权限页面,并传递角色名
        this.$router.push({
          path: "/authority/rolePermission",
          query: {
            id: id,
            name: roleName
          },

        });
      }
    }
  };
</script>
