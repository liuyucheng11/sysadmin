<template>
  <div class="list">
    <el-form class="form" :data="searchForm" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="登录账号">
            <el-input v-model.trim="searchForm.accountNo" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工编号">
            <el-input v-model.trim="searchForm.staffNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工姓名">
            <el-input v-model.trim="searchForm.staffName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据权限类型">
            <el-select v-model="searchForm.datalimit">
              <el-option v-for="item in dataLimitList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-form-item label="员工所属部门">
            <el-input v-model="searchForm.departmentName" style="width: 150px;" />
            <el-button type="primary" @click="selectDept">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="是否关联员工">
            <el-select v-model="searchForm.isConnect" style="width: 100px;">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
              <el-option label="全部" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
        <el-form-item style="margin-left: 600px">
          <el-button type="primary" @click="search('search')">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-row>
      <el-button :disabled="btnCommit" type="primary" @click="commitSelect">确认选择</el-button>
      <el-button type="primary" @click="cancelSelect">取消</el-button>
    </el-row>

    <div class="search-result">
      <div class="result-table">
        <el-table :data="accountList" @selection-change="getMultiSelection" :row-key="getRowKeys">
          <el-table-column type="selection" :reserve-selection="true" label="选择" width="50" />
          <el-table-column v-if="false" prop="id" label="账号" />
          <el-table-column prop="accountNo" label="登录账号">
            <template slot-scope="scope">
              <div style="color: blue" @click.prevent="showAccountInfo(scope.row)">
                {{scope.row.accountNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="staffNumber" label="员工编号" />
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
          <el-table-column prop="modifyTime" label="操作时间">
            <template slot-scope="scope">
              {{ scope.row.modifyTime }}
            </template>
          </el-table-column>
          <el-table-column prop="modifyName" label="操作人" />
        </el-table>
        <el-pagination background :current-page="currentPage" :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
      <div>
        <el-dialog title="请选择部门" :visible.sync="dialogVisible" :append-to-body="true">
          <el-row>
            <el-button type="primary" icon="el-icon-upload" @click="commitSelectDept()">确定</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="cancelSelectDept()">取消</el-button>
          </el-row>
          <department-tree :return-name="true" @selectId="changeDeptId" />
        </el-dialog>
      </div>
    </div>


    <el-dialog append-to-body="true" title="账号详情" width="60%" :visible.sync="accountDialogVisible">
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
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getPage
  } from '../../../api/accountManage'
  import accountEnum from './accountEnum'
  import DepartmentTree from '../../department/departmentTree'

  export default {
    name: 'SelectAccountList',
    components: {
      DepartmentTree
    },
    props: {},
    data() {
      return {
        temp: {
          id: null,
          name:''
        },
        accountDialogVisible: false,
        addForm: {},
        btnCommit: true,
        selectAccountId: null,
        selectAccountStatus: null,
        dialogVisible: false,
        deleteDialogVisible: false,
        currentPage: 1,
        pageSize: 5,
        total: 0,
        dataLimitList: accountEnum.dataLimit.getEnumList(),
        searchForm: {
          departmentId: null
        },
        accountList: [],
        multipleSelection: [] // 选择的多行数据
      }
    },
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
    watch: {},
    created() {
      this.getData()
    },
    mounted() {
      this.getData()
    },
    destroyed() {
      this.initForm()
    },
    methods: {
      showAccountInfo(row) {
        // 显示账号信息
        let this_ = this;
        this_.addForm = row;
        this_.accountDialogVisible = true;
        console.log(row);
      },
      getRowKeys(row) {
        return row.id;
      },
      getMultiSelection(val) {
        // 如果没有选择上数据,则禁用确认选择按钮
        this.btnCommit = val.length > 0 ? false : true;
        this.multipleSelection = val
      },
      commitSelect() {
        this.$emit('selectAccount', this.multipleSelection)
      },
      cancelSelect() {
        this.$emit('cancel', null)
      },
      initForm() {
        const this_ = this
        this_.searchForm = null
        this_.selectAccountId = null
      },
      getData(isSearch) {
        const this_ = this
        let param = {
            currentPage: this_.currentPage,
            limit: this_.pageSize,
          }
        if (isSearch == "search"){
          param = {
            currentPage: this_.currentPage,
            limit: this_.pageSize,
            accountNo: this_.searchForm.accountNo,
            staffNumber: this_.searchForm.staffNumber,
            staffName: this_.searchForm.staffName,
            departmentId: this_.searchForm.departmentId,
            datalimit: this_.searchForm.datalimit,
            status: this_.searchForm.status
          }
        }
        debugger;
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
        this.pageSize = val
        this.currentPage = 1
        this.getData()
      },
      // 同上
      handleCurrentChange(val) {
        this.currentPage = val
        this.getData()
      },
      search(isSearch) {
        this.currentPage = 1;
        this.getData(isSearch)
      },
      selectDept() {
        this.dialogVisible = true
      },
      cancelSelectDept() {
        this.searchForm.departmentName = null
        this.searchForm.departmentId = null
        this.dialogVisible = false
      },
      commitSelectDept() {
        this.searchForm.departmentId = this.temp.id;
        this.searchForm.departmentName = this.temp.name;
        this.dialogVisible = false;
      },
      changeDeptId(val) {
        this.temp.id = val.id;
        this.temp.name = val.name;
   //     this.searchForm.departmentId = val.id
   //     this.searchForm.departmentName = val.name
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

  .el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
  }
</style>
