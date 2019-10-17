<template>
  <div style="margin-bottom: 100px">
    <div>
      <el-card class="module">
        <el-form label-width="35%">
          <el-row>
            <el-col :span="6">
              <el-form-item label="企业名称">
                <el-input v-model="queryParam.companyName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="统一社会信用代码">
                <el-input v-model="queryParam.unifiedSocialCreditCode" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类型">
                <el-select v-model="queryParam.companyType" placeholder="请选择公司类型" style="width: 100%" clearable>
                  <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in companyTypeList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司性质">
                <el-select v-model="queryParam.corporateNature" placeholder="请选择公司性质" style="width: 100%" clearable>
                  <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in companyNatureList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select v-model="queryParam.status" placeholder="请选择公司状态" style="width: 100%" clearable>
                  <el-option key="" label="全部" value=""></el-option>
                  <el-option v-for="item in companyStatusList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="修改时间">
                <el-date-picker
                  v-model="modifyTime"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="text-align: center;">
            <el-button type="success" icon="el-icon-search" @click="getCompanyList">查询</el-button>
          </el-row>
        </el-form>
        <el-row style="margin: 20px">
          <el-button type="primary" icon="el-icon-check" @click="confirmChooseCompany">确认选择</el-button>
          <el-button type="primary" icon="el-icon-close" @click="cancelChooseCompany">取消</el-button>
<!--          <el-checkbox-group v-model="selectId">-->
            <el-table ref="companyTable" :data="companyList" border style="width: 100%;margin-top: 20px"
                      @selection-change="handleSelectionChange">
<!--              <el-table-column label="选择" width="50">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-checkbox :label="scope.row">&nbsp;</el-checkbox>-->
<!--                </template>-->
<!--              </el-table-column>-->
                          <el-table-column type="selection"></el-table-column>
              <el-table-column prop="id" label="标识">
                <template slot-scope="scope">
                  <div class="id" style="color: blue" @click.prevent="showCompanyDetail(scope.row.id)">{{scope.row.id}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="companyName" label="公司名称"></el-table-column>
              <el-table-column prop="unifiedSocialCreditCode" label="统一社会信用代码" width="180"></el-table-column>
              <el-table-column prop="companyType" label="类型">
                <template slot-scope="scope">
                  {{getCompanyType(scope.row.companyType)}}
                </template>
              </el-table-column>
              <el-table-column prop="corporateNature" label="公司性质">
                <template slot-scope="scope">
                  {{getCorporateNature(scope.row.corporateNature)}}
                </template>
              </el-table-column>
              <el-table-column prop="headOfficeFlag" label="总公司标识">
                <template slot-scope="scope">
                  {{getHeadOfficeFlag(scope.row.headOfficeFlag)}}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="50">
                <template slot-scope="scope">
                  {{getStatus(scope.row.status)}}
                </template>
              </el-table-column>
              <el-table-column prop="modifyEmpName" label="修改人"></el-table-column>
              <el-table-column prop="modifyTime" label="操作时间" width="200">
                <template slot-scope="scope">
                  {{scope.row.modifyTime | formatDate}}
                </template>
              </el-table-column>
            </el-table>
<!--          </el-checkbox-group>-->
        </el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParam.currentPage"
          :page-sizes="[5, 10, 50, 100, 200]"
          :page-size="queryParam.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin: 20px">
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {getCompanyList} from "../../api/department";
  import comEnum from "../companyManage/companyEnum";

  export default {
    name: "chooseCompany",
    props: {
      departmentId: {
        type: Number,
        default: null
      },
      selectList: {
        type: Array,
        default: []
      },
      refresh: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        queryParam: {
          companyName: null,
          unifiedSocialCreditCode: null,
          companyType: '',
          corporateNature: '',
          status: '',
          startModifyTime: null,
          endModifyTime: null,
          limit: 10,
          currentPage: 1
        },
        selectId: [],
        companyList: [],
        companyTypeList: comEnum.companyType.getEnumList(),
        companyNatureList: comEnum.corporateNature.getEnumList(),
        companyFlagList: comEnum.headOfficeFlag.getEnumList(),
        companyStatusList: comEnum.status.getEnumList(),
        modifyTime: [],
        total: 0
      }
    },
    watch: {
      'selectId': {
        handler: function () {

        }
      },
      'refresh': {
        handler: function () {
          if (this.refresh) {
            this.getCompanyList()
          }
        }
      }
    },
    created() {
      this.getCompanyList()
    },
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      }
    },
    computed: {
      getCompanyType() {
        return function (param) {
          return comEnum.companyType.getLabelByValue(param)
        }
      },
      getCorporateNature() {
        return function (param) {
          return comEnum.corporateNature.getLabelByValue(param)
        }
      },
      getHeadOfficeFlag() {
        return function (param) {
          return comEnum.headOfficeFlag.getLabelByValue(param)
        }
      },
      getStatus() {
        return function (param) {
          return comEnum.status.getLabelByValue(param)
        }
      }
    },
    methods: {
      getCompanyList() {
        this.companyList = []
        this.queryParam.departmentId = this.departmentId
        this.queryParam.startModifyTime = this.modifyTime[0]
        this.queryParam.endModifyTime = this.modifyTime[1]
        this.queryParam.hasRevComIds = []
        for (let i = 0; i < this.selectList.length; i++) {
          this.queryParam.hasRevComIds.push(this.selectList[i].id)
        }
        getCompanyList(this.queryParam).then((res) => {
          this.companyList = res.data.list
          this.total = res.data.totalCount
        })
      },
      handleSizeChange(val) {
        this.queryParam.limit = val
        this.currentPage = 1
        this.getCompanyList()
      },
      handleCurrentChange(val) {
        this.queryParam.currentPage = val
        this.getCompanyList()
      },
      handleSelectionChange(val) {
        this.selectId = val
      },
      cancelChooseCompany() {
        this.$emit('close', false)
        this.$refs.companyTable.clearSelection()
      },
      confirmChooseCompany() {
        this.$emit('list', this.selectId)
        this.$refs.companyTable.clearSelection()
      }
    }
  }
</script>

<style lang="scss">
  .el-dialog__wrapper {
    &.dialog-fade-leave-active {
      -ms-animation: none;
    }
  }
</style>
