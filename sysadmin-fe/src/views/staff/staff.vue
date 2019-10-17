<template>
  <div id="swagger">

    <el-form
      :label-position="labelPosition"
      :inline="true"
      v-model="conditionForm"
    >

      <el-form-item
        prop="staffNumber"
        label="员工编号"
      >
        <el-input
          v-model.trim="conditionForm.staffNumber"
          placeholder="请输入员工编号"
          prefix-icon="el-icon-search"
          class="input"
          @keyup.enter.native="getStaffList"
        ></el-input>&nbsp;
      </el-form-item>

      <el-form-item
        prop="staffName"
        label="员工姓名"
      >
        <el-input
          v-model.trim="conditionForm.staffName"
          placeholder="请输入员工姓名"
          prefix-icon="el-icon-search"
          class="input"
          @keyup.enter.native="getStaffList"
        ></el-input>&nbsp;
      </el-form-item>

      <el-form-item
        prop="accountNo"
        label="登陆账号"
      >
        <el-input
          v-model.trim="conditionForm.accountNo"
          placeholder="请输入登陆账号"
          prefix-icon="el-icon-search"
          class="input"
          @keyup.enter.native="getStaffList"
        ></el-input>
      </el-form-item>

      <el-form-item
        prop="departmentName"
        label="所属部门"
      >
        <el-input
          v-model.trim="conditionForm.departmentName"
          placeholder="请选择所属部门"
          prefix-icon="el-icon-search"
          class="input"
          style="width:175px"
          :readonly="true"
        ></el-input>
        <el-button
          type="primary"
          @click="selectDept"
          class="departmentBt"
        >选择</el-button>
        &nbsp;
      </el-form-item>

      <el-form-item
        prop=""
        label="上级部门"
      >
        <el-input
          v-model.trim="conditionForm.parentDepartmentName"
          placeholder="请选择上级部门"
          prefix-icon="el-icon-search"
          class="input"
          style="width:175px"
          :readonly="true"
        ></el-input>
        <el-button
          type="primary"
          @click="selectparentDept"
          class="departmentBt"
        >选择</el-button>
        &nbsp;
      </el-form-item>

      <el-form-item
        prop=""
        label="是否离职:"
      >
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{conditionForm.staffLeft}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">离职</el-dropdown-item>
            <el-dropdown-item command="0">在职</el-dropdown-item>
            <el-dropdown-item command="2">全部</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

    </el-form>
    <div class="btnRow">
      <el-button
        type="primary"
        @click="getStaffList"
        class="selectbtn"
      >查询</el-button>
      <el-button
        type="primary"
        @click="exportShow"
        class="exportbtn"
        v-permission="['/staff/manage/export']"
      >导出</el-button>
    </div>
    <div class="form">
      <el-row>
        <el-button
          type="primary"
          @click="toNew"
          v-permission="['/staff/manage/new']"
          round
        >新建</el-button>
        <el-button
          type="warning"
          round
          :disabled="!isActived"
          @click="toUpdate"
          v-permission="['/staff/manage/update']"
        >修改</el-button>
        <el-button
          type="danger"
          round
          :disabled="!isActived2"
          @click="updateBatchStatusFalse"
          v-permission="['/staff/manage/delete']"
        >删除</el-button>
        <el-button
          type="warning"
          round
          :disabled="!isActived3"
          @click="updateBatchIsLeft"
          v-permission="['/staff/manage/quit']"
        >离职</el-button>
        <el-button
          type="success"
          round
          :disabled="!isActived4"
          @click="updateBatchIsNotLeft"
          v-permission="['/staff/manage/recovery']"
        >恢复</el-button>
        <el-button
          type="info"
          round
          :disabled="!isActived"
          @click="setDept"
          v-permission="['/staff/manage/updateDept']"
        >分配部门</el-button>
      </el-row>
    </div>

    <el-table
      v-loading="selectLoading"
      :data="tableData"
      stripe
      style="width: 100%;font-size: 13px"
      @selection-change="handleSelectionChange"
      id="staffTable"
    >
      <el-table-column
        label="选择"
        width="60"
        type="selection"
      >
      </el-table-column>
      <el-table-column
        prop="staffNumber"
        label="员工编号"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="12px"
            @click="toDetail(scope.row)"
          >{{scope.row.staffNumber}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="accountNo"
        label="登录账号"
      >
      </el-table-column>
      <el-table-column
        prop="staffName"
        label="员工姓名"
      >
      </el-table-column>
      <el-table-column
        prop="staffSex"
        label="员工性别"
        :formatter="formatSex"
      >
      </el-table-column>
      <el-table-column
        prop="staffTelephone"
        label="员工手机"
        :formatter="formatStaffTelephone"
      >
      </el-table-column>
      <el-table-column
        prop="staffEmail"
        label="员工邮箱"
      >
      </el-table-column>
      <el-table-column
        prop="departmentName"
        label="所属部门"
      >
      </el-table-column>
      <el-table-column
        prop="parentDepartmentName"
        label="上级部门"
      >
      </el-table-column>
      <el-table-column
        prop="staffIsLeft"
        label="是否离职"
        :formatter="formatStaffIsLeft"
      >
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentPage"
        :current-page="conditionForm.currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="conditionForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>
    <!-- 所属部门: 选择部门对话框 -->
    <div>
      <el-dialog
        title="请选择部门"
        :visible.sync="dialogVisible"
      >
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="commitSelectDept()"
            
          >确定</el-button>
          <!-- :disabled="canPointChoose" -->
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancelSelectDept()"
          >取消</el-button>
          <el-button
            type="primary"
            icon="el-icon-remove-outline"
            @click="clearSelectDept()"
          >清空</el-button>
        </el-row>

        <department-tree
          :return-name="true"
          @selectId="changeDeptId"
          :clear-choose="clearChoose"
          @clear="clear"
        ></department-tree>
      </el-dialog>
    </div>

    <!-- 上级部门对话框 -->
    <div>
      <el-dialog
        title="请选择上级部门"
        :visible.sync="parentDialogVisible"
      >
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="commitSelectParentDept()"
            
          >确定</el-button>
          <!-- :disabled="canPointParent" -->
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancelSelectParentDept()"
          >取消</el-button>
          <el-button
            type="primary"
            icon="el-icon-remove-outline"
            @click="clearSelectparentDept"
          >清空</el-button>
        </el-row>
        <department-tree
          :return-name="true"
          @selectId="changeParentDeptId"
          :clear-choose="clearChooseParent"
          @clear="clearParent"
        ></department-tree>
      </el-dialog>
    </div>

    <!-- 分配部门对话框 -->
    
    <!-- 导出对话框 -->
      <el-dialog
        title="请选择导出字段"
        :visible.sync="exportDialogVisible"
      >
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="runExport"
            v-permission="['/staff/manage/export']"
            
          >确定</el-button>
          <!-- :disabled="exportCanPoint" -->
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancleExport"
            v-permission="['/staff/manage/export']"
          >取消</el-button>
        </el-row>
        <span style="color: red">{{msg}}</span><br>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="city in cities"
            :label="city"
            :key="city[0]"
          >{{city[1]}}</el-checkbox>
        </el-checkbox-group>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getStaff,
  updateBatchIsLeft,
  updateBatchIsNotLeft,
  updateBatchStatusFalse,
  updateDepartment,
  getStaffAll
} from "../../api/staff";
import DepartmentTree from "../department/departmentTree";
import staffEnum from "./staffEnum";
// import FileSaver from "file-saver";
// import XLSX from "xlsx";
import rules from "@/utils/rules";
import { getDictName, getEnum } from "./enumUtil";

