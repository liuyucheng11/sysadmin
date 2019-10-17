<template>
  <div>
    <div class="module">
      <el-form ref="addForm" :model="addForm" :rules="rules" :inline="true">
        <el-row class="row-title">
          <div class="container-title">账号信息</div>
          <el-button type="primary" style="width: 75px;margin-left: 70%" @click="modifyAccount">修改</el-button>
          <el-button type="primary" style="width: 100px" @click="returnList">返回列表</el-button>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="登录账号" prop="accountNo">
              <el-input v-model="addForm.accountNo" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" show-password :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="关联员工账号">
              <el-input v-model="addForm.staffNumber" style="width: 125px" :disabled="true" />
              <el-button size="medium" type="text" @click="dialogTableVisible = true">选择</el-button>
              <el-button size="medium" type="text" @click="clearSelect">清空</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工姓名">
              <el-input v-model="addForm.staffName" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="数据权限类型" prop="datalimit">
              <el-select v-model="addForm.datalimit" @change="datalimitChange">
                <el-option label="全部" value="1" />
                <el-option label="递归" :disabled="datalimitDisabled" value="2" />
                <el-option label="本部门" :disabled="datalimitDisabled" value="3"/>
                <el-option label="本人" value="4"/>
                <el-option label="手动选择" value="5"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密保邮箱" prop="email">
              <el-input v-model="addForm.email" :disabled="emailDisabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="departmentTreeDisable">
          <department-tree-list :trees="trees" @selectDeptIds="selectDeptIds"></department-tree-list>
        </el-row>
        <el-row class="row-title">
          <div class="container-title">其他信息</div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="新建人">
              <el-input v-model="addForm.createName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="新建时间">
              <el-input v-model="addForm.createTime" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="修改人">
              <el-input v-model="addForm.modifyName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改时间">
              <el-input v-model="addForm.modifyTime" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="账号状态">
              <el-input v-model="getStatus" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注">
              <el-input
                v-model="addForm.remark"
                style="width: 650px"
                type="textarea"
                maxlength="200"
                show-word-limit="true"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog :append-to-body="true" title="选择关联员工编号" width="80%" :visible.sync="dialogTableVisible">
      <select-staff-form @selectStaff="selectStaff" />
    </el-dialog>
  </div>
</template>

<script>
import accountEnum from './accountEnum'
import { getAccountById } from '../../../api/accountManage'
import { modifyAccount } from '../../../api/accountManage'
import SelectStaffForm from './selectStaffForm'
import DepartmentTreeList from "./departmentTreeList";

