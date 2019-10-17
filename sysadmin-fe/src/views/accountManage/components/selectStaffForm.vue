<template>
  <div id="swagger">
    <el-form :inline="true" v-model="conditionForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="员工编号">
            <el-input v-model="conditionForm.staffNumber" placeholder="请输入员工编号" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="员工姓名">
            <el-input v-model="conditionForm.staffName" placeholder="请输入员工姓名" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登陆账号">
            <el-input v-model="conditionForm.accountNo" placeholder="请输入登陆账号" prefix-icon="el-icon-search"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属部门">
            <el-input v-model="conditionForm.departmentName" style="width:150px" :disabled="true"></el-input>
            <el-button type="primary" @click="commitSelectDept">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级部门">
            <el-input v-model="conditionForm.parentDepartmentName" style="width:150px" :disabled="true"></el-input>
            <el-button type="primary" @click="commitSelectParentDept">选择</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-button type="primary" @click="getStaff" style="margin-left: 450px">查询</el-button>
    </el-row>
    <el-row>
      <el-button type="primary" @click="selectStaff">确定选择</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-row>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      @row-click="toDetail"
      id="staffTable"
    >
      <el-table-column label="选择" width="50%">
        <template scope="scope">
          <el-radio
            v-model="selectStaffId"
            :label="scope.row.id"
            @change="getCurrentRow(scope.row.id,scope.row.staffNumber,scope.row.staffName,scope.row.staffEmail,scope.row.departmentId)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="staffNumber" label="员工编号" width="120"></el-table-column>
      <el-table-column prop="accountNo" label="登录账号"></el-table-column>
      <el-table-column prop="staffName" label="员工姓名"></el-table-column>
      <el-table-column prop="staffSex" label="员工性别" :formatter="formatSex"></el-table-column>
      <el-table-column prop="staffTelephone" label="员工手机"></el-table-column>
      <el-table-column prop="staffEmail" label="员工邮箱"></el-table-column>
      <el-table-column prop="departmentName" label="所属部门"></el-table-column>
      <el-table-column prop="parentDepartmentName" label="上级部门"></el-table-column>
      <el-table-column prop="staffIsLeft" label="是否离职" :formatter="formatStaffIsLeft"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentPage"
        :current-page="conditionForm.currentPage"
        :page-sizes="[5, 8, 10]"
        :page-size="conditionForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>
    <!-- 选择部门对话框 -->
    <div>
      <el-dialog
        title="请选择部门"
        :append-to-body="true"
        :visible.sync="dialogVisible"
      >
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="dialogVisible = false"
          >确定</el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancelSelectDept()"
          >取消</el-button>
        </el-row>
        <department-tree
          :return-name="true"
          :clear-choose="selectDept"
          @selectId="changeDeptId"
          @clear="clearSelectDept"
        ></department-tree>
      </el-dialog>
    </div>

    <!-- 上级部门对话框 -->
    <div>
      <el-dialog
        title="请选择上级部门"
        :visible.sync="parentDialogVisible"
        :append-to-body="true"
      >
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="parentDialogVisible = false"
          >确定</el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancelSelectParentDept()"
          >取消</el-button>
        </el-row>
        <department-tree
          :return-name="true"
          :clear-choose="selectParentDept"
          @selectId="changeParentDeptId"
          @clear="clearSelectParentDept"
        ></department-tree>
      </el-dialog>
    </div>

  </div>
</template>

<script>
    import { getAccountNoIsNullList } from "../../../api/staff";
    import DepartmentTree from "../../department/departmentTree";

    export default {
      name: "selectStaffForm",
      components: { DepartmentTree },
      props: {},
      data() {
        return {
          selectStaffId: null,
          selectStaffData: null,
          // 查询总数量
          totalCount: 0,
          // 查询条件 currentPage limit staffNumber accountNo staffName staffIsLeft departmentId parentDepartmentId
          conditionForm: {
            currentPage: 1,
            limit: 5,
            staffNumber: "",
            accountNo: "",
            staffName: "",
            staffIsLeft: 0,
            departmentId: "",
            departmentName: "",
            parentDepartmentId: "",
            parentDepartmentName: "",
          },

          // 员工数据
          tableData: [],
          // 部门对话框
          dialogVisible: false,
          // 上级部门对话框
          parentDialogVisible: false,
          // 是否清除选中的部门ID
          selectDept: false,
          selectParentDept: false,
          // 是否点击过选择部门的按钮
          clickSelected: false,
          clickParentSelected: false,
        };
      },
      watch: {},
      computed: {},
      methods: {
        selectStaff() {
          this.$emit("selectStaff", this.selectStaffData);
        },
        cancel() {
          this.$emit("selectStaff", null);
        },
        getCurrentRow(id,staffNumber,staffName,email,departmentId) {
          this.selectStaffData = null;
          let param = {
            id: id,
            staffNumber: staffNumber,
            staffName: staffName,
            email: email,
            departmentId: departmentId
          }
          this.selectStaffData = param;
        },
        // 获取员工数组
        getData() {
          let this_ = this;
          getAccountNoIsNullList(this_.conditionForm)
            .then(result => {
              this.tableData = result.data.list;
              this.totalCount = result.data.totalCount;
            })
            .catch(error => {
              console.log(error);
              alert(error);
            });
        },
        getStaff() {
          this.currentPage = 1;
          this.getData();
        },
        // 性别显示
        formatSex: function(row, column) {
          return row.staffSex == 1 ? "男" : "女";
        },
        // 是否离职显示
        formatStaffIsLeft: function(row, column) {
          return row.staffIsLeft == 1 ? "是" : "否";
        },
        //选择
        commitSelectDept() {
          this.dialogVisible = true;
          if (this.clickSelected) {
            this.selectDept = true;
          }else {
            this.clickSelected = true;
          }
        },
        commitSelectParentDept() {
          this.parentDialogVisible = true;
          if (this.clickParentSelected) {
            this.selectParentDept = true;
          }else {
            this.clickParentSelected = true;
          }
        },
        // 部门树子组件向父组件传值
        clearSelectDept(val) {
          if(val) {
            this.selectDept = false;
          }
        },
        clearSelectParentDept(val) {
          if(val) {
            this.selectParentDept = false;
          }
        },
        // 部门列表对话框
        cancelSelectDept() {
          this.conditionForm.departmentName = null;
          this.conditionForm.departmentId = null;
          this.dialogVisible = false;
        },
        changeDeptId(val) {
          this.conditionForm.departmentId = val.id;
          this.conditionForm.departmentName = val.name;
        },
        // 上级部门对话框
        cancelSelectParentDept() {
          this.conditionForm.parentDepartmentName = null;
          this.conditionForm.parentDepartmentId = null;
          this.parentDialogVisible = false;
        },
        changeParentDeptId(val) {
          this.conditionForm.parentDepartmentId = val.id;
          this.conditionForm.parentDepartmentName = val.name;
        },
        // 分页查询（改变页面大小）
        handleSizeChange(val) {
          //改变每页数量
          this.conditionForm.limit = val;
          this.getStaff();
        },
        // 改变页码
        handleCurrentPage(val) {
          //跳转页码
          this.conditionForm.currentPage = val;
          this.getStaff();
        }
      },
      created() {
        this.getData();
      },
      activated() {
        this.getData();
      },
      destroyed() {
        this.selectStaffId = null;
        this.selectStaffData = null;
      }
    };
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper {
  &.dialog-fade-leave-active {
     -ms-animation: none;
   }
  }
</style>
