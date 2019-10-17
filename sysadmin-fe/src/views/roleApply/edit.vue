<template>
  <div style="margin-bottom: 100px">
    <div class="module">
      <el-card>
        <div>
          <el-row class="row-title">
            <h2>修改申请信息</h2>
            <div style="float:right">
              <el-button type="primary" style="margin-left: 500px" @click="saveOrSubmit(1)">保存</el-button>
              <el-button type="primary" @click="saveOrSubmit(2)">保存并提交</el-button>
              <el-button type="primary">取消</el-button>
            </div>
          </el-row>
        </div>

        <el-form style="margin-top: 50px" inline="true">
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="角色申请编号">
                <el-input :disabled="true" v-model="selectRole.applyCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="申请角色">
                <el-input v-model="selectRole.roleName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-button type="primary" @click="addFormRole()">选择</el-button>
          </el-row>
          <el-row :gutter="20">
            <el-col span="8">
              <el-form-item label="角色审批人">
                <el-input v-model="selectRole.approverName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="角色支持业务线">
                <el-input :value="selectRole.business" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-title">
            <h2>申请账号明细</h2>
            <el-button type="primary" style="margin-left: 80px" @click="dialogTableVisible = true">添加</el-button>
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
                <el-select v-model="scope.row.operation">
                  <el-option label="添加" value="0"></el-option>
                  <el-option label="移除" value="1"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="deleteOperation" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="clean(scope.$index)">
                  删除
                </el-button>
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
                <el-input v-model="addForm.modifyTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="审批人">
                <el-input v-model="selectRole.approverAccount" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="状态">
                <el-input v-model="addForm.status" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-card>
    </div>

    <el-dialog title="选择账户" width="80%" :visible.sync="dialogTableVisible">
      <select-account-list @selectAccount="getAccounts" @cancel="dialogTableVisible = false"></select-account-list>
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
      return {
        applyCode: "",
        roleApply: {},
        roleApplyList: [],

        selectAccountList: [],
        dialogTableVisible: false,
        status1: "1",
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
        selectRoleId: "",
        selectRole: {},
      }
    },

    methods: {
      getData() {
        let this_ = this;
        let params = {
          applyCode: this_.applyCode
        };
        ajaxParams("/roleApply/getListByApplyCode", params).then((result) => {
          // 将数据绑定
          this_.roleApplyList = result.data.applyList;
          this_.selectRole = this_.roleApplyList[0];
          console.log(this_.selectRole);
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
      saveOrSubmit(status) {
        let this_ = this;
        this_.selectAccountList.forEach(item => {
          item.applyId = item.id;
        })
        let RoleApplyAddDTO = {
          roleId: this_.selectRole.id,
          status: status,
          createEmp: this.$store.getters.nowLogin.id,
          approverId: this_.selectRole.approverId,
          list: this_.selectAccountList
        }
        ajaxData("/roleApply/insertRoleApply", JSON.stringify(RoleApplyAddDTO)).then((result) => {
          // 将数据绑定
          if (result.code == 200) {
            this_.$message({
              type: 'success',
              message: '操作成功！'
            });
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      savaMit() {
        let this_ = this;
        let RoleApplyAddDTO = {
          roleId: this_.selectRole.id,
          status: 2,
          createEmp: 1005,
          approverAccount: this_.selectRole.approverAccount,
          list: this_.selectAccountList
        }
        ajaxData("/roleApply/insertRoleApply", JSON.stringify(RoleApplyAddDTO)).then((result) => {
          // 将数据绑定
          if (result.code == 200) {
            this_.$message({
              type: 'success',
              message: '保存并提交!'
            });
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      save() {
        let this_ = this;
        let RoleApplyAddDTO = {
          roleId: this_.selectRole.id,
          status: 1,
          createEmp: this.$store.getters.nowLogin.id,
          approverAccount: this_.selectRole.id,
          list: this_.selectAccountList
        };
        console.log(RoleApplyAddDTO);
        ajaxData("/roleApply/insertRoleApply", JSON.stringify(RoleApplyAddDTO)).then((result) => {
          // 将数据绑定
          if (result.code == 200) {
            this_.$message({
              type: 'success',
              message: '保证成功!'
            });
          }
        }).catch((error) => {
          console.log(error);
        });
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
      if (this.$route.params.applyCode != null) {
        this.applyCode = this.$route.params.applyCode;
      }
      this.getData();
    }
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
