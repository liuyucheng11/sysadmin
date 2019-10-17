<template>
  <div style="margin:10px">
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="角色名">
          <el-input v-model.trim="roleName" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fuzzyQuery()">查询</el-button>
          <el-button
            type="primary"
            @click="exportShow()"
            v-permission="['/roleManage/roleManage/export']"
            >导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-row>
        <el-button
          type="primary"
          @click="toCreateFrom"
          v-permission="['/roleManage/roleManage/add']"
          >新建</el-button
        >
        <el-button
          type="warning"
          @click="toRoleEdit"
          v-permission="['/roleManage/roleManage/update']"
          :disabled="disabled"
          >修改</el-button
        >
        <el-button
          type="danger"
          @click="handleDelete"
          v-permission="['/roleManage/roleManage/delete']"
          :disabled="disabled"
          >删除</el-button
        >
        <el-button
          type="primary"
          @click="toRoleAccount"
          :disabled="disabled"
          v-permission="['/roleManage/roleManage/addAccount']"
          >添加账号</el-button
        >
        <el-button
          type="primary"
          :disabled="disabled"
          @click="rolePermission"
          v-permission="['/roleManage/roleManage/permission']"
          >分配权限</el-button
        >
      </el-row>
    </div>

    <div>
      <el-table ref="singleTable" :data="list" highlight-current-row>
        <el-table-column label="选择" width="100" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="radio" :label="scope.row.id"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column prop="id" label="角色id">
          <template slot-scope="scope">
            <el-button type="text" @click="toRoleManageDec(scope.row.id)">{{
              scope.row.id
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名"></el-table-column>
        <el-table-column
          prop="approverAccount"
          label="审批人账号"
        ></el-table-column>
        <el-table-column
          prop="approverNumber"
          label="审批人编号"
        ></el-table-column>
        <el-table-column
          prop="approverName"
          label="审批人姓名"
        ></el-table-column>
        <el-table-column
          prop="approverDepartment"
          label="审批人部门"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :formatter="statusFormatter"
        >
        </el-table-column>
        <el-table-column prop="remark" label="描述"></el-table-column>
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
      <el-dialog title="请选择导出字段" :visible.sync="exportDialogVisible">
        <el-row>
          <el-button type="primary" icon="el-icon-upload" @click="runExport"
            >确定</el-button
          >
          <el-button type="primary" icon="el-icon-delete" @click="cancleExport"
            >取消</el-button
          >
        </el-row>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox v-for="city in cities" :label="city" :key="city[0]">{{
            city[1]
          }}</el-checkbox>
        </el-checkbox-group>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDictName } from "./enumUtil";
import { parseTime } from "@/utils";
import roleManageApi from "@/api/roleManage";

const cityOptions = [
  ["id", "角色id"],
  ["roleName", "角色名"],
  ["approverAccount", "审批人账号"],
  ["approverNumber", "审批人编号"],
  ["approverName", "审批人姓名"],
  ["approverDepartment", "审批人部门"],
  ["status", "状态"],
  ["remark", "描述"]
];
export default {
  data() {
    return {
      list: [], //List<roleManageVO>
      total: 10, //总记录数
      currentPage: 1, //当前页
      pageSize: 8, //每页大小
      roleName: "", //角色名
      id: "", //当前用户修改的角色ID
      flag: "",
      radio: "",
      disabled: true, //按钮状态
      currentRow: null, //当前行
      exportList: [], //导出列表
      roleManage: {
        //查询条件
        limit: "",
        currentPage: "",
        roleName: ""
      },
      tableData: [],
      exportData: [],
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true,
      exportTHeader: [],
      exportFilterVal: [],
      exportDialogVisible: false
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    radio(val) {
      //根据是否选中单选框决定是否禁用按钮
      this.id = val;
      roleManageApi
        .findById(this.id)
        .then(response => {
          this.flag = response.data.status;
          console.log(this.flag);
          if (this.flag == 1) {
            this.disabled = false;
          } else {
            this.disabled = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  methods: {
    statusFormatter(row, column) {
      switch (row.status) {
        case 0:
          return "无效";
          break;

        case 1:
          return "有效";
          break;
      }
    },
    fetchData() {
      //加载列表数据&&模糊查询
      (this.roleManage.limit = this.pageSize),
        (this.roleManage.currentPage = this.currentPage),
        (this.roleManage.roleName = this.roleName),
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

    fuzzyQuery() {
      //模糊查询重置页面
      this.currentPage = 1;
      this.fetchData();
    },

    handleDelete() {
      //删除数据
      roleManageApi.findById(this.id).then(response => {
        this.flag = response.data.status;
        console.log("flag:" + this.flag);
        if (this.flag == 0) {
          this.$message.error("角色已被删除，无法执行该操作！");
          this.fetchData();
          this.disabled = true;
        } else {
          this.$confirm("确定要删除改条记录吗?", "角色删除确认提示框", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              roleManageApi
                .deleteById(this.id)
                .then(response => {
                  this.$message({
                    message: response.data ? "角色删除成功" : "角色删除失败",
                    type: response.data ? "success" : "error"
                  });
                  if (response.data) {
                    this.fetchData(); // 刷新数据
                    this.disabled = true;
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },

    handleCheckAllChange(val) {
      this.exportTHeader = [];
      this.exportFilterVal = [];
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
      if (val) {
        for (let index = 0; index < this.checkedCities.length; index++) {
          const element = this.checkedCities[index];
          this.exportTHeader.push(element[1]);
          this.exportFilterVal.push(element[0]);
        }
      }
    },
    handleCheckedCitiesChange(value) {
      this.exportTHeader = [];
      this.exportFilterVal = [];
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        this.exportTHeader.push(element[1]);
        this.exportFilterVal.push(element[0]);
      }
    },
    exportShow() {
      this.exportDialogVisible = true;
    },
    runExport() {
      console.log(this.exportTHeader);
      console.log(this.exportFilterVal);
      this.getRoleAll();
      this.checkedCities = [];
      this.exportTHeader = [];
      this.exportFilterVal = [];
      this.checkAll = false;
    },
    cancleExport() {
      this.exportDialogVisible = false;
      this.checkAll = false;
      this.checkedCities = [];
      this.exportTHeader = [];
      this.exportFilterVal = [];
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

    toRoleAccount() {
      //跳转至账号添加页
      roleManageApi
        .findById(this.id)
        .then(response => {
          this.flag = response.data.status;
          console.log("flag:" + this.flag);
          if (this.flag == 0) {
            this.$message.error("角色已被删除，无法执行该操作！");
            this.fetchData();
            this.disabled = true;
          } else {
            this.$router.push({
              name: "RoleAccount",
              params: {
                id: this.id
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    toRoleEdit() {
      //跳转至角色修改页
      roleManageApi
        .findById(this.id)
        .then(response => {
          this.flag = response.data.status;
          console.log("flag:" + this.flag);
          if (this.flag == 0) {
            this.$message.error("角色已被删除，无法执行该操作！");
            this.fetchData();
            this.disabled = true;
          } else {
            this.$router.push({
              name: "RoleManageEdit",
              params: {
                id: this.id
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    toCreateFrom() {
      //跳转至新建表单页
      this.$router.push({
        name: "RoleManageForm"
      });
    },
    handleSizeChange(val) {
      //改变每页数量
      this.pageSize = val;
      this.fetchData();
    },

    handleCurrentPage(val) {
      //跳转页码
      this.radio = "";
      this.currentPage = val;
      this.fetchData();
    },

    //导出的方法
    exportExcel(exportData, exportTHeader, exportFilterVal) {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../excel/Export2Excel");
        const tHeader = exportTHeader;
        const filterVal = exportFilterVal;
        const list = exportData; //把data里的tableData存到list
        console.log("length:" + tHeader.length);
        if (tHeader.length < 1) {
          this.$message("导出字段不允许为空");
          return;
        }
        console.log("222" + filterVal);
        console.log("111" + list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(
          tHeader,
          data,
          "角色信息表" + parseTime(new Date())
        );
        this.$message("导出成功");
        this.exportDialogVisible = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "status") {
            return getDictName("status", v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    getRoleAll() {
      let this_ = this;
      let a = this_.exportTHeader;
      let b = this_.exportFilterVal;
      console.log("head:" + this_.exportTHeader); // 'rrr'
      roleManageApi
        .queryAllRole(JSON.stringify(this.roleManage))
        .then(response => {
          this.exportData = response.data;
          console.log("a:" + a);
          // console.log(this.exportTHeader);  // ..
          // console.log(this_.exportTHeader);  // ..
          this.exportExcel(this.exportData, a, b);
        })
        .catch(error => {
          console.log(error);
          this.$message({
            showClose: true,
            message: error,
            type: "error"
          });
        });
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
        query: { id: id, name: roleName }
      });
    }
  }
};
</script>
