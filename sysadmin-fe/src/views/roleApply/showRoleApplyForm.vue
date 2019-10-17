<template>
  <div style="margin-bottom: 100px">
    <div class="module">
      <el-card>
      <div >
        <el-row class="row-title">
          <h2>申请信息</h2>
          <div style="float:right">
          <el-button type="primary" style="margin-left: 500px" @click="save()">关闭</el-button>
          </div>
        </el-row>
      </div>

        <el-form :model="addForm" style="margin-top: 50px" inline="true">
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="角色申请编号">
                <el-input v-model="selectRole.id" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="申请角色">
                <el-input v-model="selectRole.roleName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="角色审批人">

                <el-input v-model="selectRole.approverAccount" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="角色支持业务线">
                <el-input :disabled="true" :value="selectRole.bussiness" >
                  <v-for ="b in business">
                   {{b}}
                  </v-for>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-title">
            <h2>申请账号明细</h2>
          </el-row>
        <el-table
          :data="list"
          border
          style="width: 100%">
          <el-table-column
            prop="applyId"
            label="申请账号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="staffName"
            label="关联员工姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="staffNumber"
            label="关联员工编号">
          </el-table-column>
                    <el-table-column
            prop="department"
            label="关联员工所属部门">
          </el-table-column>
           <el-table-column
            prop="operation"
            label="申请操作">
            <template slot-scope="scope">
            <el-select v-model="operation[scope.$index]">
                <el-option label="添加" value="0"></el-option>
                <el-option label="移除" value="1"></el-option>
            </el-select>
            </template>
          </el-table-column>
        </el-table>


    </el-table>
          <el-row class="row-title">
            <h2>其他信息</h2>
          </el-row>
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="申请时间">
                <el-input v-model="addForm.createTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="申请人">
                <el-input v-model="addForm.createEmp" :disabled="true">
                  {{this.$store.getters.nowLogin.id}}
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="修改时间">
                <el-input v-model="addForm.modifyTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="修改人">
                <el-input v-model="addForm.modifyEmp" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
                    <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="审批时间">
                <el-input v-model="roleApplyForm.modifyTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="审批人">
                <el-input v-model="roleApplyForm.approverAccount" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="状态">
                <el-input v-model="roleApplyForm.status" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
  
        </el-form>
      </el-card>
    </div>
  </div>

</template>

<script>
import { isNullOrUndefined } from 'util';
import { constants } from 'crypto';
import { ajaxParams,ajaxData } from "../../api/roleApply";
  export default {
    name: "add",
    data() {
      return {
        status1:"1",
        status2:"2",
        insertRoleApply:{
          id:null,
          roleApply:null,
          status:1
        },
        operation:[],

        options: [
          {
            value: 0,
            label: '添加',
          },
          {
            value: 1,
            label: '移除',
          },
        ],
        addForm: {
          account: '',
          pass: '',
          sno: '',
          name: '',
          status: '',
          email: '',
          createEmp: '',
          modifyEmp: '',
          commit: '',
        },
        selectRole:{},
      }
    },

     methods: {
         getApplyRoleInfo(){
         let this_ = this;
          ajaxParams("/roleApply/getRoleApplyInfo", this.roleApplyForm.applyCode).then((result) => {
          // 将数据绑定到表格上
          this_.tableData = result.data.roleApplyList;
        }).catch((error) => {
          console.log(error);
        });
    },
        
       clean(index){
         let this_ = this;
        this_.list.splice(this_.list.indexOf(index),1)
       },
       addFormRole(){
         this.$router.push('/roleApply/addFormRole')
       }
      ,
     },
    mounted() {
      this.roleApplyForm.applyCode = this.$route.params.applyCode;
      console.log(this.$route.params.applyCode);
      this.getApplyRoleInfo();
    },
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

