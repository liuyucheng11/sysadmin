<template>
  <div id="swagger" @keyup.enter="enter">

    <el-form
      :label-position="labelPosition"
      :inline="true"
      v-model="conditionForm"
    >

      <el-form-item
        prop="staffNumber"
        label="员工编号">
        <!-- :rules="rules.InterNumFalse" -->
        <el-input
          v-model.number.trim="conditionForm.staffNumber"
          placeholder="请输入员工编号"
          prefix-icon="el-icon-search"
          class="input"
          @input="test"
        ></el-input><br>
        <span style="color: red">{{ msg }}</span>
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
         <!--通过部门选择树来选择部门-->
        <el-button
          type="primary"
          @click="selectDept"
          class="departmentBt"
        >选择</el-button>
      </el-form-item>

      <el-form-item
        prop=""
        label="权限名称"
      >
        <el-input
          v-model.trim="conditionForm.permissionsName"
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

      <el-form-item
        prop=""
        label="账号状态:"
      >
        <!--下拉列表-->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{state}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command=0>全部</el-dropdown-item>
            <el-dropdown-item command=1>正常</el-dropdown-item>
            <el-dropdown-item command=2>冻结</el-dropdown-item>
            <el-dropdown-item command=3>无效</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>

    <!--查询的是账号权限数据-->
    <div class="btnRow">
      <el-button
        type="primary"
        @click="getAccountPermissions2"
        class="selectbtn"
        v-permission="['/query/accountPermission']"
        :disabled="canPoint"
      >查询</el-button>

      <!--导出的功能也要改，导出的是权限功能数据-->
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
      id="accountTable"
    >

      <el-table-column
        prop="accountNo"
        label="登录账号"
      >
        <template slot-scope="scope">
          <div style="color: blue" @click.prevent="showAccountDetail(scope.row.accountId)">{{scope.row.accountNo}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="staffNumber"
        label="员工编号"
      >
      </el-table-column>

      <el-table-column v-if="false" prop="accountId" label="账号id" />

      <el-table-column
        prop="staffName"
        label="员工姓名"
      >
      </el-table-column>

      <el-table-column
        prop="departmentName"
        label="员工所属部门"
      >
      </el-table-column>

      <el-table-column
        prop="accountState"
        label="账号状态"
      >
        <template slot-scope="scope">
          {{ getStatus(scope.row.accountState) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="permissionsName"
        label="权限名称"
      >
        <template slot-scope="scope">
          <el-popover placement="top-start" title="备注:" width="250" trigger="hover">
            <div>{{scope.row.permissionsName}}</div>
            <span v-if="scope.row.permissionsName !== null && scope.row.permissionsName.length > 10" slot="reference">{{scope.row.permissionsName.substr(0,10)}}....</span>
            <span v-else slot="reference">{{scope.row.permissionsName}}</span>
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
        <!--对话框下面所显示出来的需要是权限树-->
        <radio-tree @selectId='selectName' :return-name="true">

        </radio-tree>

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
                <el-input v-model="addForm.email"/>
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
                <el-input v-model=addForm.status />
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
  import { getAccountById} from "../../api/roleAccount";
  import { getAccountPermissions } from "../../api/accountPermissions";
  import DepartmentTree from "../department/departmentTree";
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import rules from "@/utils/rules";
  import radioTree from '@/views/authority/permissionRadioTree';
  import accountEnum from '../../views/accountManage/components/accountEnum';
  import {
    parseTime
  } from '@/utils';
  // 导出字段数组列表，[0]为属性，[1]为表头
  const exportOptions = [
    ["staffNumber", "员工编号"],
    ["accountNo", "登陆账号"],
    ["staffName", "员工姓名"],
    ["departmentName", "员工所属部门"],
    ["accountState", "账号状态"],
    ["permissionsName", "权限名称"]
  ];
  export default {
    name: "accountPermissions",
    components: {radioTree, DepartmentTree},
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
        addForm: {},
        // 查看账号详情对话框
        accountDialogVisible: false,
        state:"全部",
        //其他
        //rules,
        labelPosition: "right",
        // 查询总数量
        totalCount: 0,
        // 查询条件
        conditionForm: {
          //员工编号
          staffNumber: "",
          //员工姓名
          staffName: "",
          //登录账号
          accountNo: "",
          //所属公司
          departmentName: "",
          //权限名称
          permissionsName:"",
          // 角色状态
          roleState: "",
          //账号状态
          accountState:"",
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
      getStatus2() {
        return function (param) {
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
        getAccountPermissions(JSON.stringify(temp))
          .then(result => {
            const data = result.data.list;
            this_.exportList = data;
            this_.exportList.forEach(item => {
              switch (item.accountState) {
                case "1":
                  item.accountState = "正常";
                  break;
                case "2":
                  item.accountState = "冻结";
                  break;
                case "3":
                  item.accountState = "无效";
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
            filename: '账号权限明细查询表' + parseTime(new Date())
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
      //获得账号详细信息
      showAccountDetail(id){
        const this_ = this;
        this_.accountDialogVisible = true;
        getAccountById(id).then((result) => {
          this_.addForm = result.data;

          if(this_.addForm.status=="1") this_.addForm.status = "正常";
          else if(this_.addForm.status=="2") this_.addForm.status = "冻结";
          else if(this_.addForm.status=="3") this_.addForm.status = "无效";
        }).catch((error) => {
          this_.$message({ type: 'error', message: error })
          this_.addForm.datalimit = this_.getDataLimit(result.data.datalimit)
          this_.addForm.status = this_.getStatus2(result.data.status)
        })
      },
      //获得下方列表的账号状态
      getStatus(stateValue){
        if(stateValue=="1") return "正常";
        else if(stateValue=="2") return "冻结";
        else if(stateValue=="3") return "无效";
      },
      // 获取账号权限数据
      getData() {
        const this_ = this;
        //调用接口方法进行访问数据库，需要自己写
        getAccountPermissions(JSON.stringify(this_.conditionForm))
          .then((result) => {
              this_.tableData = result.data.list;
              this_.totalCount = result.data.totalCount;
          })
          .catch((error) => {
            console.log("错误的结果是："+error);
            //alert(error);
          });
      },
      getAccountPermissions() {
        this.getData();
      },
      getAccountPermissions2() {
        this.conditionForm.currentPage = 1;
        this.getData();
      },
      //账号状态的处理,账号状态有点问题
      handleCommand(command) {
        if (command == 0) {
          this.state="全部";
          this.conditionForm.roleState = null;
        } else if (command == 1) {
          this.state="正常";
          this.conditionForm.roleState = 1;
        } else if (command == 2) {
          this.state="冻结";
          this.conditionForm.roleState = 2;
        }else if (command == 3) {
          this.state="无效";
          this.conditionForm.roleState = 3;
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
        //this.conditionForm.departmentId = null;
        this.dialogVisible = false;
      },
      //确定所选择的部门
      commitSelectDept() {
        this.dialogVisible = false;
      },
      //选择部门
      changeDeptId(val) {
        //this.conditionForm.departmentId = val.id;
        this.conditionForm.departmentName = val.name;
      },
      //选择权限
      selectName(val){
        this.conditionForm.permissionsName = val.name;
      },
      // 选择权限功能对话框
      selectPermissions() {
        this.permissionDialogVisible = true;
      },
      //取消权限功能对话框
      cancelSelectPermissions() {
        this.conditionForm.permissionsName = null;
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
          document.querySelector("#accountTable"),
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
            "账号权限明细查询表.xlsx"
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
  .block{
    Height:300px;
  }
</style>

