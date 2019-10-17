<template>
  <div style="margin-bottom: 100px">
    <div class="module">
      <el-card>
        <div>
          <el-row class="row-title">
            <h2>申请信息</h2>
            <div style="float:right">
              <el-button type="primary" style="margin-left: 500px" @click="pass(3)" v-if="flag">审批通过</el-button>
              <el-button type="primary" @click="reason()" v-if="flag">审批拒绝</el-button>
            </div>
          </el-row>
        </div>

        <el-form style="margin-top: 50px" :inline="true">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="角色申请编号">
                <el-input v-model="selectRole.applyCode" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请角色">
                <el-input v-model="selectRole.roleName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="角色审批人">

                <el-input v-model="selectRole.approverName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="角色支持业务线">
                <el-input :value="selectRole.business" :disabled="true" style="width:260px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-title">
            <h2>申请账号明细</h2>
          </el-row>
          <el-table :data="selectAccountList" border style="width: 100%">
            <el-table-column prop="accountNo" label="申请账号" width="180">
            </el-table-column>
            <el-table-column prop="staffName" label="关联员工姓名" width="180">
            </el-table-column>
            <el-table-column prop="staffNumber" label="关联员工编号">
            </el-table-column>
            <el-table-column prop="departmentName" label="关联员工所属部门">
            </el-table-column>
            <el-table-column prop="operation" label="申请操作">
              <template slot-scope="scope">
                <el-select v-model="scope.row.operation" :disabled="true">
                  <el-option label="添加" :value="0"></el-option>
                  <el-option label="移除" :value="1"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>


          </el-table>
          <el-row class="row-title">
            <h2>其他信息</h2>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="申请时间">
                <el-input v-model="info.createTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请人">
                <el-input v-model="info.createEmp" :disabled="true">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="修改时间">
                <el-input v-model="info.modifyTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修改人">
                <el-input v-model="info.modifyEmp" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="审批时间">
                <el-input v-model="info.approverTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批人">
                <el-input v-model="info.approverAccount" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="状态">
                <el-input v-model="info.status" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-card>
    </div>

 <!-- 编辑弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="editVisible" >
      <el-form  label-width="25%" style="width: 100%;" :rules="rules" ref="addForm" :model="addForm">
        <el-form-item label="拒绝理由：" prop="rejectReason">
          <el-input v-model="addForm.rejectReason" style="width: 80%;" />
        </el-form-item>
      </el-form>
      <el-row style="text-align: center;margin-top: 100px">
        <el-button icon="el-icon-close" style="margin-right: 10px" @click="editVisible=false">取消</el-button>
        <el-button type="primary" icon="el-icon-upload" style="margin-left: 10px" @click="refuse(4)">提交</el-button>
      </el-row>
    </el-dialog>
</div>

</template>

