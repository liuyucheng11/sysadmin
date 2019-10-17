<template>
  <div>
    <div class="search-form">
      <el-form class="form">
        <el-row>
          <el-col :span='8'>
            <el-form-item label="公司名称">
              <el-input class='company-name' v-model="form.companyName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="统一社会信用代码">
              <el-input class='unified-social-credit-code' v-model.trim="form.unifiedSocialCreditCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="公司类型">
              <el-select class="company-type" v-model="form.companyType">
                <el-option label="全部" value=''></el-option>
                <el-option label="有限责任公司" value="0"></el-option>
                <el-option label="股份有限公司" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="公司性质">
              <el-select v-model="form.corporateNature">
                <el-option label="全部" value=''></el-option>
                <el-option label="一般纳税人" value="0"></el-option>
                <el-option label="小规模纳税人" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.status">
                <el-option label="全部" value=''></el-option>
                <el-option label="有效" value=0></el-option>
                <el-option label="无效" value=1></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="5">
            <el-form-item label="修改时间">
              <el-date-picker
                v-model="form.startModifyTime"
                type="datetime"
                placeholder="选择起始日期">
              </el-date-picker>&nbsp;-&nbsp;
              <el-date-picker
                v-model="form.endModifyTime"
                type="datetime"
                placeholder="选择结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-top:20px ">
          <el-col :offset="10">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>

      </el-form>

    </div>

    <div class="actions">
      <el-button type="primary" @click="toNew" v-permission="['/company/add']">新建</el-button>

      <el-button type="primary" :disabled="disable" @click="editCompany" v-permission="['/company/modify']">修改
      </el-button>
    </div>

    <div class="search-result">

      <div class="result-table">
        <el-table :data="companyData" border>
          <el-table-column label="选择" width="40">
            <template slot-scope="scope">
              <el-radio v-model="selectId" :label="scope.row.id">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="标识">
            <template slot-scope="scope">
              <div class="id" style="color: blue" @click.prevent="showCompanyDetail(scope.row.id)">{{scope.row.id}}
              </div>
            </template>
            编号
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称"></el-table-column>
          <el-table-column prop="unifiedSocialCreditCode" label="统一社会信用代码" width="180"></el-table-column>
          <el-table-column prop="companyType" label="类型">
            <template slot-scope="scope">
              {{comEnum.companyType.getLabelByValue(scope.row.companyType)}}
            </template>
          </el-table-column>
          <el-table-column prop="corporateNature" label="公司性质">
            <template slot-scope="scope">
              {{comEnum.corporateNature.getLabelByValue(scope.row.corporateNature)}}
            </template>
          </el-table-column>
          <el-table-column prop="headOfficeFlag" label="总公司标识">
            <template slot-scope="scope">
              {{comEnum.headOfficeFlag.getLabelByValue(scope.row.headOfficeFlag)}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="50">
            <template slot-scope="scope">
              {{comEnum.status.getLabelByValue(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column prop="modifyEmpName" label="修改人"></el-table-column>
          <el-table-column prop="modifyTime" label="操作时间" width="200">
            <template slot-scope="scope">
              {{scope.row.modifyTime}}
            </template>
          </el-table-column>

        </el-table>
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[10, 50, 100, 200]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
  import {getPage} from '../../api/company';
  import {param} from "../../utils";
  import comEnum from './companyEnum'

  export default {
    name: "list",
    data() {
      return {
        form: {
          companyName: '',
          unifiedSocialCreditCode: '',
          companyType: null,
          corporateNature: '',
          status: null,
          startModifyTime: null,
          endModifyTime: null,
        },
        companyData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        selectId: null,
        comEnum: comEnum
      }
    },
    watch: {
      'form.endModifyTime': {
        deep: true,
        handler(val) {
          if (val <= this.form.startModifyTime && this.form.startModifyTime !== null) {
            this.$message.warning("结束时间应大于等于开始时间!");
            this.form.endModifyTime = this.form.startModifyTime
          }
        }
      },
      'form.startModifyTime': {
        deep: true,
        handler(val) {
          if(val!=null){
            if(this.form.endModifyTime!=null && val>this.form.endModifyTime){
              this.$message.warning("结束时间应大于等于开始时间!");
              this.form.startModifyTime = null;
            }
          }

        }
      }
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
      disable() {
        return this.selectId === null ? true : false;
      }
    },
    methods: {
      toNew() {
        this.$router.push('/companyManage/add')
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.getData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      search() {
        this.currentPage = 1;
        this.getData()
      },
      getData() {
        let this_ = this;
        let param = {
          currentPage: this_.currentPage,
          limit: this_.pageSize,
          companyName: this_.form.companyName.trim(),
          unifiedSocialCreditCode: this_.form.unifiedSocialCreditCode,
          companyType: this_.form.companyType,
          corporateNature: this_.form.corporateNature,
          status: this_.form.status,
          startModifyTime: this_.form.startModifyTime,
          endModifyTime: this_.form.endModifyTime
        };
        getPage(JSON.stringify(param)).then(result => {
          this_.companyData = result.data.list;
          this_.total = result.data.totalCount;
        }).catch(result => {
        })
      },
      //路由跳转传参
      showCompanyDetail(id) {
        this.$router.push({name: 'company-modify', params: {id: id, onlyShow: true}});
      },
      editCompany() {
        let this_ = this;
        this.$router.push({name: 'company-modify', params: {id: this_.selectId, onlyShow: false}})
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style lang="scss" scoped>
  .search-form {
    .form {

      padding: 20px;
      .company-name {
        width: 300px;
      }
      .unified-social-credit-code {
        width: 300px;
      }
    }
  }

  .actions {
    padding: 30px;
  }
</style>
