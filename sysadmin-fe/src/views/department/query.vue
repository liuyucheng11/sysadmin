<template>
  <div style="margin-bottom: 100px">
    <div>
      <el-card class="module">
        <!--        <el-row class="row-title">-->
        <!--          <el-col :span="2">-->
        <!--            <h2>部门查询</h2>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-form label-width="25%">
          <el-row>
            <el-col :span="6">
              <el-form-item label="部门名称:">
                <el-input v-model.trim="queryParams.name" @keyup.enter.native="queryList" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="负责人ID:">
                <el-input type="number" v-model.trim="queryParams.leaderId" @keyup.enter.native="queryList" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="负责人姓名:">
                <el-input v-model.trim="queryParams.leaderName" @keyup.enter.native="queryList" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号:">
                <el-input type="number" v-model.trim="queryParams.mobile" @keyup.enter.native="queryList" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="部门所在城市:">
                <el-select v-model="queryParams.cityId"
                           @keyup.enter.native="queryList"
                           clearable
                           filterable
                           remote
                           :remote-method="getCityList"
                           :loading="loading" style="width: 100%;">
                  <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in cityList"
                             :key="item.id"
                             :label="item.cnName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="部门级别:">
                <el-select v-model="queryParams.level" placeholder="请选择部门级别" style="width: 100%" @keyup.enter.native="queryList" clearable>
                  <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in levelList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="上级部门:">
                <el-select v-model="parentDepartmentName" @focus="chooseParentDepartment" style="width: 100%"
                           clearable @keyup.enter.native="queryList"></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态:">
                <el-select v-model="queryParams.status" placeholder="请选择部门状态" style="width: 100%" @keyup.enter.native="queryList" clearable>
                  <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in statusList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="部门类型:">
                <el-select v-model="queryParams.type" placeholder="请选择部门类型" style="width: 100%" @keyup.enter.native="queryList" clearable>
                  <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in typeList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col style="text-align: center">
            <el-button type="success" icon="el-icon-search" style="margin: 10px" @click="queryList">查询
            </el-button>
            <el-button type="primary" icon="el-icon-download" style="margin: 10px" v-permission="['/query/department/export']" @click="chooseExportColumns">导出
            </el-button>
          </el-col>
        </el-row>
        <el-row style="margin: 20px;">
          <el-table :data="departmentList" border style="width: 100%;">
            <el-table-column prop="code" label="部门编号" width="100px">
              <template slot-scope="scope">
                <a style="color: #1e6abc" @click="getDetail(scope.row.id)">{{scope.row.code}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="部门名称" width="200px"></el-table-column>
            <el-table-column prop="leaderId" label="负责人ID" width="100px"></el-table-column>
            <el-table-column prop="leaderName" label="负责人姓名" width="100px"></el-table-column>
            <el-table-column prop="mobile" label="手机号" width="200px"></el-table-column>
            <el-table-column prop="cityName" label="所在城市" width="200px"></el-table-column>
            <el-table-column prop="level" label="部门级别" width="100px">
              <template slot-scope="scope">
                {{getDepartmentLevel(scope.row.level)}}
              </template>
            </el-table-column>
            <el-table-column prop="type" label="部门类型" width="100px">
              <template slot-scope="scope">
                {{getDepartmentType(scope.row.type)}}
              </template>
            </el-table-column>
            <el-table-column prop="flag" label="办公点标识" width="100px"></el-table-column>
            <el-table-column prop="parentDepartmentName" label="上级部门" width="150px"></el-table-column>
            <el-table-column prop="businessLineString" label="支持业务线" width="250px"></el-table-column>
            <el-table-column prop="relatedCompanyString" label="关联公司" width="250px"></el-table-column>
            <el-table-column prop="status" label="状态" width="100px">
              <template slot-scope="scope">
                {{getDepartmentStatus(scope.row.status)}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handelSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.currentPage"
            :page-sizes="[10,20,50,100]"
            :page-size="queryParams.limit"
            layout="total,sizes,prev,pager,next,jumper"
            :total="total"
            style="margin: 20px"></el-pagination>
        </el-row>
      </el-card>
    </div>
    <el-dialog title="选择上级部门"
               :visible.sync="dialogVisible">
      <el-row>
        <el-button type="primary" icon="el-icon-upload" @click="commitParent()">确认</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="cancelUpdateParent()">取消</el-button>
      </el-row>
      <department-tree :return-name="true" :clear-choose="clearChoose" @selectId="selectParentDepartment" @clear="clrChoose"></department-tree>
    </el-dialog>
    <el-dialog title="选择所需导出列"
               :visible.sync="exportVisible">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                   style="margin: 20px">全选
      </el-checkbox>
      <el-row>
        <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
          <el-checkbox v-for="column in columns" :label="column" :key="column.key" style="margin: 20px">
            {{column.label}}
          </el-checkbox>
        </el-checkbox-group>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form label-width="25%">
            <el-form-item label="生成文件名：">
              <el-input v-model="filename"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row style="margin: 20px;text-align: center">
        <el-button :loading="downloadLoading" type="primary" style="margin: 10px" @click="confirmExport">导出</el-button>
        <el-button type="primary" style="margin: 10px" @click="cancelExport">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {exportDepartmentList, getDepartmentList, queryCity} from "../../api/department";
  import departmentEnum from "./departmentEnum";
  import DepartmentTree from "./departmentTree";
  import {Message} from "element-ui";

  export default {
    name: "query",
    components: {DepartmentTree},
    data() {
      return {
        departmentList: [],
        total: null,
        loading: false,
        cityList: [],
        levelList: departmentEnum.level.getEnumList(),
        typeList: departmentEnum.type.getEnumList(),
        statusList: departmentEnum.status.getEnumList(),
        parentDepartmentName: null,
        downloadLoading: false,
        exportVisible: false,
        isIndeterminate: false,
        checkAll: false,
        allChecked: false,
        clearChoose: false,
        checkedColumns: [],
        columns: [
          {
            key: 'code',
            label: '部门编号'
          },
          {
            key: 'name',
            label: '部门名称'
          },
          {
            key: 'leaderId',
            label: '负责人ID'
          },
          {
            key: 'leaderName',
            label: '负责人姓名'
          },
          {
            key: 'mobile',
            label: '手机号'
          },
          {
            key: 'cityName',
            label: '所在城市'
          },
          {
            key: 'level',
            label: '部门级别'
          },
          {
            key: 'type',
            label: '部门类型'
          },
          {
            key: 'flag',
            label: '办公点标识'
          },
          {
            key: 'parentDepartmentName',
            label: '上级部门'
          },
          {
            key: 'businessLineString',
            label: '支持业务线'
          },
          {
            key: 'relatedCompanyString',
            label: '关联公司'
          },
          {
            key: 'status',
            label: '状态'
          }
        ],
        tempParent: {
          id: null,
          name: null
        },
        dialogVisible: false,
        queryParams: {
          name: null,
          leaderId: null,
          leaderName: null,
          cityId: '',
          mobile: null,
          level: '',
          parentDepartmentId: null,
          type: '',
          status: '',
          currentPage: 1,
          limit: 10
        },
        filename: 'test',
        autoWidth: true,
        bookType: 'xlsx'
      }
    },
    computed: {
      getDepartmentLevel() {
        return function (param) {
          return departmentEnum.level.getLabelByValue(param)
        }
      },
      getDepartmentStatus() {
        return function (param) {
          return departmentEnum.status.getLabelByValue(param)
        }
      },
      getDepartmentType() {
        return function (param) {
          return departmentEnum.type.getLabelByValue(param)
        }
      }
    },
    watch: {
      'parentDepartmentName': {
        handler: function () {
          if (this.parentDepartmentName === null || this.parentDepartmentName === '') {
            this.queryParams.parentDepartmentId = null
            this.clearChoose = true
          }
        }
      }
    },
    created() {
      this.getDepartmentList()
      this.getCityList('')
    },
    methods: {
      getDepartmentList() {
        getDepartmentList(this.queryParams).then((res) => {
          this.departmentList = res.data.list
          this.total = res.data.totalCount
        })
      },
      clrChoose(val) {
        if (val) {
          this.clearChoose = false
        }
      },
      queryList() {
        this.queryParams.currentPage = 1
        this.getDepartmentList()
      },
      handelSizeChange(val) {
        this.queryParams.limit = val
        this.getDepartmentList()
      },
      handleCurrentChange(val) {
        this.queryParams.currentPage = val
        this.getDepartmentList()
      },
      getDetail(id) {
        let details = this.$router.resolve({
          name: "departmentDetail",
          params: {
            id: id,
          }
        });
        window.open(details.href, '_blank')
      },
      getCityList(query) {
        this.loading = true
        queryCity({cnName: query}).then((res) => {
          this.loading = false
          this.cityList = res.data
        })
      },
      selectParentDepartment(val) {
        this.tempParent.id = val.id
        this.tempParent.name = val.name
      },
      chooseParentDepartment() {
        this.dialogVisible = true
      },
      cancelUpdateParent() {
        this.dialogVisible = false
      },
      commitParent() {
        this.queryParams.parentDepartmentId = this.tempParent.id
        this.parentDepartmentName = this.tempParent.name
        this.tempParent.id = null
        this.tempParent.name = null
        this.dialogVisible = false
      },
      handleDownload(tHeader, filterVal, list) {
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
          Message({
            message: '生成成功！',
            type: 'success'
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      handleCheckAllChange(val) {
        console.log(val, this.isIndeterminate)
        this.checkedColumns = val ? this.columns : []
        this.isIndeterminate = false
      },
      handleCheckedColumnsChange(val) {
        let checkedCount = val.length
        this.checkAll = checkedCount === this.columns.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length
      },
      chooseExportColumns() {
        this.checkAll = false
        this.checkedColumns = []
        this.isIndeterminate = false
        this.exportVisible = true
      },
      confirmExport() {
        if (this.checkedColumns.length === 0) {
          Message({
            message: '请选择导出字段',
            type: 'error'
          })
        } else {
          this.downloadLoading = true
          let tHeader = []
          let filterVal = []
          let list = []
          let params = JSON.parse(JSON.stringify(this.queryParams))
          params.limit = null
          params.currentPage = null
          exportDepartmentList(params).then((res) => {
            list = res.data
            for (let i = 0; i < this.checkedColumns.length; i++) {
              tHeader.push(this.checkedColumns[i].label)
              filterVal.push(this.checkedColumns[i].key)
            }
            this.handleDownload(tHeader, filterVal, list)
            this.exportVisible = false
          })
        }
      },
      cancelExport() {
        this.exportVisible = false
      }
    }
  }
</script>

<style>
  .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: black;
    cursor: text;
  }

  .module {
    margin: 10px;
  }

  .row-title {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

</style>
