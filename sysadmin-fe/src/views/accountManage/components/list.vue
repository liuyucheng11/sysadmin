<template>
  <div class="list">
    <el-form class="form" :data="searchForm" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="登录账号">
            <el-input v-model="searchForm.accountNo" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工编号">
            <el-input v-model="searchForm.staffNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.staffName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据权限类型">
            <el-select v-model="searchForm.datalimit">
              <el-option label="全部" value="1" />
              <el-option label="递归" value="2" />
              <el-option label="本部门" value="3"/>
              <el-option label="本人" value="4"/>
              <el-option label="手动选择" value="5"/>
              <el-option label="全选"/>
              <!--<el-option v-for="item in dataLimitList" :key="item.value" :label="item.label" :value="item.value" />-->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="员工所属部门">
            <el-input v-model="searchForm.departmentName" style="width: 200px;" />
            <el-button type="primary" @click="selectDept">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否关联员工">
            <el-select v-model="searchForm.isConnect" style="width: 100px;">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
              <el-option label="全部" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号状态">
            <el-select v-model="searchForm.status">
              <el-option label="正常" value="1" />
              <el-option label="冻结" value="2" />
              <el-option label="无效" value="3" />
              <el-option label="全部" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item style="margin-left: 500px">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="exportClick" v-permission="['/accountManage/components/export']">导出
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div>
      <el-row>
        <el-button type="primary" @click="toAdd" v-permission="['/accountManage/components/add']">新增</el-button>
        <el-button type="primary" :disabled="disable" @click="toModify" v-permission="['/accountManage/components/modify']">修改</el-button>
        <el-button type="primary" :disabled="disable" @click="deleteAccount" v-permission="['/accountManage/components/delete']">删除</el-button>
        <el-button type="primary" :disabled="disable1" @click="freezeAccount" v-permission="['/accountManage/components/freeze']">冻结</el-button>
        <el-button type="primary" :disabled="disable2" @click="thawAccount" v-permission="['/accountManage/components/thaw']">解冻</el-button>
        <el-button type="primary" :disabled="disable" @click="resetPassword" v-permission="['/accountManage/components/resetEmail']">密码重置</el-button>
        <el-button type="primary" :disabled="disable" @click="toAssignPermissions" v-permission="['/accountManage/components/permission']">分配权限</el-button>
        <el-button type="primary" :disabled="disable3" @click="toHistory" v-permission="['/accountManage/components/history']">历史纪录</el-button>
      </el-row>
    </div>
    <div class="search-result">
      <div class="result-table">
        <el-table :data="accountList">
          <el-table-column label="选择" width="50">
            <template scope="scope">
              <el-radio
                v-model="selectAccountId"
                :label="scope.row.id"
                @change="getCurrentRow(scope.row.status, scope.row.email, scope.row.accountNo)"
              >&nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column v-if="false" prop="id" label="账号" />
          <el-table-column v-if="false" prop="email" label="邮箱" />
          <el-table-column prop="accountNo" label="登录账号">
            <template slot-scope="scope">
              <div  class="el-dropdown-link" style="color: blue" @click.prevent="showAccountDetail(scope.row.id)">{{scope.row.accountNo}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="staffNumber" label="员工编号"/>
          <el-table-column prop="staffName" label="员工姓名" />
          <el-table-column prop="departmentName" label="员工所属部门" />
          <el-table-column prop="datalimit" label="数据权限类型">
            <template slot-scope="scope">
              {{ getDataLimit(scope.row.datalimit) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账号状态">
            <template slot-scope="scope">
              {{ getStatus(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="操作时间" width="180px">
            <template slot-scope="scope">
              {{ scope.row.modifyTime }}
            </template>
          </el-table-column>
          <el-table-column prop="modifyName" label="操作人"/>
        </el-table>
        <el-pagination
          background
          :current-page="searchForm.currentPage"
          :page-sizes="[5, 10, 15]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div>
        <el-dialog
          title="请选择部门"
          :append-to-body="true"
          :visible.sync="dialogVisible"
        >
          <el-row>
            <el-button type="primary" icon="el-icon-upload" @click="commitSelectDept()">确定</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="cancelSelectDept()">取消</el-button>
          </el-row>
          <department-tree :return-name="true" :clear-choose="select" @selectId="changeDeptId" @clear="clearChoose"/>
        </el-dialog>
      </div>
    </div>

    <el-dialog :append-to-body="true" title="账号详情" width="60%" :visible.sync="accountDialogVisible">
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

    <el-dialog :append-to-body="true" title="请选择需要导出的字段" width="70%" :visible.sync="exportSelectDisable">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group
        v-model="checkedFilter"
        @change="handleCheckedChange"
      >
        <el-checkbox
          v-for="filter in accountFilters"
          :label="filter"
          :key="filter[0]"
        >{{filter[1]}}</el-checkbox>
      </el-checkbox-group>
      <div style="margin: 15px 0;"></div>
      <el-row>
        <el-button
          type="primary"
          size="mini"
          @click="exportExecl"
        >确定导出</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="cancleExport"
        >取消</el-button>
      </el-row>
    </el-dialog>

    <el-dialog :append-to-body="true" title="提示信息" :visible.sync="exportLoadingDisable">
      <el-row class="container-title">
        <el-button
          type="text"
          icon="el-icon-loading">
        </el-button>
        当前正在导出，请稍等！
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { updateAccount } from '../../../api/accountManage'
import { getPage } from '../../../api/accountManage'
import { setEmail } from '../../../api/accountManage'
import { getAllAccount } from '../../../api/accountManage'
import { getAccountById } from '../../../api/accountManage'
import accountEnum from './accountEnum'
import DepartmentTree from '../../department/departmentTree'

const AccountFilter = [
  ['accountNo','登录账号'],
  ['staffNumber','员工编号'],
  ['staffName', '员工姓名'],
  ['departmentName', '员工所属部门'],
  ['datalimit', '数据权限类型'],
  ['status', '账号状态'],
  ['modifyTime', '操作时间'],
  ['modifyName', '操作人']
];
export default {
  name: 'List',
  components: { DepartmentTree },
  props: {},
  data() {
    return {
      select: false,// 传给子组件值，是否清除选中按钮
      firstClickSelect: true,
      selectAccountId: null,
      selectAccountStatus: null,
      selectAccountNo: null,
      selectEmail: null,
      dialogVisible: false,
      deleteDialogVisible: false,
      accountDialogVisible: false, // 查看账号详情对话框
      exportSelectDisable: false, // 导出字段选择对话框
      exportLoadingDisable: false,
      total: 0,
      pageSize: 5,
      dataLimitList: accountEnum.dataLimit.getEnumList(),
      searchForm: {
        currentPage: 1,
        limit: 5,
        accountNo: '',
        staffNumber: '',
        staffName: '',
        departmentId: null
      },
      exportList: [],
      exportLoading: false,
      isIndeterminate: false,
      checkAll: true, // 是否选中所有字段
      checkedFilter: AccountFilter,
      accountFilters: AccountFilter,
      accountList: [], // 后台请求的导出账号信息
      exportTHeader: [], // 导出表头信息
      exportFilterVal: [], // 导出字段信息
      addForm: {},
      name: ''
    }
  },
  computed: {
    disable() {
      if (this.selectAccountId !== null && this.selectAccountStatus !== 3) {
        return false;
      }
      return true;
    },
    disable1() {
      return this.selectAccountStatus !== 1
    },
    disable2() {
      return this.selectAccountStatus !== 2
    },
    disable3() {
      return this.selectAccountId === null
    },
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
  watch: {
    exportLoading(val) {
      if(val) {
        this.exportLoadingDisable = true;
      }else {
        this.exportLoadingDisable = false;
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    // this.getData();
  },
  destroyed() {
    this.initForm()
  },
  methods: {
    initForm() {
      const this_ = this
      this_.searchForm = null
      this_.selectAccountId = null
    },
    getData() {
      const this_ = this
      const param = {
        currentPage: this_.searchForm.currentPage,
        limit: this_.searchForm.limit,
        accountNo: this_.searchForm.accountNo,
        staffNumber: this_.searchForm.staffNumber,
        staffName: this_.searchForm.staffName,
        departmentId: this_.searchForm.departmentId,
        datalimit: this_.searchForm.datalimit,
        status: this_.searchForm.status
      }
      if (this_.searchForm.isConnect == 0) {
        param.isNotConnect = 1
      } else if (this_.searchForm.isConnect == 1) {
        param.isConnect = 1
      }
      getPage(JSON.stringify(param)).then((result) => {
        this_.accountList = result.data.list
        this_.total = result.data.totalCount
      }).catch((error) => {
        console.log(error)
      })
    },
    // 分页处理
    handleSizeChange(val) {
      this.searchForm.limit = val
      this.getData()
    },
    // 跳转到指定页面
    handleCurrentChange(val) {
      this.searchForm.currentPage = val
      this.getData()
    },
    search() {
      this.searchForm.currentPage = 1
      this.getData()
    },
    deleteAccount() {
      const this_ = this;
      let message = '此操作将删除账号:' + this_.selectAccountNo + ', 是否继续?';
      this_.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: this_.selectAccountId,
          status: 3
        }
        updateAccount(JSON.stringify(param)).then((result) => {
          this_.$message({ type: 'success', message: '删除成功' })
          this_.getData()
          this_.selectAccountId = null;
        }).catch(function(error) {
          console.log(error)
        })
      }).catch(() => {
        this_.$message.info('取消操作')
      })
    },
    freezeAccount() {
      const this_ = this;
      let message = '此操作将冻结账号:' + this_.selectAccountNo + ', 是否继续?';
      this_.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: this_.selectAccountId,
          status: 2
        }
        updateAccount(JSON.stringify(param)).then((result) => {
          this_.$message({ type: 'success', message: '冻结成功' })
          this_.getData();
          this_.selectAccountStatus = 2;
        }).catch(function(error) {
          console.log(error)
        })
      }).catch(() => {
        this_.$message.info('取消操作')
      })
    },
    thawAccount() {
      const this_ = this;
      let message = '此操作将解冻账号:' + this_.selectAccountNo + ', 是否继续?';
      this_.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: this_.selectAccountId,
          status: 1
        }
        updateAccount(JSON.stringify(param)).then((result) => {
          this_.$message({ type: 'success', message: '解冻成功' })
          this_.getData()
          this_.selectAccountStatus = 1
        }).catch(function(error) {
          console.log(error)
        })
      }).catch(() => {
        this_.$message.info('取消操作')
      })
    },
    resetPassword() {
      const this_ = this
      this_.$confirm('是否选择重置密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          email: this_.selectEmail,
          accountId: this_.selectAccountId,
        }
        setEmail(param).then(() => {
          this_.$message({ type: 'success', message: '邮件发送成功' })
        })
      }).catch(() => {
        this_.$message.info('取消操作')
      })
    },
    exportClick() {
      this.exportSelectDisable = true;
      this.checkedFilter = AccountFilter;// 默认勾选全部字段
      this.handleCheckAllChange(true);
    },
    cancleExport() {
      this.exportSelectDisable = false;
    },
    handleCheckAllChange(val) {
      this.exportTHeader = [];
      this.exportFilterVal = [];
      this.checkedFilter = val ? AccountFilter : [];
      if(val) {
        this.checkAll = true;
        this.isIndeterminate = false;
        for (let index = 0; index < this.checkedFilter.length; index++) {
          const element = this.checkedFilter[index];
          this.exportTHeader.push(element[1]);
          this.exportFilterVal.push(element[0]);
        }
      }
    },
    handleCheckedChange(value) {
      for (let i = 0; i < value.length; i++) {
        console.log(value[i]);
      }
      this.exportTHeader = [];
      this.exportFilterVal = [];
      let checkedCount = value.length;
      this.checkAll = (checkedCount === AccountFilter.length);
      this.isIndeterminate = (checkedCount > 0 && (checkedCount < AccountFilter.length));
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        this.exportTHeader.push(element[1]);
        this.exportFilterVal.push(element[0]);
      }
    },
    // 测试延迟
    // testExportExecl() {
    //   this.exportLoading = true;
    //   setTimeout(this.exportExecl(), 10000);
    // },
    exportExecl() {
      const this_ = this;
      if(this_.exportTHeader.length < 1) {
        this.$message({type: 'error', message: "导出失败！请至少选择一个数据项！"});
        return;
      }
      // 此代码实现向后台异步请求数据
      this_.exportSelectDisable = false;
      const param = this_.searchForm;
      if (this_.searchForm.isConnect === 0) {
        param.isNotConnect = 1
      } else if (this_.searchForm.isConnect === 1) {
        param.isConnect = 1
      }
      getAllAccount(param).then(response => {
        this.exportLoading = true;
        const data = response.data// 声明常量data用来接收后台返回的数据data
        this.exportList = data// 将接受到的data数据赋给exportList这个列表，用于当作导出Excel的数据源
        // 开始执行导出方法，此方法要放在括号里面，因为是异步请求数据，请求完才能执行导出
        this.export2Excel();
        this_.$message({ type: 'success', message: '导出成功，请关注下载文件' })
        this_.exportLoading = false;
      }).catch(error => {
        debugger
        this.exportLoading = false;
        console.log(error)
      });
    },
    export2Excel() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = this.exportTHeader;
          const filterVal = this.exportFilterVal;
          const list = this.exportList;
          const data = this.formatJson(filterVal, list);
          let nowDate = new Date();
          let date = {
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            date: nowDate.getDate(),
          }
          let systemDate = date.year + '年' + date.month + '月' + date.date + '日';
          // parseTime(new Date())方法在edge浏览器上不适应
          excel.export_json_to_excel({ header: tHeader, data, filename: '账号导出' + systemDate })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'status') {
          return this.getStatus(v[j])
        } else if (j === 'datalimit') {
          return this.getDataLimit(v[j])
        }
        return v[j]
      }))
    },
    toAdd() {
      this.$router.push('/accountManage/add')
    },
    toModify() {
      const this_ = this
      this_.$router.push({ name: 'modify', params: { accountId: this_.selectAccountId }})
    },
    toHistory() {
      const this_ = this
      this_.$router.push({ name: 'history', params: { accountId: this_.selectAccountId , accountNo: this_.selectAccountNo}})
    },
    toAssignPermissions() {
      const this_ = this
      this_.$router.push({ name: 'assignPermissions', params: { 'accountIdPer': this_.selectAccountId }})
    },
    selectDept() {
      if(this.firstClickSelect === true) {
        this.firstClickSelect = false;
      }else {
        this.select = true;
      }
      this.dialogVisible = true
    },
    cancelSelectDept() {
      this.searchForm.departmentName = null
      this.searchForm.departmentId = null
      this.dialogVisible = false
    },
    commitSelectDept() {
      this.dialogVisible = false
    },
    changeDeptId(val) {
      this.searchForm.departmentId = val.id
      this.searchForm.departmentName = val.name
    },
    clearChoose(val) {
      if(val) {
        this.select = false;
      }
    },
    getCurrentRow(status, email, accountNo) {
      this.selectAccountStatus = status;
      this.selectEmail = email;
      this.selectAccountNo = accountNo;
    },
    showAccountDetail(id) { // 查看账号详情
      const this_ = this
      this_.accountDialogVisible = true;
      getAccountById(id).then((result) => {
        this_.addForm = result.data
        this_.addForm.datalimit = this_.getDataLimit(result.data.datalimit)
        this_.addForm.status = this_.getStatus(result.data.status)
      }).catch((error) => {
        this_.$message({ type: 'error', message: error })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .list {
    padding: 20px;

    .form {
      .input {
        height: 12px;
        width: 200px;
      }
    }

    .search-result {
      margin-top: 50px;
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

  .container-title {
    font-size: 20px;
    font-weight: bolder;
  }

  .el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
</style>
