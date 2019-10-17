<template>


  <div id="swagger">
    <div class="form">
      <div class="factor">&nbsp;&nbsp;&nbsp;
        角色申请编号:
        <el-input v-model.trim="roleApplyList.applyCode" placeholder="角色申请编号" class="input"></el-input>&nbsp;
      </div>
      <div class="factor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        申请角色ID:
        <el-input v-model.trim="roleApplyList.roleId" placeholder="申请角色ID" class="input"></el-input>&nbsp;
      </div>
      <div class="factor">&nbsp;&nbsp;&nbsp;
        申请角色名称:
        <el-input v-model.trim="roleApplyList.roleName" placeholder="申请角色名称" class="input"></el-input>&nbsp;
      </div>
      <div class="factor">&nbsp;
        申请人登录账号：
        <el-input v-model.trim="roleApplyList.accountNo" placeholder="申请人登录账号" class="input"></el-input>
      </div>
    </div>
    <div class="form">
      <div class="factor">
        申请人员工编号:
        <el-input v-model.trim="roleApplyList.staffNumber" placeholder="申请人员工编号" class="input"></el-input>
      </div>
      <div class="factor">
        申请人员工姓名：
        <el-input v-model.trim="roleApplyList.staffName" placeholder="申请人员工姓名" class="input"></el-input>
      </div>
      <div class="factor">
        申请人所属部门:
        <el-input :readonly="true" style="width: 180px;" placeholder="申请人所属部门" v-model="roleApplyList.departmentName"></el-input>
        <el-button type="primary" @click="selectDept">选择</el-button>
      </div>

      <div class="factor">
        状态：
        <el-select v-model="roleApplyList.status" class="input" placeholder="全部">
          <el-option v-for="item in options" :key="item.value" :label="item.codeKey" :value="item.codeValue">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="form">
      <div class="factor">
        申请时间：
        <el-date-picker v-model="roleApplyList.searchApplyTime" type="datetimerange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="factor" style="margin-left: 60px;">
        操作时间:
        <el-date-picker v-model="roleApplyList.searchModifyTime" type="datetimerange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>

    <div class="btnRow">
      <el-button type="primary" @click="searchList('search')" class="selectbtn">
        查询
      </el-button>
      <el-button type="primary" @click="clearSearch()" class="selectbtn">
        清空
      </el-button>
      <el-button type="primary" @click="showExport()" class="exportbtn" v-permission="['/roleManage/roleApply/export']">导出
      </el-button>
    </div>
    <div class="form">
      <el-row>
        <el-button type="primary" round @click="add" v-permission="['/roleManage/roleApply/add']">新建</el-button>
        <el-button type="primary" :disabled="btnModify" @click="modifyInfo()" round v-permission="['/roleManage/roleApply/update']">修改
        </el-button>
        <el-button type="danger" :disabled="btnDelete" @click="deleteOrSubmit(5)" round v-permission="['/roleManage/roleApply/delete']">删除
        </el-button>
        <el-button type="primary" :disabled="btnSubmit" @click="deleteOrSubmit(2)" round v-permission="['/roleManage/roleApply/commit']">提交审核
        </el-button>
      </el-row>

    </div>

    <el-table :data="tableData" style="width: 100%">
      <!-- <el-table-column label="选择" width="90" type="selection" fixed>
      </el-table-column> -->
      <el-table-column label="选择" width="50" fixed>
        <template scope="scope">
          <el-radio v-model="applyCode" :label="scope.row.applyCode" @change="changeType(scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="applyCode" label="角色申请编号" width="150" fixed>
        <template slot-scope="scope">
          <div class="id" style="color: blue" @click.prevent="showApplyDetail(scope.row)">
            {{scope.row.applyCode}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="roleId" label="申请角色ID" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="toRoleManageDec(scope.row.roleId)">
            {{scope.row.roleId}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="申请角色名称" align="center" width="120">
      </el-table-column>
      <el-table-column prop="approverName" label="审批负责人" align="center" width="100">
      </el-table-column>
      <el-table-column prop="businessLine" label="角色支持业务线" width="200">
      </el-table-column>
      <el-table-column prop="accountNo" label="申请人登录账号" align="center" width="150">
      </el-table-column>
      <el-table-column prop="staffNumber" label="申请人员工编号" align="center" width="150">
      </el-table-column>
      <el-table-column prop="staffName" label="申请人员工姓名" align="center" width="150">
      </el-table-column>
      <el-table-column prop="department" label="申请人所属部门" align="center" width="150">
      </el-table-column>

      <el-table-column prop="applyTime" label="申请时间" width="200" align="center">
      </el-table-column>

      <el-table-column prop="status" label="状态">
      </el-table-column>

      <el-table-column prop="modifyEmpNo" label="操作人" width="100">
      </el-table-column>

      <el-table-column prop="modifyTime" label="操作时间" width="200" align="center">

      </el-table-column>

      <el-table-column prop="rejectReason" label="拒绝原因" width="200">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="备注:" width="250" trigger="hover">
            <div>{{scope.row.rejectReason}}</div>
            <span v-if="scope.row.rejectReason != null && scope.row.rejectReason.length>10" slot="reference">
              {{scope.row.rejectReason.substr(0,10)}}....
            </span>
            <span v-else slot="reference">{{scope.row.rejectReason}}</span>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" :page-size="pageSize" :total="total">
    </el-pagination>

    <div>
      <el-dialog title="请选择部门" :visible.sync="dialogVisible">
        <el-row>
          <el-button type="primary" icon="el-icon-upload" @click="commitSelectDept()">确定</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="cancelSelectDept()">取消</el-button>
        </el-row>
        <department-tree :return-name="true" @selectId="changeDeptId"></department-tree>
      </el-dialog>
    </div>

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
  import {
    ajaxParams,
    ajaxData
  } from "../../api/roleApply";
  import DepartmentTree from "../department/departmentTree";
  import {
    parseTime
  } from '@/utils';

  // 导出字段数组列表，[0]为属性，[1]为表头
  const exportOptions = [
    ["applyCode", "角色申请编号"],
    ["roleId", "申请角色ID"],
    ["roleName", "申请角色名称"],
    ["approverName", "审批负责人"],
    ["businessLine", "角色支持业务线"],
    ["accountNo", "申请人登录账号"],
    ["staffNumber", "申请人员工编号"],
    ["staffName", "申请人员工姓名"],
    ["department", "申请人所属部门"],
    ["createTime", "申请时间"],
    ["status", "状态"],
    ["modifyEmpNo", "操作人"],
    ["modifyTime", "操作时间"],
    ["rejectReason", "拒绝原因"],
  ];
  export default {
    name: "staffSingle",
    components: {
      DepartmentTree
    },
    props: {},
    data() {
      return {
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
        btnModify: true,
        btnDelete: true,
        btnSubmit: true,
        applyCode: "",
        dictionary: {
          id: null,
          codeId: '',
          codeKey: '',
          codeValue: '',
          remark: ''
        },
        // 保存roleApplyList的临时变量
        tempRoleApplyList: {
          id: null
        },
        roleApplyList: {
          id: null,
          roleId: '',
          roleName: '',
          accountNo: '',
          staffNumber: '',
          staffName: '',
          department: '',
          status: '',
          createTime: "",
          modifyTime: "",
          currentPage: 1,
          pageSize: 10,
          searchApplyTime: [],
          searchModifyTime: [],
        },
        searchListData: {
          id: null,
          roleId: '',
          roleName: '',
          accountNo: '',
          staffNumber: '',
          staffName: '',
          department: '',
          status: '',
          createTime: "",
          modifyTime: "",
          currentPage: 1,
          pageSize: 10,
          searchApplyTime: [],
          searchModifyTime: [],
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalCount: 0,
        totalPage: 0,
        limit: 10,
        startIndex: 0,
        staffNumber: "",
        accountNo: "",
        staffName: "",
        staffSex: "",
        staffTelephone: "",
        staffEmail: "",
        departmentCode: "",
        superiorDepartmentCode: "",
        staffLeft: "",
        tableData: [],
        selection: [],
        options: [],
        value: '全部',
        value1: '',
        value2: '',
        dialogVisible: false,

      };
    },
    watch: {},
    computed: {},
    methods: {
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
      toRoleManageDec(roleId) {
        //跳转至角色详情页
        this.$router.push({
          name: "ApproveRoleInfo",
          params: {
            id: roleId,
          }
        });
      },
      showExport() {
        this.exportDia = true;
      },
      exportClick() {
        // 此代码实现向后台异步请求数据
        let this_ = this;
        debugger;
        if(this_.exportFilterVal==null || this_.exportFilterVal.length===0){
          this.$message.error("导出字段不允许为空");
          return;
        }
        // 去除分页条件
        this_.roleApplyList.currentPage = null;
        this_.roleApplyList.limit = null;
        let loginUser = JSON.parse(localStorage.getItem('nowLoginUser'));
        this_.roleApplyList.createEmp = loginUser.id,
        // 取得所有数据
        ajaxData('/roleApply/getRoleApplyList', this_.roleApplyList).then(result => {
          let this_ = this;
          // 赋值给数据表格
          const data = result.data.list;
          this_.exportList = data;
          // 开始执行导出方法，此方法要放在括号里面，因为是异步请求数据，请求完才能执行导出
          this.export2Excel();
        }).catch((error) => {
          console.log(error);
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
            filename: '角色申请表' + parseTime(new Date())
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
      cancelSelectDept() {
        this.roleApplyList.departmentName = null;
        this.roleApplyList.departmentId = null;
        this.dialogVisible = false;
      },
      commitSelectDept() {
        this.roleApplyList.departmentId = this.tempRoleApplyList.id;
        this.roleApplyList.departmentName = this.tempRoleApplyList.name;
        this.dialogVisible = false;
      },
      changeDeptId(val) {
        this.tempRoleApplyList.id = val.id;
        this.tempRoleApplyList.name = val.name;
      },
      selectDept() {
        this.dialogVisible = true;
      },
      modifyInfo() {
        let this_ = this;
        let applyCode = this_.selection.applyCode;
        this.$router.push({
          name: 'createRoleForm',
          params: {
            applyCode: applyCode,
            isEdit: true
          }
        });
      },
      deleteOrSubmit(state) {
        let msg = "是否确认删除此记录？";
        let successMsg = "角色申请删除成功！";
        if (state == "2") {
          msg = "是否确认提交审核此记录？";
          successMsg = "角色申请提交审核成功！";
        }
        this.$confirm(msg, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let this_ = this;
          let param = new FormData();
          // 删除状态设置为0,提交设置为1
          param.append("state", state);
          param.append("id", this_.selection.id);
          ajaxData('/roleApply/deleteOrSubmit', param).then((result) => {
            if (result.code == 200) {
              this.$message.success(successMsg);
            } else {
              this.$message.error("操作失败，请稍后重试！");
            }
            this_.searchList();
            //this.$router.go(0);
            this_.applyCode=null;
            this_.btnDelete = true;
            this_.btnSubmit = true;
            this_.btnModify = true;
          }
          ).catch((error) => {
            console.log(error);
          });
        })
      },
      showApplyDetail(row) {
        let isEdit = row.status == "已新建" ? true : false;
        this.$router.push({
          name: 'createRoleForm',
          params: {
            applyCode: row.applyCode,
            isEdit: isEdit
          }
        });
      },
      // 清空查询条件
      clearSearch() {
        this.roleApplyList = {};
        this.roleApplyList.departmentName = null;
        this.roleApplyList.departmentId = null;
      },
      getOptions() {
        let params = {
          codeId: 'userApplyType'
        };
        // 取得所有数据
        ajaxParams('/dictionary/getListByCodeId', params).then((result) => {
          let this_ = this;
          // 赋值给数据表格
          this_.options = result.data.dictionaries;
        }).catch((error) => {
          console.log(error);
        });
      },
      searchList(status) {
        let this_ = this;
        // 如果点击的是查询按钮,则将页码指向第一页
        if (status == "search") {
          this_.currentPage = 1;
          this_.searchListData = {...this_.roleApplyList};
        }
        this_.searchListData.currentPage = this_.currentPage;
        this_.searchListData.limit = this_.limit;
        let loginUser = JSON.parse(localStorage.getItem('nowLoginUser'));
        this_.searchListData.createEmp = loginUser.id,
          // 取得所有数据
          ajaxData('/roleApply/getRoleApplyList', this_.searchListData).then((result) => {
            let this_ = this;
            // 赋值给数据表格
            this_.tableData = result.data.list;
            this_.total = result.data.totalCount;
          }).catch((error) => {
            console.log(error);
          });
      },
      add() {
        this.$router.push({
          name: 'createRoleForm',
          params: {
            selectRole: null,
            isEdit: true
          }
        })
      },
      getData() {
        let this_ = this;
        this_.getOptions();
        this_.searchList();
      },
      changeType(row) {
        let this_ = this;
        this_.selection.id = row.id;
        this_.selection.applyCode = row.applyCode;
        if (row.status == "已新建") {
          this_.btnDelete = false;
          this_.btnSubmit = false;
          this_.btnModify = false;
        } else {
          this_.btnDelete = true;
          this_.btnSubmit = true;
          this_.btnModify = true;
        }
      },
      //分页处理
      handleSizeChange(val) {
        this.limit = val;
        this.currentPage = 1;
        this.searchList();
      },
      //同上
      handleCurrentChange(val) {
        this.currentPage = val;
        this.searchList();
      }
    },
    created() {},
    mounted() {
      this.getData();
    }
  };
</script>
<style lang="scss" scoped>
  .form {
    font-size: 12px;
    padding: 25px;

    .factor {
      float: left;
      padding-left: 8px;
    }

    .input {
      height: 12px;
      width: 160px;
    }

    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }

    .el-icon-arrow-down {
      font-size: 12px;
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
