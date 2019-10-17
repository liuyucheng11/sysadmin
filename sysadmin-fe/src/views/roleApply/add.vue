<template>
  <div style="margin-bottom: 100px">
    <div class="module">
      <el-card>
        <div>
          <el-row class="row-title">
            <h2>申请信息</h2>
            <div style="float:right">
              <el-button v-permission="['/roleManage/roleApply/update']" v-if="isEdit" type="primary" style="margin-left: 500px"
                @click="saveOrSubmit(1)">保存</el-button>
              <el-button v-permission="['/roleManage/roleApply/update']" v-if="isEdit" type="primary" @click="saveOrSubmit(2)">保存并提交</el-button>
              <el-button type="primary" @click="onBack()">取消</el-button>
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
            <el-button v-permission="['/roleManage/roleApply/update']" v-if="isEdit" type="primary" @click="addFormRole()">选择</el-button>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="角色审批人">
                <el-input v-model="selectRole.approverName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色支持业务线">
                <el-input style="width: 300px;" :value="selectRole.business" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-title">
            <h2>申请账号明细</h2>
            <el-button v-permission="['/roleManage/roleApply/update']" v-if="isEdit" type="primary" style="margin-left: 80px"
              @click="dialogTableVisible = true">添加</el-button>
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
                <el-select v-model="scope.row.operation" :disabled="!isEdit">
                  <el-option label="添加" :value="0"></el-option>
                  <el-option label="移除" :value="1"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="isEdit" prop="deleteOperation" label="操作">
              <template slot-scope="scope">
                <el-button v-permission="['/roleManage/roleApply/update']" type="primary" @click="clean(scope.$index)">
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

    <el-dialog title="选择账户" width="80%" :visible.sync="dialogTableVisible">
      <selectAccountList :append-to-body="true" @selectAccount="getAccounts" @cancel="dialogTableVisible = false"></selectAccountList>
    </el-dialog>
    <el-dialog title="选择角色" width="80%" :visible.sync="dialogAddFormRole">
      <addFormRole :append-to-body="true" @selectRole="getRole" @cancel="dialogAddFormRole = false"></addFormRole>
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
  import addFormRole from "./addFormRole";
  export default {
    name: "add",
    components: {
      SelectAccountList,
      addFormRole
    },
    data() {
      return {
        dialogAddFormRole: false,
        isEdit: false,
        info: {
          createTime: "",
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
          applyCode: null
        }
      }
    },

    methods: {
      onBack() {
        this.$store.dispatch('tagsView/delVisitedView', this.$route);
        //回到列表页
        this.$router.push({
          name: "roleApply"
        });
      },
      getApplyRoleInfo() {
        let this_ = this;
        let params = {
          applyCode: this_.applyCode,
        }
        ajaxParams("/roleApply/getRoleApplyFormDTO", params).then((result) => {
          // 绑定需要提交的数据
          this_.selectRole.applyCode = result.data.applyCode;
          this_.selectRole.approverName = result.data.approverName;
          this_.selectRole.approverId = result.data.approverId;
          this_.selectRole.roleName = result.data.roleName;
          this_.selectRole.id = result.data.roleId;
          this_.selectRole.business = result.data.business.join("、");

          // 绑定显示消息的数据
          this_.info.createTime = result.data.createTime;
          this_.info.modifyTime = result.data.modifyTime;
          this_.info.approverTime = result.data.approverTime;
          this_.info.createEmp = result.data.createName;
          this_.info.modifyEmp = result.data.modifyName;
          this_.info.approverAccount = result.data.approverName;
          this_.info.approverId = result.data.approverId;
          this_.info.status = result.data.status;

          // 绑定list数据
          this_.selectAccountList = result.data.roleApplyAcountVOs;
        }).catch((error) => {
          console.log(error);
        });

      },
      getRole(selectRole) {
        let this_ = this;
        // 判断选择的角色是否有效
        if (selectRole.status === 0) {
          this_.$message({
            type: 'warring',
            message: '无法选择状态为无效的角色！',
          });
          return;
        }
        //如果有申请编号，先保存之前的编号
        let applyCode = this_.selectRole.applyCode;
        // 然后在将选择的角色信息显示到文本框中
        this_.selectRole = selectRole;
        debugger;
        if(selectRole.business==null){
        this_.selectRole.business = selectRole.business.join("、");}
        if (applyCode != null) {
          this_.selectRole.applyCode = applyCode;
        }
        this_.dialogAddFormRole = false;
      },
      // 获取页面上选中的员工信息
      getAccounts(accounts) {
        let this_ = this;
        let isActive= false;
        accounts.forEach(item=>{
        // 判断选择的账户是否有效
        if (item.status === 2||item.status ===3) {
          this_.$message({
            type: 'warring',
            message: '无法选择状态为冻结或无效的角色！',
          });
          isActive = true;
          return;
        }
        })
        if(isActive){
          return;
        }
        
        // 临时数组,用来判断记录是否超过20条
        let temp = this_.selectAccountList.concat(accounts);
        if (Array.from(new Set(temp)).length > 20) {
          this_.$message({
            type: 'warring',
            message: '一共只能选择20条数据！',
          });
          return;
        }
        // 使用对象去重,去重重复的对象
        this_.selectAccountList = this.unique(temp);
        // this_.selectAccountList.forEach(item => {
        //   // 去除不要的属性
        //   item.status = '';
        // })
        this_.dialogTableVisible = false;
      },
      // 对象去重
      unique(arr) {
        const res = new Map();
        return arr.filter((a) => !res.has(a.id) && res.set(a.id, 1))
      },
      saveOrSubmit(status) {
        let this_ = this;
        // 如果什么数据都没有选择
        if (!this_.selectRole.roleName) {
          this_.$message({
            type: 'warring',
            message: '请选择角色数据！'
          });
          return;
        }
        if (this_.selectAccountList == null || this_.selectAccountList.length == 0) {
          this_.$message({
            type: 'warring',
            message: '请选择需要添加的账户数据！'
          });
          return;
        }
        // for循环中，判断是否有申请操作没有选择的
        let isContinue = true;
        this_.selectAccountList.forEach(item => {
          if (item.id != null) {
            item.applyId = item.id;
          }
          if (typeof(item.operation) == "undefined" || item.operation === "") {
            isContinue = false;
            this_.$message({
              type: 'warring',
              message: '账号申请操作不能为空！'
            });
            return;
          }
        })
        if (!isContinue) {
          return;
        }
        let RoleApplyAddDTO = {
          applyCode: this_.selectRole.applyCode,
          roleId: this_.selectRole.id,
          status: status,
          createEmp: this.$store.getters.nowLogin.id,
          approverId: this_.selectRole.approverId,
          list: this_.selectAccountList,
          createTime: this_.info.createTime
        }
        ajaxData("/roleApply/insertRoleApply", JSON.stringify(RoleApplyAddDTO)).then((result) => {
          // 将数据绑定
          if (result.code == 200) {
            this_.$message({
              type: 'success',
              message: '操作成功！'
            });
            this_.onBack();
          }
        }).catch((error) => {
          this_.onBack();
        });
      },
      clean(index) {
        let this_ = this;
        this_.selectAccountList.splice(this_.selectAccountList.indexOf(index), 1)
      },
      // 选择申请角色方法
      addFormRole() {
        this.dialogAddFormRole = true;
      },
      setDefault() {
        let dt = new Date();
        let year = dt.getFullYear();
        let month = this.addZero(dt.getMonth() + 1);
        let day = this.addZero(dt.getDate());
        let honrs = this.addZero(dt.getHours());
        let minutes = this.addZero(dt.getMinutes());
        let seconds = this.addZero(dt.getSeconds());
        let nowDate = year + "-" + month + "-" + day + " " + honrs + ":" + minutes + ":" + seconds;
        let this_ = this;
        this_.info.modifyTime = nowDate;
        let loginUser = JSON.parse(localStorage.getItem('nowLoginUser'));
        this_.info.modifyEmp = loginUser.staffName;
        this_.info.status = "已新建";
      },
      addZero(num) {
        num = num < 10 ? "0" + num : num;
        return num;
      }
    },
    mounted() {
      if (this.$route.params.applyCode != null) {
        this.applyCode = this.$route.params.applyCode;
        this.getApplyRoleInfo();
      } else {
        // 如果是新建页,则初始化默认值
        this.setDefault();
      }
      if (this.$route.params.isEdit != null) {
        this.isEdit = this.$route.params.isEdit;
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

  .el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
  }
</style>
