<template>
  <div>
    <div class="module">
      <el-form ref="addForm" :model="addForm" :rules="rules" :inline="true">
        <el-row class="row-title">
          <div class="container-title">账号信息</div>
          <el-button type="primary" style="width: 75px;margin-left: 70%" @click="addAccount">保存</el-button>
          <el-button type="primary" style="width: 100px;" @click="returnList">返回列表</el-button>
        </el-row>
        <el-row style="margin-bottom: 25px">
          <el-col :span="8">
            <el-form-item label="登录账号" prop="accountNo">
              <el-input v-model="addForm.accountNo" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="password">
              <el-input class="test-liu" v-model="addForm.password" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
        <el-row>
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="新建人">
              <el-input v-model="addForm.createEmp" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="新建时间">
              <el-input v-model="addForm.createTime" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="修改人">
              <el-input v-model="addForm.modifyEmp" :disabled="true" />
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
    <el-dialog :append-to-body="true" title="选择关联员工编号" width="70%" :visible.sync="dialogTableVisible">
      <select-staff-form @selectStaff="selectStaff" />
    </el-dialog>
  </div>
</template>

<script>
import accountEnum from './accountEnum'
import { addAccount } from '../../../api/accountManage'
import SelectStaffForm from './selectStaffForm'
import DepartmentTreeList from "./departmentTreeList";
export default {
  name: 'Add',
  components: {DepartmentTreeList, SelectStaffForm },
  data() {
    const checkPassWord = (rule, value, callback) => {
      if (!this.checkPassWord.test(value)) {
        callback(new Error('至少包含数字、大写字母、小写字母、特殊字符中的三种类型，长度6-16'))
      } else {
        callback()
      }
    }
    const checkAccountNo = (rule, value, callback) => {
      if (!this.checkAccountNo.test(value)) {
        callback(new Error('只支持“@” “.”“ _”,字母，数字，长度6-15'))
      } else {
        callback()
      }
    }
    return {
      dataLimitList: accountEnum.dataLimit.getEnumList(),
      checkPassWord: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,16}$/,
      checkAccountNo: /^[0-9a-zA-Z_@.]{6,15}$/,
      addForm: {
        accountNo: '',
        password: '',
        staffNumber: null,
        staffName: null,
        staffId: null,
        departmentId: null,
        datalimit: null,
        status: 1,
        email: '',
        remark: '',
        selectDeptIds: [],
      },
      trees: [],
      departmentTreeDisable: false,//选择部门树形控件是否可见
      emailDisabled: false,
      dialogTableVisible: false,
      rules: {
        accountNo: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { validator: checkAccountNo, trigger: 'blur'},
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: checkPassWord, trigger: 'blur' }
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
    getLowerAccountNo() {
      return this.addForm.accountNo.toLowerCase();
    },
    getStatus() {
      return accountEnum.status.getLabelByValue(this.addForm.status)
    },
    emailDisabled1() {
      return this.addForm.staffNumber !== null
    },
    datalimitDisabled() {
      return this.addForm.staffName === null
    },
  },
  watch: {
    getLowerAccountNo() {
      this.addForm.accountNo = this.addForm.accountNo.toLowerCase();
    },
  },
  activated() {
    this.resetAddForm()
  },
  methods: {
    datalimitChange() {//判断部门树是否可见
      this.departmentTreeDisable = (this.addForm.datalimit == 5);
    },
    selectDeptIds(value) {//选中部门ID
      this.addForm.selectDeptIds = value;
    },
    clearSelect() { // 清除选中员工
      this.addForm.staffNumber = null;
      this.addForm.staffName = null;
      this.addForm.email = null;
      this.addForm.staffId = null;
      this.addForm.departmentId = null;
      this.emailDisabled = false
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
      // 关闭面包屑后返回
      this.$store.dispatch('tagsView/delVisitedView', this.$route);
      this.$router.go(-1);
      this.$router.push('/accountManage/list');
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
      this_.emailDisabled = false
    },
    addAccount() {
      const this_ = this
      // 表单验证
      let isValid = false
      this_.$refs['addForm'].validate((valid) => {
        if(this_.addForm.datalimit == 5 && this.addForm.selectDeptIds.length === 0) {
          this_.$message({type: 'error', message: '手动选择时请至少选中一个部门'})
        }else if (valid) isValid = true;
      })

      if (isValid) {
        const param = this_.addForm;
        addAccount(JSON.stringify(param)).then(() => {
          this_.$message({ type: 'success', message: '添加成功' });
          this_.$store.dispatch('tagsView/delVisitedView', this.$route);
          this_.$router.go(-1);
          this_.$router.push('/accountManage/list');
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
    margin-bottom: 30px
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


  .test-liu {
    ::-ms-reveal{display:none;}
  }
</style>

