<template>
  <div class="module">

    <el-row>
      <el-col :span=24>
        <el-form :model="query" size="small" label-width="120px" label-position="right">
          <el-row>
            <el-col :span="6">
              <el-form-item label="国际代码：">
                <el-input v-model.trim="query.code" @keyup.enter.native="search" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="区/县名称：">
                <el-input v-model.trim="query.cnName" @keyup.enter.native="search" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="城市名称：">
                <el-input v-model.trim="query.cityName" @keyup.enter.native="search" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="省/市名称：">
                <el-input v-model.trim="query.provinceName" @keyup.enter.native="search" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态：">
                <el-select v-model="query.status"  clearable filterable placeholder="请选择">
                  <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in getStatusEnum()"
                             :key="item.key"
                             :value="item.key"
                             :label="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col el-col :span=24 style="text-align: center;">
        <el-button type="warning" size="small" icon="el-icon-search" @click="searchBtn" :disabled="this.queryLoading">查询</el-button>
        <el-button type="warning" size="small" icon="el-icon-download" :disabled="this.exportLoading" v-permission="['/cityManage/countyQuery/export']"  @click="exportClick" >导出</el-button> <span v-loading="this.exportLoading" element-loading-spinner="el-icon-loading"></span>
      </el-col>

    </el-row>

    <div>
      <el-table
        v-loading="queryLoading"
        :data="tableData"
        style="width: 100%; margin-top: 1em; margin-bottom: 1em"
        :cell-style="{padding: '3px'}"
        :highlight-current-row=true
        max-height="380"
        border>


        <el-table-column
          prop="code"
          min-width="130px"
          :show-overflow-tooltip="true"
          label="国际代码">
        </el-table-column>

        <el-table-column
          prop="cnName"
          min-width="130px"
          :show-overflow-tooltip="true"
          label="区/县">
        </el-table-column>

        <el-table-column
          prop="cityName"
          min-width="130px"
          :show-overflow-tooltip="true"
          label="城市">
        </el-table-column>

        <el-table-column
          prop="provinceName"
          min-width="130px"
          :show-overflow-tooltip="true"
          label="省/市">
        </el-table-column>

        <el-table-column
          prop="enName"
          min-width="180px"
          :show-overflow-tooltip="true"
          label="拼音全称">
        </el-table-column>

        <el-table-column
          min-width="100px"
          prop="status"
          :show-overflow-tooltip="true"
          label="状态"
          :formatter="statusFormatter">
        </el-table-column>

        <el-table-column
          prop="modifyEmpName"
          min-width="100px"
          :show-overflow-tooltip="true"
          label="修改人">
        </el-table-column>

        <el-table-column
          min-width="160px"
          prop="modifyTime"
          :show-overflow-tooltip="true"
          label="修改时间">
        </el-table-column>

      </el-table>
    </div>
    <el-footer >
      <el-pagination
        @size-change="reSearch"
        @current-change="pageSearch"
        :current-page="query.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-footer>

  </div>
</template>

<script>
  import {getDictName, getEnum} from "./enumUtil"
  import {cityApi} from "@/api/city";
  import { parseTime } from '@/utils'

  export default {
      data() {
        return {
          query: {
            code: '',
            provinceName: '',
            cityName: '',
            cnName: '',
            enName: '',
            status: '',
            currentPage: 1,
            limit: 10

          },
          queryLoading: false,
          tableData: [],
          totalCount: 0,
          exportLoading: false,
          exportList: []

        }
      },
      methods: {
        reSearch(size) {
          this.query.limit = size
          this.search()
        },
        pageSearch(page){
          this.query.currentPage = page
          this.search()
        },
        searchBtn(){
          this.query.currentPage = 1
          this.search()
        },
        statusFormatter(row, column, cellValue){
          return getDictName(column.property, cellValue)
        },
        getStatusEnum(){
          return getEnum('status')
        },
        search(){
          this.queryLoading = true
          cityApi.queryCounty(this.query)
            .then((res) => {
              if(res.data) {
                this.tableData = res.data.list
                this.totalCount = res.data.totalCount
                console.log(this.tableData)
              }
          }).finally(() => {
            this.queryLoading = false
          })
        },
        exportClick() {
          //此代码实现向后台异步请求数据
          cityApi.queryCounty(this.query).then(response => {
            this.exportLoading = false;
            const data = response.data.list;//声明常量data用来接收后台返回的数据data
            this.exportList = data;//将接受到的data数据赋给exportList这个列表，用于当作导出Excel的数据源
            //开始执行导出方法，此方法要放在括号里面，因为是异步请求数据，请求完才能执行导出
            this.export2Excel()
          }).catch(error => {
            debugger;
            this.exportLoading = false
            console.log(error)
          })
        },
        export2Excel() {
          import('@/vendor/Export2Excel').then(excel=>{
            const tHeader =
              ['国际代码', '区县','城市', '省/市','拼音全称','状态', '修改时间','修改人'];
            const filterVal =
              ['code', 'cnName','cityName','provinceName','enName','status','modifyTime', 'modifyEmpName'];
            const list = this.exportList;
            const data = this.formatJson(filterVal, list);
            excel.export_json_to_excel({header: tHeader, data, filename: '区县导出' + parseTime(new Date())})
          })

        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'status') {
              return getDictName('status',v[j])
            } else {
              return v[j]
            }
          }))
        }
      },
      mounted() {
        this.search()
      },
      activated() {
        this.search()
      }


  }
</script>

<style scoped>
  .module {
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 20px;
  }


</style>
