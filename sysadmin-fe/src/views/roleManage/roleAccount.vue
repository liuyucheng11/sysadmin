<template>
  <div style="margin:10px">
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="登录账号：">
          <el-input v-model.trim="accountNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fuzzyQuery">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-row>
        <el-button type="danger" @click="handleDelete" :disabled="disabled"
          >移 除</el-button
        >
        <el-button type="primary" @click="addShow">添 加</el-button>
        <el-button type="primary" @click="onBack">返 回</el-button>
      </el-row>
    </div>

    <div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        :row-key="getRowKeys"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="选择"
          type="selection"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column prop="accountNo" label="登录账号"> </el-table-column>
        <el-table-column prop="staffNumber" label="员工编号"> </el-table-column>
        <el-table-column prop="staffName" label="员工姓名"> </el-table-column>
        <el-table-column prop="departmentName" label="员工所属部门">
        </el-table-column>
        <el-table-column
          prop="datalimit"
          label="数据权限类型"
          :formatter="datalimitFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="账号状态"
          :formatter="statusFormatter"
        >
        </el-table-column>
        <el-table-column prop="modifyName" label="操作人"> </el-table-column>
        <el-table-column prop="modifyTime" label="操作时间"> </el-table-column>
      </el-table>
    </div>
    <div class="block" style="margin: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentPage"
        :current-page="currentPage"
        :page-sizes="[5, 8, 10]"
        :page-size="8"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <div>
      <el-dialog
        title="添加账号"
        width="90%"
        :append-to-body="true"
        :visible.sync="addDialogVisible"
      >
        <SelectAccountList
          :accountIdsParam="accountIds"
          :roleIdParam="roleId"
          @close="closeShow"
          :flag="addDialogVisible"
        >
        </SelectAccountList>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import roleManageApi from "@/api/roleManage";
import SelectAccountList from "@/views/roleManage/selectAccountList";
export default {
  components: { SelectAccountList },
  data() {
    return {
      tableData: [], //列表账号
      flag: "",
      multipleSelection: [], //选中数据
      ids: [], //需要删除的id
      accountIds: [], //已添加的id
      disabled: true,
      total: 10, //总记录数
      currentPage: 1, //当前页
      pageSize: 8, //每页大小
      roleId: "", //角色ID
      accountNo: "",
      addDialogVisible: false,
      account: {
        //查询条件
        roleId: "",
        limit: "",
        currentPage: "",
        accountNo: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  watch: {},
  methods: {
    datalimitFormatter(row, column) {
      switch (row.status) {
        case 1:
          return "全部";
          break;
        case 2:
          return "递归";
          break;
        case 3:
          return "本部门";
          break;
        case 4:
          return "本人";
          break;
        case 5:
          return "手动选择";
          break;
      }
    },
    statusFormatter(row, column) {
      switch (row.status) {
        case 1:
          return "正常";
          break;
        case 2:
          return "冻结";
          break;
        case 3:
          return "无效";
          break;
      }
    },
    fetchData() {
      //加载列表数据
      (this.roleId = this.$route.params.id),
        (this.account.roleId = this.roleId),
        (this.account.limit = this.pageSize),
        (this.account.currentPage = this.currentPage),
        (this.account.accountNo = this.accountNo),
        roleManageApi
          .getRoleAccount(JSON.stringify(this.account))
          .then(response => {
            console.log(response);
            this.tableData = response.data.list;
            this.total = response.data.totalCount;
            this.setaccountIds();
          })
          .catch(error => {
            console.log(error);
          });
    },
    fuzzyQuery() {
      //模糊查询重置页面
      console.log("查询执行了");
      this.currentPage = 1;
      this.fetchData();
    },
    setaccountIds() {
      this.accountIds.splice(0, this.accountIds.length);
      roleManageApi
        .getRoleAccountId(this.roleId)
        .then(response => {
          console.log("22222response" + response.data);
          this.accountIds = response.data;
          console.log("333333accountIds" + this.accountIds);
        })
        .catch(error => {
          console.log(error);
        });
    },

    addShow() {
      roleManageApi
        .findById(this.roleId)
        .then(response => {
          this.flag = response.data.status;
          console.log("flag:" + this.flag);
          if (this.flag == 0) {
            this.$message.error("角色已被删除，无法执行该操作！");
          } else {
            console.log(this.accountIds);
            this.addDialogVisible = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    closeShow() {
      this.addDialogVisible = false;
      this.fetchData();
    },

    handleDelete() {
      //删除数据
      roleManageApi
        .findById(this.roleId)
        .then(response => {
          let role = response.data;
          let accounts = []; 
          this.flag = response.data.status;
          console.log("flag:" + this.flag);
          if (this.flag == 0) {
            this.$message.error("角色已被删除，无法执行该操作！");
          } else {
            this.ids.splice(0, this.ids.length);
            this.multipleSelection.forEach(item => {
              accounts.push(item.accountNo);
              this.ids.push(item.id);
              console.log(this.ids);
            });
            
            this.$confirm("确定要删除 角色名:"+role.roleName+" 下的 账号:"+accounts.join(";")+"吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              roleManageApi
                .deleteRoleAccount(JSON.stringify(this.ids))
                .then(response => {
                  this.$message({
                    message: response.data ? "删除成功" : "删除失败",
                    type: response.data ? "success" : "error"
                  });
                  if (response.data) {
                    this.fetchData(); // 刷新数据
                    this.$refs.multipleTable.clearSelection();
                    this.disabled = true;
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getRowKeys(row) {
      return row.id;
    },

    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      console.log(this.multipleSelection);
      if (this.multipleSelection != "") {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },

    handleSizeChange(val) {
      //改变每页数量
      this.pageSize = val;
      this.fetchData();
    },

    handleCurrentPage(val) {
      //跳转页码
      this.currentPage = val;
      this.fetchData();
    },

    onBack() {
      //回到列表页
      this.$store.dispatch("tagsView/delVisitedView", this.$route);
      this.$router.push({
        name: "RoleManage"
      });
    }
  }
};
</script>