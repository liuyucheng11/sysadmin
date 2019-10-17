<template>
  <div id="swagger" @keyup.enter="enter">

    <el-form
      :label-position="labelPosition"
      :inline="true"
      v-model="conditionForm"
    >

      <el-form-item
        prop="roleName"
        label="角色名">
        <!-- :rules="rules.InterNumFalse" -->
        <el-input
          v-model.trim="conditionForm.roleName"
          placeholder="请输入角色名"
          prefix-icon="el-icon-search"
          class="input"
        ></el-input>
      </el-form-item>

      <el-form-item
        prop="approvalAccount"
        label="审批人账号"
      >
        <el-input
          v-model.trim="conditionForm.approverAccount"
          placeholder="请输入审批人账号"
          prefix-icon="el-icon-search"
          class="input"
        ></el-input>&nbsp;
      </el-form-item>

      <el-form-item
        prop="approvalNo"
        label="审批人编号"
      >
        <el-input
          v-model.number.trim="conditionForm.approverNumber"
          placeholder="请输入审批人编号"
          prefix-icon="el-icon-search"
          class="input"
          @input="test"
          :value="val"
        ></el-input><br>
        <span style="color: red">{{ msg }}</span>
      </el-form-item>

      <el-form-item
        prop="approvalName"
        label="审批人姓名"
      >
        <el-input
          v-model.trim="conditionForm.approverName"
          placeholder="请输入审批人姓名"
          prefix-icon="el-icon-search"
          class="input"
        ></el-input>
      </el-form-item>
      <!--支持业务线的下拉列表-->
      <el-form-item
        prop=""
        label="支持业务线:"
      >
        <!--下拉列表-->
        <el-dropdown @command="handleCommandBusinessLine">
          <span class="el-dropdown-link">
            {{businessLineDefault}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">全部</el-dropdown-item>
            <el-dropdown-item command="1">买买车</el-dropdown-item>
            <el-dropdown-item command="2">闪贷</el-dropdown-item>
            <el-dropdown-item command="3">租车</el-dropdown-item>
            <el-dropdown-item command="4">专车</el-dropdown-item>
            <el-dropdown-item command="5">保险</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <!--选择所属部门控件-->
      <el-form-item
        prop="departmentName"
        label="所属部门"
      >
        <el-input
          v-model="conditionForm.approverDepartment"
          placeholder="请选择所属部门"
          prefix-icon="el-icon-search"
          class="input"
          style="width:175px"
          :readonly="true"
        ></el-input>
        <!--通过部门选择树来选择部门-->
        <el-button
          type="primary"
          @click="selectDept"
          class="departmentBt"
        >选择
        </el-button>
      </el-form-item>

      <!--选择权限控件-->
      <el-form-item
        prop=""
        label="权限名称"
      >
        <el-input
          v-model="showName"
          placeholder="请选择权限名称"
          prefix-icon="el-icon-search"
          class="input"
          style="width:175px"
          :readonly="true"
        ></el-input>
        <!--选择权限的方法需要改！-->
        <el-button
          type="primary"
          @click="selectPermissions"
          class="departmentBt"
        >选择权限</el-button>
      </el-form-item>

      <!--角色状态下拉控件-->
      <el-form-item
        prop=""
        label="角色状态:"
      >
        <!--下拉列表-->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{state}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="2">全部</el-dropdown-item>
            <el-dropdown-item command="1">有效</el-dropdown-item>
            <el-dropdown-item command="0">无效</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>

    <!--查询控件，查询的是角色权限数据-->
    <div class="btnRow">
      <el-button
        type="primary"
        @click="getAccountPermissions2"
        class="selectbtn"
        v-permission="['/query/rolePermission']"
        :disabled="canPoint"
      >查询</el-button>

      <!--导出控件，导出的是权限功能数据-->
      <el-button
        type="primary"
        @click="exportExcel2"
        class="exportbtn"
      >导出</el-button>
    </div>

    <!--下方的列表-->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      id="rolePermissions"
    >
      <el-table-column
        prop="id"
        label="角色ID"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="toRoleManageDec(scope.row.id)">
            {{scope.row.id }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        prop="roleName"
        label="角色名称"
      >
      </el-table-column>

      <el-table-column
        prop="businessName"
        label="支持业务线"
      >
      </el-table-column>

      <el-table-column
        prop="approverAccount"
        label="审批人账号"
      >
      </el-table-column>

      <el-table-column
        prop="approverNumber"
        label="审批人员工编号"
      >
      </el-table-column>

      <el-table-column
        prop="approverName"
        label="审批人姓名"
      >
      </el-table-column>

      <el-table-column
        prop="approverDepartment"
        label="审批人所属部门"
      >
      </el-table-column>

      <el-table-column
        prop="roleStatue"
        label="角色状态"
      >
        <template slot-scope="scope">
        {{ getStatus(scope.row.roleStatue) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="permissionName"
        label="权限名称"
      >
        <template slot-scope="scope">
          <el-popover placement="top-start" title="备注:" width="250" trigger="hover">
            <div>{{scope.row.permissionName}}</div>
            <span v-if="scope.row.permissionName.length>10" slot="reference">{{scope.row.permissionName.substr(0,10)}}....</span>
            <span v-else slot="reference">{{scope.row.permissionName}}</span>
          </el-popover>
        </template>
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

    <!-- 选择部门对话框 -->
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
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancelSelectDept()"
          >取消</el-button>
        </el-row>
        <!--选择部门对话框下就是部门树-->
        <department-tree
          :return-name="true"
          @selectId="changeDeptId"
        ></department-tree>
      </el-dialog>
    </div>

    <!-- 选择权限对话框 -->
    <!--部分方法还需要修改-->
    <div>
      <el-dialog
        title="请选择权限"
        :visible.sync="permissionDialogVisible"
      >
        <el-row>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="commitSelectPermissions()"
          >确定</el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="cancelSelectPermissions()"
          >取消</el-button>
        </el-row>
        <br>
        <br>
        <!--对话框下面所显示出来的需要是一组支持单选框的权限树-->
        <radio-tree @selectId='selectName' :return-name="true">
        </radio-tree>

      </el-dialog>
    </div>
    <!--导出字段对话框-->
    <el-dialog title="请选择导出字段" :visible.sync="exportDia">
      <el-row>
        <el-button type="primary" icon="el-icon-upload" @click="exportClick()">确定</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="exportDia = false">取消</el-button>
      </el-row>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedOptions" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="option in exportOption" :label="option" :key="option[0]">{{option[1]}}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
  import { getRolePermissions } from "../../api/rolePermissions";
  import DepartmentTree from "../department/departmentTree";
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import rules from "@/utils/rules";
  import radioTree from '@/views/authority/permissionRadioTree';

  import {
    parseTime
  } from '@/utils';
  const exportOptions = [
    ["id", "角色ID"],
    ["roleName", "角色名称"],
    ["businessName", "支持业务线"],
    ["approverAccount", "审批人账号"],
    ["approverNumber", "审批人编号"],
    ["approverName", "审批人姓名"],
    ["approverDepartment", "审批人所属部门"],
    ["roleStatue", "角色状态"],
    ["permissionName", "权限名称"]
  ];
  export default {
    name: "rolePermissions",
    components: {DepartmentTree,radioTree },
    props: {},
    data() {
      return {
        tempConditionForm: {
          name:''
        },
        exportOption: exportOptions,
        exportFilterVal: [],
        exportTHeader: [],
        exportDia: false,
        exportList: [],
        // 选择的字段
        checkedOptions: [],
        // 导出
        // 是否全选
        checkAll: false,
        // 全选（不确定的）
        isIndeterminate: false,
        //业务线和角色状态下拉列表的默认值
        businessLineDefault:"全部",
        state:"全部",
        //其他
        rules,
        labelPosition: "right",
        // 查询总数量
        totalCount: 0,
        // 查询条件
        conditionForm: {
          //角色名
          roleName: "",
          //审批人账号
          approverAccount: "",
          //审批人编号
          approverNumber: "",
          //审批人姓名
          approverName: "",
          //业务线
          businessName:"",
          //部门名
          approverDepartment:"",
          //角色状态
          roleStatue:"",
          //权限名称
          permissionName:"",
          //当前页
          currentPage: 1,
          //每页多少条
          limit: 5
        },
        // 账号权限数据列表
        tableData: [],
        // 部门对话框
        dialogVisible: false,
        // 权限对话框
        permissionDialogVisible: false,

        showName: '', //显示在页面的权限名
        msg: '',
        canPoint: false
      };
    },
    watch: {},
    computed: {},
    methods: {
      test(){
        //this.val=e.target.value.replace(/^[0-9]\d*$/,'')
        const reg = /^[0-9]\d*$/
        if(!reg.test(this.conditionForm.approverNumber)){
          this.msg = "请输入数字"
          this.canPoint = true
        }else{
          this.msg = ''
        }
        if(this.conditionForm.approverNumber === ''){
            this.msg = ''
            this.canPoint = false
        }
      },
      enter(){
        if(!this.canPoint){
          this.getAccountPermissions2()
        }
      },
      exportClick() {
        // 此代码实现向后台异步请求数据
        let this_ = this;
        if (this_.exportFilterVal == null || this_.exportFilterVal.length === 0) {
          this.$message.error("导出字段不允许为空");
          return;
        }
        // 取得所有数据
        //调用接口方法进行访问数据库，需要自己写
        let temp = {
          ...this_.conditionForm
        };
        temp.limit = null;
        temp.currentPage = null;
        getRolePermissions(JSON.stringify(temp))
          .then(result => {
            const data = result.data.list;
            this_.exportList = data;
            this_.exportList.forEach(item => {
              switch (item.roleStatue) {
                case 1:
                  item.roleStatue = "有效";
                  break;
                case 0:
                  item.roleStatue = "无效";
                  break;
                default:
                  break;
              }
            })
            this.export2Excel();
          })
          .catch(error => {
            console.log("错误的结果是：" + error);
          });
      },
      export2Excel() {
        import('@/vendor/Export2Excel').then(excel => {
          let this_ = this;
          const list = this.exportList;
          const data = this.formatJson(this_.exportFilterVal, list);
          excel.export_json_to_excel({
            header: this_.exportTHeader,
            data,
            filename: '角色权限明细查询表' + parseTime(new Date())
          })
        })
        this.exportDia = false;
        this.$message.success("导出成功，请关注下载文件");
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      //获得角色的详细信息
      toRoleManageDec(id){
        //跳转至角色详情页
        this.$router.push({
          name: "RoleManageDec",
          params: {
            id: id
          }
        });
      },
      //获得状态
      getStatus(stateValue){
        return stateValue == "1" ? "有效" : "无效";
      },
      //选择权限
      selectName(val){
        this.showName = val.allName
        this.conditionForm.permissionName = val.name;
      },
      // 获取账号权限数据，需要改
      getData() {
        let this_ = this;
        //调用接口方法进行访问数据库，需要自己写
        getRolePermissions(JSON.stringify(this_.conditionForm))
          .then(result => {
            console.log("返回的结果是："+result.data.list);
            this.tableData = result.data.list;
            this.totalCount = result.data.totalCount;
          })
          .catch(error => {
            console.log("错误的结果是："+error);
            //alert(error);
          });
      },
      getAccountPermissions() {
        this.getData();
      },
      getAccountPermissions2() {
        this.conditionForm.currentPage=1;
        this.getData();
      },
      //角色状态下拉列表的触发事件
      handleCommand(command) {
        if (command == 2) {
          this.state="全部";
          this.conditionForm.roleStatue ="";
        } else if (command == 1) {
          this.state="有效";
          this.conditionForm.roleStatue = 1;
        } else if (command == 0) {
          this.state="无效";
          this.conditionForm.roleStatue = 0;
        }
      },
      //业务线下拉列表的触发事件
      handleCommandBusinessLine(command){
        if (command == 0) {
          this.businessLineDefault="全部";
          this.conditionForm.businessName = "";
        } else if (command == 1) {
          this.businessLineDefault="买买车";
          this.conditionForm.businessName = "买买车";
        } else if (command == 2) {
          this.businessLineDefault="闪贷";
          this.conditionForm.businessName = "闪贷";
        }else if (command == 3) {
          this.businessLineDefault="租车";
          this.conditionForm.businessName = "租车";
        }else if (command == 4) {
          this.businessLineDefault="专车";
          this.conditionForm.businessName = "专车";
        }else if (command == 5) {
          this.businessLineDefault="保险";
          this.conditionForm.businessName = "保险";
        }
      },
      // 部门列表对话框的方法
      //选择部门
      selectDept() {
        this.dialogVisible = true;
      },
      //取消选择部门
      cancelSelectDept() {
        this.conditionForm.approverDepartment = null;
        this.dialogVisible = false;
      },
      //确定所选择的部门
      commitSelectDept() {
        this.conditionForm.approverDepartment = this.tempConditionForm.name;
        this.dialogVisible = false;
      },
      //选择部门
      changeDeptId(val) {
        //this.conditionForm.departmentId = val.id;
        //this.conditionForm.approverDepartment = val.name;
        this.tempConditionForm.name = val.name;
      },
      // 选择权限功能对话框
      selectPermissions() {
        this.permissionDialogVisible = true;
      },
      //取消权限功能对话框
      cancelSelectPermissions() {
        this.conditionForm.permissionName = null;
        this.permissionDialogVisible = false;
      },
      //确定所选择的权限
      commitSelectPermissions() {
        this.permissionDialogVisible = false;
      },
      // 导出
      // 全选触发
      handleCheckAllChange(val) {
        this.exportTHeader = [];
        this.exportFilterVal = [];
        this.checkedOptions = val ? exportOptions : [];
        this.isIndeterminate = false;
        if (val) {
          for (let index = 0; index < this.checkedOptions.length; index++) {
            const element = this.checkedOptions[index];
            this.exportTHeader.push(element[1]);
            this.exportFilterVal.push(element[0]);
          }
        }
      },
      // 单项勾选触发
      handleCheckedCitiesChange(value) {
        this.exportTHeader = [];
        this.exportFilterVal = [];
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.exportOption.length;
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.exportOption.length;
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          this.exportTHeader.push(element[1]);
          this.exportFilterVal.push(element[0]);
        }
      },
      //导出的数据应该是权限功能，这个需要改
      exportExcel2() {
        this.exportDia = true;
        return;
        /* generate workbook object from table */
        var xlsxParam = {
          raw: true
        }; // 导出的内容只做解析，不进行格式转换
        var wb = XLSX.utils.table_to_book(
          document.querySelector("#rolePermissions"),
          xlsxParam
        );
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], {
              type: "application/octet-stream"
            }),
            "角色权限明细查询表.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") {
            console.log(e, wbout);
          }
        }
        return wbout;
      },
      // 分页查询（改变页面大小）
      handleSizeChange(val) {
        //改变每页数量
        this.conditionForm.limit = val;
        this.getAccountPermissions();
      },
      // 改变页码
      handleCurrentPage(val) {
        //跳转页码
        this.conditionForm.currentPage = val;
        this.getAccountPermissions();
      }
    },
    created() {},
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
    font-size: 12px;
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
</style>
