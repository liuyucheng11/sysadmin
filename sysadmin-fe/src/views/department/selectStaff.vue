<template>
  <div>
    <el-form label-width="25%">
      <el-row>
        <el-col :span="8">
          <el-form-item label="员工编号">
            <el-input v-model="queryParams.staffNumber" clearable>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="员工姓名">
            <el-input v-model="queryParams.staffName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登录账号">
            <el-input v-model="queryParams.accountNo" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
        <el-col :span="8">
          <el-form-item label="是否离职">
            <el-select v-model="queryParams.staffIsLeft" placeholder="请选择" style="width: 100%" disabled>
              <el-option :key="0" label="在职"
                         :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      <el-row>
        <el-col :span="6">
          <el-form-item label="所属部门" label-width="33%">
            <el-input v-model="departmentName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label-width="20%">
            <el-button type="primary" @click="openDialog(1)" style="width: 100%">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上级部门" label-width="33%">
            <el-input v-model="parentDepartmentName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label-width="20%">
            <el-button type="primary" @click="openDialog(2)" style="width: 100%">选择</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align: center">
        <el-col>
          <el-button type="warning" icon="el-icon-search" @click="getStaffList">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin: 20px">
      <el-button type="primary" icon="el-icon-check" @click="confirmLeader">确认选择</el-button>
      <el-button type="primary" icon="el-icon-close" @click="cancelSelect">取消</el-button>
    </el-row>
    <el-row style="margin: 20px">
      <el-table :data="staffList" border>
        <el-table-column label="选择" width="50px">
          <template slot-scope="scope">
            <el-radio v-model="selectStaff" :label="scope.row">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="staffNumber" label="员工编号"></el-table-column>
        <el-table-column prop="accountNo" label="登录账号"></el-table-column>
        <el-table-column prop="staffName" label="员工姓名"></el-table-column>
        <el-table-column prop="staffSex" label="性别" width="50px">
          <template slot-scope="scope">
            <span v-if="scope.row.staffSex === 1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column prop="staffTelephone" label="员工手机"></el-table-column>
        <el-table-column prop="staffEmail" label="员工邮箱" width="200px"></el-table-column>
        <el-table-column prop="departmentName" label="所属部门"></el-table-column>
        <el-table-column prop="parentDepartmentName" label="上级部门"></el-table-column>
        <el-table-column prop="staffIsLeft" label="是否离职" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.staffIsLeft === 0">在职</span>
            <span v-else>离职</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handelSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.currentPage"
        :page-sizes="[5,10,20,50,100]"
        :page-size="queryParams.limit"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
        style="margin: 20px"></el-pagination>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :modal="false"
      :visible.sync="dialogVisible">
      <el-row>
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="confirmDept">确定</el-button>
        <el-button
          type="primary"
          icon="el-icon-delete"
          @click="cancelDept">清空</el-button>
      </el-row>
      <department-tree
        :return-name="true"
        :clear-choose="clearChoose"
        @clear="clear"
        @selectId="changeDeptId"></department-tree>
    </el-dialog>
  </div>
</template>

<script>
  import {getStaff} from "../../api/staff";
  import DepartmentTree from "./departmentTree";

  export default {
    name: "selectStaff",
    components: {DepartmentTree},
    data() {
      return {
        staffList: [],
        selectStaff: null,
        queryParams: {
          staffNumber: null,
          staffName: null,
          accountNo: null,
          departmentId: null,
          parentDepartmentId: null,
          staffIsLeft: 0,
          currentPage: 1,
          limit: 5
        },
        departmentName: null,
        parentDepartmentName: null,
        tempDept: {
          id: null,
          name: null
        },
        clearChoose: false,
        dialogTitle: '',
        dialogVisible: false,
        departmentType: 0,
        total: 0
      }
    },
    created() {
      this.getStaffList()
    },
    methods: {
      getStaffList() {
        getStaff(this.queryParams).then((res) => {
          this.staffList = res.data.list
          this.total = res.data.totalCount
        })
      },
      handelSizeChange(val) {
        this.queryParams.limit = val
        this.getStaffList()
      },
      handleCurrentChange(val) {
        this.queryParams.currentPage = val
        this.getStaffList()
      },
      openDialog(val) {
        this.departmentType = val
        this.dialogTitle = val === 1 ? "选择所属部门" : "选择上级部门"
        this.selectId = null
        this.dialogVisible = true
      },
      changeDeptId(val) {
        this.tempDept.id = val.id
        this.tempDept.name= val.name
      },
      confirmDept() {
        if (this.departmentType === 1) {
          this.queryParams.departmentId = this.tempDept.id
          this.departmentName = this.tempDept.name
        } else {
          this.queryParams.parentDepartmentId = this.tempDept.id
          this.parentDepartmentName = this.tempDept.name
        }
        this.tempDept = {}
        this.clearChoose = true
        this.dialogVisible = false
      },
      cancelDept() {
        this.tempDept = {}
        if (this.departmentType === 1) {
          this.queryParams.departmentId = null
          this.departmentName = null
        } else {
          this.queryParams.parentDepartmentId = null
          this.parentDepartmentName = null
        }
        this.clearChoose = true
        this.dialogVisible = false
      },
      clear(val) {
        if (val) {
          this.clearChoose = false
        }
      },
      confirmLeader() {
        this.$emit('leader', this.selectStaff)
        this.$emit('dialogVisible', false)
        this.selectStaff = null
      },
      cancelSelect() {
        this.$emit('dialogVisible', false)
      }
    }
  }
</script>

<style>
  .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: black;
    cursor: text;
  }
</style>