<script>
  import {
    isNullOrUndefined
  } from 'util';
  import {
    constants
  } from 'crypto';
  import {
    ajaxParams,
    ajaxData
  } from "../../api/roleApply";
  import SelectAccountList from "../accountManage/components/selectAccountList";
  export default {
    name: "add",
    components: {
      SelectAccountList
    },
    data() {
      var rejectReason_ = (rule, val, callBack) => {
        if (val==null||val=='') {
          callBack(new Error("操作失败，不允许为空"));
        }
        else {
          if (!this.checkScope.test(val)) {
            callBack(new Error("操作失败，仅支持1-200字符"));
          }
          else {
            callBack();
          }
        }
      };
      return {
        checkScope:/^[\u4e00-\u9fa5a-zA-Z0-9]{1,200}$/,
        addForm:{
          rejectReason:null,
        },
        rules: {
          rejectReason: [
          { required: true, message: '操作失败，不允许为空', trigger: 'blur' },
          { min: 1, max: 200, message: '操作失败，仅支持1-200字符', trigger: 'blur' }
        ],
        //rejectReason:[{validator:rejectReason_,trigger:'blur'}],
      },
        flag:null,
        visiblePass: 'none',   
        visibleRejcet:'none',
        editVisible: false,
        dialogTitle: '拒绝理由',
        remark:"",
        rejectReason:'',
        info:{
          createTime :"",
        },
        applyCode: '',
        selectAccountList: [],
        dialogTableVisible: false,
        status: "",
        status2: "2",
        insertRoleApply: {
          id: null,
          roleApply: null,
          status: 1
        },
        operation: [],
        options: [{
            value: 0,
            label: '添加',
          },
          {
            value: 1,
            label: '移除',
          },
        ],
        selectRole: {
          applyCode: ''
        },
      }
    },
    methods: {
      reason() {
        let this_ = this;
        this_.dialogTitle = "请输入拒绝理由";
        // 显示编辑框
        this_.editVisible = true;
      },
      getApplyRoleInfo() {
        let this_ = this;
        let params = {
          applyCode: this_.applyCode,
        }
        ajaxParams("/roleApply/getRoleApplyFormDTO", params).then((result) => {
          // 将数据绑定
          this_.selectRole.applyCode = result.data.applyCode;
          this_.selectRole.approverName = result.data.approverName;
          this_.selectRole.roleName = result.data.roleName;
          this_.selectRole.business = result.data.business;


          this_.info.createTime = result.data.createTime;
          this_.info.modifyTime = result.data.modifyTime;
          this_.info.createEmp = result.data.createName;
          this_.info.modifyEmp = result.data.modifyName;
          this_.info.approverAccount = result.data.approverName;
          this_.info.status = result.data.status;

          // 绑定list数据
          this_.selectAccountList = result.data.roleApplyAcountVOs;
          console.log(this_.selectAccountList)
        }).catch((error) => {
          console.log(error);
        });


      },
      getAccounts(accounts) {
        let this_ = this;
        this_.selectAccountList = accounts;
        this_.selectAccountList.forEach(item => {
          item.status = '';
        })
      },
      pass(status) {
        let this_ = this;
        let params={
        status: status,
        applyCode :this_.applyCode}
        ajaxParams("/roleApply/passRoleApply", params).then((result) => {
          // 将数据绑定
          if (result.code == 200) {
            this_.$message({
              type: 'success',
              message: '操作成功，审批通过！'
            });
          this.$router.push({
          name: "roleApprove"
        });
         this.$store.dispatch('tagsView/delVisitedView',this.$route);
          }
        }).catch((error) => {
          console.log(error);
        });
        
      },
      refuse(status) {
        let isValid = false;
        let this_ = this;
        this.$refs['addForm'].validate((valid) => {
          if (valid) isValid = true;
        });
         if (isValid) {
        let params={
        status: status,
        applyCode :this_.applyCode,
        rejectReason :  this_.addForm.rejectReason,
        }
        ajaxParams("/roleApply/refuseRoleApply", params).then((result) => {
          // 将数据绑定
          if (result.code == 200) {
            this_.$message({
              type: 'success',
              message: '操作成功，审批拒绝！'
            });
            this.$router.push({
          name: "roleApprove"
        });
        this.$store.dispatch('tagsView/delVisitedView',this.$route);
          }
        }).catch((error) => {
          console.log(error);
        });
      }
      },

      clean(index) {
        let this_ = this;
        this_.selectAccountList.splice(this_.selectAccountList.indexOf(index), 1)
      },
      addFormRole() {
        this.$router.push('/roleApply/addFormRole');
      },
    },
    mounted() {
      if (this.$route.params.selectRole != null) {
        this.selectRole = this.$route.params.selectRole;
        console.log(this.selectRole);
      }
      if (this.$route.params.applyCode != null) {
        this.applyCode = this.$route.params.applyCode;
        console.log(this.applyCode);
        this.getApplyRoleInfo();
      }
      if (this.$route.params.flag != null) {
        this.flag = this.$route.params.flag==1?true:false;
      }
    },
    created() {}
  }
</script>

<style scoped>
  .actions {
    margin-left: 70%;
    padding-top: 20px;
  }

  .module {
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 20px;
  }

  .row-title {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px
  }

  .text-size {
    font-size: 25px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