export default {
  name: 'Modify',
  components: {DepartmentTreeList, SelectStaffForm },
  data() {
    const checkPassWord = (rule, value, callback) => {
      if (!this.checkPassWord.test(value)) {
        callback(new Error('至少包含数字、大写字母、小写字母、特殊字符中的三种类型'))
      } else {
        callback()
      }
    }
    return {
      accountId: null,
      dataLimitList: accountEnum.dataLimit.getEnumList(),
      checkPassWord: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{4,16}$/,
      addForm: {
        accountNo: '',
        password: '',
        staffNumber: null,
        staffName: null,
        staffId: null,
        departmentId: null,
        datalimit: null,
        createName: '',
        modifyName: '',
        status: 1,
        email: '',
        remark: '',
        selectDeptIds: null,
      },
      trees: [],
      departmentTreeDisable: false,
      emailDisabled: false,
      dialogTableVisible: false,
      rules: {
        accountNo: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 5, max: 15, massage: '账号长度6到15', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '密保邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        datalimit: [
          { required: true, message: '数据权限类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    getStatus() {
      return accountEnum.status.getLabelByValue(this.addForm.status)
    },
    datalimitDisabled() {
      return this.addForm.staffName === null
    },
    getDataLimit() {
      return function(param) {
        return accountEnum.dataLimit.getLabelByValue(param)
      }
    }
  },
  mounted: {

  },
  created() {
    this.accountId = this.$route.params.accountId
    this.getAccount()
  },
  activated() {
    this.accountId = this.$route.params.accountId
    this.getAccount()
  },
  methods: {
    getModifyDataLimit() {
      const this_ = this;
      if(this_.addForm.datalimit >= 1 && this_.addForm.datalimit <= 5 ) {
        return this_.addForm.datalimit;
      }else {
        return accountEnum.dataLimit.getValueByFiledName(this_.addForm.datalimit)
      }
    },
    datalimitChange() {//判断部门树是否可见
      this.departmentTreeDisable = (this.addForm.datalimit == 5);
      // if(this.departmentTreeDisable === true) {
      //   this.addForm.selectDeptIds = null;
      //   this.trees = [];
      // }
    },
    selectDeptIds(value) {//选中部门ID
      this.addForm.selectDeptIds = value;
    },
    emailDisabled1() {
      if(this.addForm.staffNumber !== null) {
        this.emailDisabled = true;
      }
    },
    clearSelect() { // 清除选中员工
      this.addForm.staffNumber = null;
      this.addForm.staffName = null;
      this.addForm.email = null;
      this.addForm.staffId = null;
      this.addForm.departmentId = null;
      this.emailDisabled = false
    },
    getAccount() {
      const this_ = this
      getAccountById(JSON.stringify(this_.accountId)).then((result) => {
        this_.addForm = result.data;
        this_.trees = result.data.selectDeptIds;
        this_.departmentTreeDisable = (result.data.datalimit === 5);
        this_.addForm.datalimit = this_.getDataLimit(result.data.datalimit);
        this_.emailDisabled1()
      }).catch((error) => {
        this_.$message({ type: 'error', message: error })
      })
    },
    selectStaff(param) {
      const this_ = this
      if (param == null) {
        this_.dialogTableVisible = false
      } else {
        this_.addForm.staffId = param.id
        this_.addForm.staffNumber = param.staffNumber
        this_.addForm.staffName = param.staffName
        this_.addForm.departmentId = param.departmentId
        this_.addForm.email = param.email
        if (param.email !== '') {
          this_.emailDisabled = true
        }else {
          this_.emailDisabled = false
        }
        this_.dialogTableVisible = false
      }
    },
    returnList() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route);
      this.$router.go(-1);
      this.$router.push('/accountManage/list')
    },
    resetAddForm() {
      const this_ = this
      this_.addForm.accountNo = ''
      this_.addForm.password = ''
      this_.addForm.staffNumber = null
      this_.addForm.staffName = null
      this_.addForm.staffId = null
      this_.addForm.departmentId = null
      this_.addForm.datalimit = null
      this_.addForm.status = 1
      this_.addForm.email = ''
      this_.addForm.remark = ''
    },
    modifyAccount() {
      const this_ = this
      // 表单验证
      let isValid = false
      this_.$refs['addForm'].validate((valid) => {
        if(this_.getModifyDataLimit() == 5) {
          if(this.addForm.selectDeptIds === null || this_.addForm.selectDeptIds.length === 0) {
            this_.$message({type: 'error', message: '手动选择时请至少选中一个部门'})
          }else if (valid) {
            isValid = true
          }
        }else if (valid) isValid = true;
      })

      if (isValid) {
        const param = {
          id: this_.accountId,
          accountNo: this_.addForm.accountNo,
          datalimit: this_.getModifyDataLimit(),
          status: this_.addForm.status,
          staffId: this_.addForm.staffId,
          staffNumber: this_.addForm.staffNumber,
          staffName: this_.addForm.staffName,
          departmentId: this_.addForm.departmentId,
          email: this_.addForm.email,
          selectDeptIds: this_.addForm.selectDeptIds,
          remark: this_.addForm.remark
        }
        console.log(param)
        modifyAccount(JSON.stringify(param)).then(() => {
          this_.$message({ type: 'success', message: '修改成功' });
          this_.$store.dispatch('tagsView/delVisitedView', this.$route);
          this_.$router.go(-1);
          this_.$router.push('/accountManage/list')
        }).catch((error) => {
          this_.$message({ type: 'error', message: error })
        })
      }
    }
  }

}

</script>

<style lang="scss" scoped>
  .module {
    padding: 20px;
  }

  .row-title {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px
  }

  .container-title {
    font-size: 23px;
    font-weight: bolder;
  }

  .el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
  }
</style>