// 导出字段数组列表，[0]为属性，[1]为表头
const cityOptions = [
  ["staffNumber", "员工编号"],
  ["accountNo", "登录账号"],
  ["staffName", "员工姓名"],
  ["staffSex", "员工性别"],
  ["staffTelephone", "员工手机"],
  ["staffEmail", "员工邮箱"],
  ["departmentName", "所属部门"],
  ["parentDepartmentName", "上级部门"],
  ["staffIsLeft", "是否离职"]
];

export default {
  name: "staff",
  components: { DepartmentTree },
  props: {},
  data() {
    return {
      clearChoose: false, //所属部门
      clearChooseParent: false,//上级部门
      clearParentUpdate: false,
      departmentId: "",
      departmentName: "",
      departmentIdUpdate: "",
      departmentNameUpdate: "",
      parentDepartmentId: "",
      ParentDepartmentName: "",

      rules,
      // rules1: {
      //   staffNumber: [
      //     { required: true, message: "不能输入空格", trigger: "blur" },
      //     { min: 1, max: 20, message: " 编号长度为1-20位", trigger: "blur" },
      //     { validator: checkStaffNumber, trigger:'blur'}
      //   ],
      //   staffName: [
      //     { required: true, message: " 不能输入空格", trigger: "blur" },
      //     { min: 1, max: 30, message: "姓名长度为1-30位", trigger: "blur" }
      //   ],
      //   accountNo:[],
      // },

      labelPosition: "right",
      // 查询总数量
      totalCount: 0,
      // 查询条件 currentPage limit staffNumber accountNo staffName staffIsLeft departmentId parentDepartmentId
      conditionForm: {
        currentPage: 1,
        limit: 5,
        staffNumber: "",
        accountNo: "",
        staffName: "",
        staffIsLeft: 2,
        departmentId: "",
        departmentName: "",
        parentDepartmentId: "",
        parentDepartmentName: "",
        status: 1,
        // 下拉菜单（是否离职）
        staffLeft: "全部"
      },
      // 分配部门
      departmentId2: "",
      departmentName2: "",
      // 员工数据
      tableData: [],
      // 导出员工数据
      exportData: [],
      // 修改、分配   （按钮激活）
      isActived: false,
      // 删除
      isActived2: false,
      // 离职
      isActived3: false,
      // 在职
      isActived4: false,
      // 选择的员工数组
      multipleSelection: [],
      // 选择的id数组
      idArray: [],
      // 部门对话框
      dialogVisible: false,
      // 上级部门对话框
      parentDialogVisible: false,
      // 分配部门对话框
      dialogFormVisible: false,
      // 选择的员工数据(分配部门)
      formLabelAlign: {
        // 当前选择的id
        id: "",
        staffNumber: "",
        staffName: "",
        staffSex: "",
        staffTelephone: "",
        departmentName: "",
        departmentId: '',
        beforeDepartmentName: ''
      },
      // 导出
      // 是否全选
      checkAll: false,
      // 选择的字段
      checkedCities: [],
      // 总字段
      cities: cityOptions,
      // 全选（不确定的）
      isIndeterminate: false,
      // 表头
      exportTHeader: [],
      // 表数据字段
      exportFilterVal: [],
      // 导出弹出框显示
      exportDialogVisible: false,
      // tableData加载
      selectLoading: false,
      exportLoading: false,

      canPointChoose: true,//选择部门
      canPointParent: true,//选择上级部门
      canPoint: true,//分配部门
      exportCanPoint: true,

      msg: '',
      //存数据
      temporary: {
        currentPage: 1,
        limit: 5,
        staffNumber: "",
        accountNo: "",
        staffName: "",
        staffIsLeft: 2,
        departmentId: "",
        departmentName: "",
        parentDepartmentId: "",
        parentDepartmentName: "",
        status: 1,
        // 下拉菜单（是否离职）
        staffLeft: "全部"
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 获取员工数组
    getData() {
      let this_ = this;
      this.selectLoading = true;
      getStaff(this_.conditionForm)
        .then(result => {
          this.tableData = result.data.list;
          this.selectLoading = false;
          this.totalCount = result.data.totalCount;
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
    getStaffList() {
      this.conditionForm.currentPage = 1;
      this.conditionForm.limit = 5;
      this.getData();
    },
    // 获取多选的所有数据、判断按钮的激活
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.idArray = [];
      for (let item of val) {
        this.idArray.push(item.id);
      }

      if (this.multipleSelection.length < 1) {
        this.isActived = false;
        this.isActived2 = false;
        this.isActived3 = false;
        this.isActived4 = false;
      } else if (this.multipleSelection.length == 1) {
        this.isActived = true;
        this.isActived2 = true;
        this.isActived3 = true;
        this.isActived4 = true;
        // 获取当前选择的员工id  (分配部门)
        this.formLabelAlign.id = this.idArray[0];
        this.formLabelAlign.staffNumber = this.multipleSelection[0].staffNumber;
        this.formLabelAlign.staffName = this.multipleSelection[0].staffName;
        this.formLabelAlign.staffTelephone = this.multipleSelection[0].staffTelephone;
        this.formLabelAlign.departmentName = this.multipleSelection[0].departmentName;
        this.formLabelAlign.staffSex = this.multipleSelection[0].staffSex;
        this.formLabelAlign.departmentId = this.multipleSelection[0].departmentId
        this.formLabelAlign.status = this.multipleSelection[0].status
        this.formLabelAlign.beforeDepartmentName = this.multipleSelection[0].departmentName
        // if (this.multipleSelection[0].staffSex === 1) {
        //   this.formLabelAlign.sex = "男";
        // } else if (this.multipleSelection[0].staffSex === 0) {
        //   this.formLabelAlign.sex = "女";
        // }
      } else {
        this.isActived = false;
        this.isActived2 = true;
        this.isActived3 = true;
        this.isActived4 = true;
      }
      for (let item of val) {
        const element = item.staffIsLeft;
        if (element == 1) {
          this.isActived3 = false;
          this.isActived = false;
        } else {
          this.isActived4 = false;
        }
      }
    },
    handleCommand(command) {
      this.conditionForm.staffIsLeft = command;
      if (command == 1) {
        this.conditionForm.staffLeft = "离职";
      } else if (command == 0) {
        this.conditionForm.staffLeft = "在职";
      } else {
        this.conditionForm.staffLeft = "全部";
      }
    },
    // 跳转到新建页面
    toNew() {
      this.$router.push({ name: "addStaff" });
    },
    // 性别显示
    formatSex: function(row, column) {
      if (row.staffSex === 1) {
        return "男";
      } else if (row.staffSex === 0) {
        return "女";
      } else {
        return "";
      }
    },
    // 是否离职显示
    formatStaffIsLeft: function(row, column) {
      return row.staffIsLeft === 1 ? "是" : "否";
    },
    // 是否离职显示
    formatStaffTelephone: function(row, column) {
      if (null != row.staffTelephone && row.staffTelephone != undefined) {
        var pat = /(\d{3})\d*(\d{4})/;
        return row.staffTelephone.replace(pat, "$1****$2");
      } else {
        return "";
      }
    },
    // 跳转到详情页面
    toDetail(row) {
      this.$router.push({
        name: "detailStaff",
        query: {
          id: row.id
        }
      });
    },
    // 批量更新为离职
    updateBatchIsLeft() {
      this.$confirm("确定离职？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateBatchIsLeft(this.idArray)
            .then(result => {
              this.getData();
              if (200 === result.code) {
                this.$message({
                  showClose: true,
                  message: "离职操作成功",
                  type: "success"
                });
              }
            })
            .catch(error => {
              // 后台回参code!==200时，执行刷新表格数据
              this.getData();
            });
        })
        .catch(() => {
          // 取消时调用
        });
    },
    // 批量更新为在职
    updateBatchIsNotLeft() {
      this.$confirm("确定恢复？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateBatchIsNotLeft(this.idArray)
            .then(result => {
              this.getData();
              if (200 === result.code) {
                this.$message({
                  showClose: true,
                  message: "恢复操作成功",
                  type: "success"
                });
              }
            })
            .catch(error => {
              // 后台回参code!==200时，执行
              this.getData();
            });
        })
        .catch(() => {
          // 取消时调用
        });
    },
    // 批量删除员工
    updateBatchStatusFalse() {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateBatchStatusFalse(this.idArray)
            .then(result => {
              this.getData();
              if (200 === result.code) {
                this.$message({
                  showClose: true,
                  message: "删除操作成功",
                  type: "success"
                });
              }
            })
            .catch(error => {
              // 后台回参code!==200时，执行
              this.getData();
            });
        })
        .catch(() => {
          // 取消时调用
        });
    },
    // 跳转到更新页面
    toUpdate(row) {
      let ids = this.idArray;
      this.$router.push({
        name: "updateStaff",
        query: {
          id: ids[0]
        }
      });
    },
    // 部门列表对话框
    selectDept() {
      this.dialogVisible = true;
      //this.canPointChoose = true
    },
    cancelSelectDept() {
      if(this.conditionForm.departmentName === null || this.conditionForm.departmentName === ''){
        this.clearChoose = true
      }
      //this.conditionForm.departmentName = null;
      //this.conditionForm.departmentId = null;
      this.dialogVisible = false;
      //this.canPointChoose = true
    },
    commitSelectDept() {
      this.conditionForm.departmentId = this.departmentId;
      this.conditionForm.departmentName = this.departmentName;
      //this.clearChoose = true;
      this.dialogVisible = false;
    },
    changeDeptId(val) {
      if(val.id){
        this.departmentId = val.id;
        this.departmentName = val.name;
        this.canPointChoose = false
      }
      // this.conditionForm.departmentId = val.id;
    },
    clearSelectDept(){//清空部门
      this.clearChoose = true
      this.departmentId = null
      this.departmentName = null
      //清空输入框
      //this.conditionForm.departmentId = null
      //this.conditionForm.departmentName = null
    },

    // 上级部门对话框
    selectparentDept() {
      this.parentDialogVisible = true;
      this.canPointParent = true
    },
    cancelSelectParentDept() {
      if(this.conditionForm.departmentName === null || this.conditionForm.departmentName === ''){
        this.clearChooseParent = true
      }
      //this.conditionForm.parentDepartmentName = null;
      //this.conditionForm.parentDepartmentId = null;
      this.parentDialogVisible = false;
      this.canPointParent = true
    },
    commitSelectParentDept() {
      this.conditionForm.parentDepartmentId = this.parentDepartmentId;
      this.conditionForm.parentDepartmentName = this.parentDepartmentName;
      //this.clearChooseParent = true;
      this.parentDialogVisible = false;
    },
    changeParentDeptId(val) {
      if(val.id){
        this.parentDepartmentId = val.id;
        this.parentDepartmentName = val.name;
        this.canPointParent = false
      }
      // this.conditionForm.parentDepartmentId = val.id;
      // this.conditionForm.parentDepartmentName = val.name;
    },
    clearSelectparentDept(){
      this.clearChooseParent = true
      this.parentDepartmentId = null
      this.parentDepartmentName = null
      //清空输入框
      //this.conditionForm.parentDepartmentId = null
      //this.conditionForm.parentDepartmentName = null
    },

    //分配部门页面
    setDept(){
      this.$router.push({
        name: 'setDepartment',
        query: {
          formLabelAlign: this.formLabelAlign
          //query: { id: id, name: roleName }
        }
      })
    },

    // 分配部门对话框
    
    //导出的方法
    exportExcel(exportData, exportTHeader, exportFilterVal) {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../excel/Export2Excel");
        // 设置Excel的表格第一行的标题
        const tHeader = exportTHeader;
        // exportFilterVal是tableData里对象的属性
        const filterVal = exportFilterVal;
        //把data里的tableData存到list
        const list = exportData;
        if (tHeader.length < 1) {
          this.$message("导出失败！请选择数据项！");
          // this.exportDialogVisible = true;
        } else {
          const data = this.formatJson(filterVal, list);
          let nowDate = new Date();
          let date = {
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            date: nowDate.getDate(),
          }
          let systemDate = ''
          systemDate = date.year + '年' + date.month + '月' + date.date + '日';
          export_json_to_excel(tHeader, data, "员工信息表" + systemDate);
          this.$message("导出成功");
          this.exportDialogVisible = false;
        }
      });
    },
    formatJson(filterVal, jsonData) {
      // return jsonData.map(v => filterVal.map(j => v[j]));
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "staffIsLeft") {
            return getDictName("isLeft", v[j]);
          } else if (j === "staffSex") {
            return getDictName("sex", v[j]);
          } else if (j === "staffTelephone") {
            if (null != v[j] && v[j] != undefined) {
              var pat = /(\d{3})\d*(\d{4})/;
              return v[j].replace(pat, "$1****$2");
            } else {
              return "";
            }
          } else {
            return v[j];
          }
        })
      );
    },
    // 导出 ‘当前页’ 员工列表信息
    // exportExcel() {
    //   /* generate workbook object from table */
    //   var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
    //   var wb = XLSX.utils.table_to_book(
    //     document.querySelector("#staffTable"),
    //     xlsxParam
    //   );

    //   /* get binary string as output */
    //   var wbout = XLSX.write(wb, {
    //     bookType: "xlsx",
    //     bookSST: true,
    //     type: "array"
    //   });
    //   try {
    //     FileSaver.saveAs(
    //       new Blob([wbout], { type: "application/octet-stream" }),
    //       "员工信息表.xlsx"
    //     );
    //   } catch (e) {
    //     if (typeof console !== "undefined") {
    //       console.log(e, wbout);
    //     }
    //   }
    //   return wbout;
    // },
    // 分页查询（改变页面大小）
    handleSizeChange(val) {
      //改变每页数量
      this.conditionForm.limit = val;
      this.conditionForm.currentPage = 1;
      this.getData();
    },
    // 改变页码
    handleCurrentPage(val) {
      //跳转页码
      this.conditionForm.currentPage = val;
      this.getData();
    },

    getStaffAll() {
      let this_ = this;
      let a = this_.exportTHeader;
      let b = this_.exportFilterVal;
      console.log("head:" + this_.exportTHeader); // 'rrr'
      getStaffAll(this_.conditionForm)
        .then(result => {
          this.exportData = result.data.list;
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
    getIsLeftEnum() {
      return getEnum("isLeft");
    },
    getSexEnum() {
      return getEnum("sex");
    },
    
    // 导出
    // 全选触发
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
      if(this.checkedCities.length !== 0){
        this.msg = ''
      } else{
        this.msg = '请选择需要导出的字段'
      }
    },
    // 单项勾选触发
    handleCheckedCitiesChange(value) {
      //console.log(this.checkedCities)
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
      //this.exportCanPoint = false
      if(this.checkedCities.length !== 0){
        //this.exportCanPoint = false
        this.msg = ''
      } else{
        //this.exportCanPoint = true
        this.msg = '请选择需要导出的字段'
        this.checkAll = false
      }
    },
    exportShow() {
      this.exportDialogVisible = true
      this.msg = ''
    },
    runExport() {
      if(this.checkedCities.length !== 0){
        //this.exportCanPoint = false
        this.msg = ''
        this.getStaffAll();
        this.checkedCities = [];
        this.exportTHeader = [];
        this.exportFilterVal = [];
        this.checkAll = false
        this.exportDialogVisible = false;
        this.isIndeterminate = false
      } else{
        //this.exportCanPoint = true
        this.msg = '请选择需要导出的字段'
        this.isIndeterminate = false
      }
      
    },
    cancleExport() {
      this.exportDialogVisible = false;
      this.checkAll = false;
      this.checkedCities = [];
      this.exportTHeader = [];
      this.exportFilterVal = [];
      this.isIndeterminate = false
      this.msg = ''
    },
    //所属部门
    clear(val) {
      if (val) {
        this.clearChoose = false;
      }
    },
    //上级部门
    clearParent(val) {
      if (val) {
        this.clearChooseParent = false;
      }
    },
    //分配部门
    clearUpdate(val) {
      if (val) {
        this.clearParentUpdate = false;
      }
    }
  },
  created() {
    // 页面创建时加载员工数据
    this.getData();
  },
  mounted() {
    // 获取登录账号信息 （刷新失效）
    // this.$store.getters.nowLogin.id
  }
};
</script>
<style lang="scss" scoped>
#swagger {
  padding: 20px;
}

.input {
  height: 12px;
  width: 250px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 10px;
}

.btnRow {
  padding-left: 20px;
  padding-bottom: 20px;
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
.rad {
  width: 250px;
}
.el-dialog__wrapper {
  &.dialog-fade-leave-active {
    -ms-animation: none;
  }
}
</style>
