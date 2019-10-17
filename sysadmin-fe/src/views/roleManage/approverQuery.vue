<template>
  <div class="list">
    <el-form class="form" :data="searchForm" :inline="true">
      <el-row>
        <el-col :span="5">
          <el-form-item label="登录账号">
            <el-input v-model="searchForm.accountNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="员工编号">
            <el-input v-model="searchForm.staffNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.staffName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据权限类型">
            <el-select v-model="searchForm.datalimit">
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
              @clear="clearSelect"
              clearable="true"
              style="width: 200px;"
              v-model="searchForm.departmentName"
            ></el-input>
            <el-button type="primary" @click="selectDept">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否关联员工">
            <el-select style="width: 100px;" v-model="searchForm.isConnect">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="全部"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号状态">
            <el-select v-model="searchForm.status">
              <el-option label="正常" value="1"></el-option>
              <el-option label="冻结" value="2"></el-option>
              <el-option label="全部"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item style="margin-left: 500px">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div>
      <el-row>
        <el-button type="primary" @click="toAddAccount" :disabled="disable"
          >确认选择</el-button
        >
        <el-button type="primary" @click="onBack">取 消</el-button>
      </el-row>
    </div>
    <div class="search-result">
      <div class="result-table">
        <el-table :data="accountList">
          <!--<el-table-column type="selection" width="60" label="选择"></el-table-column>-->
          <el-table-column label="选择" width="50">
            <template slot-scope="scope">
              <el-radio
                v-model="selectAccountId"
                :label="scope.row.id"
                @change="getCurrentRow(scope.row)"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="账号"
            v-if="false"
          ></el-table-column>
          <el-table-column prop="accountNo" label="登录账号"></el-table-column>
          <el-table-column
            prop="staffNumber"
            label="员工编号"
          ></el-table-column>
          <el-table-column prop="staffName" label="员工姓名"></el-table-column>
          <el-table-column
            prop="departmentName"
            label="员工所属部门"
          ></el-table-column>
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
          <el-table-column prop="modifyName" label="操作人"></el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div>
        <el-dialog title="请选择部门" :visible.sync="dialogVisible">
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
          <department-tree
            :return-name="true"
            @selectId="changeDeptId"
          ></department-tree>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { updateAccount } from "@/api/accountManage";
import { getPage2 } from "@/api/accountManage";
import accountEnum from "@/views/accountManage/components/accountEnum";
import DepartmentTree from "@/views/department/departmentTree";

export default {
  name: "list",
  components: { DepartmentTree },
  props: {},
  data() {
    return {
      ruleForm: {
        id: "",
        roleName: "",
        approverAccount: "",
        approverNumber: "",
        approverName: "",
        approverDepartment: "",
        business: []
      },
      currentRow: null, //当前行数据
      selectAccountId: null,
      selectAccountStatus: null,
      dialogVisible: false,
      deleteDialogVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dataLimitList: accountEnum.dataLimit.getEnumList(),
      searchForm: {
        departmentId: null
      },
      accountList: [],

      //账号id 修改人：郑伟坤
      name: ""
    };
  },
  watch: {},
  computed: {
    disable() {
      return this.selectAccountId === null ? true : false;
    },
    disable1() {
      if (this.selectAccountStatus == 1) {
        return false;
      }
      return true;
    },
    disable2() {
      if (this.selectAccountStatus == 2) {
        return false;
      }
      return true;
    },
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
  methods: {
    getData() {
      let this_ = this;
      let param = {
        currentPage: this_.currentPage,
        limit: this_.pageSize,
        accountNo: this_.searchForm.accountNo,
        staffNumber: this_.searchForm.staffNumber,
        staffName: this_.searchForm.staffName,
        departmentId: this_.searchForm.departmentId,
        datalimit: this_.searchForm.datalimit,
        status: this_.searchForm.status
      };
      if (this_.searchForm.isConnect == 0) {
        param.isNotConnect = 1;
      } else if (this_.searchForm.isConnect == 1) {
        param.isConnect = 1;
      }
      console.log(param)
      getPage2(JSON.stringify(param))
        .then(result => {
          this_.total = result.data.totalCount;
          this_.accountList = result.data.list;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //分页处理
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getData();
    },
    //同上
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    toAddAccount() {
      //选择账号并返回
      this.ruleForm = this.$route.params.ruleForm;
      this.ruleForm.approverId = this.currentRow.id;
      this.ruleForm.approverAccount = this.currentRow.accountNo;
      this.ruleForm.approverNumber = this.currentRow.staffNumber;
      this.ruleForm.approverName = this.currentRow.staffName;
      this.ruleForm.approverDepartment = this.currentRow.departmentName;
      console.log(this.ruleForm);
      if (this.ruleForm.id != "") {
        this.$store.dispatch("tagsView/delVisitedView", this.$route);
        this.$router.push({
          name: "RoleManageEdit",
          params: {
            ruleForm: this.ruleForm
          }
        });
      } else {
        this.$store.dispatch("tagsView/delVisitedView", this.$route);
        this.$router.push({
          name: "RoleManageForm",
          params: {
            ruleForm: this.ruleForm
          }
        });
      }
    },
    onBack() {
      //返回修改页
      this.ruleForm = this.$route.params.ruleForm;
      if (this.ruleForm.id != "") {
        this.$store.dispatch("tagsView/delVisitedView", this.$route);
        this.$router.push({
          name: "RoleManageEdit",
          params: {
            ruleForm: this.ruleForm
          }
        });
      } else {
        //返回新建页
        this.$store.dispatch("tagsView/delVisitedView", this.$route);
        this.$router.push({
          name: "RoleManageForm",
          params: {
            ruleForm: this.ruleForm
          }
        });
      }
    },
    search() {
      this.currentPage = 1;
      this.getData();
    },
    toAdd() {
      this.$router.push("/accountManage/add");
    },
    selectDept() {
      this.dialogVisible = true;
    },
    cancelSelectDept() {
      this.searchForm.departmentName = null;
      this.searchForm.departmentId = null;
      this.dialogVisible = false;
    },
    clearSelect(){
      if(this.searchForm.departmentName==null){
        this.searchForm.departmentName = null;
      this.searchForm.departmentId = null;
      }
      
    },
    commitSelectDept() {
      this.dialogVisible = false;
    },
    changeDeptId(val) {
      this.searchForm.departmentId = val.id;
      this.searchForm.departmentName = val.name;
    },
    getCurrentRow(row) {
      this.currentRow = row;
      this.selectAccountStatus = row.status;
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    // this.getData();
  },
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



