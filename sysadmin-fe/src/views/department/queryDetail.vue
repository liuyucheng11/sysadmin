<template>
  <div style="margin-bottom: 100px">
    <div>
      <el-card class="module">
        <el-row class="row-title">
          <el-col :span="2">
            <h2>基本信息</h2>
          </el-col>
          <el-col :span="10" style="text-align: right">
            <el-button type="primary" style="margin: 10px" @click="cancel">关闭</el-button>
          </el-col>
        </el-row>
        <el-form label-width="25%">
          <el-row>
            <el-col :span="6">
              <el-form-item label="部门编号">
                <el-input v-model="departmentInfo.code" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="部门名称">
                <el-input v-model="departmentInfo.name" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="负责人ID">
                <el-input v-model="departmentInfo.leaderId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="负责人姓名">
                <el-input v-model="departmentInfo.leaderName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="手机号">
                <el-input v-model="departmentInfo.mobile" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮箱">
                <el-input v-model="departmentInfo.email" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="座机号">
                <el-input v-model="departmentInfo.telephone" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所在城市">
                <el-input v-model="departmentInfo.cityName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="详细地址" label-width="12.5%">
                <el-input v-model="departmentInfo.address" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="经度">
                <el-input v-model="departmentInfo.lng" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="纬度">
                <el-input v-model="departmentInfo.lat" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card class="module">
        <el-row class="row-title">
          <h2>业务信息</h2>
        </el-row>
        <el-form label-width="25%">
          <el-row>
            <el-col :span="6">
              <el-form-item label="部门级别">
                <el-input v-model="getDepartmentLevel" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="上级部门">
                <el-input v-model="departmentInfo.parentDepartmentName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="支持业务线" label-width="12.5%">
                <el-input v-model="businessString" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="getDepartmentLevel==='办公点'">
            <el-col :span="6">
              <el-form-item label="部门类型">
                <el-input v-model="departmentInfo.type" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="办公点标识">
                <el-input v-model="departmentInfo.flag" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card class="module">
        <el-row class="row-title">
          <h2>关联部门列表</h2>
        </el-row>
        <el-row style="margin: 20px">
          <el-col style="width: 1051px;">
            <relate-company :relate-company-list="relateCompanyList"></relate-company>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="module">
        <el-row class="row-title">
          <h2>关联城市列表</h2>
        </el-row>
        <el-row style="margin: 20px">
          <el-col style="width: 1051px;">
            <el-button v-for="item in cityList">{{item.cnName}}</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="module">
        <el-row class="row-title">
          <h2>其他信息</h2>
        </el-row>
        <el-form label-width="25%">
          <el-row>
            <el-col :span="6">
              <el-form-item label="新建时间">
                <el-input v-model="departmentInfo.createTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="新建人">
                <el-input v-model="departmentInfo.createEmpName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="修改时间">
                <el-input v-model="departmentInfo.modifyTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="修改人">
                <el-input v-model="departmentInfo.modifyEmpName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-input v-model="getDepartmentStatus" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注" label-width="12.5%">
                <el-input v-model="departmentInfo.remark" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {getDepartmentInfo, queryDepartmentRelateCity, queryRelateCompanyList} from "../../api/department";
  import departmentEnum from "./departmentEnum";
  import {Message} from "element-ui";
  import RelateCompany from "./relateCompany";

  export default {
    name: "queryDetail",
    components: {RelateCompany},
    data() {
      return {
        departmentId: null,
        businessString: '',
        departmentInfo: {
          code: '',
          name: '',
          leaderId: null,
          leaderName: '',
          cityId: null,
          address: '',
          lng: null,
          lat: null,
          mobile: '',
          email: '',
          telephone: '',
          level: null,
          parentDepartmentId: null,
          parentDepartmentName: '',
          businessLine: [],
          supportBusinessLine: [],
          type: null,
          flag: null,
          createTime: null,
          createEmp: '',
          modifyTime: null,
          modifyEmp: '',
          remark: '',
          status: null
        },
        relateCompanyList: [],
        cityList: []
      }
    },
    computed: {
      getDepartmentStatus() {
        return departmentEnum.status.getLabelByValue(this.departmentInfo.status)
      },
      getDepartmentLevel() {
        return departmentEnum.level.getLabelByValue(this.departmentInfo.level)
      }
    },
    created() {
      this.getDepartmentInfo()
    },
    methods: {
      getDepartmentInfo() {
        document.title = "部门详情"
        this.departmentId = this.$route.params.id
        if (this.departmentId === null || this.departmentId === undefined) {
          Message({
            message: '获取部门id失败，请从父页面重新进入',
            type: 'error'
          })
        }
        getDepartmentInfo({id: this.departmentId}).then((res) => {
          this.departmentInfo = res.data
          this.departmentInfo.lng = res.data.lng >= 0 ? 'E '+res.data.lng+'°' : 'W '+res.data.lng+'°'
          this.departmentInfo.lat = res.data.lat >= 0 ? 'N '+res.data.lat+'°' : 'S '+res.data.lat+'°'
          let business = this.departmentInfo.businessLine
          if (null !== business) {
            for (let i = 0; i < business.length; i++) {
              this.businessString = this.businessString + business[i].name + ";"
            }
          }
          if (null !== res.data.createEmpName) {
            this.departmentInfo.createEmpName = res.data.createAccountNo + "(" + res.data.createEmpName + ")"
          } else {
            this.departmentInfo.createEmpName = res.data.createAccountNo
          }
          if (null !== res.data.modifyEmpName) {
            this.departmentInfo.modifyEmpName = res.data.modifyAccountNo + "(" + res.data.modifyEmpName + ")"
          } else {
            this.departmentInfo.modifyEmpName = res.data.modifyAccountNo
          }
        })
        let param = {
          departmentId: this.departmentId
        }
        queryRelateCompanyList(param).then((res) => {
          this.relateCompanyList = res.data
        })
        queryDepartmentRelateCity(param).then((res) => {
          this.cityList = res.data
        })
      },
      cancel() {
        window.close()
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
  .el-button {
    cursor: text;
  }
</style>
