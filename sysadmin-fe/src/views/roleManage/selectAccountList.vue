<template>
  <div class="list">
    <el-form class="form" :data="searchForm" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="登录账号">
            <el-input v-model="searchForm.accountNo" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工编号">
            <el-input v-model="searchForm.staffNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.staffName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据权限类型">
            <el-select v-model="searchForm.datalimit" >
              <el-option label="全部" value="1" />
              <el-option label="递归" value="2" />
              <el-option label="本部门" value="3" />
              <el-option label="本人" value="4" />
              <el-option label="手动选择" value="5" />
              <el-option label="全选" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="员工所属部门">
            <el-input
              v-model="searchForm.departmentName"
              style="width: 200px;"
            />
            <el-button type="primary" @click="selectDept">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否关联员工">
            <el-select v-model="searchForm.isConnect" style="width: 100px;">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
              <el-option label="全部" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号状态">
            <el-select v-model="searchForm.status">
              <el-option label="正常" value="1" />
              <el-option label="冻结" value="2" />
              <el-option label="全部" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item style="margin-left: 600px">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-row>
      <el-button type="primary" @click="commitSelect" :disabled="disabled"
        >确认选择</el-button
      >
      <el-button type="primary" @click="onBack()">取 消</el-button>
    </el-row>

    <div class="search-result">
      <div class="result-table">
        <el-table
          ref="multipleTable"
          :data="accountList"
          :row-key="getRowKeys"
          @selection-change="getMultiSelection"
        >
          <el-table-column type="selection" :reserve-selection="true" label="选择" width="50" />
          <el-table-column v-if="false" prop="id" label="账号" />
          <el-table-column prop="accountNo" label="登录账号" />
          <el-table-column prop="staffNumber" label="员工编号" />
          <el-table-column prop="staffName" label="员工姓名" />
          <el-table-column prop="departmentName" label="员工所属部门" />
          <el-table-column prop="datalimit" label="数据权限类型">
            <template slot-scope="scope">
              {{ getDataLimit(scope.row.datalimit) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账号状态">
            <template slot-scope="scope">
              {{ getStatus(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="操作时间">
            <template slot-scope="scope">
              {{ scope.row.modifyTime}}
            </template>
          </el-table-column>
          <el-table-column prop="modifyName" label="操作人" />
        </el-table>
        <el-pagination
          background
          :current-page="currentPage"
          :page-sizes="[5, 8, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
      <div>
        <el-dialog
          title="请选择部门"
          :visible.sync="dialogVisible"
          :append-to-body="true"
        >
          <el-row>
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="commitSelectDept()"
              >确定</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-delete"
              @click="cancelSelectDept()"
              >取消</el-button
            >
          </el-row>
          <department-tree :return-name="true" @selectId="changeDeptId" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import roleManageApi from "@/api/roleManage";
import { getAccountNotInIds } from "../../api/accountManage";
import accountEnum from "../accountManage/components/accountEnum";
import DepartmentTree from "../department/departmentTree";

export default {
  name: "SelectAccountList",
  components: { DepartmentTree },
  props: { accountIdsParam: Array, roleIdParam: Number,flag: Boolean},
  data() {
    return {
      currentPage: 1,
      pageSize: 8,
      total: 0,
      accountIds: [], //查询账号时需要排除的ID数组
      addRoleAccountDTO: {
        roleId: "",
        accountId: [] //需要添加的id
      },
      roleId: "",
      disabled: true,
      selectAccountId: null,
      selectAccountStatus: null,
      dialogVisible: false,
      deleteDialogVisible: false,
      dataLimitList: accountEnum.dataLimit.getEnumList(),
      searchForm: {
        departmentId: null
      },
      accountList: [],
      multipleSelection: [] // 选择的多行数据
    };
  },
  created(){
    this.getData();
  },
  computed: {
    getDataLimit() {
      return function(param) {
        return accountEnum.dataLimit.getLabelByValue(param);
      };
    },
    getStatus() {
      return function(param) {
        return accountEnum.status.getLabelByValue(param);
      };
    }
  },
  watch: {
    flag(val){
      console.log("flag:"+val)
      this.getData();
    },
  },
  methods: {
    getMultiSelection(val) {
      this.multipleSelection = val;
      if (this.multipleSelection != "") {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },

    commitSelect() {
      //确定选择，将multipleSelection传递
      this.addRoleAccountDTO.accountId.length = 0;
      console.log("multipleSelection:1" + this.multipleSelection);
      this.multipleSelection.forEach(item => {
        this.addRoleAccountDTO.accountId.push(item.id);
      });
      console.log(this.addRoleAccountDTO.accountId);
      console.log(this.addRoleAccountDTO.roleId);
      roleManageApi
        .addRoleAccount(JSON.stringify(this.addRoleAccountDTO))
        .then(response => {
          if (response.data) {
            this.$message({
              message: "恭喜你，添加成功",
              type: "success"
            });
            this.accountList.splice(0,this.accountList.length);
            this.$refs.multipleTable.clearSelection();
            this.$emit("close");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    onBack() {
      //回到列表页
      this.accountList.splice(0,this.accountList.length);
      this.$refs.multipleTable.clearSelection();
      this.$emit("close");
    },

    // 分页处理
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getData()
    },
    // 同上
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    getRowKeys(row) {
      return row.id;
    },
    getData() {
      this.accountIds = this.accountIdsParam;
      this.roleId = this.roleIdParam;
      this.addRoleAccountDTO.roleId = this.roleId;
      console.log("roleIdParam:"+this.roleIdParam)
      console.log("addRoleAccountDTO.roleId:"+this.addRoleAccountDTO.roleId)
      console.log("roleId:"+this.roleId)
      console.log("accountIdsParam:"+this.accountIdsParam)
      console.log("accountIds:"+this.accountIds)
      const this_ = this;
      const param = {
        currentPage: this_.currentPage,
        limit: this_.pageSize,
        accountNo: this_.searchForm.accountNo,
        staffNumber: this_.searchForm.staffNumber,
        staffName: this_.searchForm.staffName,
        departmentId: this_.searchForm.departmentId,
        datalimit: this_.searchForm.datalimit,
        status: this_.searchForm.status,
        accountIds: this_.accountIds
      };
      if (this_.searchForm.isConnect == 0) {
        param.isNotConnect = 1;
      } else if (this_.searchForm.isConnect == 1) {
        param.isConnect = 1;
      }
      getAccountNotInIds(JSON.stringify(param))
        .then(result => {
          this.accountList = result.data.list;
          this.total = result.data.totalCount;
        })
        .catch(error => {
          console.log(error);
        });
    },
    search() {
      this.currentPage = 1;
      this.getData();
    },
    selectDept() {
      this.dialogVisible = true;
    },
    cancelSelectDept() {
      this.searchForm.departmentName = null;
      this.searchForm.departmentId = null;
      this.dialogVisible = false;
    },
    commitSelectDept() {
      this.dialogVisible = false;
    },
    changeDeptId(val) {
      this.searchForm.departmentId = val.id;
      this.searchForm.departmentName = val.name;
    }
  }
};
</script>
<style lang="scss" scoped>
.list {
  padding: 20px;

  .form {
    .input {
      height: 12px;
      width: 200px;
    }
  }
  .search-result {
    margin-top: 50px;
  }
}
.btnRow {
  padding: 20px;
  text-align: center;
}

.selectbtn {
  margin-left: auto;
  margin-right: auto;
}

.exportbtn {
  margin-left: auto;
  margin-right: auto;
}

.el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
}
</style>

