<template>
  <div id="swagger" @keyup.enter="enter">

    <el-form :label-position="labelPosition" :inline="true" v-model="conditionForm">
      <el-form-item prop="roleName" label="角色名">
        <!-- :rules="rules.InterNumFalse" -->
        <el-input v-model.trim="conditionForm.roleName" placeholder="请输入角色名" prefix-icon="el-icon-search" class="input"></el-input>
      </el-form-item>

      <el-form-item prop="accountNo" label="登录账号">
        <el-input v-model.trim="conditionForm.accountNo" placeholder="请输入登录账号" prefix-icon="el-icon-search" class="input"></el-input>&nbsp;
      </el-form-item>

      <el-form-item prop="staffNumber" label="员工编号">
        <el-input v-model.number.trim="conditionForm.staffNumber" placeholder="请输入员工编号" prefix-icon="el-icon-search" class="input" @input="test"></el-input>
        <br><span style="color: red">{{ msg }}</span>
      </el-form-item>

      <el-form-item prop="staffName" label="员工姓名">
        <el-input v-model.trim="conditionForm.staffName" placeholder="请输入员工姓名" prefix-icon="el-icon-search" class="input"></el-input>
      </el-form-item>

      <!--支持业务线的下拉列表-->
      <el-form-item prop="" label="支持业务线:">
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
      <el-form-item prop="departmentName" label="所属部门">
        <el-input v-model.trim="conditionForm.departmentName" placeholder="请选择所属部门" prefix-icon="el-icon-search" class="input"
          style="width:175px" :readonly="true"></el-input>
        <!--通过部门选择树来选择部门-->
        <el-button type="primary" @click="selectDept" class="departmentBt">选择</el-button>
      </el-form-item>

      <!--支持角色状态的下拉列表-->
      <el-form-item prop="" label="角色状态:">
        <!--下拉列表-->
        <el-dropdown @command="handleCommandRoleStatus">
          <span class="el-dropdown-link">
            {{state1}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="2">全部</el-dropdown-item>
            <el-dropdown-item command="1">有效</el-dropdown-item>
            <el-dropdown-item command="0">无效</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <!--账号状态下拉控件-->
      <el-form-item prop="" label="账号状态:">
        <!--下拉列表-->
        <el-dropdown @command="handleCommandAccountStatus">
          <span class="el-dropdown-link">
            {{state2}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">全部</el-dropdown-item>
            <el-dropdown-item command="1">正常</el-dropdown-item>
            <el-dropdown-item command="2">冻结</el-dropdown-item>
            <el-dropdown-item command="3">无效</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>

    <!--查询控件，查询的是角色账号数据-->
    <div class="btnRow">
      <el-button :disabled="canPoint" type="primary" @click="getRoleAccount2" class="selectbtn" v-permission="['/query/roleAccount']">查询</el-button>

      <!--导出控件，导出的是角色账号数据-->
      <el-button type="primary" @click="exportExcel2" class="exportbtn">导出</el-button>
    </div>

    <!--下方的列表-->
    <el-table :data="tableData" stripe style="width: 100%" id="roleAccount">
      <el-table-column prop="id" label="角色ID">
        <template slot-scope="scope">
          <el-button type="text" @click="toRoleManageDec(scope.row.id)">
            {{scope.row.id }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称">
      </el-table-column>

      <el-table-column prop="businessLine" label="支持业务线">
      </el-table-column>
      <el-table-column v-if="false" prop="accountId" label="账号id" />
      <el-table-column prop="accountNo" label="登录账号">
        <template slot-scope="scope">
          <div style="color: blue" @click.prevent="showAccountDetail(scope.row.accountId)">{{scope.row.accountNo}}</div>
        </template>
      </el-table-column>

      <el-table-column prop="staffNumber" label="员工编号">
      </el-table-column>

      <el-table-column prop="staffName" label="员工姓名">
      </el-table-column>

      <el-table-column prop="departmentName" label="员工所属部门">
      </el-table-column>

      <el-table-column prop="roleStatus" label="角色状态">
        <template slot-scope="scope">
          {{ getStatus2(scope.row.roleStatus) }}
        </template>
      </el-table-column>

      <el-table-column prop="accountStatus" label="账号状态">
        <template slot-scope="scope">
          {{ getAccountStatus(scope.row.accountStatus) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPage" :current-page="conditionForm.currentPage"
        :page-sizes="[5, 10, 20]" :page-size="conditionForm.limit" layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>

    <!-- 选择部门对话框 -->
    <div>
      <el-dialog title="请选择部门" :visible.sync="dialogVisible">
        <el-row>
          <el-button type="primary" icon="el-icon-upload" @click="commitSelectDept()">确定</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="cancelSelectDept()">取消</el-button>
        </el-row>
        <!--选择部门对话框下就是部门树-->
        <department-tree :return-name="true" @selectId="changeDeptId"></department-tree>
      </el-dialog>
    </div>
    <!--账号详情对话框-->
    <div>
      <el-dialog title="账号详情" width="60%" :visible.sync="accountDialogVisible">
        <el-button type="primary" size="medium" style="width: 75px;margin-bottom: 10px" @click="accountDialogVisible = false">关闭</el-button>
        <el-form :model="addForm" :disabled="true" :inline="true">
          <el-row>
            <el-col :span="12">
              <el-form-item label="登录账号">
                <el-input v-model="addForm.accountNo" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码">
                <el-input v-model="addForm.password" show-password />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="关联员工账号">
                <el-input v-model="addForm.staffNumber" style="width: 125px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工姓名">
                <el-input v-model="addForm.staffName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据权限类型" prop="datalimit">
                <el-input v-model="addForm.datalimit" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密保邮箱">
                <el-input v-model="addForm.email" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="新建人">
                <el-input v-model="addForm.createName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="新建时间">
                <el-input v-model="addForm.createTime" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="修改人">
                <el-input v-model="addForm.modifyName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="修改时间">
                <el-input v-model="addForm.modifyTime" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="账号状态">
                <el-input v-model="addForm.status" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="备注">
                <el-input v-model="addForm.remark" type="textarea" :rows="2" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
  import {
    getRoleAccount,
    getAccountById
  } from "../../api/roleAccount";
  import DepartmentTree from "../department/departmentTree";
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import rules from "@/utils/rules";
  import accountEnum from '../../views/accountManage/components/accountEnum';
  import {
    parseTime
  } from '@/utils';

  // 导出字段数组列表，[0]为属性，[1]为表头
  const exportOptions = [
    ["id", "角色ID"],
    ["roleName", "角色名称"],
    ["businessLine", "支持业务线"],
    ["businessLine", "角色支持业务线"],
    ["accountNo", "登录账号"],
    ["staffNumber", "员工编号"],
    ["staffName", "员工姓名"],
    ["departmentName", "员工所属部门"],
    ["roleStatus", "角色状态"],
    ["accountStatus", "账号状态"],
  ];

  export default {
    name: "roleAccount",
    components: {
      DepartmentTree
    },
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
        addForm: {},
        // 查看账号详情对话框
        accountDialogVisible: false,
        //角色状态和账号状态下拉列表的默认值
        state1: "全部",
        state2: "全部",
        //业务线下拉列表的默认值
        businessLineDefault: "全部",
        //其他
        rules,
        labelPosition: "right",
        // 查询总数量
        totalCount: 0,
        // 查询条件
        conditionForm: {
          //角色名
          roleName: "",
          //登录账号
          accountNo: "",
          //员工编号
          staffNumber: "",
          //员工姓名
          staffName: "",
          //部门名
          departmentName: "",
          //角色状态
          roleStatus: "",
          //账号状态
          accountStatus: "",
          //业务线名称
          businessLine: "",
          //当前页
          currentPage: 1,
          //每页多少条
          limit: 5
        },
        // 账号权限数据列表
        tableData: [],
        // 部门对话框
        dialogVisible: false,

        msg: '',
        canPoint: false
      };
    },
    watch: {},
    computed: {
      getDataLimit() {
        return function(param) {
          return accountEnum.dataLimit.getLabelByValue(param)
        }
      },
      getStatus() {
        return function(param) {
          return accountEnum.status.getLabelByValue(param)
        }
      }
    },
    methods: {
      test(){
        const reg = /^[0-9]\d*$/
        if(!reg.test(this.conditionForm.staffNumber)){
          this.msg = "请输入数字"
          this.canPoint = true
        }else{
          this.msg = ''
        }
        if(this.conditionForm.staffNumber === ''){
            this.msg = ''
            this.canPoint = false
        }
      },
      enter(){
        if(!this.canPoint){
          this.getRoleAccount2()
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
        let temp = { ...this_.conditionForm
        };
        temp.limit = null;
        temp.currentPage = null;
        getRoleAccount(JSON.stringify(temp))
          .then(result => {
            const data = result.data.list;
            this_.exportList = data;
            this_.exportList.forEach(item => {
              switch (item.accountStatus) {
                case 1:
                  item.accountStatus = "无效";
                  break;
                case 2:
                  item.accountStatus = "冻结";
                  break;
                case 3:
                  item.accountStatus = "有效";
                  break;
                default:
                  break;
              }
              switch (item.roleStatus) {
                case 1:
                  item.roleStatus = "有效";
                  break;
                case 0:
                  item.roleStatus = "无效";
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
            filename: '角色账号明细查询表' + parseTime(new Date())
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
      toRoleManageDec(id) {
        //跳转至角色详情页
        this.$router.push({
          name: "RoleManageDec",
          params: {
            id: id
          }
        });
      },
      //获得账号详细信息
      showAccountDetail(id) {
        const this_ = this
        this_.accountDialogVisible = true;
        getAccountById(id).then((result) => {
          //alert("成功获得账号详细信息！");
          this_.addForm = result.data;
          if(this_.addForm.status=="1") this_.addForm.status = "正常";
          else if(this_.addForm.status=="2") this_.addForm.status = "冻结";
          else if(this_.addForm.status=="3") this_.addForm.status = "无效";
        }).catch((error) => {
          this_.$message({
            type: 'error',
            message: error
          })
          this_.addForm.datalimit = this_.getDataLimit(result.data.datalimit)
          this_.addForm.status = this_.getStatus(result.data.status)
        })
      },
      //获得角色状态
      getStatus2(stateValue) {
        return stateValue == "1" ? "有效" : "无效";
      },
      //获得账号状态
      getAccountStatus(stateValue) {
        if (stateValue == "1") return "正常";
        else if (stateValue == "2") return "冻结";
        else if (stateValue == "3") return "无效";
      },
      // 获取账号权限数据，需要改
      getData() {
        let this_ = this;
        //调用接口方法进行访问数据库，需要自己写
        getRoleAccount(JSON.stringify(this_.conditionForm))
          .then(result => {
            this.tableData = result.data.list;
            this.totalCount = result.data.totalCount;
          })
          .catch(error => {});
      },
      getRoleAccount() {
        this.getData();
      },
      getRoleAccount2() {
        this.conditionForm.currentPage=1;
        this.getData();
      },
      //角色状态下拉列表的触发事件
      handleCommandRoleStatus(command) {
        if (command == 2) {
          this.state1 = "全部";
          this.conditionForm.roleStatus = "";
        } else if (command == 1) {
          this.state1 = "有效";
          this.conditionForm.roleStatus = 1;
        } else if (command == 0) {
          this.state1 = "无效";
          this.conditionForm.roleStatus = 0;
        }
      },
      //账号状态下拉列表的触发事件
      handleCommandAccountStatus(command) {
        if (command == 0) {
          this.state2 = "全部"
          this.conditionForm.accountStatus = "";
        } else if (command == 1) {
          this.state2 = "正常"
          this.conditionForm.accountStatus = 1;
          console.log(this.conditionForm.accountStatus);
        } else if (command == 2) {
          this.state2 = "冻结"
          this.conditionForm.accountStatus = 2;
        } else if (command == 3) {
          this.state2 = "无效"
          this.conditionForm.accountStatus = 3;
        }
      },
      //业务线下拉列表的触发事件
      handleCommandBusinessLine(command) {
        if (command == 0) {
          this.businessLineDefault = "全部";
          this.conditionForm.businessLine = "";
        } else if (command == 1) {
          this.businessLineDefault = "买买车";
          this.conditionForm.businessLine = "买买车";
        } else if (command == 2) {
          this.businessLineDefault = "闪贷";
          this.conditionForm.businessLine = "闪贷";
        } else if (command == 3) {
          this.businessLineDefault = "租车";
          this.conditionForm.businessLine = "租车";
        } else if (command == 4) {
          this.businessLineDefault = "专车";
          this.conditionForm.businessLine = "专车";
        } else if (command == 5) {
          this.businessLineDefault = "保险";
          this.conditionForm.businessLine = "保险";
        }
      },
      // 部门列表对话框的方法
      //选择部门
      selectDept() {
        this.dialogVisible = true;
      },
      //取消选择部门
      cancelSelectDept() {
        this.conditionForm.departmentName = null;
        this.dialogVisible = false;
      },
      //确定所选择的部门
      commitSelectDept() {
        this.conditionForm.departmentName = this.tempConditionForm.name;
        this.dialogVisible = false;
      },
      //选择部门
      changeDeptId(val) {
        this.tempConditionForm.name = val.name;
       // this.conditionForm.departmentName = val.name;
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
      //导出的数据,这个需要改
      exportExcel2() {
        this.exportDia = true;
        return;
        /* generate workbook object from table */
        var xlsxParam = {
          raw: true
        }; // 导出的内容只做解析，不进行格式转换
        var wb = XLSX.utils.table_to_book(
          document.querySelector("#roleAccount"),
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
            "角色账号明细查询表.xlsx"
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
        this.getRoleAccount();
      },
      // 改变页码
      handleCurrentPage(val) {
        //跳转页码
        this.conditionForm.currentPage = val;
        this.getRoleAccount();
      }
    },
    created() {},
    mounted() {
      this.getRoleAccount();
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
