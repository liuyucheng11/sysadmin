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
        <el-input style="width: 200px;" placeholder="申请人所属部门" v-model="roleApplyList.departmentName" readonly="true"></el-input>
        <el-button type="primary" @click="selectDept">选择</el-button>
      </div>
    </div>

    <div class="form">
      <div class="factor">
        <span class="demonstration">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;操作时间</span>
          <el-date-picker
            v-model="roleApplyList.searchModifyTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
      <div class="factor">
      <span class="demonstration">申请时间</span>
          <el-date-picker
            v-model="roleApplyList.searchApplyTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>


    </div>
    <div class="btnRow">
      <el-button type="primary" @click="searchList('search')" class="selectbtn">查询
      </el-button>
      <el-button type="primary" @click="clearSearch()" class="selectbtn">清空
      </el-button>
    </div>
    <div class="form">
      <el-row>
        <el-button type="primary" :disabled="btnModify" @click="showApplyDetail(applyCode,1)" round
                   v-permission="['/roleManage/roleApprove/examine']">审核
        </el-button>
      </el-row>

    </div>

    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column label="选择" width="50">
            <template scope="scope">
              <el-radio v-model="applyCode"  :label="scope.row.applyCode" @change="changeType(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
      <el-table-column prop="applyCode" label="角色申请编号" width="150">
        <template slot-scope="scope">
          <div class="id" style="color: blue" @click.prevent="showApplyDetail(scope.row.applyCode,0)">
            {{scope.row.applyCode}}
          </div>
        </template>

      </el-table-column>
      <el-table-column prop="roleId" label="申请角色ID" align="center" width="100">
           <template slot-scope="scope">
            <el-button type="text" @click="toRoleManageDec(scope.row.roleId)">{{
              scope.row.roleId
            }}</el-button>
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
      <el-table-column prop="department" label="申请人所属部门" align="center" width="150" >
      </el-table-column>

      <el-table-column prop="applyTime" label="申请时间" width="200" align="center">
      </el-table-column>

      <el-table-column prop="status" label="状态">
      </el-table-column>

      <el-table-column prop="modifyEmpNo" label="操作人">
      </el-table-column>

      <el-table-column prop="modifyTime" label="操作时间" width="200" align="center">

      </el-table-column>

      <el-table-column prop="rejectReason" label="拒绝原因">
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" :page-size="pageSize" :total="total">
    </el-pagination>

    <div>
      <el-dialog
        title="请选择部门"
        :visible.sync="dialogVisible">
        <el-row>
          <el-button type="primary" icon="el-icon-upload" @click="commitSelectDept()">确定</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="cancelSelectDept()">取消</el-button>
        </el-row>
        <department-tree :return-name="true" @selectId="changeDeptId"></department-tree>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import {
    ajaxParams,
    ajaxData
  } from "../../api/roleApply";
  import DepartmentTree from "../department/departmentTree";
  export default {
    name: "staffSingle",
    components: {
      DepartmentTree
    },
    props: {},
    data() {
      return {
        tempRoleApplyList: {
          id: null,
          name:''
        },
        approverId:'',
        btnModify: true,
        applyCode: "",
        dictionary: {
          id: null,
          codeId: '',
          codeKey: '',
          codeValue: '',
          remark: ''
        },
        roleApplyList: {
          id: null,
          roleId: '',
          roleName: '',
          accountNo: '',
          staffNumber: '',
          staffName: '',
          department: '',
          applyTime: '',
          status: '',
          createTime: "",
          modifyTime: '',
          currentPage: 1,
          pageSize: 10,
          userId:"",
          searchApplyTime:[],
          searchModifyTime:[]
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
        multipleSelection: [],
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
         toRoleManageDec(roleId) {
      //跳转至角色详情页
      this.$router.push({
        name: "ApproveRoleInfo",
        params: {
          id: roleId,
        }
      });
    },
      changeType(row){
        let this_ = this;
        debugger;
        if(row.status=="待审批"){
              this_.btnModify = false;
        }
        else{this_.btnModify = true;}
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
      ApplyEdit() {
        let this_ = this;
        console.log( this_.multipleSelection)
        let applyCode = this_.multipleSelection[0].applyCode;

        this.$router.push({
          name: 'RoleApproveEdit',
          params: {
            applyCode: applyCode
          }
        })
      },
      deleteOrSubmit(state) {
        let this_ = this;
        let param = new FormData();
        this_.multipleSelection.forEach(item => {
          debugger;
          param.append("ids", item.id);
        });
        // 删除状态设置为0,提交设置为1
        param.append("state", state);
        ajaxData('/roleApply/deleteOrSubmit', param).then((result) => {
          if (result.code == 200) {
            this.$message.success(result.message);
          } else {
            this.$message.error("操作失败，请稍后重试！");
          }
          this_.getTableData();
        }).catch((error) => {
          console.log(error);
        });
      },
      showApplyDetail(applyCode,flag) {
        this.flag=flag;
        this.applyCode = applyCode;
        this.$router.push({
          name: 'RoleApproveEdit',
          params: {
            applyCode: applyCode,
            onlyShow: true,
            flag:flag
          }
        });
      },
       searchList(status) {
        let this_ = this;
        // 如果点击的是查询按钮,则将页码指向第一页
        if (status == "search") {
          this_.currentPage = 1;
          this_.searchListData = {...this_.roleApplyList};
        }
        this_.roleApplyList.currentPage = this_.currentPage;
        this_.roleApplyList.limit = this_.limit;
        //this_.roleApplyList.approverId = this.$store.getters.nowLogin.id,
        this_.roleApplyList.status = 2;
        let loginUser = JSON.parse(localStorage.getItem('nowLoginUser'));
        this_.roleApplyList.approverId = loginUser.id,
          // 取得所有数据
          ajaxData('/roleApply/getRoleApplyList', this_.roleApplyList).then((result) => {
            let this_ = this;
            // 赋值给数据表格
            this_.tableData = result.data.list;
            this_.total = result.data.totalCount;
          }).catch((error) => {
            console.log(error);
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
      getTableData() {
        let this_ = this;
        let param = {
          currentPage: this_.currentPage,
          limit: this_.pageSize,
          approverId:this.$store.getters.nowLogin.id,
          status:2,
          
        };
        // 取得所有数据
        ajaxData('/roleApply/getRoleApplyList', JSON.stringify(param)).then((result) => {
          let this_ = this;
          // 赋值给数据表格
          this_.tableData = result.data.list;
          this_.total = result.data.totalCount;
        }).catch((error) => {
          console.log(error);
        });
      },
      empty() {
        this.value = "全部"
      },
      add() {
        this.$router.push({
          name: 'createRoleForm',
          params: {
            selectRole: null
          }
        })
      },
     getData() {
        let this_ = this;
        this_.getOptions();
        this_.searchList();
      },
      getStaff() {
        this.getData();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
        if (val.length == 0) {
          // 选中的记录数等于0,没有选中数据,则禁用所有按钮
          this.btnModify = true;
        } else {
          this.btnModify = false;
        }
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
</style>
